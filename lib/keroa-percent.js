/**
 * Module : Kero percent
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 20:02:50
 */
import { FloatAdapter } from './keroa-float';
import { NumberFormater } from 'tinper-sparrow/src/util/formater';
import { PercentMasker } from 'tinper-sparrow/src/util/masker';
import { core } from 'tinper-sparrow/src/core';
/**
 * 百分比控件
 */
var PercentAdapter = FloatAdapter.extend({
    init: function init() {
        FloatAdapter.prototype.init.call(this);
        this.validType = 'float';
        this.maskerMeta = core.getMaskerMeta('percent') || {};
        this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
        if (this.maskerMeta.precision) {
            this.maskerMeta.precision = parseInt(this.maskerMeta.precision) + 2;
        }
        this.formater = new NumberFormater(this.maskerMeta.precision);
        this.masker = new PercentMasker(this.maskerMeta);
    }
});
if (u.compMgr) u.compMgr.addDataAdapter({
    adapter: PercentAdapter,
    name: 'percent'
});
export { PercentAdapter };