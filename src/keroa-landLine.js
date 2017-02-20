/**
 * Module : Kero LandLine
 * Author : Alex(zhoubyc@yonyou.com)
 * Date	  : 2016-08-09 20:02:50
 */
import {StringAdapter} from './keroa-string';
import {PhoneNumberMasker} from 'tinper-sparrow/src/util/masker';
import {core} from 'tinper-sparrow/src/core';
import {compMgr} from 'compox/src/compMgr';
import {on} from 'tinper-sparrow/src/event';
/**
 * 电话号码控件
 */
var LandLineAdapter = StringAdapter.extend({
    init: function () {
        var self = this;
        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        LandLineAdapter.superclass.init.apply(this);
        this.validType = 'landline';
        this.masker = new PhoneNumberMasker(this.maskerMeta);

        on(this.element, 'keydown', function(e) {
            if (self.enable) {
                var code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                if (!((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 37 || code == 39 || code == 8 || code == 46 || code == 109 || code == 189)) {
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
	adapter: LandLineAdapter,
	name: 'landLine'
});
export {LandLineAdapter};
