'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Module : Kero Enable Mixin
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-08 16:32:54
 */

var RequiredMixin = {
    init: function init() {
        var self = this;
        this.required = this.getOption('required');
        this.dataModel.refRowMeta(this.field, "required").subscribe(function (value) {
            self.setRequired(value);
        });
        //this.setRequired(this.dataModel.getMeta(this.field, "required"));
    },
    methods: {
        setRequired: function setRequired(required) {
            if (required === true || required === 'true') {
                this.required = true;
            } else if (required === false || required === 'false') {
                this.required = false;
            }
        }
    }
};

exports.RequiredMixin = RequiredMixin;