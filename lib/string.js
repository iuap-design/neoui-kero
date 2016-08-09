'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StringAdapter = undefined;

var _baseAdapter = require('./baseAdapter');

var _extend = require('neoui-sparrow/lib/extend');

var _valueMixin = require('./valueMixin');

var _event = require('neoui-sparrow/lib/event');

var _compMgr = require('neoui-sparrow/lib/compMgr');

/**
 * Module : Kero string adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 20:12:42
 */
var StringAdapter = _baseAdapter.BaseAdapter.extend({
    mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin, _valueMixin.RequiredMixin, _valueMixin.ValidateMixin],
    init: function init() {
        var self = this;
        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        if (!this.element) {
            throw new Error('not found INPUT element, u-meta:' + JSON.stringify(this.options));
        };
        this.validType = this.options['validType'] || 'string';
        this.minLength = this.getOption('minLength');
        this.maxLength = this.getOption('maxLength');

        (0, _event.on)(this.element, 'focus', function () {
            if (self.enable) {
                self.setShowValue(self.getValue());
                try {
                    var e = event.srcElement;
                    var r = e.createTextRange();
                    r.moveStart('character', e.value.length);
                    r.collapse(true);
                    r.select();
                } catch (e) {}
            }
        });

        (0, _event.on)(this.element, 'blur', function (e) {
            if (self.enable) {
                if (!self.doValidate() && self._needClean()) {
                    if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                        // 因必输项清空导致检验没通过的情况
                        self.setValue('');
                    } else {
                        self.element.value = self.getShowValue();
                    }
                } else self.setValue(self.element.value);
            }
        });
    }
});
_compMgr.compMgr.addDataAdapter({
    adapter: StringAdapter,
    name: 'string'
});

exports.StringAdapter = StringAdapter;