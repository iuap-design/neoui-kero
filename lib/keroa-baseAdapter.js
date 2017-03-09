(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'tinper-sparrow/src/class', 'tinper-sparrow/src/util', 'neoui-kero-mixin/src/valueMixin', 'neoui-kero-mixin/src/enableMixin', 'neoui-kero-mixin/src/requiredMixin', 'neoui-kero-mixin/src/validateMixin'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('tinper-sparrow/src/class'), require('tinper-sparrow/src/util'), require('neoui-kero-mixin/src/valueMixin'), require('neoui-kero-mixin/src/enableMixin'), require('neoui-kero-mixin/src/requiredMixin'), require('neoui-kero-mixin/src/validateMixin'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global._class, global.util, global.valueMixin, global.enableMixin, global.requiredMixin, global.validateMixin);
        global.keroaBaseAdapter = mod.exports;
    }
})(this, function (exports, _class, _util, _valueMixin, _enableMixin, _requiredMixin, _validateMixin) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.BaseAdapter = undefined;


    /**
     * adapter基类
     */

    /**
     * Module : Kero adapter 基类
     * Author : Kvkens(yueming@yonyou.com)
     * Date	  : 2016-08-09 10:00:00
     */
    var BaseAdapter = _class.Class.create({
        mixins: [_valueMixin.ValueMixin, _enableMixin.EnableMixin, _requiredMixin.RequiredMixin, _validateMixin.ValidateMixin],
        /**
         *
         * @param comp
         * @param options ：
         *      el: '#content',  对应的dom元素
         *      options: {},     配置
         *      model:{}        模型，包括数据和事件
         */
        initialize: function initialize(options) {
            this.initBefore();
            //组合mixin中的方法
            for (var i in this.mixins) {
                var mixin = this.mixins[i];
                for (var key in mixin['methods']) {
                    if (!this[key]) {
                        this[key] = mixin['methods'][key];
                    }
                }
            }

            //this.comp = comp;
            this.element = options['el'];
            this.options = options['options'];
            this.viewModel = options['model'];
            this.app = options['app'];
            this.dataModel = null;
            this.mixins = this.mixins || [];
            this.parseDataModel();
            this.init();
            //执行mixin中的初始化方法
            for (var i in this.mixins) {
                var mixin = this.mixins[i];
                if (mixin['init']) mixin.init.call(this);
            }
        },
        initBefore: function initBefore() {},
        parseDataModel: function parseDataModel() {
            if (!this.options || !this.options["data"]) return;
            this.field = this.options["field"];
            var dtId = this.options["data"];
            this.dataModel = (0, _util.getJSObject)(this.viewModel, this.options["data"]);
            if (this.dataModel) {
                var opt = {};
                if (this.options.type === 'u-date') {
                    opt.type = 'date';
                }
                if (this.field) this.dataModel.createField(this.field, opt);
            }
        },
        getOption: function getOption(key) {
            var rs = this.dataModel.getRowMeta(this.field, key);
            if (rs === 0) {
                return 0;
            } else {
                return rs || this.options[key];
            }
        },
        init: function init() {}
    });

    exports.BaseAdapter = BaseAdapter;
});