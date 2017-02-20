'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TextFieldAdapter = undefined;

var _keroaBaseAdapter = require('./keroa-baseAdapter');

var _extend = require('tinper-sparrow/src/extend');

var _neouiTextfield = require('tinper-neoui/src/neoui-textfield');

var _keroaFloat = require('./keroa-float');

var _keroaString = require('./keroa-string');

var _keroaInteger = require('./keroa-integer');

var _compMgr = require('compox/src/compMgr');

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