/**
 * Module : Kero string adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 20:12:42
 */

import {
    extend
} from 'tinper-sparrow/src/extend';
import {
    on
} from 'tinper-sparrow/src/event';

import {
    addClass,
    removeClass
} from 'tinper-sparrow/src/dom';

var StringAdapter = u.BaseAdapter.extend({
    init: function() {
        var self = this;
        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        if (!this.element) {
            throw new Error('not found INPUT element, u-meta:' + JSON.stringify(this.options));
        };
        this.validType = this.options['validType'] || 'string';
        this.minLength = this.getOption('minLength');
        this.maxLength = this.getOption('maxLength');
        var placeholder = this.options['placeholder']
        if (placeholder)
            this.element.placeholder = placeholder;

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

        on(this.element, 'blur', function(e) {
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
                } else
                    self.setValue(self.element.value)
            }
        });
    },
    onFocusin: function(){
        this.setShowValue(this.getValue())
    },
    hide: function() {
        var self = this;
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
            } else
                self.setValue(self.element.value)
        }
    },
    setEnable: function(enable) {
        var self = this;
        if (this.trueAdpt)
            self = this.trueAdpt
        if (enable === true || enable === 'true') {
            self.enable = true;
            self.element.removeAttribute('readonly');
            removeClass(self.element.parentNode, 'disablecover');
        } else if (enable === false || enable === 'false') {
            self.enable = false;
            self.element.setAttribute('readonly', 'readonly');
            addClass(self.element.parentNode, 'disablecover');
        }
    }
});
if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: StringAdapter,
        name: 'string'
    });


export {
    StringAdapter
};
