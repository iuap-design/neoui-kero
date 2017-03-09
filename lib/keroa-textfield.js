(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './keroa-baseAdapter', 'tinper-sparrow/src/extend', 'tinper-neoui/src/neoui-textfield', './keroa-float', './keroa-string', './keroa-integer', 'compox/src/compMgr'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./keroa-baseAdapter'), require('tinper-sparrow/src/extend'), require('tinper-neoui/src/neoui-textfield'), require('./keroa-float'), require('./keroa-string'), require('./keroa-integer'), require('compox/src/compMgr'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.keroaBaseAdapter, global.extend, global.neouiTextfield, global.keroaFloat, global.keroaString, global.keroaInteger, global.compMgr);
        global.keroaTextfield = mod.exports;
    }
})(this, function (exports, _keroaBaseAdapter, _extend, _neouiTextfield, _keroaFloat, _keroaString, _keroaInteger, _compMgr) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TextFieldAdapter = undefined;


    var TextFieldAdapter = _keroaBaseAdapter.BaseAdapter.extend({
        init: function init() {
            var options = {};
            var dataType = this.dataModel.getMeta(this.field, 'type') || 'string';
            this.comp = new _neouiTextfield.Text(this.element);
            this.element['u.Text'] = this.comp;

            options["options"] = this.options;
            options["el"] = this.element;
            options["model"] = this.viewModel;
            options["app"] = this.app;

            if (dataType === 'float') {
                this.trueAdpt = new _keroaFloat.FloatAdapter(options);
            } else if (dataType === 'string') {
                this.trueAdpt = new _keroaString.StringAdapter(options);
            } else if (dataType === 'integer') {
                this.trueAdpt = new _keroaInteger.IntegerAdapter(options);
            } else {
                throw new Error("'u-text' only support 'float' or 'string' or 'integer' field type, not support type: '" + dataType + "', field: '" + this.field + "'");
            }
            (0, _extend.extend)(this, this.trueAdpt);

            this.trueAdpt.comp = this.comp;
            this.trueAdpt.setShowValue = function (showValue) {
                this.showValue = showValue;
                this.comp.change(showValue);
                this.element.title = showValue;
            };
            // 解决初始设置值后，没有走这个setShowValue方法问题
            if (this.trueAdpt.enable) {
                this.trueAdpt.setShowValue(this.trueAdpt.getValue());
            }
            return this.trueAdpt;
        }
    }); /**
         * Module : Kero textfield adapter
         * Author : Kvkens(yueming@yonyou.com)
         * Date	  : 2016-08-10 13:00:27
         */

    _compMgr.compMgr.addDataAdapter({
        adapter: TextFieldAdapter,
        name: 'u-text'
    });

    exports.TextFieldAdapter = TextFieldAdapter;
});