/**
 * Module : Kero float adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 15:16:08
 */

import {
    on,
    off,
    stopEvent
} from 'tinper-sparrow/src/event';
import {
    addClass,
    removeClass
} from 'tinper-sparrow/src/dom';
import {
    core
} from 'tinper-sparrow/src/core';
import {
    NumberFormater
} from 'tinper-sparrow/src/util/formater';
import {
    date
} from 'tinper-sparrow/src/util/dateUtils';
import {
    NumberMasker
} from 'tinper-sparrow/src/util/masker';
import {
    isNumber
} from 'tinper-sparrow/src/util';


var FloatAdapter = u.BaseAdapter.extend({
    init: function() {
        var self = this;
        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        if (!this.element) {
            throw new Error('not found INPUT element, u-meta:' + JSON.stringify(this.options));
        };
        this.maskerMeta = core.getMaskerMeta('float') || {};
        this.validType = 'float';
        this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
        this.max = this.getOption('max');
        this.min = this.getOption('min');
        var placeholder = this.options['placeholder']
        if (placeholder)
            this.element.placeholder = placeholder;
        //如果max为false并且不为0
        if (!this.max && this.max !== 0) {
            this.max = "10000000000000000000";
        }
        //如果min为false并且不为0
        if (!this.min && this.min !== 0) {
            this.min = "-10000000000000000000";
        }
        // this.max = this.getOption('max') || "10000000000000000000";
        // this.min = this.getOption('min') || "-10000000000000000000";
        this.maxNotEq = this.getOption('maxNotEq');
        this.minNotEq = this.getOption('minNotEq');

        //处理数据精度
        this.dataModel.refRowMeta(this.field, "precision").subscribe(function(precision) {
            if (precision === undefined) return;
            self.setPrecision(precision)
        });
        this.formater = new NumberFormater(this.maskerMeta.precision);
        this.masker = new NumberMasker(this.maskerMeta);
        on(this.element, 'focus', function() {
            if (self.enable) {
                self.onFocusin()
                try {
                    var e = event.srcElement;
                    var r = e.createTextRange();
                    r.moveStart('character', e.value.length);
                    r.collapse(true);
                    r.select();
                } catch (e) {}
            }
        })

        on(this.element, 'blur', function() {
            var newValue;
            if (self.enable) {
                if (!self.doValidate().passed) {
                    if (self._needClean()) {
                        if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                            // 因必输项清空导致检验没通过的情况
                            self.setValue('')
                        } else {
                            self.element.value = self.getShowValue()
                        }
                    }

                } else {
                    newValue = self.element.value ? self.element.value.replaceAll(',', '') : "";
                    self.setValue(newValue);
                }
            }
        });

        on(this.element, 'keydown', function(e) {
            if (self.enable) {
                var code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                if (e.ctrlKey && (e.keyCode == 67 || e.keyCode == 86)) {
                    //复制粘贴
                    return true;
                }
                if (!((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 37 || code == 102 || code == 39 || code == 8 || code == 46 || code == 110 || code == 190 || code == 189 || code == 109)) {
                    //阻止默认浏览器动作(W3C)
                    if (e && e.preventDefault)
                        e.preventDefault();
                    //IE中阻止函数器默认动作的方式
                    else
                        window.event.returnValue = false;
                    return false;
                }
            }
        })
    },
    hide: function() {
        var self = this,
            newValue;
        if (self.enable) {
            if (!self.doValidate().passed) {
                if (self._needClean()) {
                    if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                        // 因必输项清空导致检验没通过的情况
                        self.setValue('')
                    } else {
                        self.element.value = self.getShowValue()
                    }
                }
            } else {
                newValue = self.element.value ? self.element.value.replaceAll(',', '') : "";
                self.setValue(newValue);
            }
        }
    },
    /**
     * 修改精度
     * @param {Integer} precision
     */
    setPrecision: function(precision) {
        if (this.maskerMeta.precision == precision) return;
        this.maskerMeta.precision = precision
        this.formater = new NumberFormater(this.maskerMeta.precision);
        this.masker = new NumberMasker(this.maskerMeta);
        var currentRow = this.dataModel.getCurrentRow();
        if (currentRow) {
            var v = this.dataModel.getCurrentRow().getValue(this.field)
            this.showValue = this.masker.format(this.formater.format(v)).value
        } else {
            this.showValue = this.masker.format(this.formater.format(this.trueValue)).value
        }

        this.setShowValue(this.showValue)
    },

    onFocusin: function() {
        var v = this.getValue(),
            vstr = v + '',
            focusValue = v;
        if (isNumber(v) && isNumber(this.maskerMeta.precision)) {
            if (vstr.indexOf('.') >= 0) {
                var sub = vstr.substr(vstr.indexOf('.') + 1);
                if (sub.length < this.maskerMeta.precision || parseInt(sub.substr(this.maskerMeta.precision)) == 0) {
                    focusValue = this.formater.format(v)
                }
            } else if (this.maskerMeta.precision > 0) {
                focusValue = this.formater.format(v)
            }
        }

        focusValue = parseFloat(focusValue) === 0 ? parseFloat(focusValue) : (parseFloat(focusValue) || '');
        this.setShowValue(focusValue)
    }
});

if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: FloatAdapter,
        name: 'float'
    });

export {
    FloatAdapter
};
