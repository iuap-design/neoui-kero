
/**
 * Module : Kero percent
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 10:33:09
 */


import {
    getJSObject
} from 'tinper-sparrow/src/util';
import {
    makeDOM
} from 'tinper-sparrow/src/dom';
import {
    on,
    off,
    stopEvent
} from 'tinper-sparrow/src/event';
import {
    Radio
} from 'tinper-neoui/src/neoui-radio';
import {
    addClass,
    removeClass
} from 'tinper-sparrow/src/dom';
import {
    env
} from 'tinper-sparrow/src/env';

var RadioAdapter = u.BaseAdapter.extend({
    init: function() {
        var self = this;
        this.dynamic = false;
        this.otherValue = this.options['otherValue'] || '其他';
        if (this.options['datasource'] || this.options['hasOther']) {
            // 存在datasource或者有其他选项，将当前dom元素保存，以后用于复制新的dom元素
            if (env.isIE) {
                this.radioTemplateHTML = this.element.innerHTML;
            } else {
                this.radioTemplateArray = [];
                for (var i = 0, count = this.element.childNodes.length; i < count; i++) {
                    this.radioTemplateArray.push(this.element.childNodes[i]);
                }
            }

        }
        if (this.options['datasource']) {
            this.dynamic = true;
            this.datasource = getJSObject(this.viewModel, this.options['datasource']);
            if (this.datasource)
                this.setComboData(this.datasource);
        } else {
            this.comp = new Radio(this.element);
            this.element['u.Radio'] = this.comp;
            this.eleValue = this.comp._btnElement.value;

            this.comp.on('change', function(event) {
                if (self.slice) return;
                var modelValue = self.dataModel.getValue(self.field);
                //var valueArr = modelValue == '' ?  [] : modelValue.split(',');
                if (self.comp._btnElement.checked) {
                    self.dataModel.setValue(self.field, self.eleValue);
                }
            });
        }

        // 如果存在其他
        if (this.options['hasOther']) {
            var node = null;
            if (env.isIE) {
                var nowHtml = this.element.innerHTML;
                this.element.innerHTML = nowHtml + this.radioTemplateHTML;
            } else {
                for (var j = 0; j < this.radioTemplateArray.length; j++) {
                    this.element.appendChild(this.radioTemplateArray[j].cloneNode(true));
                }
            }

            var LabelS = this.element.querySelectorAll('.u-radio');
            self.lastLabel = LabelS[LabelS.length - 1];
            var allRadioS = this.element.querySelectorAll('[type=radio]');
            self.lastRadio = allRadioS[allRadioS.length - 1];
            var nameDivs = this.element.querySelectorAll('.u-radio-label');
            self.lastNameDiv = nameDivs[nameDivs.length - 1];
            self.lastNameDiv.innerHTML = '其他';
            self.otherInput = makeDOM('<input type="text" disabled style="vertical-align: middle;line-height: normal;width: 80%">');
            self.lastNameDiv.parentNode.appendChild(self.otherInput);
            self.lastRadio.value = '';


            var comp;
            if (self.lastLabel['u.Radio']) {
                comp = self.lastLabel['u.Radio'];
            } else {
                comp = new Radio(self.lastLabel);
            }
            self.lastLabel['u.Radio'] = comp;
            self.otherComp = comp;
            comp.on('change', function() {
                if (comp._btnElement.checked) {
                    if (self.otherInput.value) {
                        self.dataModel.setValue(self.field, self.otherInput.value);
                    } else {
                        self.dataModel.setValue(self.field, self.otherValue);
                    }
                    // 选中后可编辑
                    comp.element.querySelectorAll('input[type="text"]').forEach(function(ele) {
                        ele.removeAttribute('disabled');
                    });
                } else {
                    comp.element.querySelectorAll('input[type="text"]').forEach(function(ele) {
                        ele.setAttribute('disabled', true);
                    });
                }
            });

            on(self.otherInput, 'blur', function(e) {
                self.otherComp.trigger('change');
            })
            on(self.otherInput, 'click', function(e) {
                stopEvent(e);
            })
        }

        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },
    setComboData: function(comboData) {

        var self = this;
        this.datasource = comboData;
        this.element.innerHTML = '';
        if (env.isIE) {
            var htmlStr = ''
            for (var i = 0, len = comboData.length; i < len; i++) {
                htmlStr　 += this.radioTemplateHTML;
            }
            this.element.innerHTML = htmlStr;
        } else {
            for (var i = 0, len = comboData.length; i < len; i++) {
                for (var j = 0; j < this.radioTemplateArray.length; j++) {
                    this.element.appendChild(this.radioTemplateArray[j].cloneNode(true));
                }
                //this.radioTemplate.clone().appendTo(this.element)
            }
        }


        var allRadio = this.element.querySelectorAll('[type=radio]');
        var allName = this.element.querySelectorAll('.u-radio-label');
        for (var k = 0; k < allRadio.length; k++) {
            allRadio[k].value = comboData[k].pk || comboData[k].value;
            allName[k].innerHTML = comboData[k].name
        }

        this.radioInputName = '';
        if (allRadio.length > 0) {
            this.radioInputName = allRadio[0].name;
        }

        this.element.querySelectorAll('.u-radio').forEach(function(ele) {
            var comp = new Radio(ele);
            ele['u.Radio'] = comp;

            comp.on('change', function(event) {
                if (comp._btnElement.checked) {
                    self.dataModel.setValue(self.field, comp._btnElement.value);
                }
                // 其他元素input输入框不能进行编辑
                var allChild = comp.element.parentNode.children;
                var siblingAry = [];
                for (var i = 0; i < allChild.length; i++) {
                    if (allChild[i] == comp.element) {

                    } else {
                        siblingAry.push(allChild[i])
                    }
                }
                siblingAry.forEach(function(children) {
                    var childinput = children.querySelectorAll('input[type="text"]')
                    if (childinput) {
                        childinput.forEach(function(inputele) {
                            inputele.setAttribute('disabled', 'true')
                        });
                    }
                });
            });
        })
    },

    modelValueChange: function(value) {
        if (this.slice) return;
        var fetch = false,self = this;
        if (this.dynamic) {
            if (this.datasource) {
                this.showValue = '';
                this.trueValue = value;
                this.element.querySelectorAll('.u-radio').forEach(function(ele) {
                    var comp = ele['u.Radio'];
                    if (comp) {
                        var inptuValue = comp._btnElement.value;
                        //解决boolean类型的true和false与"true"和"false"比较
                        if (inptuValue && inptuValue == value.toString()) {
                            fetch = true;
                            addClass(comp.element, 'is-checked')
                            comp._btnElement.click();
                            var nameSpan = ele.querySelector('.u-radio-label');
                            var showValue = $(nameSpan).text();
                            if (showValue) {
                                self.showValue = showValue;
                            }
                        } else {
                            removeClass(comp.element, 'is-checked')
                        }
                    }
                })
            }
        } else {
            if (this.eleValue == value) {
                fetch = true;
                this.slice = true;
                addClass(this.comp.element, 'is-checked')
                //this.comp._btnElement.click(); // https://github.com/iuap-design/tinper.org/issues/41
                this.slice = false;
            }
        }
        if (this.options.hasOther && !fetch && value) {
            this.showValue = value;
            if (!this.enable) {
                this.lastRadio.removeAttribute('disabled');
            }
            u.addClass(this.lastLabel, 'is-checked')
            this.lastRadio.checked = true;
            if (value != this.otherValue) {
                this.otherInput.value = value;
            }
            this.lastRadio.removeAttribute('disabled');
            this.otherInput.removeAttribute('disabled');
            if (!this.enable) {
                this.lastRadio.setAttribute('disabled', true);
            }
        }
    },

    setEnable: function(enable) {
        this.enable = (enable === true || enable === 'true');
        if (this.dynamic) {
            if (this.datasource) {
                if (this.otherInput && !this.enable) {
                    this.otherInput.setAttribute('disabled', true);
                }
                this.element.querySelectorAll('.u-radio').forEach(function(ele) {
                    var comp = ele['u.Radio'];
                    if (comp) {
                        if (enable === true || enable === 'true') {
                            comp.enable();
                        } else {
                            comp.disable();
                        }
                    }
                })
            }
        } else {
            if (this.enable) {
                this.comp.enable();
            } else {
                this.comp.disable();
            }
        }
    }
})


if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: RadioAdapter,
        name: 'u-radio'
    });
export {
    RadioAdapter
};
