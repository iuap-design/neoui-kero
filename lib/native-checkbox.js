'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NativeCheckAdapter = undefined;

var _baseAdapter = require('./baseAdapter');

var _valueMixin = require('./valueMixin');

var _util = require('neoui-sparrow/lib/util');

var _event = require('neoui-sparrow/lib/event');

var _compMgr = require('neoui-sparrow/lib/compMgr');

/**
 * Module : Kero native-checkbox
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 18:55:51
 */

var NativeCheckAdapter = _baseAdapter.BaseAdapter.extend({
    mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin],
    init: function init() {
        var self = this;
        this.isGroup = false;
        //如果存在datasource，动态创建checkbox
        if (this.options['datasource']) {
            this.isGroup = true;
            var datasource = (0, _util.getJSObject)(this.viewModel, this.options['datasource']);

            this.checkboxTemplateArray = [];
            for (var i = 0, count = this.element.childNodes.length; i < count; i++) {
                this.checkboxTemplateArray.push(this.element.childNodes[i]);
            }
            this.setComboData(datasource);
        } else {
            this.checkedValue = this.options['checkedValue'] || 'Y';
            this.unCheckedValue = this.options["unCheckedValue"] || 'N';
            (0, _event.on)(this.element, 'click', function () {
                if (this.checked) {
                    self.dataModel.setValue(self.field, self.checkedValue);
                } else {
                    self.dataModel.setValue(self.field, self.unCheckedValue);
                }
            });
        }
    },
    setComboData: function setComboData(comboData) {
        var self = this;
        this.element.innerHTML = '';
        for (var i = 0, len = comboData.length; i < len; i++) {
            for (var j = 0; j < this.checkboxTemplateArray.length; j++) {
                try {
                    this.element.appendChild(this.checkboxTemplateArray[j].cloneNode());
                } catch (e) {}
            }
            //this.radioTemplate.clone().appendTo(this.element)
        }

        var allCheck = this.element.querySelectorAll('[type=checkbox]');
        var allName = this.element.querySelectorAll('[data-role=name]');
        for (var k = 0; k < allCheck.length; k++) {
            allCheck[k].value = comboData[k].pk || comboData[k].value;
            allName[k].innerHTML = comboData[k].name;
        }

        this.element.querySelectorAll('[type=checkbox]').forEach(function (ele) {
            (0, _event.on)(ele, 'click', function () {
                var modelValue = self.dataModel.getValue(self.field);

                var valueArr = modelValue == '' ? [] : modelValue.split(',');

                if (this.checked) {
                    valueArr.push(this.value);
                } else {
                    var index = valueArr.indexOf(this.value);
                    valueArr.splice(index, 1);
                }
                self.slice = true;
                self.dataModel.setValue(self.field, valueArr.join(','));
                self.slice = false;
            });
        });
    },
    modelValueChange: function modelValueChange(val) {
        if (this.slice) return;
        if (this.isGroup) {
            this.element.querySelectorAll('[type=checkbox]').forEach(function (ele) {
                if (ele.checked != (val + ',').indexOf(ele.value) > -1) {
                    this.slice = true;
                    ele.checked = !ele.checked;
                    this.slice = false;
                }
            });
        } else {
            if (this.element.checked != (val === this.checkedValue)) {
                this.slice = true;
                this.element.checked = !this.element.checked;
                this.slice = false;
            }
        }
    },
    setValue: function setValue(value) {
        this.trueValue = value;
        this.element.querySelectorAll('[type=checkbox]').forEach(function (ele) {
            if (ele.value == value) {
                ele.checked = true;
            } else {
                ele.checked = false;
            }
        });
        this.slice = true;
        this.dataModel.setValue(this.field, this.trueValue);
        this.slice = false;
    },
    getValue: function getValue() {
        return this.trueValue;
    }

});

_compMgr.compMgr.addDataAdapter({
    adapter: NativeCheckAdapter,
    name: 'checkbox'
});
exports.NativeCheckAdapter = NativeCheckAdapter;