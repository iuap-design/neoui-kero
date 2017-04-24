/**
 * Module : Kero multilang adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 14:11:50
 */

import { Multilang } from 'tinper-neoui/src/neoui-multilang';
import { core } from 'tinper-sparrow/src/core';

import { ValueMixin } from 'neoui-kero-mixin/src/valueMixin';
import { EnableMixin } from 'neoui-kero-mixin/src/enableMixin';
import { RequiredMixin } from 'neoui-kero-mixin/src/requiredMixin';
import { ValidateMixin } from 'neoui-kero-mixin/src/validateMixin';

var MultilangAdapter = u.BaseAdapter.extend({
    mixins: [],
    init: function init() {

        var self = this;
        var multinfo;
        if (this.options) {
            multinfo = this.options.multinfo;
        } else {
            multinfo = core.getLanguages(); //暂时不支持
        };
        multinfo = multinfo.split(',');

        self.multiLen = multinfo.length;
        var multidata = [];
        this.field = this.options.field;

        if (parseInt(this.options.rowIndex) > -1) {
            if ((this.options.rowIndex + '').indexOf('.') > 0) {
                // 主子表的情况
                var childObj = ValueMixin.methods.getChildVariable.call(this);
                var lastRow = childObj.lastRow;
                var lastField = childObj.lastField;
                this.field = lastField;
            }
        }

        // 创建组件 - 此处不加el?
        this.comp = new Multilang({
            el: this.element,
            "multinfo": multinfo,
            "field": this.field
        });

        if (parseInt(this.options.rowIndex) > -1) {
            if ((this.options.rowIndex + '').indexOf('.') > 0) {
                // 主子表的情况
                var childObj = ValueMixin.methods.getChildVariable.call(this);
                var lastRow = childObj.lastRow;
                var lastField = childObj.lastField;

                this.dataModel.on(DataTable.ON_VALUE_CHANGE, function (opt) {
                    var id = opt.rowId;
                    var field = opt.field;
                    var value = opt.newValue;
                    var obj = {
                        fullField: self.options.field,
                        index: self.options.rowIndex
                    };
                    var selfRow = self.dataModel.getChildRow(obj);
                    var row = opt.rowObj;
                    if (selfRow == row && field.indexOf(lastField) == 0) {
                        self.modelValueChange(field, value);
                    }
                });

                this.dataModel.on(DataTable.ON_INSERT, function (opt) {
                    var obj = {
                        fullField: self.options.field,
                        index: self.options.rowIndex
                    };
                    var field,
                        value,
                        row = self.dataModel.getChildRow(obj);
                    if (row) {
                        for (var i = 0; i < self.multiLen; i++) {
                            if (i == 0) {
                                field = lastField;
                            } else {
                                field = lastField + (i + 1);
                            }
                            value = row.getValue(field);
                            self.modelValueChange(field, value);
                        }
                    }
                });

                if (lastRow) {
                    var field, value;
                    for (var i = 0; i < self.multiLen; i++) {
                        if (i == 0) {
                            field = lastField;
                        } else {
                            field = lastField + (i + 1);
                        }
                        value = lastRow.getValue(field);
                        self.modelValueChange(field, value);
                    }
                }
            } else {

                this.dataModel.on(DataTable.ON_VALUE_CHANGE, function (opt) {
                    var id = opt.rowId;
                    var field = opt.field;
                    var value = opt.newValue;
                    var row = opt.rowObj;
                    var rowIndex = self.dataModel.getRowIndex(row);
                    if (rowIndex == self.options.rowIndex && field.indexOf(self.field) == 0) {
                        self.modelValueChange(field, value);
                    }
                });

                this.dataModel.on(DataTable.ON_INSERT, function (opt) {
                    var field,
                        value,
                        row = self.dataModel.getRow(self.options.rowIndex);
                    if (row) {
                        for (var i = 0; i < self.multiLen; i++) {
                            if (i == 0) {
                                field = self.field;
                            } else {
                                field = self.field + (i + 1);
                            }
                            value = row.getValue(field);
                            self.modelValueChange(field, value);
                        }
                    }
                });

                var rowObj = this.dataModel.getRow(this.options.rowIndex);
                var field, value;
                if (rowObj) {
                    for (var i = 0; i < self.multiLen; i++) {
                        if (i == 0) {
                            field = self.field;
                        } else {
                            field = self.field + (i + 1);
                        }
                        value = rowObj.getValue(field);
                        self.modelValueChange(field, value);
                    }
                }
            }
        } else {
            // datatable传值到UI - 初始化 & 监听
            this.dataModel.on(DataTable.ON_VALUE_CHANGE, function (opt) {
                var id = opt.rowId;
                var field = opt.field;
                var value = opt.newValue;
                var row = opt.rowObj;
                if (field.indexOf(self.field) == 0) {
                    self.modelValueChange(field, value);
                }
            });

            this.dataModel.on(DataTable.ON_INSERT, function (opt) {
                var field,
                    value,
                    row = opt.rows[0];
                for (var i = 0; i < self.multiLen; i++) {
                    if (i == 0) {
                        field = self.field;
                    } else {
                        field = self.field + (i + 1);
                    }
                    value = row.getValue(field);
                    self.modelValueChange(field, value);
                }
            });
            var field, value;
            for (var i = 0; i < self.multiLen; i++) {
                if (i == 0) {
                    field = self.field;
                } else {
                    field = self.field + (i + 1);
                }
                value = self.dataModel.getValue(field);
                self.modelValueChange(field, value);
            }
        }

        // meta标签写入方式
        // var rowObj = this.dataModel.getRow(this.options.rowIndex);
        // if (rowObj) {
        //     this.modelValueChange(rowObj.getValue(this.field));
        // }

        // UI传值到datatable
        this.comp.on('change.u.multilang', function (object) {
            self.slice = true;
            self.setValue(object.field, object.newValue);
            self.slide = false;
        });
    },
    modelValueChange: function modelValueChange(field, value) {
        this.comp.setDataValue(field, value);
    },
    /**
     * [setValue   由于多语组件对应多个field，因此setValue需要额外传入field字段]
     * @param {[type]} field [发生改变的字段]
     * @param {[type]} value [发生改变的值]
     */
    setValue: function setValue(field, value) {
        this.slice = true;
        if (parseInt(this.options.rowIndex) > -1) {
            if ((this.options.rowIndex + '').indexOf('.') > 0) {
                var childObj = ValueMixin.methods.getChildVariable.call(this);
                var lastRow = childObj.lastRow;
                if (lastRow) lastRow.setValue(field, value);
            } else {
                var rowObj = this.dataModel.getRow(this.options.rowIndex);
                if (rowObj) rowObj.setValue(field, value);
            }
        } else {
            this.dataModel.setValue(field, value);
        }
        this.slice = false;
    }

});

if (u.compMgr) u.compMgr.addDataAdapter({
    adapter: MultilangAdapter,
    name: 'u-multilang'
});

export { MultilangAdapter };