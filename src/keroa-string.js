/**
 * Module : Kero string adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 20:12:42
 */
import {BaseAdapter} from './keroa-baseAdapter';
import {extend} from 'tinper-sparrow/src/extend';
import {on} from 'tinper-sparrow/src/event';
import {compMgr} from 'compox/src/compMgr';

var StringAdapter = BaseAdapter.extend({
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
    },
    hide: function() {
        var self = this;
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
    }
});
compMgr.addDataAdapter({
        adapter: StringAdapter,
        name: 'string'
    });

	
export {StringAdapter};