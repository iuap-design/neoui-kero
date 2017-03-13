/**
 * Module : Kero url adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 13:51:26
 */
import {StringAdapter} from './keroa-string';
import {addClass,removeClass,makeDOM} from 'tinper-sparrow/src/dom';
import {compMgr} from 'compox/src/compMgr';

var UrlAdapter = StringAdapter.extend({
    init: function () {
        this.validType = 'url';
        UrlAdapter.superclass.init.apply(this);
        /*
         * 因为需要输入，因此不显示为超链接
         */
    },
    // 如果enable为false则显示<a>标签
    setEnable: function(enable){
        if (enable === true || enable === 'true') {
            this.enable = true;
            this.element.removeAttribute('readonly');
            removeClass(this.element.parentNode,'disablecover');
            if(this.aDom){
                this.aDom.style.display = 'none';
            }
        } else if (enable === false || enable === 'false') {
            this.enable = false;
            this.element.setAttribute('readonly', 'readonly');
            addClass(this.element.parentNode,'disablecover');
            if(!this.aDom){
                this.aDom = makeDOM('<div style="position:absolute;background:#fff;z-index:999;"><a href="' + this.trueValue + '" target="_blank" style="position:absolue;">' + this.trueValue +'</a></div>');
                var left = this.element.offsetLeft;
                var width = this.element.offsetWidth;
                var top = this.element.offsetTop;
                var height = this.element.offsetHeight;
                this.aDom.style.left = left + 'px';
                this.aDom.style.width = width + 'px';
                this.aDom.style.top = top + 'px';
                this.aDom.style.height = height + 'px';
                this.element.parentNode.appendChild(this.aDom);
            }
            var $a = $(this.aDom).find('a');
            $a.href = this.trueValue;
            $a.innerHTML = this.trueValue;
            this.aDom.style.display = 'block';
        }
    }
});
compMgr.addDataAdapter({
	adapter: UrlAdapter,
	name: 'url'
});
export {UrlAdapter};
