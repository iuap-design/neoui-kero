'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TextAreaAdapter = undefined;

var _keroaBaseAdapter = require('./keroa-baseAdapter');

var _event = require('tinper-sparrow/src/event');

var _compMgr = require('compox/src/compMgr');

var TextAreaAdapter = _keroaBaseAdapter.BaseAdapter.extend({
    init: function init() {
        var self = this;
        this.element = this.element.nodeName === 'TEXTAREA' ? this.element : this.element.querySelector('textarea');
        if (!this.element) {
            throw new Error('not found TEXTAREA element, u-meta:' + JSON.stringify(this.options));
        };

        (0, _event.on)(this.element, 'focus', function () {
            self.setShowValue(self.getValue());
        });
        (0, _event.on)(this.element, 'blur', function () {
            self.setValue(self.element.value);
        });
    }
}); /**
     * Module : Kero textarea adapter
     * Author : Kvkens(yueming@yonyou.com)
     * Date	  : 2016-08-10 12:40:46
     */

_compMgr.compMgr.addDataAdapter({
    adapter: TextAreaAdapter,
    name: 'textarea'
});

_compMgr.compMgr.addDataAdapter({
    adapter: TextAreaAdapter,
    name: 'u-textarea'
});

exports.TextAreaAdapter = TextAreaAdapter;