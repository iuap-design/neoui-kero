(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './keroa-string', 'tinper-sparrow/src/util/masker', 'tinper-sparrow/src/core', 'compox/src/compMgr', 'tinper-sparrow/src/event'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./keroa-string'), require('tinper-sparrow/src/util/masker'), require('tinper-sparrow/src/core'), require('compox/src/compMgr'), require('tinper-sparrow/src/event'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.keroaString, global.masker, global.core, global.compMgr, global.event);
        global.keroaPhoneNumber = mod.exports;
    }
})(this, function (exports, _keroaString, _masker, _core, _compMgr, _event) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PhoneNumberAdapter = undefined;

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
});