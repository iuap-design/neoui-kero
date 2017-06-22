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
                if (!self.doValidate().passed && self._needClean()) {
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
            if (!self.doValidate().passed && self._needClean()) {
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
 * Module : Sparrow util tools
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

/**
 * 创建一个带壳的对象,防止外部修改
 * @param {Object} proto
 */
try{
	NodeList.prototype.forEach = Array.prototype.forEach;
}catch(e){
	
}


/**
 * 获得字符串的字节长度
 */
String.prototype.lengthb = function() {
	//	var str = this.replace(/[^\x800-\x10000]/g, "***");
	var str = this.replace(/[^\x00-\xff]/g, "**");
	return str.length;
};

/**
 * 将AFindText全部替换为ARepText
 */
String.prototype.replaceAll = function(AFindText, ARepText) {
	//自定义String对象的方法
	var raRegExp = new RegExp(AFindText, "g");
	return this.replace(raRegExp, ARepText);
};

/**
 * Module : Sparrow browser environment
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

var u$1 = {};


extend(u$1, {
	isIE:  false,
	isFF: false,
	isOpera: false,
	isChrome: false,
	isSafari: false,
	isWebkit: false,
	isIE8_BEFORE: false,
	isIE8: false,
	isIE8_CORE: false,
	isIE9: false,
	isIE9_CORE: false,
	isIE10: false,
	isIE10_ABOVE: false,
	isIE11: false,
	isEdge: false,
	isIOS: false,
	isIphone: false,
	isIPAD: false,
	isStandard: false,
	version: 0,
	isWin: false,
	isUnix: false,
	isLinux: false,
	isAndroid: false,
	isAndroidPAD:false,
	isAndroidPhone:false,
	isMac: false,
	hasTouch: false,
	isMobile: false
});

(function() {
	var userAgent = navigator.userAgent,
		rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
		rFirefox = /(firefox)\/([\w.]+)/,
		rOpera = /(opera).+version\/([\w.]+)/,
		rChrome = /(chrome)\/([\w.]+)/,
		rSafari = /version\/([\w.]+).*(safari)/,
		version,
		ua = userAgent.toLowerCase(),
		s,
		browserMatch = {
			browser: "",
			version: ''
		},
		match = rMsie.exec(ua);

	if(match != null) {
		browserMatch = {
			browser: "IE",
			version: match[2] || "0"
		};
	}
	match = rFirefox.exec(ua);
	if(match != null) {
		browserMatch = {
			browser: match[1] || "",
			version: match[2] || "0"
		};
	}
	match = rOpera.exec(ua);
	if(match != null) {
		browserMatch = {
			browser: match[1] || "",
			version: match[2] || "0"
		};
	}
	match = rChrome.exec(ua);
	if(match != null) {
		browserMatch = {
			browser: match[1] || "",
			version: match[2] || "0"
		};
	}
	match = rSafari.exec(ua);
	if(match != null) {
		browserMatch = {
			browser: match[2] || "",
			version: match[1] || "0"
		};
	}

	if(userAgent.indexOf("Edge") > -1){
		u$1.isEdge = true;
	}
	if(s = ua.match(/opera.([\d.]+)/)) {
		u$1.isOpera = true;
	} else if(browserMatch.browser == "IE" && browserMatch.version == 11) {
		u$1.isIE11 = true;
		u$1.isIE = true;
	} else if(s = ua.match(/chrome\/([\d.]+)/)) {
		u$1.isChrome = true;
		u$1.isStandard = true;
	} else if(s = ua.match(/version\/([\d.]+).*safari/)) {
		u$1.isSafari = true;
		u$1.isStandard = true;
	} else if(s = ua.match(/gecko/)) {
		//add by licza : support XULRunner
		u$1.isFF = true;
		u$1.isStandard = true;
	} else if(s = ua.match(/msie ([\d.]+)/)) {
		u$1.isIE = true;
	} else if(s = ua.match(/firefox\/([\d.]+)/)) {
		u$1.isFF = true;
		u$1.isStandard = true;
	}
	if(ua.match(/webkit\/([\d.]+)/)) {
		u$1.isWebkit = true;
	}
	if(ua.match(/ipad/i)) {
		u$1.isIOS = true;
		u$1.isIPAD = true;
		u$1.isStandard = true;
	}

	if(ua.match(/iphone/i)) {
		u$1.isIOS = true;
		u$1.isIphone = true;
	}

	if((navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel")) {
		//u.isIOS = true;
		u$1.isMac = true;
	}

	if((navigator.platform == "Win32") || (navigator.platform == "Windows") || (navigator.platform == "Win64")) {
		u$1.isWin = true;
	}

	if((navigator.platform == "X11") && !u$1.isWin && !u$1.isMac) {
		u$1.isUnix = true;
	}
	if((String(navigator.platform).indexOf("Linux") > -1)) {
		u$1.isLinux = true;
	}

	if(ua.indexOf('Android') > -1 || ua.indexOf('android') > -1 || ua.indexOf('Adr') > -1 || ua.indexOf('adr') > -1) {
		u$1.isAndroid = true;
	}

	u$1.version = version ? (browserMatch.version ? browserMatch.version : 0) : 0;
	if(u$1.isAndroid){
		if(window.screen.width>=768&&window.screen.width<1024){
			u$1.isAndroidPAD=true;
		}
		if(window.screen.width<=768) {
			u$1.isAndroidPhone = true;
		}
	}
	if(u$1.isIE) {
		var intVersion = parseInt(u$1.version);
		var mode = document.documentMode;
		if(mode == null) {
			if(intVersion == 6 || intVersion == 7) {
				u$1.isIE8_BEFORE = true;
			}
		} else {
			if(mode == 7) {
				u$1.isIE8_BEFORE = true;
			} else if(mode == 8) {
				u$1.isIE8 = true;
			} else if(mode == 9) {
				u$1.isIE9 = true;
				u$1.isSTANDARD = true;
			} else if(mode == 10) {
				u$1.isIE10 = true;
				u$1.isSTANDARD = true;
				u$1.isIE10_ABOVE = true;
			} else {
				u$1.isSTANDARD = true;
			}
			if(intVersion == 8) {
				u$1.isIE8_CORE = true;
			} else if(intVersion == 9) {
				u$1.isIE9_CORE = true;
			} else if(browserMatch.version == 11) {
				u$1.isIE11 = true;
			}
		}
	}
	if("ontouchend" in document) {
		u$1.hasTouch = true;
	}
	if(u$1.isIphone || u$1.isAndroidPhone)
		u$1.isMobile = true;

})();

var env = u$1;

/**
 * Module : Kero password
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 19:19:33
 */

/**
 * 密码控件
 */
var PassWordAdapter = StringAdapter.extend({
    init: function() {
        var oThis = this;
        StringAdapter.prototype.init.call(this);
        if (env.isIE8) {
            var outStr = this.element.outerHTML;
            var l = outStr.length;
            outStr = outStr.substring(0, l - 1) + ' type="password"' + outStr.substring(l - 1);
            var newEle = document.createElement(outStr);
            var parent = this.element.parentNode;
            parent.insertBefore(newEle, this.element.nextSibling);
            parent.removeChild(this.element);
            this.element = newEle;
        } else {
            this.element.type = "password";
        }
        oThis.element.title = '';
        this._element = this.element.parentNode;
        this.span = this._element.querySelector("span");
        if (env.isIE8) {
            this.span.style.display = 'none';
        }
        if (this.span) {
            on(this.span, 'click', function() {
                if (oThis.element.type == 'password') {
                    oThis.element.type = 'text';
                } else {
                    oThis.element.type = 'password';
                }
            });
        }

    },
    setShowValue: function(showValue) {
        this.showValue = showValue;
        this.element.value = showValue;
        this.element.title = '';
    },
});
if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: PassWordAdapter,
        name: 'password'
    });

exports.PassWordAdapter = PassWordAdapter;

}((this.bar = this.bar || {})));
