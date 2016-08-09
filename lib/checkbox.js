'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CheckboxAdapter = undefined;

var _baseAdapter = require('./baseAdapter');

var _valueMixin = require('./valueMixin');

var _util = require('neoui-sparrow/lib/util');

var _neouiCheckbox = require('neoui/lib/neoui-checkbox');

var _compMgr = require('neoui-sparrow/lib/compMgr');

/**
 * Module : Kero Check Adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-08 15:50:03
 */

var CheckboxAdapter = _baseAdapter.BaseAdapter.extend({
    mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin, _valueMixin.RequiredMixin, _valueMixin.ValidateMixin],
    init: function init(options) {
        var self = this;
        // CheckboxAdapter.superclass.initialize.apply(this, arguments); 
        this.isGroup = this.options['isGroup'] === true || this.options['isGroup'] === 'true';
        if (this.options['datasource'] || this.options['hasOther']) {
            // 存在datasource或者有其他选项，将当前dom元素保存，以后用于复制新的dom元素
            this.checkboxTemplateArray = [];
            for (var i = 0, count = this.element.childNodes.length; i < count; i++) {
                this.checkboxTemplateArray.push(this.element.childNodes[i]);
            }
        }
        if (this.options['datasource']) {
            this.isGroup = true;
            var datasource = (0, _util.getJSObject)(this.viewModel, this.options['datasource']);

            this.setComboData(datasource);
        } else {
            if (this.element['u.Checkbox']) {
                this.comp = this.element['u.Checkbox'];
            } else {
                this.comp = new _neouiCheckbox.Checkbox(this.element);
                this.element['u.Checkbox'] = this.comp;
            }

            this.checkedValue = this.options['checkedValue'] || this.comp._inputElement.value;
            this.unCheckedValue = this.options["unCheckedValue"];

            this.comp.on('change', function () {
                if (self.slice) return;
                if (!self.dataModel) return;
                var modelValue = self.dataModel.getValue(self.field);
                modelValue = modelValue ? modelValue : '';
                if (self.isGroup) {
                    var valueArr = modelValue == '' ? [] : modelValue.split(',');

                    if (self.comp._inputElement.checked) {
                        valueArr.push(self.checkedValue);
                    } else {
                        var index = valueArr.indexOf(self.checkedValue);
                        valueArr.splice(index, 1);
                    }
                    self.dataModel.setValue(self.field, valueArr.join(','));
                } else {
                    if (self.comp._inputElement.checked) {
                        self.dataModel.setValue(self.field, self.checkedValue);
                    } else {
                        self.dataModel.setValue(self.field, self.unCheckedValue);
                    }
                }
            });
        }
        // 如果存在其他
        if (this.options['hasOther']) {
            var node = null;
            for (var j = 0; j < this.checkboxTemplateArray.length; j++) {
                this.element.appendChild(this.checkboxTemplateArray[j].cloneNode(true));
            }
            var LabelS = this.element.querySelectorAll('.u-checkbox');
            self.lastLabel = LabelS[LabelS.length - 1];
            var allCheckS = this.element.querySelectorAll('[type=checkbox]');
            self.lastCheck = allCheckS[allCheckS.length - 1];
            var nameDivs = this.element.querySelectorAll('[data-role=name]');
            self.lastNameDiv = nameDivs[nameDivs.length - 1];
            self.lastNameDiv.innerHTML = '其他';
            self.otherInput = makeDOM('<input type="text">');
            self.lastNameDiv.parentNode.appendChild(self.otherInput);
            self.lastCheck.value = '';

            var comp;
            if (self.lastLabel['u.Checkbox']) {
                comp = self.lastLabel['u.Checkbox'];
            } else {
                comp = new _neouiCheckbox.Checkbox(self.lastLabel);
            }
            self.lastLabel['u.Checkbox'] = comp;
            self.otherComp = comp;
            comp.on('change', function () {
                if (self.slice) return;
                var modelValue = self.dataModel.getValue(self.field);
                modelValue = modelValue ? modelValue : '';
                var valueArr = modelValue == '' ? [] : modelValue.split(',');
                if (comp._inputElement.checked) {
                    var oldIndex = valueArr.indexOf(comp._inputElement.oldValue);
                    if (oldIndex > -1) {
                        valueArr.splice(oldIndex, 1);
                    }
                    if (comp._inputElement.value) valueArr.push(comp._inputElement.value);
                } else {
                    var index = valueArr.indexOf(comp._inputElement.value);
                    if (index > -1) {
                        valueArr.splice(index, 1);
                    }
                }
                //self.slice = true;
                self.dataModel.setValue(self.field, valueArr.join(','));
                //self.slice = false;
            });

            on(self.otherInput, 'blur', function (e) {
                self.lastCheck.oldValue = self.lastCheck.value;
                self.lastCheck.value = this.value;
                self.otherComp.trigger('change');
            });
            on(self.otherInput, 'click', function (e) {
                stopEvent(e);
            });
        }

        if (this.dataModel) {
            this.dataModel.ref(this.field).subscribe(function (value) {
                self.modelValueChange(value);
            });
        }
    },
    setComboData: function setComboData(comboData) {
        var self = this;
        //this.element.innerHTML = '';
        for (var i = 0, len = comboData.length; i < len - 1; i++) {
            for (var j = 0; j < this.checkboxTemplateArray.length; j++) {
                this.element.appendChild(this.checkboxTemplateArray[j].cloneNode(true));
            }
        }
        var allCheck = this.element.querySelectorAll('[type=checkbox]');
        var allName = this.element.querySelectorAll('[data-role=name]');
        for (var k = 0; k < allCheck.length; k++) {
            allCheck[k].value = comboData[k].pk || comboData[k].value;
            allName[k].innerHTML = comboData[k].name;
        }
        this.element.querySelectorAll('.u-checkbox').forEach(function (ele) {
            var comp;
            if (ele['u.Checkbox']) {
                comp = ele['u.Checkbox'];
            } else {
                comp = new _neouiCheckbox.Checkbox(ele);
            }
            ele['u.Checkbox'] = comp;
            comp.on('change', function () {
                if (self.slice) return;
                var modelValue = self.dataModel.getValue(self.field);
                modelValue = modelValue ? modelValue : '';
                var valueArr = modelValue == '' ? [] : modelValue.split(',');
                if (comp._inputElement.checked) {
                    valueArr.push(comp._inputElement.value);
                } else {
                    var index = valueArr.indexOf(comp._inputElement.value);
                    valueArr.splice(index, 1);
                }
                //self.slice = true;
                self.dataModel.setValue(self.field, valueArr.join(','));
                //self.slice = false;
            });
        });
    },
    modelValueChange: function modelValueChange(val) {
        var self = this;
        if (this.slice) return;

        if (this.isGroup) {
            this.trueValue = val;
            if (this.options.hasOther) {
                otherVal = '';
                if (val) otherVal = val + ',';
            }
            this.element.querySelectorAll('.u-checkbox').forEach(function (ele) {
                var comp = ele['u.Checkbox'];
                var inputValue = comp._inputElement.value;
                if (inputValue && comp._inputElement.checked != (val + ',').indexOf(inputValue + ',') > -1) {
                    self.slice = true;
                    comp.toggle();
                    self.slice = false;
                }
                if (inputValue && (val + ',').indexOf(inputValue + ',') > -1) {
                    if (self.options.hasOther) {
                        otherVal = otherVal.replace(inputValue + ',', '');
                    }
                }
            });
            if (this.options.hasOther) {
                otherVal = otherVal.replace(/\,/g, '');
                if (otherVal) {
                    self.lastCheck.value = otherVal;
                    self.otherInput.value = otherVal;
                }
            }
        } else {
            if (this.comp._inputElement.checked != (val === this.checkedValue)) {
                this.slice = true;
                this.comp.toggle();
                this.slice = false;
            }
        }
    },

    setEnable: function setEnable(enable) {
        this.enable = enable === true || enable === 'true';
        if (this.isGroup) {
            this.element.querySelectorAll('.u-checkbox').forEach(function (ele) {
                var comp = ele['u.Checkbox'];
                if (enable === true || enable === 'true') {
                    comp.enable();
                } else {
                    comp.disable();
                }
            });
        } else {
            if (this.enable) {
                this.comp.enable();
            } else {
                this.comp.disable();
            }
        }
    }
});

_compMgr.compMgr.addDataAdapter({
    adapter: CheckboxAdapter,
    name: 'u-checkbox'
});

exports.CheckboxAdapter = CheckboxAdapter;