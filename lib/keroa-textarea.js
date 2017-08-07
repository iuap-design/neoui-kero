/**
 * Module : Kero textarea adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 12:40:46
 */

import { on } from 'tinper-sparrow/src/event';

var TextAreaAdapter = u.BaseAdapter.extend({
    init: function init() {
        var self = this;
        this.element = this.element.nodeName === 'TEXTAREA' ? this.element : this.element.querySelector('textarea');
        if (!this.element) {
            throw new Error('not found TEXTAREA element, u-meta:' + JSON.stringify(this.options));
        };
        var placeholder = this.options['placeholder'];
        if (placeholder) this.element.placeholder = placeholder;

        on(this.element, 'focus', function () {
            self.setShowValue(self.getValue());
        });
        on(this.element, 'blur', function () {
            if (self.enable) {
                if (!self.doValidate().passed) {
                    if (self._needClean()) {
                        if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                            // 因必输项清空导致检验没通过的情况
                            self.setValue('');
                        } else {
                            self.element.value = self.getShowValue();
                        }
                    }
                } else self.setValue(self.element.value);
            }
        });
    }
});
if (u.compMgr) u.compMgr.addDataAdapter({
    adapter: TextAreaAdapter,
    name: 'textarea'
});

if (u.compMgr) u.compMgr.addDataAdapter({
    adapter: TextAreaAdapter,
    name: 'u-textarea'
});

export { TextAreaAdapter };