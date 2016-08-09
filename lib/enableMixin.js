'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnableMixin = undefined;

var _dom = require('neoui-sparrow/lib/dom');

var EnableMixin = {
    init: function init() {
        var self = this;
        //处理只读
        if (this.options['enable'] && (this.options['enable'] == 'false' || this.options['enable'] == false)) {
            this.setEnable(false);
        } else {
            this.dataModel.refEnable(this.field).subscribe(function (value) {
                self.setEnable(value);
            });
            this.setEnable(this.dataModel.isEnable(this.field));
        }
    },
    methods: {
        setEnable: function setEnable(enable) {
            if (enable === true || enable === 'true') {
                this.enable = true;
                this.element.removeAttribute('readonly');
                (0, _dom.removeClass)(this.element.parentNode, 'disablecover');
            } else if (enable === false || enable === 'false') {
                this.enable = false;
                this.element.setAttribute('readonly', 'readonly');
                (0, _dom.addClass)(this.element.parentNode, 'disablecover');
            }
        }
    }
}; /**
    * Module : Kero Enable Mixin
    * Author : Kvkens(yueming@yonyou.com)
    * Date	  : 2016-08-08 16:32:54
    */
exports.EnableMixin = EnableMixin;