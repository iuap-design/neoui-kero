/**
 * Module : Kero phonenumber
 * Author : Alex(zhoubyc@yonyou.com)
 * Date	  : 2016-08-09 20:02:50
 */
import {BaseAdapter} from '../core/baseAdapter';
import {NumberFormater} from 'tinper-sparrow/js/util/formater';
import {PhoneNumberMasker} from 'tinper-sparrow/js/util/masker';
import {core} from 'tinper-sparrow/js/core';
import {compMgr} from 'tinper-sparrow/js/compMgr';
/**
 * 手机号控件
 */
var PhoneNumberAdapter = BaseAdapter.extend({
    init: function () {
        PhoneNumberAdapter.superclass.init.apply(this);
        this.validType = 'phoneNumber';
        // this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
        // this.formater = new NumberFormater(this.maskerMeta.precision);
        this.masker = new PhoneNumberMasker(this.maskerMeta);
    }
});
compMgr.addDataAdapter({
	adapter: PhoneNumberAdapter,
	name: 'phoneNumber'
});
export {PhoneNumberAdapter};
