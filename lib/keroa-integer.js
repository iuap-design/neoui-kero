'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IntegerAdapter = undefined;

var _keroaBaseAdapter = require('./keroa-baseAdapter');

var _util = require('tinper-sparrow/src/util');

var _event = require('tinper-sparrow/src/event');

var _core = require('tinper-sparrow/src/core');

var _formater = require('tinper-sparrow/src/util/formater');

var _masker = require('tinper-sparrow/src/util/masker');

var _env = require('tinper-sparrow/src/env');

var _compMgr = require('compox/src/compMgr');

/**
 * Module : Kero integer
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 18:29:59
 */

var IntegerAdapter = _keroaBaseAdapter.BaseAdapter.extend({
    init: function init() {
        var self = this;
        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        if (!this.element) {
            throw new Error('not found INPUT element, u-meta:' + JSON.stringify(this.options));
        };
        this.maskerMeta = _core.core.getMaskerMeta('integer') || {};
        this.validType = this.options['validType'] || 'integer';
        this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
        this.max = this.options['max'];
        this.min = this.options['min'];
        this.maxNotEq = this.options['maxNotEq'];
        this.minNotEq = this.options['minNotEq'];
        this.maxLength = this.options['maxLength'] ? options['maxLength'] : 25;
        this.minLength = this.options['mixLength'] ? options['mixLength'] : 0;
        if (this.dataModel) {
            this.min = this.dataModel.getMeta(this.field, "min") !== undefined ? this.dataModel.getMeta(this.field, "min") : this.min;
            this.max = this.dataModel.getMeta(this.field, "max") !== undefined ? this.dataModel.getMeta(this.field, "max") : this.max;
            this.minNotEq = this.dataModel.getMeta(this.field, "minNotEq") !== undefined ? this.dataModel.getMeta(this.field, "minNotEq") : this.minNotEq;
            this.maxNotEq = this.dataModel.getMeta(this.field, "maxNotEq") !== undefined ? this.dataModel.getMeta(this.field, "maxNotEq") : this.maxNotEq;
            this.minLength = (0, _util.isNumber)(this.dataModel.getMeta(this.field, "minLength")) ? this.dataModel.getMeta(this.field, "minLength") : this.minLength;
            this.maxLength = (0, _util.isNumber)(this.dataModel.getMeta(this.field, "maxLength")) ? this.dataModel.getMeta(this.field, "maxLength") : this.maxLength;
        }
        this.formater = new _formater.NumberFormater(this.maskerMeta.precision);
        this.masker = new _masker.NumberMasker(this.maskerMeta);
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

        (0, _event.on)(this.element, 'blur', function () {
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

        (0, _event.on)(this.element, 'keydown', function (e) {
            if (self.enable) {
                var code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                if (!(code >= 48 && code <= 57 || code >= 96 && code <= 105 || code == 37 || code == 39 || code == 8 || code == 46)) {
                    //阻止默认浏览器动作(W3C)
                    if (e && e.preventDefault) e.preventDefault();
                    //IE中阻止函数器默认动作的方式
                    else window.event.returnValue = false;
                    return false;
                }
            }
        });
    },
    hide: function hide() {
        var self = this;
        self.element.value = (self.element.value + '').replace(/\,/g, '');
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
    }
});
_compMgr.compMgr.addDataAdapter({
    adapter: IntegerAdapter,
    name: 'integer'
});

exports.IntegerAdapter = IntegerAdapter;