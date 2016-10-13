/**
 * Module : Kero LandLine
 * Author : Alex(zhoubyc@yonyou.com)
 * Date	  : 2016-08-09 20:02:50
 */
import {BaseAdapter} from '../core/baseAdapter';
import {NumberFormater} from 'tinper-sparrow/js/util/formater';
import {PhoneNumberMasker} from 'tinper-sparrow/js/util/masker';
import {core} from 'tinper-sparrow/js/core';
import {compMgr} from 'tinper-sparrow/js/compMgr';
/**
 * 电话号码控件
 */
var LandLineAdapter = BaseAdapter.extend({
    init: function () {
        LandLineAdapter.superclass.init.apply(this);
        this.validType = 'landLine';
        // this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
        // this.formater = new NumberFormater(this.maskerMeta.precision);
        this.masker = new PhoneNumberMasker(this.maskerMeta);
    }
});
compMgr.addDataAdapter({
	adapter: LandLineAdapter,
	name: 'landLine'
});
export {LandLineAdapter};
