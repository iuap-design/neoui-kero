/**
 * Module : Kero percent
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 20:02:50
 */
import {FloatAdapter} from './keroa-float';
import {NumberFormater} from 'tinper-sparrow/js/util/formater';
import {PercentMasker} from 'tinper-sparrow/js/util/masker';
import {core} from 'tinper-sparrow/js/core';
import {compMgr} from 'compox/js/compMgr';
/**
 * 百分比控件
 */
var PercentAdapter = FloatAdapter.extend({
    init: function () {
        PercentAdapter.superclass.init.apply(this);
        this.validType = 'float';
        this.maskerMeta = core.getMaskerMeta('percent') || {};
        this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
        if (this.maskerMeta.precision){
            this.maskerMeta.precision = parseInt(this.maskerMeta.precision) + 2;
        }
        this.formater = new NumberFormater(this.maskerMeta.precision);
        this.masker = new PercentMasker(this.maskerMeta);
    }
});
compMgr.addDataAdapter({
	adapter: PercentAdapter,
	name: 'percent'
});
export {PercentAdapter};
