/**
 * Module : Kero float adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 15:16:08
 */
import {BaseAdapter} from '../core/baseAdapter';
import {ValueMixin} from '../core/valueMixin';
import {EnableMixin} from '../core/enableMixin';
import {RequiredMixin} from '../core/requiredMixin';
import {ValidateMixin} from '../core/validateMixin';
import {on,off,stopEvent} from 'neoui-sparrow/js/event';
import {addClass,removeClass} from 'neoui-sparrow/js/dom';
import {core} from 'neoui-sparrow/js/core';
import {NumberFormater} from 'neoui-sparrow/js/util/formater';
import {date} from 'neoui-sparrow/js/util/dateUtils';
import {compMgr} from 'neoui-sparrow/js/compMgr';
import {NumberMasker} from 'neoui-sparrow/js/util/masker';
import {isNumber} from 'neoui-sparrow/js/util';


var FloatAdapter = BaseAdapter.extend({
    mixins:[ValueMixin,EnableMixin, RequiredMixin, ValidateMixin],
    init: function () {
        var self = this;
        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        if (!this.element){
            throw new Error('not found INPUT element, u-meta:' + JSON.stringify(this.options));
        };
        this.maskerMeta = core.getMaskerMeta('float') || {};
        this.validType = 'float';
        this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
        this.max = this.getOption('max') ;
        this.min = this.getOption('min') ;
        //如果max为false并且不为0
        if(!this.max && this.max !== 0) {
            this.max = "10000000000000000000";
        }
        //如果min为false并且不为0
        if(!this.min && this.min !== 0) {
            this.min = "-10000000000000000000";
        }
        // this.max = this.getOption('max') || "10000000000000000000";
        // this.min = this.getOption('min') || "-10000000000000000000";
        this.maxNotEq = this.getOption('maxNotEq');
        this.minNotEq = this.getOption('minNotEq');

        //处理数据精度
        this.dataModel.refRowMeta(this.field, "precision").subscribe(function(precision){
            if(precision === undefined) return;
            self.setPrecision(precision)
        });
        this.formater = new NumberFormater(this.maskerMeta.precision);
        this.masker = new NumberMasker(this.maskerMeta);
        on(this.element, 'focus', function(){
            if(self.enable){
                self.onFocusin()
                try{
                    var e = event.srcElement;
                    var r = e.createTextRange();
                    r.moveStart('character',e.value.length);
                    r.collapse(true);
                    r.select();
                }catch(e){
                }
            }
        })

        on(this.element, 'blur',function(){
            if(self.enable){
                if (!self.doValidate() && self._needClean()) {
                    if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                        // 因必输项清空导致检验没通过的情况
                        self.setValue('')
                    } else {
                        self.element.value = self.getShowValue()
                    }
                }
                else
                    self.setValue(self.element.value)
            }
        });

        on(this.element,'keydown',function(e){
            if(self.enable){
                var code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                if (!(code >= 48 && code <= 57||code==37||code==39||code==8 ||code==46 || code == 110 || code == 190)) {
                    //阻止默认浏览器动作(W3C)
                    if ( e && e.preventDefault )
                        e.preventDefault();
                    //IE中阻止函数器默认动作的方式
                    else
                        window.event.returnValue = false;
                    return false;
                }
            }
        })
    },
    /**
     * 修改精度
     * @param {Integer} precision
     */
    setPrecision: function (precision) {
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
    onFocusin: function () {
        var v = this.dataModel.getCurrentRow().getValue(this.field), vstr = v + '', focusValue = v;
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

        focusValue = parseFloat(focusValue)===0 ? parseFloat(focusValue):(parseFloat(focusValue) || '');
        this.setShowValue(focusValue)
    },
    _needClean: function () {
        return true
    }
});

compMgr.addDataAdapter({
	adapter: FloatAdapter,
	name: 'float'
});

export {FloatAdapter};
