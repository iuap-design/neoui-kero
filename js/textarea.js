/**
 * Module : Kero textarea adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 12:40:46
 */

import {BaseAdapter} from './baseAdapter';
import {ValueMixin} from './valueMixin';
import {EnableMixin} from './valueMixin';
import {RequiredMixin} from './valueMixin';
import {ValidateMixin} from './valueMixin';
import {on} from 'neoui-sparrow/lib/event';
import {compMgr} from 'neoui-sparrow/lib/compMgr';


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

export {TextAreaAdapter};
