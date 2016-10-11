/**
 * Module : Kero string adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 20:12:42
 */
import {BaseAdapter} from '../core/baseAdapter';
import {extend} from 'tinper-sparrow/js/extend';
import {ValueMixin} from '../core/valueMixin';
import {EnableMixin} from '../core/enableMixin';
import {RequiredMixin} from '../core/requiredMixin';
import {ValidateMixin} from '../core/validateMixin';
import {on} from 'tinper-sparrow/js/event';
import {compMgr} from 'tinper-sparrow/js/compMgr';

var StringAdapter = BaseAdapter.extend({
    mixins:[ValueMixin,EnableMixin, RequiredMixin, ValidateMixin],
    init: function(){
        var self = this;
        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        if (!this.element){
            throw new Error('not found INPUT element, u-meta:' + JSON.stringify(this.options));
        };
        this.validType = this.options['validType'] || 'string';
        this.minLength = this.getOption('minLength');
        this.maxLength = this.getOption('maxLength');

        on(this.element, 'focus', function(){
            if(self.enable){
                self.setShowValue(self.getValue())
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

        on(this.element, 'blur',function(e){
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
    }
});
compMgr.addDataAdapter({
        adapter: StringAdapter,
        name: 'string'
    });

	
export {StringAdapter};
