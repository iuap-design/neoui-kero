(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './keroa-string', 'tinper-sparrow/src/dom', 'compox/src/compMgr'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./keroa-string'), require('tinper-sparrow/src/dom'), require('compox/src/compMgr'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.keroaString, global.dom, global.compMgr);
        global.keroaUrl = mod.exports;
    }
})(this, function (exports, _keroaString, _dom, _compMgr) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UrlAdapter = undefined;


    var UrlAdapter = _keroaString.StringAdapter.extend({
        init: function init() {
            this.validType = 'url';
            /*
             * 因为需要输入，因此不显示为超链接
             */
        },
        // 如果enable为false则显示<a>标签
        setEnable: function setEnable(enable) {
            if (enable === true || enable === 'true') {
                this.enable = true;
                this.element.removeAttribute('readonly');
                (0, _dom.removeClass)(this.element.parentNode, 'disablecover');
                if (this.aDom) {
                    this.aDom.style.display = 'none';
                }
            } else if (enable === false || enable === 'false') {
                this.enable = false;
                this.element.setAttribute('readonly', 'readonly');
                (0, _dom.addClass)(this.element.parentNode, 'disablecover');
                if (!this.aDom) {
                    this.aDom = (0, _dom.makeDOM)('<div style="position:absolute;background:#fff;z-index:999;"><a href="' + this.trueValue + '" target="_blank" style="position:absolue;">' + this.trueValue + '</a></div>');
                    var left = this.element.offsetLeft;
                    var width = this.element.offsetWidth;
                    var top = this.element.offsetTop;
                    var height = this.element.offsetHeight;
                    this.aDom.style.left = left + 'px';
                    this.aDom.style.width = width + 'px';
                    this.aDom.style.top = top + 'px';
                    this.aDom.style.height = height + 'px';
                    this.element.parentNode.appendChild(this.aDom);
                }
                var $a = $(this.aDom).find('a');
                $a.href = this.trueValue;
                $a.innerHTML = this.trueValue;
                this.aDom.style.display = 'block';
            }
        }
    }); /**
         * Module : Kero url adapter
         * Author : Kvkens(yueming@yonyou.com)
         * Date	  : 2016-08-10 13:51:26
         */

    _compMgr.compMgr.addDataAdapter({
        adapter: UrlAdapter,
        name: 'url'
    });
    exports.UrlAdapter = UrlAdapter;
});