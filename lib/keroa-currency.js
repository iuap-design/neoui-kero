'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CurrencyAdapter = undefined;

var _keroaBaseAdapter = require('./keroa-baseAdapter');

var _util = require('tinper-sparrow/src/util');

var _neouiCheckbox = require('tinper-neoui/src/neoui-checkbox');

var _indexDataTable = require('kero/src/indexDataTable');

var _formater = require('tinper-sparrow/src/util/formater');

var _keroaFloat = require('./keroa-float');

var _compMgr = require('compox/src/compMgr');

var _core = require('tinper-sparrow/src/core');

var _masker = require('tinper-sparrow/src/util/masker');

/**
 * 货币控件
 */
/**
 * Module : Kero currency
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 13:42:14
 */

var CurrencyAdapter = _keroaFloat.FloatAdapter.extend({
    init: function init() {
        var self = this;
        this.maskerMeta = _core.core.getMaskerMeta('currency') || {};
        this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
        this.maskerMeta.curSymbol = this.getOption('curSymbol') || this.maskerMeta.curSymbol;
        this.validType = 'float';
        this.dataModel.on(this.field + '.curSymbol.' + _indexDataTable.DataTable.ON_CURRENT_META_CHANGE, function (event) {
            self.setCurSymbol(event.newValue);
        });
        this.formater = new _formater.NumberFormater(this.maskerMeta.precision);
        this.masker = new _masker.CurrencyMasker(this.maskerMeta);
    },
    /**
     * 修改精度
     * @param {Integer} precision
     */
    setPrecision: function setPrecision(precision) {
        if (this.maskerMeta.precision == precision) return;
        this.maskerMeta.precision = precision;
        this.formater = new _formater.NumberFormater(this.maskerMeta.precision);
        this.masker = new _masker.CurrencyMasker(this.maskerMeta);
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
});

_compMgr.compMgr.addDataAdapter({
    adapter: CurrencyAdapter,
    name: 'currency'
});

exports.CurrencyAdapter = CurrencyAdapter;