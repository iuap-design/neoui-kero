(function (exports) {
'use strict';

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
var isNumber$1 = function(obj) {
	//return obj === +obj
	//加了个typeof 判断，因为'431027199110.078573'会解析成number
	return obj - parseFloat(obj) + 1 >= 0;
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


var dateFormat = function ( str ) {
	//如果不是string类型  原型返回
	if ( typeof ( str ) !== 'string')
	{
		return str;
	}
	//判断 str 格式如果是 yy-mm-dd
	if (str && str.indexOf ('-') > -1){
		//获取当前是否是 ios版本,>8是因为ios不识别new Date（“2016/11”）格式
		var ua = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(ua)) {
			//转换成 yy/mm/dd
		    str = str.replace(/-/g,"/");
			str = str.replace(/(^\s+)|(\s+$)/g,"");
			if(str.length <= 8){
				str = str += "/01";
			}
		}
	}


	return str;
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

var core = new Core();

/**
 * Module : Sparrow data formater tools
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-28 15:39:01
 */
function NumberFormater(precision) {
    this.precision = precision;
}

NumberFormater.prototype.update = function (precision) {
    this.precision = precision;
};

NumberFormater.prototype.format = function (value) {
    if (!isNumber$1(value)) return "";

    // 以0开头的数字将其前面的0去掉
    while ((value + "").charAt(0) == "0" && value.length > 1 && (value + "").indexOf('0.') != 0) {
        value = value.substring(1);
    }
    var result = value;
    if (isNumber$1(this.precision)) {
        if (window.BigNumber) {
            // 已经引入BigNumber
            result = (new BigNumber(value)).toFixed(this.precision);
        } else {
            var digit = parseFloat(value);
            // 解决toFixed四舍五入问题，如1.345
            result = (Math.round(digit * Math.pow(10, this.precision)) / Math.pow(10, this.precision)).toFixed(this.precision);
        }
        if (result == "NaN")
            return "";
    }


    return result;
};

/**
 * Module : Sparrow i18n
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-29 10:16:54
 */
//import {uuii18n} from '?';//缺失故修改为default值
// 从datatable/src/compatiable/u/JsExtension.js抽取
window.getCurrentJsPath = function() {
	var doc = document,
	a = {},
	expose = +new Date(),
	rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/,
	isLtIE8 = ('' + doc.querySelector).indexOf('[native code]') === -1;
	// FF,Chrome
	if (doc.currentScript){
		return doc.currentScript.src;
	}

	var stack;
	try{
		a.b();
	}
	catch(e){
		stack = e.stack || e.fileName || e.sourceURL || e.stacktrace;
	}
	// IE10
	if (stack){
		var absPath = rExtractUri.exec(stack)[1];
		if (absPath){
			return absPath;
		}
	}

	// IE5-9
	for(var scripts = doc.scripts,
		i = scripts.length - 1,
		script; script = scripts[i--];){
		if (script.className !== expose && script.readyState === 'interactive'){
			script.className = expose;
			// if less than ie 8, must get abs path by getAttribute(src, 4)
			return isLtIE8 ? script.getAttribute('src', 4) : script.src;
		}
	}
};

if (window.i18n) {
	window.u = window.u || {};
    var scriptPath = getCurrentJsPath(),
        _temp = scriptPath.substr(0, scriptPath.lastIndexOf('/')),
        __FOLDER__ = _temp.substr(0, _temp.lastIndexOf('/')),
        resGetPath = u.i18nPath || __FOLDER__ + '/locales/__lng__/__ns__.json';
    i18n.init({
        postAsync: false,
        getAsync: false,
        fallbackLng: false,
        ns: {namespaces: ['uui-trans']},
		lng:getCookie(U_LOCALE) || 'zh',
        resGetPath: resGetPath
    });
}

var trans = function (key, dftValue) {
    return  window.i18n ?  i18n.t('uui-trans:' + key) : dftValue
};

/**
 * Module : Sparrow date util
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-06 13:37:20
 */

var u$1 = {};
u$1.date = {

    /**
     * 多语言处理
     */
    //TODO 后续放到多语文件中
    _dateLocale: {
        'zh-CN': {
            months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
            monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
            weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
            weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
            weekdaysMin: '日_一_二_三_四_五_六'.split('_')
        },
        'en-US': {
            months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
            monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thurday_Friday_Saturday'.split('_'),
            weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            weekdaysMin: 'S_M_T_W_T_F_S'.split('_')
        }
    },
    _jsonLocale: {
        months: trans('date.months', "一月\n二月\n三月\n四月\n五月\n六月\n七月\n八月\n九月\n十月\n十一月\n十二月").split('\n'),
        monthsShort: trans('date.monthsShort', "1月\n2月\n3月\n4月\n5月\n6月\n7月\n8月\n9月\n10月\n11月\n12月").split('\n'),
        weekdays: trans('date.weekdays', "星期日\n星期一\n星期二\n星期三\n星期四\n星期五\n星期六").split('\n'),
        weekdaysShort: trans('date.weekdaysShort', "周日\n周一\n周二\n周三\n周四\n周五\n周六").split('\n'),
        weekdaysMin: trans('date.weekdaysMin', "日\n一\n二\n三\n四\n五\n六").split('\n'),
        defaultMonth: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
    },

    _formattingTokens: /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYY|YY|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,

    leftZeroFill: function(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    },

    _formats: {
        //year
        YY: function(date) {
            return u$1.date.leftZeroFill(date.getFullYear() % 100, 2);
        },
        YYYY: function(date) {
            return date.getFullYear();
        },
        //month
        M: function(date) {
            return date.getMonth() + 1;
        },
        MM: function(date) {
            var m = u$1.date._formats.M(date);
            return u$1.date.leftZeroFill(m, 2);
        },
        MMM: function(date, language) {
            var m = date.getMonth();
            // return u.date._dateLocale[language].monthsShort[m];
            return u$1.date._jsonLocale.monthsShort[m];
        },
        MMMM: function(date, language) {
            var m = date.getMonth();
            // return u.date._dateLocale[language].months[m];
            return u$1.date._jsonLocale.months[m];
        },
        //date
        D: function(date) {
            return date.getDate();
        },
        DD: function(date) {
            var d = u$1.date._formats.D(date);
            return u$1.date.leftZeroFill(d, 2);
        },
        // weekday
        d: function(date) {
            return date.getDay();
        },
        dd: function(date, language) {
            var d = u$1.date._formats.d(date);
            // return u.date._dateLocale[language].weekdaysMin[d];
            return u$1.date._jsonLocale.weekdaysMin[d];
        },
        ddd: function(date, language) {
            var d = u$1.date._formats.d(date);
            // return u.date._dateLocale[language].weekdaysShort[d];
            return u$1.date._jsonLocale.weekdaysShort[d];
        },
        dddd: function(date, language) {
            var d = u$1.date._formats.d(date);
            // return u.date._dateLocale[language].weekdays[d];
            return u$1.date._jsonLocale.weekdays[d];
        },
        // am pm
        a: function(date) {
            if (date.getHours() > 12) {
                return 'pm';
            } else {
                return 'am';
            }
        },
        //hour
        h: function(date) {
            var h = date.getHours();
            h = h > 12 ? h - 12 : h;
            return h
        },
        hh: function(date) {
            var h = u$1.date._formats.h(date);
            return u$1.date.leftZeroFill(h, 2);
        },
        H: function(date) {
            return date.getHours();
        },
        HH: function(date) {
            return u$1.date.leftZeroFill(date.getHours(), 2);
        },
        // minutes
        m: function(date) {
            return date.getMinutes();
        },
        mm: function(date) {
            return u$1.date.leftZeroFill(date.getMinutes(), 2);
        },
        //seconds
        s: function(date) {
            return date.getSeconds();
        },
        ss: function(date) {
            return u$1.date.leftZeroFill(date.getSeconds(), 2);
        }
    },

    /**
     * 日期格式化
     * @param date
     * @param formatString
     */
    format: function(date, formatString, language) {
        if (!date && date != 0) return ''; // renturn date 改为 return '',因：setFormat初始会赋值为undefined,造成二次选择报错
        var array = formatString.match(u$1.date._formattingTokens),
            i, length, output = '';
        var _date = u$1.date.getDateObj(date);
        if (!_date) return date;
        language = language || core.getLanguages();
        for (i = 0, length = array.length; i < length; i++) {
            if (u$1.date._formats[array[i]]) {
                output += u$1.date._formats[array[i]](_date, language);
            } else {
                output += array[i];
            }
        }
        return output;
    },
    strToDateByTimezone: function(str, timezone) {
        var dateObj = u$1.date.getDateObj(str);
        var localTime = dateObj.getTime();
        var localOffset = dateObj.getTimezoneOffset() * 60000;
        var utc = localTime + localOffset; //得到国际标准时间
        utc = utc + (3600000 * parseFloat(timezone));
        return utc;
    },

    /**
     * 根据当前时区日期对象获取指定时区日期对象
     * @param  {Date} date     当前时区日期对象
     * @param  {number} timezone 指定时区
     * @return {Date}          转化后的日期对象
     */
    getDateByTimeZonec2z: function(date, timezone) {
        var dateObj = u$1.date.getDateObj(date);
        var localTime = dateObj.getTime();
        var localOffset = dateObj.getTimezoneOffset() * 60000;
        var utc = localTime + localOffset;
        var calctime = utc + (3600000 * parseFloat(timezone));
        return new Date(calctime);
    },
    /**
     * 根据指定时区日期对象获取当前时区日期对象
     * @param  {Date} date     指定时区日期对象
     * @param  {number} timezone 指定时区
     * @return {Date}          转化后的日期对象
     */
    getDateByTimeZonez2c: function(date, timezone) {
        var dateObj = u$1.date.getDateObj(date);
        var localTime = dateObj.getTime();
        var localOffset = dateObj.getTimezoneOffset() * 60000;
        var utc = localTime - (3600000 * parseFloat(timezone)) - localOffset;
        return new Date(utc)
    },

    _addOrSubtract: function(date, period, value, isAdding) {
        var times = date.getTime(),
            d = date.getDate(),
            m = date.getMonth(),
            _date = u$1.date.getDateObj(date);
        if (period === 'ms') {
            times = times + value * isAdding;
            _date.setTime(times);
        } else if (period == 's') {
            times = times + value * 1000 * isAdding;
            _date.setTime(times);
        } else if (period == 'm') {
            times = times + value * 60000 * isAdding;
            _date.setTime(times);
        } else if (period == 'h') {
            times = times + value * 3600000 * isAdding;
            _date.setTime(times);
        } else if (period == 'd') {
            d = d + value * isAdding;
            _date.setDate(d);
        } else if (period == 'w') {
            d = d + value * 7 * isAdding;
            _date.setDate(d);
        } else if (period == 'M') {
            m = m + value * isAdding;
            _date.setMonth(m);
        } else if (period == 'y') {
            m = m + value * 12 * isAdding;
            _date.setMonth(m);
        }
        return _date;
    },

    add: function(date, period, value) {
        return u$1.date._addOrSubtract(date, period, value, 1);
    },
    sub: function(date, period, value) {
        return u$1.date._addOrSubtract(date, period, value, -1);
    },
    getDateObj: function(value, obj) {
        var timezone;
        if (obj) {
            timezone = obj.timezone;
        }
        if ((!value && value != 0) || typeof value == 'undefined') return value;
        var dateFlag = false;
        var _date = new Date(dateFormat(value));
        if (isNaN(_date)) {
            // IE的话对"2016-2-13 12:13:22"进行处理
            var index1, index2, index3, s1, s2, s3, s4;
            if (value.indexOf) {
                index1 = value.indexOf('-');
                index2 = value.indexOf(':');
                index3 = value.indexOf(' ');
                if (index1 > 0 || index2 > 0 || index3 > 0) {
                    _date = new Date();
                    if (index3 > 0) {
                        s3 = value.split(' ');
                        s1 = s3[0].split('-');
                        s2 = s3[1].split(':');
                        s4 = s3[2];
                    } else if (index1 > 0) {
                        s1 = value.split('-');
                    } else if (index2 > 0) {
                        s2 = value.split(':');
                    }
                    if (s1 && s1.length > 0) {
                        _date.setYear(s1[0]);
                        _date.setMonth(parseInt(s1[1] - 1));
                        _date.setDate(s1[2] ? s1[2] : 0);
                        _date.setMonth(parseInt(s1[1] - 1));
                        _date.setDate(s1[2] ? s1[2] : 0);
                        dateFlag = true;
                    }
                    if (s2 && s2.length > 0) {
                        //解决ie和firefox等时间pm直接变am问题
                        if (s4 == "pm") {
                            s2[0] = s2[0] - (-12);
                        }
                        _date.setHours(s2[0] ? s2[0] : 0);
                        _date.setMinutes(s2[1] ? s2[1] : 0);
                        _date.setSeconds(s2[2] ? s2[2] : 0);
                        dateFlag = true;
                    }
                } else {
                    _date = new Date(parseInt(value));
                    if (isNaN(_date)) {
                        // throw new TypeError('invalid Date parameter');
                    } else {
                        dateFlag = true;
                    }
                }
            }
        } else {
            dateFlag = true;
        }
        if (dateFlag) {
            if (timezone) {
                _date = u$1.date.getDateByTimeZonec2z(_date, timezone);
            }
            return _date;
        } else
            return null;
    }

};

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
 * Module : Kero float adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 15:16:08
 */

var FloatAdapter = u.BaseAdapter.extend({
    init: function() {
        var self = this;
        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        if (!this.element) {
            throw new Error('not found INPUT element, u-meta:' + JSON.stringify(this.options));
        }
        this.maskerMeta = core.getMaskerMeta('float') || {};
        this.validType = 'float';
        this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
        this.max = this.getOption('max');
        this.min = this.getOption('min');
        var placeholder = this.options['placeholder'];
        if (placeholder)
            this.element.placeholder = placeholder;
        //如果max为false并且不为0
        if (!this.max && this.max !== 0) {
            this.max = "10000000000000000000";
        }
        //如果min为false并且不为0
        if (!this.min && this.min !== 0) {
            this.min = "-10000000000000000000";
        }
        // this.max = this.getOption('max') || "10000000000000000000";
        // this.min = this.getOption('min') || "-10000000000000000000";
        this.maxNotEq = this.getOption('maxNotEq');
        this.minNotEq = this.getOption('minNotEq');

        //处理数据精度
        this.dataModel.refRowMeta(this.field, "precision").subscribe(function(precision) {
            if (precision === undefined) return;
            self.setPrecision(precision);
        });
        this.formater = new NumberFormater(this.maskerMeta.precision);
        this.masker = new NumberMasker(this.maskerMeta);
        on(this.element, 'focus', function() {
            if (self.enable) {
                self.onFocusin();
                try {
                    var e = event.srcElement;
                    var r = e.createTextRange();
                    r.moveStart('character', e.value.length);
                    r.collapse(true);
                    r.select();
                } catch (e) {}
            }
        });

        on(this.element, 'blur', function() {
            var newValue;
            if (self.enable) {
                if (!self.doValidate({
                        'trueValue': true
                    }) && self._needClean()) {
                    if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                        // 因必输项清空导致检验没通过的情况
                        self.setValue('');
                    } else {
                        self.element.value = self.getShowValue();
                    }
                } else {
                    newValue = self.element.value ? self.element.value.replaceAll(',', '') : "";
                    self.setValue(newValue);
                }
            }
        });

        on(this.element, 'keydown', function(e) {
            if (self.enable) {
                var code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                if (e.ctrlKey && (e.keyCode == 67 || e.keyCode == 86)) {
                    //复制粘贴
                    return true;
                }
                if (!((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 37 || code == 102 || code == 39 || code == 8 || code == 46 || code == 110 || code == 190)) {
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
    },
    hide: function() {
        var self = this,
            newValue;
        if (self.enable) {
            if (!self.doValidate({
                    'trueValue': true
                }) && self._needClean()) {
                if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                    // 因必输项清空导致检验没通过的情况
                    self.setValue('');
                } else {
                    self.element.value = self.getShowValue();
                }
            } else {
                newValue = self.element.value ? self.element.value.replaceAll(',', '') : "";
                self.setValue(newValue);
            }
        }
    },
    /**
     * 修改精度
     * @param {Integer} precision
     */
    setPrecision: function(precision) {
        if (this.maskerMeta.precision == precision) return;
        this.maskerMeta.precision = precision;
        this.formater = new NumberFormater(this.maskerMeta.precision);
        this.masker = new NumberMasker(this.maskerMeta);
        var currentRow = this.dataModel.getCurrentRow();
        if (currentRow) {
            var v = this.dataModel.getCurrentRow().getValue(this.field);
            this.showValue = this.masker.format(this.formater.format(v)).value;
        } else {
            this.showValue = this.masker.format(this.formater.format(this.trueValue)).value;
        }

        this.setShowValue(this.showValue);
    },

    onFocusin: function() {
        var v = this.getValue(),
            vstr = v + '',
            focusValue = v;
        if (isNumber$1(v) && isNumber$1(this.maskerMeta.precision)) {
            if (vstr.indexOf('.') >= 0) {
                var sub = vstr.substr(vstr.indexOf('.') + 1);
                if (sub.length < this.maskerMeta.precision || parseInt(sub.substr(this.maskerMeta.precision)) == 0) {
                    focusValue = this.formater.format(v);
                }
            } else if (this.maskerMeta.precision > 0) {
                focusValue = this.formater.format(v);
            }
        }

        focusValue = parseFloat(focusValue) === 0 ? parseFloat(focusValue) : (parseFloat(focusValue) || '');
        this.setShowValue(focusValue);
    },
    _needClean: function() {
        return true
    }
});

if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: FloatAdapter,
        name: 'float'
    });

/**
 * Module : Kero percent
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 20:02:50
 */
/**
 * 百分比控件
 */
var PercentAdapter = FloatAdapter.extend({
    init: function() {
        FloatAdapter.prototype.init.call(this);
        this.validType = 'float';
        this.maskerMeta = core.getMaskerMeta('percent') || {};
        this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
        if (this.maskerMeta.precision) {
            this.maskerMeta.precision = parseInt(this.maskerMeta.precision) + 2;
        }
        this.formater = new NumberFormater(this.maskerMeta.precision);
        this.masker = new PercentMasker(this.maskerMeta);
    }
});
if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: PercentAdapter,
        name: 'percent'
    });

exports.PercentAdapter = PercentAdapter;

}((this.bar = this.bar || {})));
