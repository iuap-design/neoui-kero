/**
 * Module : Kero percent
 * Author : Alex(zhoubyc@yonyou.com)
 * Date	  : 2016-08-09 20:02:50
 */
import {IntegerAdapter} from './keroa-integer';
import {NumberFormater} from 'neoui-sparrow/js/util/formater';
import {PercentMasker} from 'neoui-sparrow/js/util/masker';
import {core} from 'neoui-sparrow/js/core';
import {compMgr} from 'neoui-sparrow/js/compMgr';
/**
 * 百分比控件
 */
var PhoneNumberAdapter = IntegerAdapter.extend({
    init: function () {
        PhoneNumberAdapter.superclass.init.apply(this);
        this.validType = 'phoneNumber';
        this.maskerMeta = core.getMaskerMeta('phoneNumber') || {};
        this.maskerMeta.precision = this.getOption('phoneNumber') || this.maskerMeta.phoneNumber;
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
