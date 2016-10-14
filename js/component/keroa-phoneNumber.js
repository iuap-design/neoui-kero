/**
 * Module : Kero phonenumber
 * Author : Alex(zhoubyc@yonyou.com)
 * Date	  : 2016-08-09 20:02:50
 */
import {StringAdapter} from './keroa-string';
import {PhoneNumberMasker} from 'tinper-sparrow/js/util/masker';
import {core} from 'tinper-sparrow/js/core';
import {compMgr} from 'tinper-sparrow/js/compMgr';
import {on} from 'tinper-sparrow/js/event';
/**
 * 手机号控件
 */
var PhoneNumberAdapter = StringAdapter.extend({
    init: function () {
        var self = this;
        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        PhoneNumberAdapter.superclass.init.apply(this);
        this.validType = 'phone';
        this.masker = new PhoneNumberMasker(this.maskerMeta);

        on(this.element, 'keydown', function(e) {
            if (self.enable) {
                var code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                if (!((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 37 || code == 39 || code == 8 || code == 46)) {
                    //阻止默认浏览器动作(W3C)
                    if (e && e.preventDefault)
                        e.preventDefault();
                    //IE中阻止函数器默认动作的方式
                    else
                        window.event.returnValue = false;
                    return false;
                }
            }
        });
    }
});
compMgr.addDataAdapter({
	adapter: PhoneNumberAdapter,
	name: 'phoneNumber'
});
export {PhoneNumberAdapter};
