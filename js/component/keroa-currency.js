/**
 * Module : Kero currency
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 13:42:14
 */

import {BaseAdapter} from '../core/baseAdapter';
import {getJSObject} from 'tinper-sparrow/js/util';
import {Checkbox} from 'tinper-neoui/js/neoui-checkbox';
import {DataTable} from 'kero/js/dataTable/indexDataTable';
import {NumberFormater} from 'tinper-sparrow/js/util/formater';
import {isNumber} from 'tinper-sparrow/js/util';
import {FloatAdapter} from './keroa-float';
import {compMgr} from 'compox/js/compMgr';
import {core} from 'tinper-sparrow/js/core';
import {CurrencyMasker} from 'tinper-sparrow/js/util/masker';

/**
 * 货币控件
 */
var CurrencyAdapter = FloatAdapter.extend({
    init: function () {
        var self = this;
        this.maskerMeta = core.getMaskerMeta('currency') || {};
        this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
        this.maskerMeta.curSymbol = this.getOption('curSymbol') || this.maskerMeta.curSymbol;
        this.validType = 'float';
        this.dataModel.on(this.field + '.curSymbol.' + DataTable.ON_CURRENT_META_CHANGE, function (event) {
            self.setCurSymbol(event.newValue)
        });
        this.formater = new NumberFormater(this.maskerMeta.precision);
        this.masker = new CurrencyMasker(this.maskerMeta);
    },
    /**
     * 修改精度
     * @param {Integer} precision
     */
    setPrecision: function (precision) {
        if (this.maskerMeta.precision == precision) return
        this.maskerMeta.precision = precision
        this.formater = new NumberFormater(this.maskerMeta.precision);
        this.masker = new CurrencyMasker(this.maskerMeta);
        var currentRow = this.dataModel.getCurrentRow();
        if (currentRow) {
            var v = this.dataModel.getCurrentRow().getValue(this.field)
            this.showValue = this.masker.format(this.formater.format(v)).value
        } else {
            this.showValue = this.masker.format(this.formater.format(this.trueValue)).value
        }
        this.setShowValue(this.showValue)
    },
    /**
     * 修改币符
     * @param {String} curSymbol
     */
    setCurSymbol: function (curSymbol) {
        if (this.maskerMeta.curSymbol == curSymbol) return
        this.maskerMeta.curSymbol = curSymbol
        this.masker.formatMeta.curSymbol = this.maskerMeta.curSymbol
        this.element.trueValue = this.trueValue
        this.showValue = this.masker.format(this.trueValue).value
        this.setShowValue(this.showValue)

    },
    onFocusin: function (e) {
        var v = this.getValue(), vstr = v + '', focusValue = v
        if (isNumber(v) && isNumber(this.maskerMeta.precision)) {
            if (vstr.indexOf('.') >= 0) {
                var sub = vstr.substr(vstr.indexOf('.') + 1)
                if (sub.length < this.maskerMeta.precision || parseInt(sub.substr(this.maskerMeta.precision)) == 0) {
                    focusValue = this.formater.format(v)
                }
            } else if (this.maskerMeta.precision > 0) {
                focusValue = this.formater.format(v)
            }
        }
        this.setShowValue(focusValue)

    }
})

compMgr.addDataAdapter({
    adapter: CurrencyAdapter,
    name: 'currency'
});

export {CurrencyAdapter};
