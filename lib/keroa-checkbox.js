/**
 * Module : Kero Check Adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-08 15:50:03
 */

import { getJSObject, getFunction } from 'tinper-sparrow/src/util';
import { Checkbox } from 'tinper-neoui/src/neoui-checkbox';
import { makeDOM } from 'tinper-sparrow/src/dom';
import { on, stopEvent } from 'tinper-sparrow/src/event';
import { env } from 'tinper-sparrow/src/env';

var CheckboxAdapter = u.BaseAdapter.extend({
    init: function init() {
        var self = this;
        this.isGroup = this.options['isGroup'] === true || this.options['isGroup'] === 'true';
        this.otherValue = this.options['otherValue'] || '其他';
        this.beforeEdit = getFunction(this.viewModel, this.options['beforeEdit']);
        if (this.options['datasource'] || this.options['hasOther']) {
            // 存在datasource或者有其他选项，将当前dom元素保存，以后用于复制新的dom元素
            if (env.isIE) {
                this.checkboxTemplateHTML = this.element.innerHTML;
            } else {
                this.checkboxTemplateArray = [];
                for (var i = 0, count = this.element.childNodes.length; i < count; i++) {
                    this.checkboxTemplateArray.push(this.element.childNodes[i]);
                }
            }
        }
        if (this.options['datasource']) {
            this.isGroup = true;
            this.datasource = getJSObject(this.viewModel, this.options['datasource']);
            if (this.datasource) this.setComboData(this.datasource);
        } else {
            if (this.element['u.Checkbox']) {
                this.comp = this.element['u.Checkbox'];
            } else {
                this.comp = new Checkbox(this.element);
                this.comp.beforeEdit = this.beforeEdit;
                this.element['u.Checkbox'] = this.comp;
            }

            // 由于不同浏览器input的value不一样，所以默认checkedValue修改为true

            this.checkedValue = this.options['checkedValue'] || true;
            this.unCheckedValue = this.options["unCheckedValue"];

            this.comp.on('change', function () {
                if (self.slice) return;
                if (!self.dataModel) return;
                var modelValue = self.dataModel.getValue(self.field);
                modelValue = modelValue ? modelValue + '' : '';
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
            if (env.isIE) {
                var nowHtml = this.element.innerHTML;
                this.element.innerHTML = nowHtml + this.checkboxTemplateHTML;
            } else {
                for (var j = 0; j < this.checkboxTemplateArray.length; j++) {
                    this.element.appendChild(this.checkboxTemplateArray[j].cloneNode(true));
                }
            }

            var LabelS = this.element.querySelectorAll('.u-checkbox');
            self.lastLabel = LabelS[LabelS.length - 1];
            var allCheckS = this.element.querySelectorAll('[type=checkbox]');
            self.lastCheck = allCheckS[allCheckS.length - 1];
            var nameDivs = this.element.querySelectorAll('[data-role=name]');
            self.lastNameDiv = nameDivs[nameDivs.length - 1];
            self.lastNameDiv.innerHTML = '其他';
            self.otherInput = makeDOM('<input disabled type="text" style="width: 80%">');
            self.lastNameDiv.parentNode.appendChild(self.otherInput);
            self.lastCheck.value = '';

            var comp;
            if (self.lastLabel['u.Checkbox']) {
                comp = self.lastLabel['u.Checkbox'];
            } else {
                comp = new Checkbox(self.lastLabel);
            }
            self.lastLabel['u.Checkbox'] = comp;
            self.otherComp = comp;
            comp.on('change', function () {
                if (self.slice) return;
                var modelValue = self.dataModel.getValue(self.field);
                modelValue = modelValue ? modelValue + '' : '';
                var valueArr = modelValue == '' ? [] : modelValue.split(',');
                if (comp._inputElement.checked) {
                    var oldIndex = valueArr.indexOf(self.otherInput.oldValue);
                    if (oldIndex > -1) {
                        valueArr.splice(oldIndex, 1);
                    }
                    if (self.otherInput.value) {
                        valueArr.push(self.otherInput.value);
                    }
                    var otherValueIndex = valueArr.indexOf(self.otherValue);
                    if (otherValueIndex < 0) {
                        valueArr.push(self.otherValue);
                    }

                    // 选中后可编辑
                    comp.element.querySelectorAll('input[type="text"]').forEach(function (ele) {
                        ele.removeAttribute('disabled');
                    });
                } else {
                    var index = valueArr.indexOf(self.otherInput.value);
                    if (index > -1) {
                        valueArr.splice(index, 1);
                    }

                    var otherValueIndex = valueArr.indexOf(self.otherValue);
                    if (otherValueIndex > -1) {
                        valueArr.splice(otherValueIndex, 1);
                    }

                    // 未选中则不可编辑
                    comp.element.querySelectorAll('input[type="text"]').forEach(function (ele) {
                        ele.setAttribute('disabled', 'true');
                    });
                }
                //self.slice = true;
                self.dataModel.setValue(self.field, valueArr.join(','));
                //self.slice = false;
            });

            on(self.otherInput, 'blur', function (e) {
                self.lastCheck.value = this.value;
                self.otherComp.trigger('change');
                this.oldValue = this.value;
            });
            on(self.otherInput, 'click', function (e) {
                stopEvent(e);
            });
        }

        if (this.dataModel) {
            this.dataModel.ref(this.field).subscribe(function (value) {
                if (!value) value = "";
                self.modelValueChange(value);
            });
        }
    },
    setComboData: function setComboData(comboData) {
        var self = this;
        this.datasource = comboData;
        this.element.innerHTML = '';
        if (env.isIE) {
            var htmlStr = '';
            for (var i = 0, len = comboData.length; i < len; i++) {
                htmlStr += this.checkboxTemplateHTML;
            }
            this.element.innerHTML = htmlStr;
        } else {
            for (var i = 0, len = comboData.length; i < len; i++) {
                for (var j = 0; j < this.checkboxTemplateArray.length; j++) {
                    this.element.appendChild(this.checkboxTemplateArray[j].cloneNode(true));
                }
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
                comp = new Checkbox(ele);
                comp.beforeEdit = self.beforeEdit;
            }
            ele['u.Checkbox'] = comp;
            comp.on('change', function () {
                if (self.slice) return;
                var modelValue = self.dataModel.getValue(self.field);
                modelValue = modelValue ? modelValue + '' : '';
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
            if (this.datasource) {
                this.showValue = '';
                this.trueValue = val;
                if (this.options.hasOther) {
                    var otherVal = '';
                    if (val) otherVal = val + ',';
                }
                this.element.querySelectorAll('.u-checkbox').forEach(function (ele) {
                    var comp = ele['u.Checkbox'];
                    if (comp) {
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
                            var nameSpan = ele.querySelector('[data-role=name]');
                            var showValue = $(nameSpan).text();
                            if (showValue) {
                                self.showValue += showValue + ',';
                            }
                        }
                    }
                });
                if (this.options.hasOther) {
                    if (otherVal.indexOf(this.otherValue + ',') > -1) {
                        self.lastCheck.value = this.otherValue;
                        otherVal = otherVal.replace(this.otherValue + ',', '');
                    }
                    otherVal = otherVal.replace(/\,/g, '');
                    if (otherVal) {
                        self.otherInput.oldValue = otherVal;
                        self.otherInput.value = otherVal;
                        self.showValue += otherVal + ',';
                        self.otherInput.removeAttribute('disabled');
                        self.otherComp._inputElement.checked = true;
                        self.otherComp._updateClasses();
                    }
                }
            }
        } else {
            var flag;
            if (this.checkedValue === true) flag = val === this.checkedValue || val === "true";else flag = val === this.checkedValue;
            if (this.comp._inputElement.checked != flag) {
                this.slice = true;
                this.comp.toggle();
                this.slice = false;
            }
        }
    },

    setEnable: function setEnable(enable) {
        this.enable = enable === true || enable === 'true';
        if (this.isGroup) {
            if (this.datasource) {
                if (this.otherInput && !this.enable) {
                    this.otherInput.setAttribute('disabled', true);
                }
                this.element.querySelectorAll('.u-checkbox').forEach(function (ele) {
                    var comp = ele['u.Checkbox'];
                    if (comp) {
                        if (enable === true || enable === 'true') {
                            comp.enable();
                        } else {
                            comp.disable();
                        }
                    }
                });
            }
        } else {
            if (this.enable) {
                this.comp.enable();
            } else {
                this.comp.disable();
            }
        }
    }
});

if (u.compMgr) u.compMgr.addDataAdapter({
    adapter: CheckboxAdapter,
    name: 'u-checkbox'
});

export { CheckboxAdapter };