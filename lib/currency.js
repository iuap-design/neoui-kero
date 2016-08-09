'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CurrencyAdapter = undefined;

var _baseAdapter = require('./baseAdapter');

var _valueMixin = require('./valueMixin');

var _util = require('neoui-sparrow/lib/util');

var _neouiCheckbox = require('neoui/lib/neoui-checkbox');

var _formater = require('neoui-sparrow/lib/util/formater');

var _float = require('./float');

var _compMgr = require('neoui-sparrow/lib/compMgr');

/**
 * 货币控件
 */

//miss DataTable
var CurrencyAdapter = _float.FloatAdapter.extend({
    init: function init() {
        var self = this;
        CurrencyAdapter.superclass.init.apply(this);

        this.maskerMeta = iweb.Core.getMaskerMeta('currency') || {};
        this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
        this.maskerMeta.curSymbol = this.getOption('curSymbol') || this.maskerMeta.curSymbol;
        this.validType = 'float';
        this.dataModel.on(this.field + '.curSymbol.' + DataTable.ON_CURRENT_META_CHANGE, function (event) {
            self.setCurSymbol(event.newValue);
        });
        this.formater = new _formater.NumberFormater(this.maskerMeta.precision);
        this.masker = new CurrencyMasker(this.maskerMeta);
    },
    /**
     * 修改精度
     * @param {Integer} precision
     */
    setPrecision: function setPrecision(precision) {
        if (this.maskerMeta.precision == precision) return;
        this.maskerMeta.precision = precision;
        this.formater = new _formater.NumberFormater(this.maskerMeta.precision);
        this.masker = new CurrencyMasker(this.maskerMeta);
        var currentRow = this.dataModel.getCurrentRow();
        if (currentRow) {
            var v = this.dataModel.getCurrentRow().getValue(this.field);
            this.showValue = this.masker.format(this.formater.format(v)).value;
        } else {
            this.showValue = this.masker.format(this.formater.format(this.trueValue)).value;
        }
        this.setShowValue(this.showValue);
    },
    /**
     * 修改币符
     * @param {String} curSymbol
     */
    setCurSymbol: function setCurSymbol(curSymbol) {
        if (this.maskerMeta.curSymbol == curSymbol) return;
        this.maskerMeta.curSymbol = curSymbol;
        this.masker.formatMeta.curSymbol = this.maskerMeta.curSymbol;
        this.element.trueValue = this.trueValue;
        this.showValue = this.masker.format(this.trueValue).value;
        this.setShowValue(this.showValue);
    },
    onFocusin: function onFocusin(e) {
        var v = this.getValue(),
            vstr = v + '',
            focusValue = v;
        if ((0, _util.isNumber)(v) && (0, _util.isNumber)(this.maskerMeta.precision)) {
            if (vstr.indexOf('.') >= 0) {
                var sub = vstr.substr(vstr.indexOf('.') + 1);
                if (sub.length < this.maskerMeta.precision || parseInt(sub.substr(this.maskerMeta.precision)) == 0) {
                    focusValue = this.formater.format(v);
                }
            } else if (this.maskerMeta.precision > 0) {
                focusValue = this.formater.format(v);
            }
        }
        this.setShowValue(focusValue);
    }
}); /**
     * Module : Kero currency
     * Author : Kvkens(yueming@yonyou.com)
     * Date	  : 2016-08-09 13:42:14
     */

_compMgr.compMgr.addDataAdapter({
    adapter: CurrencyAdapter,
    name: 'currency'
});

exports.CurrencyAdapter = CurrencyAdapter;