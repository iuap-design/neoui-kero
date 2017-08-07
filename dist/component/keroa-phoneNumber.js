(function (exports) {
'use strict';

/**
 * Module : Sparrow extend enum
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

var U_LANGUAGES = "i_languages";
var U_THEME = "u_theme";
var U_LOCALE = "u_locale";
var U_USERCODE = "usercode";
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
                if (!self.doValidate().passed) {
                    if (self._needClean()) {
                        if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                            // 因必输项清空导致检验没通过的情况
                            self.setValue('');
                        } else {
                            self.element.value = self.getShowValue();
                        }
                    }
                } else
                    self.setValue(self.element.value);
            }
        });
    },
    hide: function() {
        var self = this;
        if (self.enable) {
            if (!self.doValidate().passed) {
                if (self._needClean()) {
                    if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                        // 因必输项清空导致检验没通过的情况
                        self.setValue('');
                    } else {
                        self.element.value = self.getShowValue();
                    }
                }
            } else
                self.setValue(self.element.value);
        }
    },
    setEnable: function(enable) {
        var self = this;
        if (this.trueAdpt)
            self = this.trueAdpt;
        if (enable === true || enable === 'true') {
            self.enable = true;
            self.element.removeAttribute('readonly');
            removeClass(self.element.parentNode, 'disablecover');
        } else if (enable === false || enable === 'false') {
            self.enable = false;
            self.element.setAttribute('readonly', 'readonly');
            addClass(self.element.parentNode, 'disablecover');
        }
    }
});
if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: StringAdapter,
        name: 'string'
    });

/**
 * Module : Sparrow abstract formater class
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-28 19:35:26
 */

function AbstractMasker() {}

AbstractMasker.prototype.format = function(obj) {
	if (obj == null)
		return null;

	var fObj = this.formatArgument(obj);
	return this.innerFormat(fObj);
};

/**
 * 统一被格式化对象结构
 *
 * @param obj
 * @return
 */
AbstractMasker.prototype.formatArgument = function(obj) {

};

/**
 * 格式化
 *
 * @param obj
 * @return
 */
AbstractMasker.prototype.innerFormat = function(obj) {

};




/**
 * <b> 数字格式化  </b>
 *
 * <p> 格式化数字
 *
 * </p>
 *
 * Create at 2009-3-20 上午08:50:32
 *
 * @author bq
 * @since V6.0
 */
NumberMasker.prototype = new AbstractMasker;
NumberMasker.prototype.formatMeta = null;

/**
 *构造方法
 */
function NumberMasker(formatMeta) {
	this.update(formatMeta);
}

NumberMasker.prototype.update = function(formatMeta) {
	this.formatMeta = extend({}, NumberMasker.DefaultFormatMeta, formatMeta);
};

/**
 *格式化对象
 */
NumberMasker.prototype.innerFormat = function(obj) {
	var dValue, express, seperatorIndex, strValue;
	dValue = obj.value;
	if (dValue > 0) {
		express = this.formatMeta.positiveFormat;
		strValue = dValue + '';
	} else if (dValue < 0) {
		express = this.formatMeta.negativeFormat;
		strValue = (dValue + '').substr(1, (dValue + '').length - 1);
	} else {
		express = this.formatMeta.positiveFormat;
		strValue = dValue + '';
	}
	seperatorIndex = strValue.indexOf('.');
	strValue = this.setTheSeperator(strValue, seperatorIndex);
	strValue = this.setTheMark(strValue, seperatorIndex);
	var color = null;
	if (dValue < 0 && this.formatMeta.isNegRed) {
		color = "FF0000";
	}
	return new FormatResult(express.replaceAll('n', strValue), color);

};
/**
 *设置标记
 */
NumberMasker.prototype.setTheMark = function(str, seperatorIndex) {
	var endIndex, first, index;
	if (!this.formatMeta.isMarkEnable)
		return str;
	if (seperatorIndex <= 0)
		seperatorIndex = str.length;
	first = str.charCodeAt(0);
	endIndex = 0;
	if (first == 45)
		endIndex = 1;
	index = seperatorIndex - 3;
	while (index > endIndex) {
		str = str.substr(0, index - 0) + this.formatMeta.markSymbol + str.substr(index, str.length - index);
		index = index - 3;
	}
	return str;
};
NumberMasker.prototype.setTheSeperator = function(str, seperatorIndex) {
	var ca;
	if (seperatorIndex > 0) {
		ca = NumberMasker.toCharArray(str);
		//ca[seperatorIndex] = NumberMasker.toCharArray(this.formatMeta.pointSymbol)[0];
		ca[seperatorIndex] = this.formatMeta.pointSymbol;
		str = ca.join('');
	}
	return str;
};
/**
 * 将字符串转换成char数组
 * @param {} str
 * @return {}
 */
NumberMasker.toCharArray = function(str) {
	var str = str.split("");
	var charArray = new Array();
	for (var i = 0; i < str.length; i++) {
		charArray.push(str[i]);
	}
	return charArray;
};


/**
 *默认构造方法
 */
NumberMasker.prototype.formatArgument = function(obj) {
	var numberObj = {};
	numberObj.value = obj;
	return numberObj;
};

/**
 * 货币格式
 */
CurrencyMasker.prototype = new NumberMasker;
CurrencyMasker.prototype.formatMeta = null;

function CurrencyMasker(formatMeta) {
	this.update(formatMeta);
}

CurrencyMasker.prototype.update = function(formatMeta) {
	this.formatMeta = extend({}, CurrencyMasker.DefaultFormatMeta, formatMeta);
};

/**
 * 重载格式方法
 * @param {} obj
 * @return {}
 */
CurrencyMasker.prototype.innerFormat = function(obj) {
	if(!obj.value) {
		return {value: ""};
	}
	var fo = (new NumberMasker(this.formatMeta)).innerFormat(obj);
	fo.value = this.formatMeta.curSymbol  +  fo.value; //fo.value.replace("$", this.formatMeta.curSymbol);
	return fo;
};


PercentMasker.prototype = new NumberMasker;

function PercentMasker(formatMeta) {
	this.update(formatMeta);
}

PercentMasker.prototype.update = function(formatMeta) {
	this.formatMeta = extend({}, NumberMasker.DefaultFormatMeta, formatMeta);
};


PercentMasker.prototype.formatArgument = function(obj) {
	return obj;
};

PercentMasker.prototype.innerFormat = function(value) {
	var val = "";
	if (value != "") {
		var obj = (new NumberMasker(this.formatMeta)).innerFormat({value:value}).value;
		// 获取obj保留几位小数位,obj小数位-2为显示小数位
		var objStr = String(obj);
		var objPrecision = objStr.length - objStr.indexOf(".") - 1;
		var showPrecision = objPrecision - 2;
		if (showPrecision < 0) {
			showPrecision = 0;
		}
		val = parseFloat(obj) * 100;
		val = (val * Math.pow(10, showPrecision) / Math.pow(10, showPrecision)).toFixed(showPrecision);
		val = val + "%";
	}
	return {
		value: val
	};
};





/**
 *格式结果
 */
FormatResult.prototype = new Object;
/**
 *默认构造方法
 */
function FormatResult(value, color) {
	this.value = value;
	this.color = color;
}

/**
 * 电话
 * @param {[type]} formatMeta [description]
 */
function PhoneNumberMasker (formatMeta) {
	this.update(formatMeta);
}

PhoneNumberMasker.prototype = new NumberMasker();
PhoneNumberMasker.prototype.formatMeta = null;

PhoneNumberMasker.prototype.update = function (formatMeta) {
	this.formatMeta = extend({}, PhoneNumberMasker.DefaultFormatMeta, formatMeta);
};

PhoneNumberMasker.prototype.formatArgument = function (obj) {
	var numberObj = {};
	numberObj.value = obj;
	return numberObj;
};

PhoneNumberMasker.prototype.innerFormat = function (obj) {
	if(!obj){
		return;
	}
	return obj;
};


NumberMasker.DefaultFormatMeta = {
	isNegRed: true,
	isMarkEnable: true,
	markSymbol: ",",
	pointSymbol: ".",
	positiveFormat: "n",
	negativeFormat: "-n"
};

CurrencyMasker.DefaultFormatMeta = extend({}, NumberMasker.DefaultFormatMeta, {
	//curSymbol: "",
	positiveFormat: "n",
	negativeFormat: "-n"
});



PhoneNumberMasker.defaultFormatMeta = {

};

/**
 * Module : Sparrow util tools
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

/**
 * 创建一个带壳的对象,防止外部修改
 * @param {Object} proto
 */
var createShellObject = function(proto) {
	var exf = function() {};
	exf.prototype = proto;
	return new exf();
};
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
 * Module : Sparrow cookies
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

var setCookie = function(sName, sValue, oExpires, sPath, sDomain, bSecure) {
	var sCookie = sName + "=" + encodeURIComponent(sValue);
	if(oExpires)
		sCookie += "; expires=" + oExpires.toGMTString();
	if(sPath)
		sCookie += "; path=" + sPath;
	if(sDomain)
		sCookie += "; domain=" + sDomain;
	if(bSecure)
		sCookie += "; secure=" + bSecure;
	document.cookie = sCookie;
};

var getCookie = function(sName) {
	var sRE = "(?:; )?" + sName + "=([^;]*);?";
	var oRE = new RegExp(sRE);

	if(oRE.test(document.cookie)) {
		return decodeURIComponent(RegExp["$1"]);
	} else
		return null;
};

/**
 * Module : Sparrow core context
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-28 13:52:19
 */
var environment = {};
/**
 * client attributes
 */
var clientAttributes = {};

var sessionAttributes = {};

var fn = {};
var maskerMeta = {
	'float': {
		precision: 2
	},
	'datetime': {
		format: 'YYYY-MM-DD HH:mm:ss',
		metaType: 'DateTimeFormatMeta',
		speratorSymbol: '-'
	},
	'time': {
		format: 'HH:mm'
	},
	'date': {
		format: 'YYYY-MM-DD'
	},
	'currency': {
		precision: 2,
		curSymbol: '￥'
	},
	'percent': {

	},
	'phoneNumber': {
		
	}
};
/**
 * 获取环境信息
 * @return {environment}
 */
fn.getEnvironment = function() {
	return createShellObject(environment);
};

/**
 * 获取客户端参数对象
 * @return {clientAttributes}
 */
fn.getClientAttributes = function() {
	var exf = function() {};
	return createShellObject(clientAttributes);
};

fn.setContextPath = function(contextPath) {
	return environment[IWEB_CONTEXT_PATH] = contextPath
};
fn.getContextPath = function(contextPath) {
		return environment[IWEB_CONTEXT_PATH]
	};
	/**
	 * 设置客户端参数对象
	 * @param {Object} k 对象名称
	 * @param {Object} v 对象值(建议使用简单类型)
	 */
fn.setClientAttribute = function(k, v) {
		clientAttributes[k] = v;
	};
	/**
	 * 获取会话级参数对象
	 * @return {clientAttributes}
	 */
fn.getSessionAttributes = function() {
	var exf = function() {};
	return createShellObject(sessionAttributes);
};

/**
 * 设置会话级参数对象
 * @param {Object} k 对象名称
 * @param {Object} v 对象值(建议使用简单类型)
 */
fn.setSessionAttribute = function(k, v) {
	sessionAttributes[k] = v;
	setCookie("ISES_" + k, v);
};

/**
 * 移除客户端参数
 * @param {Object} k 对象名称
 */
fn.removeClientAttribute = function(k) {
	clientAttributes[k] = null;
	execIgnoreError(function() {
		delete clientAttributes[k];
	});
};

/**
 * 获取地区信息编码
 */
fn.getLocale = function() {
	return this.getEnvironment().locale
};

/**
 * 获取多语信息
 */
fn.getLanguages = function() {
	return this.getEnvironment().languages
};
/**
 * 收集环境信息(包括客户端参数)
 * @return {Object}
 */
fn.collectEnvironment = function() {
	var _env = this.getEnvironment();
	var _ses = this.getSessionAttributes();

	for(var i in clientAttributes) {
		_ses[i] = clientAttributes[i];
	}
	_env.clientAttributes = _ses;
	return _env
};

/**
 * 设置数据格式信息
 * @param {String} type
 * @param {Object} meta
 */
fn.setMaskerMeta = function(type, meta) {
	if(typeof type == 'function') {
		getMetaFunc = type;
	} else {
		if(!maskerMeta[type])
			maskerMeta[type] = meta;
		else {
			if(typeof meta != 'object')
				maskerMeta[type] = meta;
			else
				for(var key in meta) {
					maskerMeta[type][key] = meta[key];
				}
		}
	}
};
fn.getMaskerMeta = function(type) {
	if(typeof getMetaFunc == 'function') {
		var meta = getMetaFunc.call(this);
		return meta[type];
	} else
		return extend({}, maskerMeta[type]);
};
environment.languages = getCookie(U_LANGUAGES) ? getCookie(U_LANGUAGES).split(',') : navigator.language ? navigator.language : 'zh-CN';
if(environment.languages == 'zh-cn')
	environment.languages = 'zh-CN';
if(environment.languages == 'en-us')
	environment.languages = 'en-US';

environment.theme = getCookie(U_THEME);
environment.locale = getCookie(U_LOCALE);
//environment.timezoneOffset = (new Date()).getTimezoneOffset()
environment.usercode = getCookie(U_USERCODE);
//init session attribute
document.cookie.replace(/ISES_(\w*)=([^;]*);?/ig, function(a, b, c) {
	sessionAttributes[b] = c;
});

var Core = function() {};
Core.prototype = fn;

/**
 * Module : Kero phonenumber
 * Author : Alex(zhoubyc@yonyou.com)
 * Date	  : 2016-08-09 20:02:50
 */
/**
 * 手机号控件
 */
var PhoneNumberAdapter = StringAdapter.extend({
    init: function() {
        var self = this;
        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        PhoneNumberAdapter.superclass.init.apply(this);
        this.validType = 'phone';
        this.masker = new PhoneNumberMasker(this.maskerMeta);

        on(this.element, 'keydown', function(e) {
            if (self.enable) {
                var code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                if (e.ctrlKey && (e.keyCode == 67 || e.keyCode == 86)) {
                    //复制粘贴
                    return true;
                }
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
if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: PhoneNumberAdapter,
        name: 'phoneNumber'
    });

exports.PhoneNumberAdapter = PhoneNumberAdapter;

}((this.bar = this.bar || {})));
