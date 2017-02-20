'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PhoneNumberAdapter = undefined;

var _keroaString = require('./keroa-string');

var _masker = require('tinper-sparrow/src/util/masker');

var _core = require('tinper-sparrow/src/core');

var _compMgr = require('compox/src/compMgr');

var _event = require('tinper-sparrow/src/event');

/**
 * 手机号控件
 */
var PhoneNumberAdapter = _keroaString.StringAdapter.extend({
    init: function init() {
        var self = this;
        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        PhoneNumberAdapter.superclass.init.apply(this);
        this.validType = 'phone';
        this.masker = new _masker.PhoneNumberMasker(this.maskerMeta);

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
    }
}); /**
     * Module : Kero phonenumber
     * Author : Alex(zhoubyc@yonyou.com)
     * Date	  : 2016-08-09 20:02:50
     */

_compMgr.compMgr.addDataAdapter({
    adapter: PhoneNumberAdapter,
    name: 'phoneNumber'
});
exports.PhoneNumberAdapter = PhoneNumberAdapter;