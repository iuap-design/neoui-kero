/**
 * Module : Kero textarea adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 12:40:46
 */

import {BaseAdapter} from '../core/baseAdapter';

import {ValueMixin} from 'neoui-kero-mixin/js/valueMixin';
import {EnableMixin} from 'neoui-kero-mixin/js/enableMixin';
import {RequiredMixin} from 'neoui-kero-mixin/js/requiredMixin';
import {ValidateMixin} from 'neoui-kero-mixin/js/validateMixin';

import {on} from 'tinper-sparrow/js/event';
import {compMgr} from 'tinper-sparrow/js/compMgr';


var TextAreaAdapter = BaseAdapter.extend({
    mixins:[ValueMixin,EnableMixin, RequiredMixin, ValidateMixin],
    init: function () {
        var self = this;
        this.element = this.element.nodeName === 'TEXTAREA' ? this.element : this.element.querySelector('textarea');
        if (!this.element){
            throw new Error('not found TEXTAREA element, u-meta:' + JSON.stringify(this.options));
        };

        on(this.element, 'focus', function () {
            self.setShowValue(self.getValue())
        });
        on(this.element, 'blur', function () {
            self.setValue(self.element.value)
        })
    }
});
compMgr.addDataAdapter({
	adapter: TextAreaAdapter,
	name: 'textarea'
});

compMgr.addDataAdapter({
    adapter: TextAreaAdapter,
    name: 'u-textarea'
});

export {TextAreaAdapter};
