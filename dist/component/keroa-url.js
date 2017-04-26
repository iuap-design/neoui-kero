(function (exports) {
'use strict';

/**
 * Module : Sparrow extend enum
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

var enumerables = true;
var enumerablesTest = {
		toString: 1
	};
for(var i in enumerablesTest) {
	enumerables = null;
}
if(enumerables) {
	enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
		'toLocaleString', 'toString', 'constructor'
	];
}

/**
 * Module : Sparrow extend
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

/**
 * 复制对象属性
 *
 * @param {Object}  目标对象
 * @param {config} 源对象
 */
var extend = function(object, config) {
	var args = arguments,
		options;
	if(args.length > 1) {
		for(var len = 1; len < args.length; len++) {
			options = args[len];
			if(object && options && typeof options === 'object') {
				var i, j, k;
				for(i in options) {
					object[i] = options[i];
				}
				if(enumerables) {
					for(j = enumerables.length; j--;) {
						k = enumerables[j];
						if(options.hasOwnProperty && options.hasOwnProperty(k)) {
							object[k] = options[k];
						}
					}
				}
			}
		}
	}
	return object;
};

if(!Object.assign){
	Object.assign = extend;
}

/**
 * Module : Sparrow touch event
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-28 14:41:17
 */

var on = function(element, eventName, child, listener) {
	if(!element)
		return;
	if(arguments.length < 4) {
		listener = child;
		child = undefined;
	} else {
		var childlistener = function(e) {
			if(!e) {
				return;
			}
			var tmpchildren = element.querySelectorAll(child);
			tmpchildren.forEach(function(node) {
				if(node == e.target) {
					listener.call(e.target, e);
				}
			});
		};
	}
	//capture = capture || false;

	if(!element["uEvent"]) {
		//在dom上添加记录区
		element["uEvent"] = {};
	}
	//判断是否元素上是否用通过on方法填加进去的事件
	if(!element["uEvent"][eventName]) {
		element["uEvent"][eventName] = [child ? childlistener : listener];
		if(u.event && u.event[eventName] && u.event[eventName].setup) {
			u.event[eventName].setup.call(element);
		}
		element["uEvent"][eventName + 'fn'] = function(e) {
			//火狐下有问题修改判断
			if(!e)
				e = typeof event != 'undefined' && event ? event : window.event;
			element["uEvent"][eventName].forEach(function(fn) {
				try {
					e.target = e.target || e.srcElement; //兼容IE8
				} catch(ee) {}
				if(fn)
					fn.call(element, e);
			});
		};
		if(element.addEventListener) { // 用于支持DOM的浏览器
			element.addEventListener(eventName, element["uEvent"][eventName + 'fn']);
		} else if(element.attachEvent) { // 用于IE浏览器
			element.attachEvent("on" + eventName, element["uEvent"][eventName + 'fn']);
		} else { // 用于其它浏览器
			element["on" + eventName] = element["uEvent"][eventName + 'fn'];
		}
	} else {
		//如果有就直接往元素的记录区添加事件
		var lis = child ? childlistener : listener;
		var hasLis = false;
		element["uEvent"][eventName].forEach(function(fn) {
			if(fn == lis) {
				hasLis = true;
			}
		});
		if(!hasLis) {
			element["uEvent"][eventName].push(child ? childlistener : listener);
		}
	}

};

/**
 * Module : Kero string adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 20:12:42
 */

var StringAdapter = u.BaseAdapter.extend({
    init: function() {
        var self = this;
        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        if (!this.element) {
            throw new Error('not found INPUT element, u-meta:' + JSON.stringify(this.options));
        }
        this.validType = this.options['validType'] || 'string';
        this.minLength = this.getOption('minLength');
        this.maxLength = this.getOption('maxLength');
        var placeholder = this.options['placeholder'];
        if (placeholder)
            this.element.placeholder = placeholder;

        on(this.element, 'focus', function() {
            if (self.enable) {
                self.setShowValue(self.getValue());
                try {
                    var e = event.srcElement;
                    var r = e.createTextRange();
                    r.moveStart('character', e.value.length);
                    r.collapse(true);
                    r.select();
                } catch (e) {}
            }
        });

        on(this.element, 'blur', function(e) {
            if (self.enable) {
                if (!self.doValidate() && self._needClean()) {
                    if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                        // 因必输项清空导致检验没通过的情况
                        self.setValue('');
                    } else {
                        self.element.value = self.getShowValue();
                    }
                } else
                    self.setValue(self.element.value);
            }
        });
    },
    hide: function() {
        var self = this;
        if (self.enable) {
            if (!self.doValidate() && self._needClean()) {
                if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                    // 因必输项清空导致检验没通过的情况
                    self.setValue('');
                } else {
                    self.element.value = self.getShowValue();
                }
            } else
                self.setValue(self.element.value);
        }
    }
});
if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: StringAdapter,
        name: 'string'
    });

/**
 * Module : Sparrow dom
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-16 13:59:17
 */
/**
 * 元素增加指定样式
 * @param value
 * @returns {*}
 */
var addClass = function(element, value) {
	if(element){
		if(typeof element.classList === 'undefined') {
			if(u._addClass){
				u._addClass(element, value);
			}else{
				$(element).addClass(value);
			}

		} else {
			element.classList.add(value);
		}
	}

	return this;
};
/**
 * 删除元素上指定样式
 * @param {Object} element
 * @param {Object} value
 */
var removeClass = function(element, value) {
	if(element){
		if(typeof element.classList === 'undefined') {
			if(u._removeClass){
				u._removeClass(element, value);
			}else{
				$(element).removeClass(value);
			}

		} else {
			element.classList.remove(value);
		}
	}
	return this;
};
var makeDOM = function(htmlString) {
	var tempDiv = document.createElement("div");
	tempDiv.innerHTML = htmlString;
	var _dom = tempDiv.children[0];
	return _dom;
};

/**
 * Module : Kero url adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 13:51:26
 */
var UrlAdapter = StringAdapter.extend({
    init: function() {

        UrlAdapter.superclass.init.apply(this);
        this.validType = 'url';
        /*
         * 因为需要输入，因此不显示为超链接
         */
    },
    // 如果enable为false则显示<a>标签
    setEnable: function(enable) {
        if (enable === true || enable === 'true') {
            this.enable = true;
            this.element.removeAttribute('readonly');
            removeClass(this.element.parentNode, 'disablecover');
            if (this.aDom) {
                this.aDom.style.display = 'none';
            }
        } else if (enable === false || enable === 'false') {
            this.enable = false;
            this.element.setAttribute('readonly', 'readonly');
            addClass(this.element.parentNode, 'disablecover');
            if (!this.aDom) {
                this.aDom = makeDOM('<div style="position:absolute;background:#fff;z-index:999;"><a href="' + this.trueValue + '" target="_blank" style="position:absolue;">' + this.trueValue + '</a></div>');
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
if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: UrlAdapter,
        name: 'url'
    });

exports.UrlAdapter = UrlAdapter;

}((this.bar = this.bar || {})));
