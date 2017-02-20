'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PassWordAdapter = undefined;

var _keroaString = require('./keroa-string');

var _util = require('tinper-sparrow/src/util');

var _env = require('tinper-sparrow/src/env');

var _event = require('tinper-sparrow/src/event');

var _compMgr = require('compox/src/compMgr');

/**
 * 密码控件
 */
var PassWordAdapter = _keroaString.StringAdapter.extend({
    init: function init() {
        var oThis = this;
        if (_env.env.isIE8) {
            var outStr = this.element.outerHTML;
            var l = outStr.length;
            outStr = outStr.substring(0, l - 1) + ' type="password"' + outStr.substring(l - 1);
            var newEle = document.createElement(outStr);
            var parent = this.element.parentNode;
            parent.insertBefore(newEle, this.element.nextSibling);
            parent.removeChild(this.element);
            this.element = newEle;
        } else {
            this.element.type = "password";
        }
        oThis.element.title = '';
        this._element = this.element.parentNode;
        this.span = this._element.querySelector("span");
        if (_env.env.isIE8) {
            this.span.style.display = 'none';
        }
        if (this.span) {
            (0, _event.on)(this.span, 'click', function () {
                if (oThis.element.type == 'password') {
                    oThis.element.type = 'text';
                } else {
                    oThis.element.type = 'password';
                }
            });
        }
    },
    setShowValue: function setShowValue(showValue) {
        this.showValue = showValue;
        this.element.value = showValue;
        this.element.title = '';
    }
}); /**
     * Module : Kero password
     * Author : Kvkens(yueming@yonyou.com)
     * Date	  : 2016-08-09 19:19:33
     */

_compMgr.compMgr.addDataAdapter({
    adapter: PassWordAdapter,
    name: 'password'
});

exports.PassWordAdapter = PassWordAdapter;