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

var off = function(element, eventName, listener) {
	//删除事件数组
	if(listener) {
		if(element && element["uEvent"] && element["uEvent"][eventName]) {
			element["uEvent"][eventName].forEach(function(fn, i) {
				if(fn == listener) {
					element["uEvent"][eventName].splice(i, 1);
				}
			});
		}
		return;
	}
	var eventfn;
	if(element && element["uEvent"] && element["uEvent"][eventName + 'fn'])
		eventfn = element["uEvent"][eventName + 'fn'];
	if(element.removeEventListener) { // 用于支持DOM的浏览器
		element.removeEventListener(eventName, eventfn);
	} else if(element.removeEvent) { // 用于IE浏览器
		element.removeEvent("on" + eventName, eventfn);
	} else { // 用于其它浏览器
		delete element["on" + eventName];
	}
	if(u.event && u.event[eventName] && u.event[eventName].teardown) {
		u.event[eventName].teardown.call(element);
	}

	if(element && element["uEvent"] && element["uEvent"][eventName])
		element["uEvent"][eventName] = undefined;
	if(element && element["uEvent"] && element["uEvent"][eventName + 'fn'])
		element["uEvent"][eventName + 'fn'] = undefined;

};
/**
 * 阻止冒泡
 */
var stopEvent = function(e) {
	if(typeof(e) != "undefined") {
		if(e.stopPropagation)
			e.stopPropagation();
		else {
			e.cancelBubble = true;
		}
		//阻止默认浏览器动作(W3C)
		if(e && e.preventDefault)
			e.preventDefault();
		//IE中阻止函数器默认动作的方式
		else
			window.event.returnValue = false;
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
 * 元素上是否存在该类
 * @param {Object} element
 * @param {Object} value
 */
var hasClass = function(element, value) {
	if(!element) return false;
	if(element.nodeName && (element.nodeName === '#text' || element.nodeName === '#comment')) return false;
	if(typeof element.classList === 'undefined') {
		if(u._hasClass){
			return u._hasClass(element, value);
		}else{
			return $(element).hasClass(value);
		}

		return false;
	} else {
		return element.classList.contains(value);
	}
};
/**
 * 向上查找指定类元素
 * @param {Object} element
 * @param {Object} selector
 */
var closest = function(element, selector) {
	var tmp = element;
	while(tmp != null && !hasClass(tmp, selector) && tmp != document.body) {
		tmp = tmp.parentNode;
	}
	if(tmp == document.body) return null;
	return tmp;
};

var globalZIndex;
/**
 * 统一zindex值, 不同控件每次显示时都取最大的zindex，防止显示错乱
 */
var getZIndex = function() {
	if(!globalZIndex) {
		globalZIndex = 2000;
	}
	return globalZIndex++;
};
var makeDOM = function(htmlString) {
	var tempDiv = document.createElement("div");
	tempDiv.innerHTML = htmlString;
	var _dom = tempDiv.children[0];
	return _dom;
};
var showPanelByEle = function(obj) {
		var ele = obj.ele,panel = obj.panel,position = obj.position,
			// off = u.getOffset(ele),scroll = u.getScroll(ele),
			// offLeft = off.left,offTop = off.top,
			// scrollLeft = scroll.left,scrollTop = scroll.top,
			// eleWidth = ele.offsetWidth,eleHeight = ele.offsetHeight,
			// panelWidth = panel.offsetWidth,panelHeight = panel.offsetHeight,
			bodyWidth = document.body.clientWidth,bodyHeight = document.body.clientHeight,
			position = position || 'top',
			// left = offLeft - scrollLeft,top = offTop - scrollTop,
			eleRect = obj.ele.getBoundingClientRect(),
			panelRect = obj.panel.getBoundingClientRect(),
			eleWidth = eleRect.width || 0,eleHeight = eleRect.height || 0,
			left = eleRect.left || 0,top = eleRect.top || 0,
			panelWidth = panelRect.width || 0,panelHeight = panelRect.height || 0,
			docWidth =  document.documentElement.clientWidth, docHeight =  document.documentElement.clientHeight;

			// 基准点为Ele的左上角
			// 后续根据需要完善
		if(position == 'left'){
			left=left-panelWidth;
			top=top+(eleHeight - panelHeight)/2;
		}else if(position == 'right'){
			left=left+eleWidth;
			top=top+(eleHeight - panelHeight)/2;
		}else if(position == 'top'||position == 'topCenter'){
			left = left + (eleWidth - panelWidth)/2;
			top = top - panelHeight;
		}else if(position == 'bottom'||position == 'bottomCenter'){
			left = left+ (eleWidth - panelWidth)/2;
			top = top + eleHeight;
		}else if(position == 'bottomLeft'){
			left = left;
			top = top + eleHeight;
		}

	        if((left + panelWidth) > docWidth)
	            left = docWidth - panelWidth - 10;
	        if(left < 0)
	            left = 0;

	         if((top + panelHeight) > docHeight) {
		 top = docHeight - panelHeight - 10;
		 }

	         if(top < 0)
	             top = 0;
	        panel.style.left = left + 'px';
	        panel.style.top = top + 'px';
	};

var getElementLeft = function (element){
	var actualLeft = element.offsetLeft;
　　　　var current = element.offsetParent;
　　　　while (current !== null){
　　　　　　actualLeft += current.offsetLeft;
　　　　　　current = current.offsetParent;
　　　　}
　　　　if (document.compatMode == "BackCompat"){
　　　　　　var elementScrollLeft=document.body.scrollLeft;
　　　　} else {
　　　　　　var elementScrollLeft=document.documentElement.scrollLeft;
　　　　}
　　　　return actualLeft-elementScrollLeft;
};
var getElementTop = function (element){
	var actualTop = element.offsetTop;
　　　　var current = element.offsetParent;
　　　　while (current !== null){
　　　　　　actualTop += current. offsetTop;
　　　　　　current = current.offsetParent;
　　　　}
　　　　 if (document.compatMode == "BackCompat"){
　　　　　　var elementScrollTop=document.body.scrollTop;
　　　　} else {
　　　　　　var elementScrollTop=document.documentElement.scrollTop;
　　　　}
　　　　return actualTop-elementScrollTop;
};

/**
 * Module : Sparrow extend enum
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

var U_LANGUAGES = "i_languages";
var U_THEME = "u_theme";
var U_LOCALE = "u_locale";
var U_USERCODE = "usercode";
var U_TIMEZONE = "u_timezone";

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
var getFunction = function(target, val) {
	if(!val || typeof val == 'function') return val
	if(typeof target[val] == 'function')
		return target[val]
	else if(typeof window[val] == 'function')
		return window[val]
	else if(val.indexOf('.') != -1) {
		var func = getJSObject(target, val);
		if(typeof func == 'function') return func
		func = getJSObject(window, val);
		if(typeof func == 'function') return func
	}
	return val
};
var getJSObject = function(target, names) {
	if(!names) {
		return;
	}
	if(typeof names == 'object')
		return names
	var nameArr = names.split('.');
	var obj = target;
	for(var i = 0; i < nameArr.length; i++) {
		obj = obj[nameArr[i]];
		if(!obj) return null
	}
	return obj
};
var isNumber$1 = function(obj) {
	//return obj === +obj
	//加了个typeof 判断，因为'431027199110.078573'会解析成number
	return obj - parseFloat(obj) + 1 >= 0;
};
var isArray = Array.isArray || function(val) {
	return Object.prototype.toString.call(val) === '[object Array]';
};
var isEmptyObject = function(obj) {
	var name;
	for(name in obj) {
		return false;
	}
	return true;
};
var inArray = function(node, arr) {
	if(!arr instanceof Array) {
		throw "arguments is not Array";
	}
	for(var i = 0, k = arr.length; i < k; i++) {
		if(node == arr[i]) {
			return true;
		}
	}
	return false;
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
 * Module : kero DataTable copyRow
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-08-01 14:34:01
 */


/**
 * 在指定index位置插入单条数据行
 * @memberof DataTable
 * @param  {number} index 数据行插入之后的位置
 * @param  {object} row   数据行信息
 * @example
 * var row = {
 *    field1:'value1'
 * }
 * datatable.copyRow(1,row)
 */
const copyRow = function(index, row) {
    this.copyRows(index, [row]);
};

/**
 * 在指定index位置插入多条数据行
 * @memberof DataTable
 * @param  {number} index 数据行插入之后的位置
 * @param  {array} rows   存储数据行信息的数组
 * @example
 * var row1 = {
 *    field1:'value1'
 * }
 * var row2 = {
 *    field1:'value1'
 * }
 * datatable.copyRow(1,[row1,row2])
 */
const copyRows = function(index, rows) {
    for (var i = 0; i < rows.length; i++) {
        var newRow = new Row({
            parent: this
        });
        if (rows[i]) {
            newRow.setData(rows[i].getData());
        }
        this.insertRows(index === undefined ? this.rows().length : index, [newRow]);
    }
};

const copyRowFunObj = {
    copyRow: copyRow,
    copyRows: copyRows
};

/**
 * Module : kero DataTable data
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-07-30 14:34:01
 */

/**
 * 设置数据信息
 * @memberof DataTable
 * @param {object} data    需要设置的数据信息，必须包含rows或者pages属性
 * @param {array} [data.rows]    数据信息中的行信息数组
 * @param {array} [data.pages]    数据信息中的page对象数组
 * @param {number} [data.pageIndex=DataTable对象当前的页码]    数据信息中的当前页码
 * @param {number} [data.pageSize=DataTable对象当前的每页显示条数]    数据信息中的每页显示条数
 * @param {number} [data.totalPages=DataTable对象当前的总页数]    数据信息中的总页数
 * @param {number} [data.totalRow=如果存在rows则为rows的长度，否则为DataTable对象当前的总条数]    数据信息中的总条数
 * @param {number} [data.select]    数据信息中的选中行行号
 * @param {number} [data.focus]    数据信息中的focus行行号
 * @param {object} options 设置数据时的配置参数
 * @param {boolean} options.unSelect=false 是否默认选中第一行，如果为true则不选中第一行，否则选中第一行
 * @example
 * // 不包含分页的情况
 * var data = {
 *    pageIndex:0,
 *    pageSize:5,
 *    totalPages:5,
 *    totalRow:22,
 *    rows:[{
 *      id:'r41201', // 如果需要添加
 *      status:'nrm', // 如果需要添加
 *      data:{
 *          field1:'value1',
 *          field2:'value2'
 *        }
 *    },{
 *      id:'r41202',
 *      status:'nrm',
 *      data:{
 *          field1:'value11',
 *          field2:'value21'
 *        }
 *    },...],
 *    select:[0]
 * }
 * // 包含分页的情况
 * var data = {
 *    pageIndex:0,
 *    pageSize:5,
 *    totalPages:5,
 *    totalRow:22,
 *    pages:[{
 *      index: 0,
 *      select: [],
 *      current: -1,
 *      rows:[{
 *        id:'r41201', // 如果需要添加
 *        status:'nrm', // 如果需要添加
 *        data:{
 *          field1:'value1',
 *          field2:'value2'
 *        }
 *      },{
 *        id:'r41202',
 *        status:'nrm',
 *        data:{
 *          field1:'value11',
 *          field2:'value21'
 *        }
 *      },...]
 *    },...],
 * }
 * var op = {
 *     unSelect:true
 * }
 * datatable.setData(data,op)
 */
const setData = function(data, options) {
    if (data.pageIndex || data.pageIndex === 0) {
        var newIndex = data.pageIndex;
    } else {
        var newIndex = this.pageIndex();
    }
    if (data.pageSize || data.pageSize === 0) {
        var newSize = data.pageSize;
    } else {
        var newSize = this.pageSize();
    }
    if (data.totalPages || data.totalPages === 0) {
        var newTotalPages = data.totalPages;
    } else {
        var newTotalPages = this.totalPages();
    }
    if (data.totalRow || data.totalRow === 0) {
        var newTotalRow = data.totalRow;
    } else {
        if (data.rows)
            var newTotalRow = data.rows.length;
        else
            var newTotalRow = this.totalRow();
    }
    var select, focus, unSelect = options ? options.unSelect : false;

    this.pageIndex(newIndex);
    this.pageSize(newSize);

    this.pageCache = data.pageCache || this.pageCache;
    if (this.pageCache === true) {
        this.updatePages(data.pages);
        if (newIndex != this.pageIndex()) {
            this.setCurrentPage(newIndex, true);
            this.totalPages(newTotalPages);
            this.totalRow(newTotalRow + this.newCount);
            return;
        } else {
            // 首先删除数据，然后将当前页数据插入
            this.removeAllRows();
            select = this.getPage(newIndex).selectedIndices;
            focus = this.getPage(newIndex).focus;
            var rows = this.setRows(this.getPage(newIndex).rows, options);
            this.getPage(newIndex).rows = rows;
        }
        // 后台传入totalPages及totalRow才进行更新
        if (data.totalPages) {
            this.totalPages(data.totalPages);
        }
        if (data.totalRow || data.totalRow === 0) {
            this.totalRow(data.totalRow + this.newCount);
        }
    } else {
        select = data.select || (!unSelect ? [0] : []);
        focus = data.focus !== undefined ? data.focus : data.current;
        this.setRows(data.rows, options);
        this.totalPages(newTotalPages);
        this.totalRow(newTotalRow);
    }



    this.updateSelectedIndices();

    if (select && select.length > 0 && this.rows().length > 0)
        this.setRowsSelect(select);
    if (focus !== undefined && this.getRow(focus))
        this.setRowFocus(focus);
};


/**
 * 设置对应行对应字段的值
 * @memberof DataTable
 * @param {string} fieldName 需要设置的字段
 * @param {string} value     需要设置的值
 * @param {u.row} [row=当前行] 需要设置的u.row对象，
 * @param {*} [ctx]        自定义属性，在valuechange监听传入对象中可通过ctx获取此处设置
 * @example
 * datatable.setValue('filed1','value1') //设置当前行字段值
 * var row = datatable.getRow(1)
 * datatable.setValue('filed1','value1',row) //设置在指定行字段值
 * datatable.setValue('filed1','value1',row,'ctx') //设置在指定行字段值，同时传入自定义数据
 */
const setValue = function(fieldName, value, row, ctx) {
    if (arguments.length === 1) {
        value = fieldName;
        fieldName = '$data';
    }

    row = row ? row : this.getCurrentRow();
    if (row)
        row.setValue(fieldName, value, ctx);
};

/**
 * 重置所有行的数据至nrm状态时的数据
 */
const resetAllValue = function() {
    var rows = new Array();
    rows = rows.concat(this.rows());
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        this.resetValueByRow(row);
    }
};

/**
 * 根据row对象重置数据至nrm状态时的数据
 * @param {u.row} row 需要重置数据的row对象
 */
const resetValueByRow = function(row) {
    if (row.status == Row.STATUS.NEW) {
        this.setRowsDelete(row);
    } else if (row.status == Row.STATUS.FALSE_DELETE) {
        row.status = Row.STATUS.NORMAL;
        var rows = [row];
        this.trigger(DataTable.ON_INSERT, {
            index: 0,
            rows: rows
        });
    } else if (row.status == Row.STATUS.UPDATE) {
        row.status = Row.STATUS.NORMAL;
        row.resetValue();
    }

};
const dataFunObj = {
    setData: setData,
    setValue: setValue,
    resetAllValue: resetAllValue,
    resetValueByRow: resetValueByRow
};

/**
 * Module : kero DataTable enable
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-08 09:59:01
 */

/**
 * 判断DataTable或指定字段是否可修改
 * @memberof DataTable
 * @param  {string}  [fieldName] 需要进行判断的字段值
 * @return {boolean}  DataTable/指定字段是否可修改
 * @example
 * datatable.isEnable() //获取datatable是否可修改
 * datatable.isEnable('field1') //获取字段field1是否可修改
 */
const isEnable = function(fieldName) {
    var fieldEnable = this.getMeta(fieldName, 'enable');
    if (typeof fieldEnable == 'undefined' || fieldEnable == null)
        fieldEnable = true;
    return fieldEnable && this.enable
};

/**
 * 设置DataTable是否可修改
 * @memberof DataTable
 * @param {boolean} enable true表示可修改，否则表示不可修改
 * @example
 * datatable.setEnable(true)
 */
const setEnable = function(enable) {
    if (this.enable == enable) return
    //当传入的参数不为false时，默认enable为true
    if (enable === false) {
        enable = false;
    } else {
        enable = true;
    }
    this.enable = enable;
    this.enableChange(-this.enableChange());
    this.trigger(DataTable.ON_ENABLE_CHANGE, {
        enable: this.enable
    });
};

const enableFunObj = {
    isEnable: isEnable,
    setEnable: setEnable
};

/**
 * Module : kero DataTable getCurrent
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-08 09:59:01
 */


/**
 * 获取DataTable对象的当前行
 * @memberof DataTable
 * @return {null|u.Row} DataTable对象的当前行
 * @example
 * datatable.getCurrentRow()
 */
const getCurrentRow = function() {
    if (this.focusIndex() != -1)
        return this.getFocusRow()
    var index = this.getSelectedIndex();
    if (index == -1)
        return null
    else
        return this.getRow(index)
};
/**
 * 获取DataTable对象的当前行对应的index
 * @memberof DataTable
 * @return {number} DataTable对象的当前行对应的index
 * @example
 * datatable.getCurrentIndex()
 */
const getCurrentIndex = function() {
    if (this.focusIndex() != -1)
        return this.focusIndex()
    var index = this.getSelectedIndex();
    if (index == -1)
        return -1
    else
        return index
};

const getCurrentFunObj = {
    getCurrentRow: getCurrentRow,
    getCurrentIndex: getCurrentIndex
};

/**
 * Module : kero DataTable getData
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-07-30 14:34:01
 */

/**
 * 获取DataTable的数据信息
 * @memberof DataTable
 * @return {array} 数据信息对应的数组，每项对应一条数据
 * @example
 * datatable.getData()
 */
const getData = function() {
    var datas = [],
        rows = this.rows();
    for (var i = 0; i < rows.length; i++) {
        datas.push(rows[i].getData());
    }
    return datas
};


// 将page转为row对象格式
const page2data = function(page, pageIndex) {
    var data = {};
    data.focus = page.focus;
    data.index = pageIndex;
    data.select = page.selectedIndices;
    return data;
};

/**
 * 按照特定规则获取数据
 * @memberof DataTable
 * @param  {string} rule
 * DataTable.SUBMIT.current('current') ：当前选中行
 * DataTable.SUBMIT.focus('focus') ：当前focus行
 * DataTable.SUBMIT.all('all') ：所有行
 * DataTable.SUBMIT.select('select') ：当前页选中行
 * DataTable.SUBMIT.change('change') ：发生改变的行
 * DataTable.SUBMIT.empty('empty') ：不获取数据，返回空数组
 * DataTable.SUBMIT.allSelect('allSelect') ：所有页选中行
 * DataTable.SUBMIT.allPages('allPages') ：所有页的数据
 * @return {array}      按照规则获取到的数据信息
 * @example
 * datatable.getDataByRule(‘all’)
 */

const getDataByRule = function(rule) {
    var returnData = {},
        datas = null,
        rows;
    returnData.meta = this.meta;
    returnData.params = this.params;
    rule = rule || DataTable.SUBMIT.current;
    // 存在多页及不存在多页分开处理
    if (this.pageCache) {
        var pages = this.getPages();
        if (rule == DataTable.SUBMIT.current || rule == DataTable.SUBMIT.focus) {
            datas = [];
            var pageIndex = this.pageIndex();
            var currPage = pages[pageIndex];
            if (currPage) {
                var currIndex = this.focusIndex();
                if (rule == DataTable.SUBMIT.current) {
                    if (currIndex == -1)
                        currIndex = this.getSelectedIndex();
                }
                var data = page2data(currPage, pageIndex);
                data.rows = [];
                for (var i = 0, count = currPage.rows.length; i < count; i++) {
                    var row = currPage.rows[i].getData();
                    if (i != currIndex)
                        row.data = {};
                    data.rows.push(row);
                }
                datas.push(data);
            }
        } else if (rule == DataTable.SUBMIT.all || rule == DataTable.SUBMIT.allPages) {
            datas = [];
            for (var i = 0; i < pages.length; i++) {
                var currPage = pages[i];
                var data = page2data(currPage, i);
                data.rows = [];
                for (var i = 0; i < currPage.rows.length; i++) {
                    data.rows.push(currPage.rows[i].getData());
                }
                datas.push(data);
            }
        } else if (rule == DataTable.SUBMIT.select) {
            datas = [];
            var pageIndex = this.pageIndex();
            var currPage = pages[pageIndex];
            if (currPage) {
                var data = page2data(currPage, pageIndex);
                data.rows = [];
                for (var i = 0, count = currPage.rows.length; i < count; i++) {
                    var row = currPage.rows[i].getData();
                    if (data.select.indexOf(i) < 0)
                        row.data = {};
                    data.rows.push(row);
                }
                datas.push(data);
            }
        } else if (rule == DataTable.SUBMIT.allSelect) {
            datas = [];
            for (var i = 0; i < pages.length; i++) {
                var currPage = pages[i];
                var data = page2data(currPage, i);
                data.rows = [];
                for (var j = 0, count = currPage.rows.length; j < count; j++) {
                    var row = currPage.rows[j].getData();
                    if (data.select.indexOf(j) < 0)
                        row.data = {};
                    data.rows.push(row);
                }
                datas.push(data);
            }
        } else if (rule == DataTable.SUBMIT.change) {
            datas = [];
            for (var i = 0; i < pages.length; i++) {
                var currPage = pages[i];
                var data = page2data(currPage, i);
                data.rows = [];
                for (var j = 0, count = currPage.rows.length; j < count; j++) {
                    var row = currPage.rows[j].getData();
                    if (row.status == Row.STATUS.NORMAL) {
                        row.data = {};
                    }
                    data.rows.push(row);
                }
                datas.push(data);
            }
        } else if (rule === DataTable.SUBMIT.empty) {
            datas = [];
        }
        if (pages.length < 1 || !pages[this.pageIndex()]) {
            datas = [{
                index: this.pageIndex(),
                select: [],
                focus: -1,
                rows: []
            }];
        }
        returnData.pages = datas;
    } else {
        if (rule == DataTable.SUBMIT.current) {
            datas = [];
            var currIndex = this.focusIndex();
            if (currIndex == -1)
                currIndex = this.getSelectedIndex();
            rows = this.rows();
            for (var i = 0, count = rows.length; i < count; i++) {
                if (i == currIndex)
                    datas.push(rows[i].getData());
                else
                    datas.push(rows[i].getEmptyData());
            }

        } else if (rule == DataTable.SUBMIT.focus) {
            datas = [];
            rows = this.rows();
            for (var i = 0, count = rows.length; i < count; i++) {
                if (i == this.focusIndex())
                    datas.push(rows[i].getData());
                else
                    datas.push(rows[i].getEmptyData());
            }
        } else if (rule == DataTable.SUBMIT.all) {
            datas = this.getData();
        } else if (rule == DataTable.SUBMIT.select) {
            datas = this.getSelectedDatas(true);
        } else if (rule == DataTable.SUBMIT.change) {
            datas = this.getChangedDatas();
        } else if (rule === DataTable.SUBMIT.empty) {
            datas = [];
        }

        returnData.rows = datas;
        returnData.select = this.getSelectedIndexs();
        returnData.focus = this.getFocusIndex();
    }




    returnData.pageSize = this.pageSize();
    returnData.pageIndex = this.pageIndex();
    returnData.isChanged = this.isChanged();
    returnData.master = this.master;
    returnData.pageCache = this.pageCache;
    return returnData
};


/**
 * 根据索引获取指定行数据信息
 * @memberof DataTable
 * @param  {number} index 需要获取的数据信息的索引
 * @return {object}      获取到的指定行数据信息
 * @example
 * datatable.getRow(1)
 */
const getRow = function(index) {
    //return this.rows()[index]   //modify by licza.   improve performance
    return this.rows.peek()[index]
};

// 获取子表的数据行
const getChildRow = function(obj) {
    var fullField = obj.fullField,
        index = obj.index,
        row = null;
    if (parseInt(index) > -1) {
        if ((index + '').indexOf('.') > 0) {
            var fieldArr = fullField.split('.');
            var indexArr = index.split('.');
            var nowDataTable = this;
            var nowRow = null;
            for (var i = 0; i < indexArr.length; i++) {
                nowRow = nowDataTable.getRow(indexArr[i]);
                if (i < indexArr.length - 1) {
                    if (nowRow) {
                        nowDataTable = nowRow.getValue(fieldArr[i]);
                    } else {
                        nowRow = null;
                        break;
                    }
                }
            }
            row = nowRow;
        } else {
            row = this.getRow(index);
        }
    }
    return row;
};

/**
 * 根据rowid获取Row对象
 * @memberof DataTable
 * @param {string} rowid 需要获取的Row对应的rowid
 * @returns {Row}
 * @example
 * datatable.getRowByRowId('rowid')
 */
const getRowByRowId = function(rowid) {
    var rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].rowId == rowid)
            return rows[i]
    }
    return null
};

/**
 * 获取Row对象对应的索引
 * @memberof DataTable
 * @param {u.Row} 需要获取索引的row对象
 * @returns {*}
 * @example
 * var row = datatable.getRow(1)
 * datatable.getRowIndex(row) // 1
 */
const getRowIndex = function(row) {
    var rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].rowId === row.rowId)
            return i;
    }
    return -1;
};

/**
 * 根据字段及字段值获取所有数据行
 * @memberof DataTable
 * @param  {string} field 需要获取行的对应字段
 * @param  {string} value 需要获取行的对应字段值
 * @return {array}      根据字段及字段值获取的所有数据行
 * @example
 * datatable.getRowsByField('field1','value1')
 */
const getRowsByField = function(field, value) {
    var rows = this.rows.peek();
    var returnRows = new Array();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].getValue(field) === value)
            returnRows.push(rows[i]);
    }
    return returnRows;
};

/**
 * 根据字段及字段值获取第一条数据行
 * @memberof DataTable
 * @param  {string} field 需要获取行的对应字段
 * @param  {string} value 需要获取行的对应字段值
 * @return {u.Row}      根据字段及字段值获取第一条数据行
 * @example
 * datatable.getRowByField('field1','value1')
 */
const getRowByField = function(field, value) {
    var rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].getValue(field) === value)
            return rows[i]
    }
    return null;
};

/**
 * 获取当前页的所有数据行
 * @memberof DataTable
 * @return {array} 获取到的数据行
 * @example
 * datatable.getAllRows()
 */
const getAllRows = function() {
    return this.rows.peek();
};

/**
 * 获取所有页的所有数据行
 * @memberof DataTable
 * @return {array} 获取到的数据行
 * @example
 * datatable.getAllPageRows()
 */
const getAllPageRows = function() {
    var datas = [],
        rows;
    for (var i = 0; i < this.totalPages(); i++) {
        rows = [];
        if (i == this.pageIndex()) {
            rows = this.getData();
        } else {
            var page = this.cachedPages[i];
            if (page) {
                rows = page.getData();
            }
        }
        for (var j = 0; j < rows.length; j++) {
            datas.push(rows[j]);
        }
    }
    return datas;
};

/**
 * 获取发生变化的数据信息
 * @memberof DataTable
 * @param  {boolean} withEmptyRow=false 未发生变化的数据是否使用空行代替，true表示以空行代替未发生变化行，false相反
 * @return {array}            发生变化的数据信息
 * @example
 * datatable.getChangedDatas()
 */
const getChangedDatas = function(withEmptyRow) {
    var datas = [],
        rows = this.rows();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i] && rows[i].status != Row.STATUS.NORMAL) {
            datas.push(rows[i].getData());
        } else if (withEmptyRow == true) {
            datas.push(rows[i].getEmptyData());
        }
    }
    return datas
};

/**
 * 获取发生改变的Row对象
 * @memberof DataTable
 * @return {array} 发生改变的Row对象
 * @example
 * datatable.getChangedRows()
 */
const getChangedRows = function() {
    var changedRows = [],
        rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i] && rows[i].status != Row.STATUS.NORMAL) {
            changedRows.push(rows[i]);
        }
    }
    return changedRows
};

const getDeleteRows = function() {
    var deleteRows = [],
        rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i] && rows[i].status == Row.STATUS.FALSE_DELETE) {
            deleteRows.push(rows[i]);
        }
    }
    return deleteRows
};

/**
 * 根据字段获取对应Row对象的字段值
 * @memberof DataTable
 * @param  {string} fieldName 需要获取的值对应的字段
 * @param  {u.Row} [row=默认为当前行]     对应的数据行
 * @return {string}     获取到的字段值
 * @example
 * datatable.getValue('field1')
 * var row = datatable.getRow(1)
 * datatable.getValue('field1',row)
 */
const getValue = function(fieldName, row) {
    row = row || this.getCurrentRow();
    if (row)
        return row.getValue(fieldName)
    else
        return ''
};


/**
 * 根据行号获取行索引
 * @memberof DataTable
 * @param {String} rowId
 * @example
 * datatable.getIndexByRowId('rowid')
 */
const getIndexByRowId = function(rowId) {
    var rows = this.rows();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].rowId == rowId)
            return i
    }
    return -1
};

/**
 * 获取所有行数据信息
 * @memberof DataTable
 * @return {array} 所有行数据信息
 * @example
 * datatable.getAllDatas()
 */
const getAllDatas = function() {
    var rows = this.getAllRows();
    var datas = [];
    for (var i = 0, count = rows.length; i < count; i++)
        if (rows[i])
            datas.push(rows[i].getData());
    return datas
};


/**
 * 根据索引获取rowid
 * @memberof DataTable
 * @param  {array} indices 需要获取rowid的索引值
 * @return {array}         获取到的rowid
 * @example
 * datatable.getRowIdsByIndices([1,2,5])
 */
const getRowIdsByIndices = function(indices) {
    var rowIds = [];
    for (var i = 0; i < indices.length; i++) {
        if (this.getRow(indices[i]))
            rowIds.push(this.getRow(indices[i]).rowId);
    }
    return rowIds
};
/**
 * 根据索引获取row
 * @memberof DataTable
 * @param  {array} indices 需要获取rowid的索引值
 * @return {array}         获取到的row
 * @example
 * datatable.getRowIdsByIndices([1,2,5])
 */
const getRowsByIndices = function(indices) {
    var rows = [];
    for (var i = 0; i < indices.length; i++) {
        rows.push(this.getRow(indices[i]));
    }
    return rows
};


const getDataFunObj = {
    getData: getData,
    getDataByRule: getDataByRule,
    getRow: getRow,
    getChildRow: getChildRow,
    getRowByRowId: getRowByRowId,
    getRowIndex: getRowIndex,
    getRowsByField: getRowsByField,
    getRowByField: getRowByField,
    getAllRows: getAllRows,
    getAllPageRows: getAllPageRows,
    getChangedDatas: getChangedDatas,
    getChangedRows: getChangedRows,
    getDeleteRows: getDeleteRows,
    getValue: getValue,
    getIndexByRowId: getIndexByRowId,
    getAllDatas: getAllDatas,
    getRowIdsByIndices: getRowIdsByIndices,
    getRowsByIndices: getRowsByIndices
};

/**
 * Module : kero dataTable getFocus
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-08 09:59:01
 */

/**
 * 获取焦点行
 * @memberof DataTable
 * @return {u.Row} 焦点行
 * @example
 * datatable.getFocusRow()
 */
const getFocusRow = function() {
    if (this.focusIndex() != -1)
        return this.getRow(this.focusIndex())
    else
        return null
};

/**
 * 获取焦点行索引
 * @memberof DataTable
 * @return {number} 焦点行索引
 * @example
 * datatable.getFocusIndex()
 */
const getFocusIndex = function() {
    return this.focusIndex()
};

const getFocusFunObj = {
    getFocusRow: getFocusRow,
    getFocusIndex: getFocusIndex
};

/**
 * Module : kero dataTable getMete
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-07-30 14:34:01
 */


/**
 * 获取meta信息
 * @memberof DataTable
 * @param  {string} [fieldName] 需要获取的字段
 * @param  {string} [key]       需要获取的字段指定meta信息
 * @return {object}           meta信息
 * @example
 * datatable.getMeta() // 获取所有meta信息
 * datatable.getMeta('field1') // 获取field1所有meta信息
 * datatable.getMeta('field1','type') // 获取field1的key信息
 */
const getMeta = function(fieldName, key) {
    if (arguments.length === 0)
        return this.meta;
    else if (arguments.length === 1)
        return this.meta[fieldName];

    if (this.meta[fieldName] && typeof this.meta[fieldName][key] !== 'undefined') {
        return this.meta[fieldName][key];
    } else {
        return null;
    }

};


/**
 * 获取当前行的meta信息，如果不存在当前行则获取DataTable的meta信息
 * @memberof DataTable
 * @param  {string} [fieldName] 需要获取的字段
 * @param  {string} [key]       需要获取的字段指定meta信息
 * @return {object}           meta信息
 * @example
 * datatable.getRowMeta() // 获取当前行所有meta信息
 * datatable.getRowMeta('field1') // 获取当前行field1所有meta信息
 * datatable.getRowMeta('field1','type') // 获取当前行field1的key信息
 */
const getRowMeta = function(fieldName, key) {
    var row = this.getCurrentRow();
    if (row)
        return row.getMeta(fieldName, key)
    else
        return this.getMeta(fieldName, key)
};

const getMetaFunObj = {
    getMeta: getMeta,
    getRowMeta: getRowMeta
};

/**
 * Module : kero dataTable getPage
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-08-01 14:34:01
 */


/**
 * 获取指定索引的Page对象
 * @memberof DataTable
 * @param  {number} pageIndex 需要获取的page对应的索引
 * @return {Page|-1}           获取到的Page对象，不存在则返回-1
 * @example
 * datatable.getPage(1)
 */
const getPage = function(pageIndex) {
    if (this.pageCache) {
        return this.cachedPages[pageIndex]
    }
    return -1;
};

/**
 * 获取所有的Page对象
 * @memberof DataTable
 * @return {array} 所有的Page对象
 * @example
 * datatable.getPages()
 */
const getPages = function() {
    if (this.pageCache) {
        return this.cachedPages
    }
    return [];
};

const getPageFunObj = {
    getPage: getPage,
    getPages: getPages
};

/**
 * Module : kero dataTable getParam
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-07-30 14:34:01
 */

/**
 * 获取Param参数值
 * @memberof DataTable
 * @param  {string} key Param对应的key
 * @return {*}     Param参数值
 * @example
 * datatable.getParam('param1')
 */
const getParam = function(key) {
    return this.params[key]
};

const getParamFunObj = {
    getParam: getParam
};

/**
 * Module : kero dataTable getSelect
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-01 14:34:01
 */


/**
 * 获取选中行索引，多选时，只返回第一个行索引
 * @memberof DataTable
 * @return {number} 选中行索引
 * @example
 * datatable.getSelectedIndex()
 */
const getSelectedIndex = function() {
    var selectedIndices = this.selectedIndices();
    if (selectedIndices == null || selectedIndices.length == 0)
        return -1
    return selectedIndices[0]
};

/**
 * 获取选中的所有行索引数组
 * @memberof DataTable
 * @return {array} 所有行索引数组
 * @example
 * datatable.getSelectedIndices()
 */
const getSelectedIndices = function() {
    var selectedIndices = this.selectedIndices();
    if (selectedIndices == null || selectedIndices.length == 0)
        return []
    return selectedIndices
};

// 兼容保留，不要用
const getSelectedIndexs = function() {
    return this.getSelectedIndices();
};

/**
 * 获取选中行的数据信息
 * @memberof DataTable
 * @param  {boolean} [withEmptyRow=false] 未选中的数据是否使用空行代替，true表示以空行代替未选中行，false相反
 * @return {array}            发生变化的数据信息
 * @example
 * datatable.getSelectedDatas()
 * datatable.getSelectedDatas(true)
 */
const getSelectedDatas = function(withEmptyRow) {
    var selectedIndices = this.selectedIndices();
    var datas = [];
    var sIndices = [];
    for (var i = 0, count = selectedIndices.length; i < count; i++) {
        sIndices.push(selectedIndices[i]);
    }
    var rows = this.rows();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (sIndices.indexOf(i) != -1)
            datas.push(rows[i].getData());
        else if (withEmptyRow == true)
            datas.push(rows[i].getEmptyData());
    }
    return datas
};

/**
 * 获取选中的Row对象
 * @memberof DataTable
 * @return {array} 选中的Row对象
 * @example
 * datatable.getSelectedRows()
 */
const getSelectedRows = function() {
    var selectedIndices = this.selectedIndices();
    var selectRows = [];
    var rows = this.rows.peek();
    var sIndices = [];
    for (var i = 0, count = selectedIndices.length; i < count; i++) {
        sIndices.push(selectedIndices[i]);
    }
    for (var i = 0, count = rows.length; i < count; i++) {
        if (sIndices.indexOf(i) != -1)
            selectRows.push(rows[i]);
    }
    return selectRows
};

const getSelectFunObj = {
    getSelectedIndex: getSelectedIndex,
    getSelectedIndices: getSelectedIndices,
    getSelectedIndexs: getSelectedIndexs,
    getSelectedDatas: getSelectedDatas,
    getSelectedRows: getSelectedRows
};

/**
 * Module : kero dataTable getSimpleData
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-08-01 14:34:01
 */

/**
 * 获取数据信息，只获取字段名与字段值
 * @memberof DataTable
 * @param  {object} [options] [description]
 * @param  {string} [options.type=all]    获取数据的规则
 * all：所有数据
 * current：当前行数据
 * focus：焦点行数据
 * select：选中行数据
 * change：发生改变的数据
 * @param  {array} [options.fields]    需要获取数据的字段名数组
 * @return {array}        获取到的数据信息
 * @example
 * datatable.getSimpleData() // 获取所有数据信息
 * datatable.getSimpleData({type:'current'}) // 获取当前行数据信息
 * datatable.getSimpleData({type:'current','fields':['filed1','field3']}) // 获取当前行field1和filed3数据信息
 */
const getSimpleData = function(options) {
    options = options || {};
    var rows, _rowData = [],
        type = options['type'] || 'all',
        fields = options['fields'] || null;

    if (type === 'current') {
        var currRow = this.getCurrentRow();
        rows = currRow == null ? [] : [currRow];
    } else if (type === 'focus') {
        var focusRow = this.getFocusRow();
        rows = focusRow == null ? [] : [focusRow];
    } else {
        if (this.pageCache) {
            var pages = this.getPages();
            rows = [];
            for (var i = 0; i < pages.length; i++) {
                var page = pages[i];
                if (type === 'all') {
                    rows = rows.concat(page.rows.peek());
                }else if(type === 'select') {
                    rows = rows.concat(page.getSelectRows());
                } else if (type === 'change') {
                    rows = rows.concat(page.getSelectRows());
                }
            }
        } else {
            if (type === 'all') {
                rows = this.rows.peek();
            } else if (type === 'select') {
                rows = this.getSelectedRows();
            } else if (type === 'change') {
                rows = this.getChangedRows();
            }
        }
    }

    for (var i = 0; i < rows.length; i++) {
        _rowData.push(rows[i].getSimpleData({
            fields: fields
        }));
    }
    if (_rowData.length == 0) {
        _rowData = this.setSimpleDataReal; //云采提的#需求
    }
    return _rowData;
};



const getSimpleDataFunObj = {
    getSimpleData: getSimpleData
};

/**
 * Module : kero dataTable mete
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-07-30 14:34:01
 */


/**
 * 设置meta信息
 * @memberof DataTable
 * @param {string} fieldName 需要设置meta信息的字段名
 * @param {string} key       meta信息的key
 * @param {string} value     meta信息的值
 * @example
 * datatable.setMeta('filed1','type','string')
 */
const setMeta = function(fieldName, key, value) {
    if (!this.meta[fieldName])
        return;
    var oldValue = this.meta[fieldName][key];
    var currRow = this.getCurrentRow();
    this.meta[fieldName][key] = value;
    if (this.metaChange[fieldName + '.' + key])
        this.metaChange[fieldName + '.' + key](-this.metaChange[fieldName + '.' + key]());
    if (key == 'enable')
        this.enableChange(-this.enableChange());
    this.trigger(DataTable.ON_META_CHANGE, {
        eventType: 'dataTableEvent',
        dataTable: this.id,
        field: fieldName,
        meta: key,
        oldValue: oldValue,
        newValue: value
    });
    if (currRow && !currRow.getMeta(fieldName, key, false)) {
        this.trigger(fieldName + '.' + key + '.' + DataTable.ON_CURRENT_META_CHANGE, {
            eventType: 'dataTableEvent',
            dataTable: this.id,
            oldValue: oldValue,
            newValue: value
        });
    }
};


/**
 * 更新meta信息
 * @memberof DataTable
 * @param  {object} meta 需要更新的meta信息
 * @example
 * var metaObj = {supplier: {meta: {precision:'3', default: '0239900x', display:'显示名称'}}}
 * datatable.updateMeta(metaObj)
 */
const updateMeta = function(meta) {
    if (!meta) {
        return;
    }
    for (var fieldKey in meta) {
        for (var propKey in meta[fieldKey]) {
            var oldValue = this.meta[fieldKey][propKey];
            var newValue = meta[fieldKey][propKey];
            if (propKey === 'default') {
                if (!this.meta[fieldKey]['default']) {
                    this.meta[fieldKey]['default'] = {};
                }
                this.meta[fieldKey]['default'].value = meta[fieldKey][propKey];
            } else if (propKey === 'display') {
                if (!this.meta[fieldKey]['default']) {
                    this.meta[fieldKey]['default'] = {};
                }
                this.meta[fieldKey]['default'].display = meta[fieldKey][propKey];
            } else {
                this.meta[fieldKey][propKey] = meta[fieldKey][propKey];
            }
            if (this.metaChange[fieldKey + '.' + propKey])
                this.metaChange[fieldKey + '.' + propKey](-this.metaChange[fieldKey + '.' + propKey]());

            this.trigger(DataTable.ON_META_CHANGE, {
                eventType: 'dataTableEvent',
                dataTable: this.id,
                field: fieldKey,
                meta: propKey,
                oldValue: oldValue,
                newValue: newValue
            });
        }

    }
};




// 字段不存在时创建字段，fieldName为需要创建的字段
// options.meta为对应的meta信息
const createField = function(fieldName, options) {
    //字段不主动定义，则不创建
    if (this.root.strict == true)
        return;
    //有子表的情况不创建字段
    if (fieldName.indexOf('.') != -1) {
        var fNames = fieldName.split('.');
        var _name = fNames[0];
        for (var i = 0, count = fNames.length; i < count; i++) {
            if (this.meta[_name] && this.meta[_name]['type'] === 'child')
                return;
            if ((i + 1) < count)
                _name = _name + '.' + fNames[i + 1];
        }
    }
    if (!this.meta[fieldName]) {
        this.meta[fieldName] = {};
    }
    if (typeof options === 'object') {
        if (options['meta']) {
            for (var key in options['meta']) {
                //if (!this.meta[fieldName][key]){
                this.meta[fieldName]['meta'][key] = options['meta'][key];
                //}
            }
        } else {
            for (var key in options) {
                //if (!this.meta[fieldName][key]){
                this.meta[fieldName][key] = options[key];
                //}
            }
        }
    }
    // 在顶层dataTable上定义field信息
    if (this.root !== this) {
        var nsArr = this.ns.split('.');
        var _fieldMeta = this.root.meta;
        for (var i = 0; i < nsArr.length; i++) {
            _fieldMeta[nsArr[i]] = _fieldMeta[nsArr[i]] || {};
            _fieldMeta[nsArr[i]]['type'] = _fieldMeta[nsArr[i]]['type'] || 'child';
            _fieldMeta[nsArr[i]]['meta'] = _fieldMeta[nsArr[i]]['meta'] || {};
            _fieldMeta = _fieldMeta[nsArr[i]]['meta'];
        }
        if (!_fieldMeta[fieldName]) {
            _fieldMeta[fieldName] = {};
        }
        if (typeof options === 'object') {
            for (var key in options) {
                if (!_fieldMeta[fieldName][key]) {
                    _fieldMeta[fieldName][key] = options[key];
                }
            }
        }
    }

};

const metaFunObj = {
    setMeta: setMeta,
    updateMeta: updateMeta,
    createField: createField
};

/**
 * Module : kero dataTable page
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-08-01 14:34:01
 */

// 设置当前页
const setCurrentPage = function(pageIndex, notCacheCurrentPage) {
    var nowTotalRow = this.totalRow();
    if (pageIndex != this.pageIndex() && notCacheCurrentPage != true)
        this.cacheCurrentPage();
    this.pageIndex(pageIndex);
    var cachedPage = this.cachedPages[this.pageIndex()];
    if (cachedPage) {
        // 取当前页的选中行重设选中行
        var selectedIndices = cachedPage.selectedIndices;
        this.removeAllRows();
        this.setRows(cachedPage.rows);
        this.setRowsSelect(selectedIndices);
    }
    this.totalRow(nowTotalRow);
};


// 更新分页信息，通过fire调用，不对外提供
const updatePages = function(pages) {
    var pageSize = this.pageSize(),
        pageIndex = 0,
        page, r, row;
    var page, index, i, rows, focus, selectIndices, status, j, row, originRow;
    for (i = 0; i < pages.length; i++) {
        index = pages[i].index;
        rows = pages[i].rows;
        focus = pages[i].current;
        selectIndices = pages[i].select;
        status = pages[i].status;
        if (status === 'del') {
            this.cachedPages[index] = null;
            continue;
        }
        if (!this.cachedPages[index]) {
            page = new Page({
                parent: this
            });
            page.rows = rows;
            for (var j = 0; j < page.rows.length; j++) {
                page.rows[j].rowId = page.rows[j].id;
                delete page.rows[j].id;
            }
            this.cachedPages[index] = page;
            page.selectedIndices = selectIndices;
            page.focus = focus;
        } else {
            page = this.cachedPages[index];
            page.selectedIndices = selectIndices;
            page.focus = focus;
            for (var j = 0; j < rows.length; j++) {
                r = rows[j];
                if (!r.id)
                    r.id = Row.getRandomRowId();
                if (r.status == Row.STATUS.DELETE) {

                    var row = page.getRowByRowId(r.id);
                    if (row) {
                        // 针对后台不传回总行数的情况下更新总行数
                        var oldTotalRow = this.totalRow();
                        var newTotalRow = oldTotalRow - 1;
                        this.totalRow(newTotalRow);
                        if (row.status == Row.STATUS.NEW) {
                            this.newCount -= 1;
                            if (this.newCount < 0)
                                this.newCount = 0;
                        }
                    }
                    this.removeRowByRowId(r.id);
                    page.removeRowByRowId(r.id);

                } else {
                    row = page.getRowByRowId(r.id);
                    if (row) {
                        page.updateRow(row, r);
                        // if(row.status == Row.STATUS.NEW){
                        //     // 针对后台不传回总行数的情况下更新总行数
                        //     var oldTotalRow = this.totalRow();
                        //     var newTotalRow = oldTotalRow + 1;
                        //     this.totalRow(newTotalRow);
                        // }
                        if (row.status == Row.STATUS.NEW && r.status != Row.STATUS.NEW) {
                            this.newCount -= 1;
                            if (this.newCount < 0)
                                this.newCount = 0;
                        }
                        row.setStatus(Row.STATUS.NORMAL);
                        if (r.status == Row.STATUS.NEW) {
                            row.setStatus(Row.STATUS.NEW);
                        }
                    } else {
                        r.rowId = r.id;
                        delete r.id;
                        page.rows.push(r);
                        if (r.status != Row.STATUS.NEW) {
                            row.setStatus(Row.STATUS.NORMAL);
                        } else {
                            this.newCount += 1;
                        }
                        // 针对后台不传回总行数的情况下更新总行数
                        var oldTotalRow = this.totalRow();
                        var newTotalRow = oldTotalRow + 1;
                        this.totalRow(newTotalRow);
                    }
                }
            }
        }

    }
};

// 前端分页方法，不建议使用，建议在后端进行分页
const setPages = function(allRows) {
    var pageSize = this.pageSize(),
        pageIndex = 0,
        page;
    this.cachedPages = [];
    for (var i = 0; i < allRows.length; i++) {
        pageIndex = Math.floor(i / pageSize);
        if (!this.cachedPages[pageIndex]) {
            page = new Page({
                parent: this
            });
            this.cachedPages[pageIndex] = page;
        }
        page.rows.push(allRows[i]);
    }
    if (this.pageIndex() > -1)
        this.setCurrentPage(this.pageIndex());
    this.totalRow(allRows.length);
    this.totalPages(pageIndex + 1);
};

// 判断是否存在索引对应的Page
const hasPage = function(pageIndex) {
    return (this.pageCache && this.cachedPages[pageIndex]) ? true : false
};

// 清空cachedPages
const clearCache = function() {
    this.cachedPages = [];
};

// 更新当前分页的page对象
const cacheCurrentPage = function() {
    if (this.pageCache && this.pageIndex() > -1) {
        var page = new Page({
            parent: this
        });
        page.focus = this.getFocusIndex();
        page.selectedIndices = this.selectedIndices().slice();
        var rows = this.rows.peek();
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i].getData();
            r.rowId = r.id;
            delete r.id;
            page.rows.push(r);
        }
        this.cachedPages[this.pageIndex()] = page;
    }
};

//根据datatable的选中行更新每页的选中行
const updatePagesSelect = function() {
    var selectRows = this.getSelectedRows();
    var pages = this.getPages();
    for (var i = 0; i < pages.length; i++) {
        var rows = pages[i].rows;
        var selectedIndices = [];
        for (var j = 0; j < selectRows.length; j++) {
            var nowSelectRow = selectRows[j];
            for (var k = 0; k < rows.length; k++) {
                var row = rows[k];
                if (nowSelectRow == row) {
                    selectedIndices.push(k);
                    break;
                }
            }
        }
        pages[i].selectedIndices = selectedIndices;
    }

};


//根据datatable的rows更新当前页的rows
const updatePageRows = function() {
    if (this.pageCache) {
        var pageIndex = this.pageIndex();
        var page = this.getPages()[pageIndex];
        if (page) {
            page.rows = this.rows();
        }
    }
};

//根据datatable的选中行更新page的选中行
const updatePageSelect = function() {
    if (this.pageCache) {
        var pageIndex = this.pageIndex();
        var page = this.getPages()[pageIndex];
        if (page) {
            var selectedIndices = this.selectedIndices().slice();
            page.selectedIndices = selectedIndices;
        }
    }
};

//根据datatable的focus更新page的focus
const updatePageFocus = function() {
    if (this.pageCache) {
        var pageIndex = this.pageIndex();
        var page = this.getPages()[pageIndex];
        if (page) {
            page.focus = this.getFocusIndex();
        }
    }
};

// 根据datatable更新page对象
const updatePageAll = function() {
    this.updatePageRows();
    this.updatePageSelect();
    this.updatePageFocus();
};


const pageFunObj = {
    setCurrentPage: setCurrentPage,
    updatePages: updatePages,
    setPages: setPages,
    hasPage: hasPage,
    clearCache: clearCache,
    cacheCurrentPage: cacheCurrentPage,
    updatePagesSelect: updatePagesSelect,
    updatePageRows: updatePageRows,
    updatePageSelect: updatePageSelect,
    updatePageFocus: updatePageFocus,
    updatePageAll: updatePageAll
};

/**
 * Module : kero dataTable param
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-07-30 14:34:01
 */

/**
 * 增加Param参数
 * @memberof DataTable
 * @param {string} key   需要增加的key值
 * @param {*} value 需要增加的具体指
 * @example
 * datatable.addParam('precision','3')
 */
const addParam = function(key, value) {
    this.params[key] = value;
};

/**
 * 增加多个Param参数
 * @memberof DataTable
 * @param {object} params 需要增加的Param对象
 * @example
 * var paramsObj = {
 *  'precision':'3',
 *  'default':'1.234'
 * }
 * datatable.addParams(paramsObj)
 */
const addParams = function(params) {
    for (var key in params) {
        this.params[key] = params[key];
    }
};


const paramFunObj = {
    addParam: addParam,
    addParams: addParams
};

/**
 * Module : kero dataTable ref
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-01 14:34:01
 */

/**
 * 为选中行绑定监听，当选中行发生改变时触发对应方法
 * @memberof DataTable
 * @param {string} fieldName 绑定的字段名
 * @example
 * datatable.refSelectedRows().subscribe(function(){})
 */
const refSelectedRows = function() {
    return ko.pureComputed({
        read: function() {
            var ins = this.selectedIndices() || [];
            var rs = this.rows();
            var selectedRows = [];
            for (var i = 0; i < ins.length; i++) {
                selectedRows.push(rs[i]);
            }
            return selectedRows
        },
        owner: this
    })
};


/**
 * 为某个字段绑定监听，当字段发生改变时触发对应方法
 * @memberof DataTable
 * @param {string} fieldName 绑定的字段名
 * @example
 * datatable.ref('field1').subscribe(function(){})
 */
const ref = function(fieldName) {
    this.createField(fieldName);
    if (!this.valueChange[fieldName])
        this.valueChange[fieldName] = ko.observable(1);
    return ko.pureComputed({
        read: function() {
            this.valueChange[fieldName]();
            this.currentRowChange();
            var row = this.getCurrentRow();
            if (row) {
                return row.getChildValue(fieldName)
            } else
                return ''
        },
        write: function(value) {
            var row = this.getCurrentRow();
            if (row)
                row.setChildValue(fieldName, value);
        },
        owner: this
    })
};

/**
 * 绑定字段属性，当字段属性发生改变时触发对应方法
 * @memberof DataTable
 * @param {string} fieldName 绑定的字段名
 * @param {string} key 绑定的属性key
 * @example
 * datatable.refMeta('field1','type').subscribe(function(){})
 */
const refMeta = function(fieldName, key) {
    if (!this.metaChange[fieldName + '.' + key])
        this.metaChange[fieldName + '.' + key] = ko.observable(1);
    return ko.pureComputed({
        read: function() {
            this.metaChange[fieldName + '.' + key]();
            this.currentRowChange();
            return this.getMeta(fieldName, key)
        },
        write: function(value) {
            this.setMeta(fieldName, key, value);
        },
        owner: this
    })
};

/**
 * 绑定当前行的字段属性，当字段属性发生改变时触发对应方法
 * @memberof DataTable
 * @param {string} fieldName 绑定的字段名
 * @param {string} key 绑定的属性key
 * @example
 * datatable.refRowMeta('field1','type').subscribe(function(){})
 */
const refRowMeta = function(fieldName, key) {
    if (!this.metaChange[fieldName + '.' + key])
        this.metaChange[fieldName + '.' + key] = ko.observable(1);
    return ko.pureComputed({
        read: function() {
            this.metaChange[fieldName + '.' + key]();
            this.currentRowChange();
            var row = this.getCurrentRow();
            if (row)
                return row.getMeta(fieldName, key)
            else
                return this.getMeta(fieldName, key)
        },
        write: function(value) {
            var row = this.getCurrentRow();
            if (row)
                row.setMeta(fieldName, value);
        },
        owner: this
    })
};

/**
 * 绑定字段是否可修改属性，当字段可修改属性发生改变时触发对应方法
 * @memberof DataTable
 * @param {string} fieldName 绑定的字段名
 * @example
 * datatable.refEnable('field1').subscribe(function(){})
 */
const refEnable = function(fieldName) {
    return ko.pureComputed({
        //enable优先级： dataTable.enable >  row上的enable >  field中的enable定义
        read: function() {
            this.enableChange();
            if (!fieldName)
                return this.enable;
            var fieldEnable = this.getRowMeta(fieldName, 'enable');
            if (typeof fieldEnable == 'undefined' || fieldEnable == null)
                fieldEnable = true;
            return fieldEnable && this.enable
        },
        owner: this
    })
};

const refFunObj = {
    refSelectedRows: refSelectedRows,
    ref: ref,
    refMeta: refMeta,
    refRowMeta: refRowMeta,
    refEnable: refEnable
};

/**
 * Module : kero dataTable util
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-08 09:59:01
 */
// 判断DataTable对象是否发生了改变
const isChanged = function() {
    var rows = this.getAllRows();
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].status != Row.STATUS.NORMAL)
            return true
    }
    return false
};

// 将Row对象转为索引数组或者将Row对象数组转为索引数组
const _formatToIndicesArray = function(dataTableObj, indices) {
    if (typeof indices == 'string' || typeof indices == 'number') {
        indices = [indices];
    } else if (indices instanceof Row) {
        indices = [dataTableObj.getIndexByRowId(indices.rowId)];
    } else if (isArray(indices) && indices.length > 0 && indices[0] instanceof Row) {
        for (var i = 0; i < indices.length; i++) {
            indices[i] = dataTableObj.getIndexByRowId(indices[i].rowId);
        }
    }
    return indices;
};

const utilFunObj = {
    isChanged: isChanged,
    _formatToIndicesArray: _formatToIndicesArray

};

/**
 * Module : kero dataTable removeRow
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-01 14:34:01
 */
/**
 * 根据rowId删除指定行
 * @memberof DataTable
 * @param  {string} rowId 需要删除行的rowId
 * @example
 * datatable.removeRowByRowId('rowid1')
 */
const removeRowByRowId = function(rowId) {
    var index = this.getIndexByRowId(rowId);
    if (index != -1)
        this.removeRow(index);
};

/**
 *根据索引删除指定行
 * @memberof DataTable
 * @param  {number} index 需要删除行的索引
 * @example
 * datatable.removeRow(1)
 */
const removeRow = function(index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId);
    }
    this.removeRows([index]);
};

/**
 * 删除所有行
 * @memberof DataTable
 * @example
 * datatable.removeAllRows();
 */
const removeAllRows = function() {
    this.rows([]);
    this.selectedIndices([]);
    this.focusIndex(-1);
    this.trigger(DataTable.ON_DELETE_ALL);
    this.updateCurrIndex();
};

/**
 * 根据索引数据删除多条数据行
 * @memberof DataTable
 * @param  {array} indices 需要删除的数据行对应数组，数组中既可以是索引也可以是row对象
 * @example
 * datatable.removeRows([1,2])
 * datatable.removeRows([row1,row2])
 */
const removeRows = function(indices) {
    this.setRowsDelete(indices);
};


/**
 * 清空datatable的所有数据以及分页数据以及index
 * @memberof DataTable
 * @example
 * datatable.clear()
 */
const clear = function() {
    this.removeAllRows();
    this.cachedPages = [];
    this.totalPages(1);
    this.pageIndex(0);
    this.focusIndex(-1);
    this.selectedIndices([]);
};

const removeRowFunObj = {
    removeRowByRowId: removeRowByRowId,
    removeRow: removeRow,
    removeAllRows: removeAllRows,
    removeRows: removeRows,
    clear: clear
};

/**
 * Module : kero dataTable row
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-08-01 14:34:01
 */
// 添加数据，建议使用setData或者setSimpleData
const setRows = function(rows, options) {
    var insertRows = [],
        _id;
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        _id = r.rowId || r.id;
        if (!_id)
            _id = Row.getRandomRowId();
        if (r.status == Row.STATUS.DELETE) {
            this.removeRowByRowId(_id);
        } else {
            var row = this.getRowByRowId(_id);
            if (row) {
                row.updateRow(r);
                if (!isEmptyObject(r.data)) {
                    this.trigger(DataTable.ON_UPDATE, {
                        index: i,
                        rows: [row]
                    });
                    if (row == this.getCurrentRow()) {
                        this.currentRowChange(-this.currentRowChange());
                        row.currentRowChange(-row.currentRowChange());
                        this.trigger(DataTable.ON_CURRENT_UPDATE, {
                            index: i,
                            rows: [row]
                        });
                    } else {
                        row.currentRowChange(-row.currentRowChange());
                    }
                }

            } else {
                row = new Row({
                    parent: this,
                    id: _id
                });
                row.setData(rows[i], null, options);
                insertRows.push(row);
            }
            // 如果r对象中存在状态则更新状态为返回的状态
            if (r.status) {
                row.setStatus(r.status);
            }
        }
    }
    if (insertRows.length > 0)
        this.addRows(insertRows);
    return insertRows;
};


/**
 * 在最后位置添加一条数据行
 * @memberof DataTable
 * @param {u.Row} row 数据行
 * @example
 * var row1 = new Row({parent: datatable})
 * row1.setData({
 *  data:{
 *    field1: 'value1',
 *    field2: 'value2'
 *  }
 * })
 * datatable.addRow(row1)
 */
const addRow = function(row) {
    this.insertRow(this.rows().length, row);
    this.resetDelRowEnd();
};

const resetDelRowEnd = function() {
    for (var i = this.rows().length - 1; i > -1; i--) {
        var row = this.rows()[i];
        if (row.status == Row.STATUS.DELETE || row.status == Row.STATUS.FALSE_DELETE) {
            this.rows().splice(i, 1);
            this.rows().push(row);
        }
    }
};

/**
 * 在最后位置添加多条数据行
 * @memberof DataTable
 * @param {array} rows  数据行数组
 * @example
 * var row1 = new Row({parent: datatable})
 * row1.setData({
 *  data:{
 *    field1: 'value1',
 *    field2: 'value2'
 *  }
 * })
 * var row2 = new Row({parent: datatable})
 * row2.setData({
 *  data:{
 *    field1: 'value11',
 *    field2: 'value22'
 *  }
 * })
 * datatable.addRows([row1,row2])
 */
const addRows = function(rows) {
    this.insertRows(this.rows().length, rows);
    this.resetDelRowEnd();
};

/**
 * 在指定索引位置添加一条数据行
 * @memberof DataTable
 * @param  {number} index 指定索引
 * @param  {u.Row} row   数据行
 * @example
 * var row1 = new Row({parent: datatable})
 * row1.setData({
 *  data:{
 *    field1: 'value1',
 *    field2: 'value2'
 *  }
 * })
 * datatable.insertRow(1,row1)
 */
const insertRow = function(index, row) {
    if (!row) {
        row = new Row({
            parent: this
        });
    }
    this.insertRows(index, [row]);
};

/**
 * 在指定索引位置添加多条数据行
 * @memberof DataTable
 * @param  {number} index 指定索引
 * @param  {array} rows  数据行数组
 * var row1 = new Row({parent: datatable})
 * row1.setData({
 *  data:{
 *    field1: 'value1',
 *    field2: 'value2'
 *  }
 * })
 * var row2 = new Row({parent: datatable})
 * row2.setData({
 *  data:{
 *    field1: 'value11',
 *    field2: 'value22'
 *  }
 * })
 * datatable.insertRows(1,[row1,row2])
 */
const insertRows = function(index, rows) {
    var args = [index, 0];
    for (var i = 0; i < rows.length; i++) {
        args.push(rows[i]);
    }
    this.rows.splice.apply(this.rows, args);

    this.updateSelectedIndices(index, '+', rows.length);
    this.updateFocusIndex(index, '+', rows.length);
    this.updatePageAll();
    this.trigger(DataTable.ON_INSERT, {
        index: index,
        rows: rows
    });
    if (this.ns) {
        if (this.root.valueChange[this.ns])
            this.root.valueChange[this.ns](-this.root.valueChange[this.ns]());
    }
};

/**
 * 创建空行
 * @memberof DataTable
 * @return {u.Row} 空行对象
 * @example
 * datatable.createEmptyRow();
 * datatable.createEmptyRow({unSelect:true})
 */
const createEmptyRow = function(options) {
    var r = new Row({
        parent: this
    });
    this.addRow(r);
    var unSelect = options ? options.unSelect : false;
    if (!unSelect) {
        if (!this.getCurrentRow())
            this.setRowSelect(r);
    }
    return r
};

const rowFunObj = {
    setRows: setRows,
    addRow: addRow,
    addRows: addRows,
    insertRow: insertRow,
    insertRows: insertRows,
    createEmptyRow: createEmptyRow,
    resetDelRowEnd: resetDelRowEnd
};

/***
 * Module : kero dataTable rowCurrent
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-08 09:59:01
 */



// 更新当前行对应索引
const updateCurrIndex = function() {
    var currentIndex = this.focusIndex() != -1 ? this.focusIndex() : this.getSelectedIndex();
    if (this._oldCurrentIndex != currentIndex) {
        this._oldCurrentIndex = currentIndex;
        this.trigger(DataTable.ON_CURRENT_ROW_CHANGE);
        this.currentRowChange(-this.currentRowChange());
        if (this.ns) {
            if (this.root.valueChange[this.ns])
                this.root.valueChange[this.ns](-this.root.valueChange[this.ns]());
        }
    }
};

const rowCurrentFunObj = {
    updateCurrIndex: updateCurrIndex
};

/**
 * Module : kero dataTable rowDelete
 * Desc: 不建议使用此库方法
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-01 14:34:01
 */
/***
 * 根据索引删除数据行
 * @param {number} index 需要删除数据行的索引
 */
const setRowDelete = function(index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId);
    }
    this.setRowsDelete([index]);
};

/***
 * 删除所有数据行
 */
const setAllRowsDelete = function() {
    var indices = new Array(this.rows().length);
    for (var i = 0; i < indices.length; i++) {
        indices[i] = i;
    }
    this.setRowsDelete(indices);
};

/***
 * 根据索引数组删除数据行
 * @param {Array} indices 需要删除数据行的索引数组
 */
const setRowsDelete = function(indices) {
    indices = utilFunObj._formatToIndicesArray(this, indices);
    indices = indices.sort(function(a, b) {
        return b - a;
    });
    var rowIds = this.getRowIdsByIndices(indices);
    var rows = this.getRowsByIndices(indices);
    var ros = this.rows();
    for (var i = 0; i < indices.length; i++) {
        var row = this.getRow(indices[i]);
        if (row.status == Row.STATUS.NEW || this.forceDel) {
            ros.splice(indices[i], 1);
        } else {
            row.setStatus(Row.STATUS.FALSE_DELETE);
            var temprows = ros.splice(indices[i], 1);
            ros.push(temprows[0]);
        }
        this.updateSelectedIndices(indices[i], '-');
        this.updateFocusIndex(indices[i], '-');
    }
    this.rows(ros);
    this.updateCurrIndex();
    this.trigger(DataTable.ON_DELETE, {
        falseDelete: true,
        indices: indices,
        rowIds: rowIds,
        rows: rows
    });

};

const rowDeleteFunObj = {
    setRowDelete: setRowDelete,
    setAllRowsDelete: setAllRowsDelete,
    setRowsDelete: setRowsDelete
};

/**
 * Module : kero dataTable rowSelect
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-01 14:34:01
 */
/**
 * 设置所有行选中
 * @memberof DataTable
 * @example
 * datatable.setAllRowsSelect()
 */
const setAllRowsSelect = function() {
    var indices = new Array(this.rows().length);
    for (var i = 0; i < indices.length; i++) {
        indices[i] = i;
    }
    this.setRowsSelect(indices);
    this.allSelected(true);
    this.trigger(DataTable.ON_ROW_ALLSELECT, {});
};

/**
 * 根据索引设置选中行，清空之前已选中的所有行
 * @memberof DataTable
 * @param {number} index 需要选中行的索引
 * @example
 * datatable.setRowSelect(1)
 */
const setRowSelect = function(index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId);
    }
    this.setRowsSelect([index]);
    this.setRowFocus(this.getSelectedIndex());
};

/**
 * 根据索引数组设置选中行，清空之前已选中的所有行
 * @memberof DataTable
 * @param {array} indices 需要选中行的索引数组
 * @example
 * datatable.setRowsSelect([1,2])
 */
const setRowsSelect = function(indices) {
    indices = indices || -1;
    if (indices == -1) {
        this.setAllRowsUnSelect({
            quiet: true
        });
        return;
    }
    indices = utilFunObj._formatToIndicesArray(this, indices);
    var sIns = this.selectedIndices();
    if (isArray(indices) && isArray(sIns) && indices.join() == sIns.join()) {
        // 避免与控件循环触发
        return;
    }

    if (isArray(indices)) {
        var rowNum = this.rows().length;
        for (var i = 0; i < indices.length; i++) {
            if (indices[i] < 0 || indices[i] >= rowNum)
                indices.splice(i, 1);
        }
    }

    this.setAllRowsUnSelect({
        quiet: true
    });
    try {
        this.selectedIndices(indices);
    } catch (e) {

    }
    this.updatePageSelect();
    var rowIds = this.getRowIdsByIndices(indices);
    this.currentRowChange(-this.currentRowChange());
    this.trigger(DataTable.ON_ROW_SELECT, {
        indices: indices,
        rowIds: rowIds
    });
    this.updateCurrIndex();

};


/**
 * 根据索引添加选中行，不会清空之前已选中的行
 * @memberof DataTable
 * @param {number} index 需要选中行的索引
 * @example
 * datatable.addRowSelect(1)
 */
const addRowSelect = function(index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId);
    }
    this.addRowsSelect([index]);
};

/**
 * 根据索引数组添加选中行，不会清空之前已选中的行
 * @memberof DataTable
 * @param {array} indices 需要选中行的索引数组
 * @example
 * datatabel.addRowsSelect([1,2])
 */
const addRowsSelect = function(indices) {
    indices = utilFunObj._formatToIndicesArray(this, indices);
    var selectedIndices = this.selectedIndices().slice();
    var needTrigger = false;
    for (var i = 0; i < indices.length; i++) {
        var ind = indices[i],
            toAdd = true;
        for (var j = 0; j < selectedIndices.length; j++) {
            if (selectedIndices[j] == ind) {
                toAdd = false;
            }
        }
        //indices[i]存在并且大于-1
        if (toAdd && indices[i] > -1) {
            needTrigger = true;
            selectedIndices.push(indices[i]);
        }
    }
    this.selectedIndices(selectedIndices);
    this.updatePageSelect();
    var rowIds = this.getRowIdsByIndices(selectedIndices);
    if (needTrigger) {
        this.trigger(DataTable.ON_ROW_SELECT, {
            indices: selectedIndices,
            rowIds: rowIds
        });
    }
    this.updateCurrIndex();

};

/**
 * 全部取消选中
 * @memberof DataTable
 * @param {object} [options] 可选参数
 * @param {boolean} [options.quiet] 如果为true则不触发事件，否则触发事件
 * @example
 * datatable.setAllRowsUnSelect() // 全部取消选中
 * datatable.setAllRowsUnSelect({quiet:true}) // 全部取消选中,不触发事件
 */
const setAllRowsUnSelect = function(options) {
    this.selectedIndices([]);
    this.updatePageSelect();
    if (!(options && options.quiet)) {
        this.trigger(DataTable.ON_ROW_ALLUNSELECT);
    }
    this.updateCurrIndex();
    this.allSelected(false);
};

/**
 * 根据索引取消选中
 * @memberof DataTable
 * @param {number} index 需要取消选中的行索引
 * @example
 * datatable.setRowUnSelect(1)
 */
const setRowUnSelect = function(index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId);
    }
    this.setRowsUnSelect([index]);
};

/**
 * 根据索引数组取消选中
 * @memberof DataTable
 * @param {array} indices 需要取消选中的行索引数组
 * @example
 * datatable.setRowsUnSelect([1,2])
 */
const setRowsUnSelect = function(indices) {
    indices = utilFunObj._formatToIndicesArray(this, indices);
    var selectedIndices = this.selectedIndices().slice();

    // 避免与控件循环触发
    if (selectedIndices.indexOf(indices[0]) == -1) return;

    for (var i = 0; i < indices.length; i++) {
        var index = indices[i];
        var pos = selectedIndices.indexOf(index);
        if (pos != -1)
            selectedIndices.splice(pos, 1);
    }
    this.selectedIndices(selectedIndices);
    this.updatePageSelect();
    var rowIds = this.getRowIdsByIndices(indices);
    this.trigger(DataTable.ON_ROW_UNSELECT, {
        indices: indices,
        rowIds: rowIds
    });
    this.updateCurrIndex();
    this.allSelected(false);
};

/**
 * 当全部选中时取消选中，否则全部选中
 * @memberof DataTable
 */
const toggleAllSelect = function() {
    if (this.allSelected()) {
        this.setAllRowsUnSelect();
    } else {
        this.setAllRowsSelect();
    }

};


/***
 * 数据行发生改变时更新focusindex
 * @memberof DataTable
 * @param  {number} index 发生改变的数据行位置
 * @param  {string} type  +表示新增行，-表示减少行
 * @param  {number} num     新增/减少的行数
 */
const updateSelectedIndices = function(index, type, num) {
    if (!isNumber$1(num)) {
        num = 1;
    }
    var selectedIndices = this.selectedIndices().slice();
    if (selectedIndices == null || selectedIndices.length == 0)
        return
    for (var i = 0, count = selectedIndices.length; i < count; i++) {
        if (type == '+') {
            if (selectedIndices[i] >= index)
                selectedIndices[i] = parseInt(selectedIndices[i]) + num;
        } else if (type == '-') {
            if (selectedIndices[i] >= index && selectedIndices[i] <= index + num - 1) {
                selectedIndices.splice(i, 1);
            } else if (selectedIndices[i] > index + num - 1)
                selectedIndices[i] = selectedIndices[i] - num;
        }
    }
    this.selectedIndices(selectedIndices);
    this.updatePageSelect();
};
const rowSelectFunObj = {
    setAllRowsSelect: setAllRowsSelect,
    setRowSelect: setRowSelect,
    setRowsSelect: setRowsSelect,
    addRowSelect: addRowSelect,
    addRowsSelect: addRowsSelect,
    setAllRowsUnSelect: setAllRowsUnSelect,
    setRowUnSelect: setRowUnSelect,
    setRowsUnSelect: setRowsUnSelect,
    toggleAllSelect: toggleAllSelect,
    updateSelectedIndices: updateSelectedIndices
};

/**
 * Module : kero dataTable rowFocus
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-08 09:59:01
 */
/**
 * 设置焦点行
 * @memberof DataTable
 * @param {number|u.Row} index 行对象或者行index
 * @param {boolean} [quiet] 如果为true则不触发事件，否则触发事件
 * @param {boolean} [force] 如果为true当index行与已focus的行相等时，仍然触发事件，否则不触发事件
 * @example
 * datatable.setRowFocus(1) // 设置第二行为焦点行
 * datatable.setRowFocus(1,true) // 设置第二行为焦点行，不触发事件
 * datatable.setRowFocus(1,false,true) // 设置第二行为焦点行，如果当前焦点行为第二行，仍旧触发事件
 */
const setRowFocus = function(index, quiet, force) {
    var rowId = null;
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId);
        rowId = index.rowId;
    }
    if (index === -1 || (index === this.focusIndex() && !force)) {
        return;
    }
    this.focusIndex(index);
    if (quiet) {
        return;
    }
    this.currentRowChange(-this.currentRowChange());
    if (!rowId) {
        rowId = this.getRow(index).rowId;
    }
    this.trigger(DataTable.ON_ROW_FOCUS, {
        index: index,
        rowId: rowId
    });
    this.updateCurrIndex();
};


/**
 * 焦点行反选
 * @memberof DataTable
 * @example
 * datatable.setRowUnFocus()
 */
const setRowUnFocus = function() {
    this.currentRowChange(-this.currentRowChange());
    var indx = this.focusIndex(),
        rowId = null;
    if (indx !== -1) {
        rowId = this.getRow(indx).rowId;
    }
    this.trigger(DataTable.ON_ROW_UNFOCUS, {
        index: indx,
        rowId: rowId
    });
    this.focusIndex(-1);
    this.updateCurrIndex();
};

/***
 * 数据行发生改变时更新focusindex
 * @memberof DataTable
 * @param  {number} opIndex 发生改变的数据行位置
 * @param  {string} opType  +表示新增行，-表示减少行
 * @param  {number} num     新增/减少的行数
 *
 */
const updateFocusIndex = function(opIndex, opType, num) {
    if (!isNumber$1(num)) {
        num = 1;
    }
    if (opIndex <= this.focusIndex() && this.focusIndex() != -1) {
        if (opType === '+') {
            this.focusIndex(this.focusIndex() + num);
        } else if (opType === '-') {
            if (this.focusIndex() >= opIndex && this.focusIndex() <= opIndex + num - 1) {
                this.focusIndex(-1);
            } else if (this.focusIndex() > opIndex + num - 1) {
                this.focusIndex(this.focusIndex() - num);
            }
        }
    }
};

const rowFocusFunObj = {
    setRowFocus: setRowFocus,
    setRowUnFocus: setRowUnFocus,
    updateFocusIndex: updateFocusIndex
};

/**
 * Module : kero dataTable simpleData
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-08-01 14:34:01
 */
/**
 * 设置数据, 只设置字段值
 * @memberof DataTable
 * @param {array} data 数据信息
 * @param {boject} [options] 可配置参数
 * @param {boject} [options.unSelect=false] 是否默认选中第一行，如果为true则不选中第一行，否则选中第一行
 * @example
 * var data = [{
 *   filed1:'value1',
 *   field2:'value2'
 * },{
 *   filed1:'value11',
 *   field2:'value21'
 * }]
 * datatable.setSimpleData(data)
 * datatable.setSimpleData(data,{unSelect:true})
 */
const setSimpleData = function(data,options){
    this.removeAllRows();
    this.cachedPages = [];
    this.focusIndex(-1);
    this.selectedIndices([]);

    this.setSimpleDataReal = [];
    if (!data){
        this.setSimpleDataReal = data;
        // throw new Error("dataTable.setSimpleData param can't be null!");
        return;
    }

    var rows = [];
    if (!isArray(data))
        data = [data];
    for (var i =0; i< data.length; i++){
        var _data = data[i];
        /* 判断data中的字段在datatable中是否存在，如果不存在则创建 */
        // for(var f in _data){
        //     this.createField(f)
        // }
        if (typeof data[i] !== 'object')
            _data = {$data:data[i]};
        rows.push({
            status: Row.STATUS.NORMAL,
            data: _data
        });
    }
    var _data = {
        rows: rows
    };
    if(options) {
        if(typeof options.fieldFlag == 'undefined'){
            options.fieldFlag = true;
        }
    }
    this.setData(_data,options);
};


 /**
  * 追加数据, 只设置字段值
  * @memberof DataTable
  * @param {array} data 数据信息
  * @param {string} [status=nrm] 追加数据信息的状态，参照Row对象的状态介绍
  * @param {boject} [options] 可配置参数
  * @param {boject} [options.unSelect=false] 是否默认选中第一行，如果为true则不选中第一行，否则选中第一行
  * @example
  * var data = [{
  *   filed1:'value1',
  *   field2:'value2'
  * },{
  *   filed1:'value11',
  *   field2:'value21'
  * }]
  * datatable.addSimpleData(data,Row.STATUS.NEW)
  * datatable.addSimpleData(data, null, {unSelect:true})
  */
const addSimpleData = function(data, status, options){
    if (!data){
        throw new Error("dataTable.addSimpleData param can't be null!");
    }
    if (!isArray(data))
        data = [data];
    for (var i =0; i< data.length; i++){
        var r = this.createEmptyRow(options);
        r.setSimpleData(data[i],status);
    }

};

const simpleDataFunObj = {
	setSimpleData:setSimpleData,
	addSimpleData:addSimpleData
};

/**
 * Module : kero DataTable events
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-07-30 14:34:01
 */


/**
 * 为DataTable对象添加监听
 * @memberof DataTable
 * @param  {string|array|object}   name     针对不同用法分别对应监听名称、监听名称对应的数组、监听名称及对应的回调组成的对象
 * @param  {function} [callback] 监听对应的回调函数
 * @param  {boolean}   [one]      是否只执行一次监听，为true则表示只执行一次回调函数，否则每次触发监听都是执行回调函数
 * @return {DataTable}            当前的DataTable对象
 * @example
 * datatable.on(u.DataTable.ON_ROW_FOCUS, function() {}) // 普通
 * datatable.on([u.DataTable.ON_INSERT, u.DataTable.ON_DELETE], function() {}) // 数组
 * datatable.on({u.DataTable.ON_INSERT: function() {}, u.DataTable.ON_DELETE: function() {}}) // map
 */
const on$1 = function(name, callback, one) {
    var self = this,
        origCb = callback;
    if (Object.prototype.toString.call(name) == '[object Array]') {
        // 数组
        for (var i in name) {
            this.on(name[i], callback);
        }
        return this;
    } else if (typeof name == 'object') {
        // map
        for (var key in name) {
            this.on(key, name[key]);
        }
        return this;
    }
    if (one) {
        callback = function() {
            self.off(name, callback);
            origCb.apply(this, arguments);
        };
    }
    name = name.toLowerCase();
    this._events || (this._events = {});
    var events = this._events[name] || (this._events[name] = []);
    events.push({
        callback: callback
    });
    return this;
};

/**
 * 为DataTable对象取消监听
 * @memberof DataTable
 * @param  {string|array|object}   name     针对不同用法分别对应监听名称、监听名称对应的数组、监听名称及对应的回调组成的对象
 * @param  {function} [callback] 监听对应的回调函数
 * @return {DataTable}            当前的DataTable对象
 * @example
 * datatable.off(u.DataTable.ON_ROW_FOCUS, function() {}) // 普通
 * datatable.off([u.DataTable.ON_INSERT, u.DataTable.ON_DELETE], function() {}) // 数组
 * datatable.off({u.DataTable.ON_INSERT: function() {}, u.DataTable.ON_DELETE: function() {}}) // map
 */
const off$1 = function(name, callback) {
    name = name.toLowerCase();
    if (!this._events)
        return this;
    if (Object.prototype.toString.call(name) == '[object Array]') {
        // 数组
        for (var i in name) {
            this.off(name[i], callback);
        }
        return this;
    } else if (typeof name == 'object') {
        // map
        for (var key in name) {
            this.off(key, name[key]);
        }
        return this;
    }
    var cbs = this._events[name];
    if (!cbs) return this;
    if (!callback) {
        // 解绑所有事件
        cbs = null;
    } else {
        for (var i = cbs.length - 1; i >= 0; i--) {
            if (cbs[i] == callback) {
                cbs.splice(i, 1);
            }
        }
    }
    this._events[name] = cbs;
    return this;
};

/**
 * 为DataTable对象添加只执行一次的监听
 * @memberof DataTable
 * @param  {string|array|object}   name     针对不同用法分别对应监听名称、监听名称对应的数组、监听名称及对应的回调组成的对象
 * @param  {function} [callback] 监听对应的回调函数
 * @example
 * datatable.one(u.DataTable.ON_ROW_FOCUS, function() {}) // 普通
 * datatable.one([u.DataTable.ON_INSERT, u.DataTable.ON_DELETE], function() {}) // 数组
 * datatable.one({u.DataTable.ON_INSERT: function() {}, u.DataTable.ON_DELETE: function() {}}) // map
 */
const one = function(name, callback) {
    this.on(name, callback, 1);
};

/**
 * 触发DataTable对象绑定的事件监听
 * @memberof DataTable
 * @param  {string} name 需要触发的事件监听对应的名称
 * @return {DataTable}            当前的DataTable对象
 * @example
 * datatable.trigger('valuechange')
 */
const trigger$1 = function(name) {
    name = name.toLowerCase();
    if (!this._events || !this._events[name]) return this;
    var args = Array.prototype.slice.call(arguments, 1);
    var events = this._events[name];
    for (var i = 0, count = events.length; i < count; i++) {
        events[i].callback.apply(this, args);
    }
    return this;
};

// 带返回值的trigger，可以获取回调函数的返回值
const triggerReturn = function(name) {
    name = name.toLowerCase();
    if (!this._events || !this._events[name]) return this;
    var args = Array.prototype.slice.call(arguments, 1);
    var events = this._events[name];
    var flag = true;
    for (var i = 0, count = events.length; i < count; i++) {
        flag = flag && events[i].callback.apply(this, args);
    }
    return flag;
};

// 获取监听名称对应的回调函数
const getEvent = function(name) {
    name = name.toLowerCase();
    this._events || (this._events = {});
    return this._events[name]
};

const eventsFunObj = {
    on: on$1,
    off: off$1,
    one: one,
    trigger: trigger$1,
    triggerReturn: triggerReturn,
    getEvent: getEvent
};

/**
  * Module : Kero webpack entry dataTable index
  * Author : liuyk(liuyuekai@yonyou.com)
  * Date   : 2016-08-09 15:24:46
  */

 /**
  * DataTable
  * @namespace
  * @description 前端数据模型对象
  */
 class DataTable$1 {
     constructor(options) {
         options = options || {};
         /**
          * DataTable对应的唯一标识
          * @type {string}
          */
         this.id = options['id'];
         /**
          * 在设置数据时是否自动创建对应字段，如果为true则不自动创建，如果为false则自动创建缺失的字段
          * @type {boolean}
          * @default false
          */
         this.strict = options['strict'] || false;
         /**
          * DataTable的所有字段属性信息
          * @type {object}
          */
         this.meta = DataTable$1.createMetaItems(options['meta']);
         /**
          * DataTable的是否支持编辑功能
          * @type {boolean}
          * @default true
          */
         this.enable = options['enable'] || DataTable$1.DEFAULTS.enable;
         /**
          * DataTable支持翻页功能时每页显示数据条数
          * @type {number}
          * @default 20
          */
         this.pageSize = ko.observable(options['pageSize'] || DataTable$1.DEFAULTS.pageSize);
         /**
          * DataTable支持翻页功能时当前页码
          * @type {number}
          * @default 0
          */
         this.pageIndex = ko.observable(options['pageIndex'] || DataTable$1.DEFAULTS.pageIndex);
         /**
          * DataTable支持翻页功能时总页数
          * @type {number}
          * @default 0
          */
         this.totalPages = ko.observable(options['totalPages'] || DataTable$1.DEFAULTS.totalPages);
         // 存储所有行对象
         this.totalRow = ko.observable();
         /**
          * DataTable的是否支持前端缓存，支持前端缓存则前端会存储所有页的数据信息，否则只保存当前页的数据信息。如果使用前端缓存则需要使用框架封装的fire方法来与后台进行交互
          * @type {boolean}
          * @default false
          */
         this.pageCache = options['pageCache'] === undefined ? DataTable$1.DEFAULTS.pageCache : options['pageCache'];
         /**
          * DataTable删除数据时是否强制删除，如果设置为true则不再考虑数据的状态，执行删除时则删除此条数据。如果设置为false则需要考虑数据的状态，如果状态为new则删除此条数据否则将状态修改为fdel
          * @type {boolean}
          * @default false
          */
         this.forceDel = options['forceDel'] === undefined ? DataTable$1.DEFAULTS.forceDel : options['forceDel'];
         // 存储所有row对象
         this.rows = ko.observableArray([]);
         // 存储所有的选中行的index
         this.selectedIndices = ko.observableArray([]);
         // 原有的当前行，用于判断当前行是否发生变化
         this._oldCurrentIndex = -1;
         // 当前focus行
         this.focusIndex = ko.observable(-1);
         // 存储所有页对象
         this.cachedPages = [];
         // 存储meta改变信息
         this.metaChange = {};
         // 存储valuecahnge改变信息
         this.valueChange = {}; //ko.observable(1);
         // 监听当前行改变
         this.currentRowChange = ko.observable(1);
         // 监听是否可修改属性的改变
         this.enableChange = ko.observable(1);
         /**
          * 使用者自定义的属性合集，框架内部不会针对此属性进行特殊处理，仅用于设置及获取
          * @type {object}
          */
         this.params = options['params'] || {};
         /**
          * 使用者自定义的属性，框架内部不会针对此属性进行特殊处理，仅用于设置及获取。
          * @type {string}
          */
         this.master = options['master'] || '';
         // 监听是否全部选中
         this.allSelected = ko.observable(false);
         /**
          * 通过getSimpleData获取数据时，日期字段是否转化为long型，如果为true时不进行转化，为false时转化为long型
          * @type {boolean}
          * @default false
          */
         this.dateNoConvert = options['dateNoConvert'] || false;
         // 对于子表通过root字段存储根datatable对象
         if (options['root']) {
             this.root = options['root'];
         } else {
             this.root = this;
         }
         // 记录子表的路径
         if (options['ns']) {
             this.ns = options['ns'];
         } else {
             this.ns = '';
         }
         // 前端分页情况下记录前端新增的数据
         this.newCount = 0;
     }
 }

 var DataTableProto = DataTable$1.prototype;
 Object.assign(DataTableProto, copyRowFunObj);
 Object.assign(DataTableProto, dataFunObj);
 Object.assign(DataTableProto, enableFunObj);
 Object.assign(DataTableProto, getCurrentFunObj);
 Object.assign(DataTableProto, getDataFunObj);
 Object.assign(DataTableProto, getFocusFunObj);
 Object.assign(DataTableProto, getMetaFunObj);
 Object.assign(DataTableProto, getPageFunObj);
 Object.assign(DataTableProto, getParamFunObj);
 Object.assign(DataTableProto, getSelectFunObj);
 Object.assign(DataTableProto, getSimpleDataFunObj);
 Object.assign(DataTableProto, pageFunObj);
 Object.assign(DataTableProto, metaFunObj);
 Object.assign(DataTableProto, refFunObj);
 Object.assign(DataTableProto, paramFunObj);
 Object.assign(DataTableProto, rowFunObj);
 Object.assign(DataTableProto, removeRowFunObj);
 Object.assign(DataTableProto, rowCurrentFunObj);
 Object.assign(DataTableProto, simpleDataFunObj);
 Object.assign(DataTableProto, rowFocusFunObj);
 Object.assign(DataTableProto, eventsFunObj);
 Object.assign(DataTableProto, utilFunObj);
 Object.assign(DataTableProto, rowSelectFunObj);
 Object.assign(DataTableProto, rowDeleteFunObj);

 DataTable$1.DEFAULTS = {
     pageSize: 20,
     pageIndex: 0,
     totalPages: 0,
     pageCache: false,
     enable: true,
     forceDel: false
 };

 DataTable$1.META_DEFAULTS = {
     enable: true,
     required: false,
     descs: {}
 };

 //事件类型
 DataTable$1.ON_ROW_SELECT = 'select';
 DataTable$1.ON_ROW_UNSELECT = 'unSelect';
 DataTable$1.ON_ROW_ALLSELECT = 'allSelect';
 DataTable$1.ON_ROW_ALLUNSELECT = 'allUnselect';
 DataTable$1.ON_VALUE_CHANGE = 'valueChange';
 DataTable$1.ON_BEFORE_VALUE_CHANGE = 'beforeValueChange';
 DataTable$1.ON_CURRENT_VALUE_CHANGE = 'currentValueChange'; //当前行变化
 //  DataTable.ON_AFTER_VALUE_CHANGE = 'afterValueChange'
 //  DataTable.ON_ADD_ROW = 'addRow'
 DataTable$1.ON_INSERT = 'insert';
 DataTable$1.ON_UPDATE = 'update';
 DataTable$1.ON_CURRENT_UPDATE = 'currentUpdate';
 DataTable$1.ON_DELETE = 'delete';
 DataTable$1.ON_DELETE_ALL = 'deleteAll';
 DataTable$1.ON_ROW_FOCUS = 'focus';
 DataTable$1.ON_ROW_UNFOCUS = 'unFocus';
 DataTable$1.ON_LOAD = 'load';
 DataTable$1.ON_ENABLE_CHANGE = 'enableChange';
 DataTable$1.ON_META_CHANGE = 'metaChange';
 DataTable$1.ON_ROW_META_CHANGE = 'rowMetaChange';
 DataTable$1.ON_CURRENT_META_CHANGE = 'currentMetaChange';
 DataTable$1.ON_CURRENT_ROW_CHANGE = 'currentRowChange';

 DataTable$1.SUBMIT = {
     current: 'current',
     focus: 'focus',
     all: 'all',
     select: 'select',
     change: 'change',
     empty: 'empty',
     allSelect: 'allSelect',
     allPages: 'allPages'
 };


 DataTable$1.createMetaItems = function(metas) {
     var newMetas = {};
     for (var key in metas) {
         var meta = metas[key];
         if (typeof meta == 'string')
             meta = {};
         newMetas[key] = extend({}, DataTable$1.META_DEFAULTS, meta);
     }
     return newMetas
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

var u$2 = {};
u$2.date = {

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
            return u$2.date.leftZeroFill(date.getFullYear() % 100, 2);
        },
        YYYY: function(date) {
            return date.getFullYear();
        },
        //month
        M: function(date) {
            return date.getMonth() + 1;
        },
        MM: function(date) {
            var m = u$2.date._formats.M(date);
            return u$2.date.leftZeroFill(m, 2);
        },
        MMM: function(date, language) {
            var m = date.getMonth();
            // return u.date._dateLocale[language].monthsShort[m];
            return u$2.date._jsonLocale.monthsShort[m];
        },
        MMMM: function(date, language) {
            var m = date.getMonth();
            // return u.date._dateLocale[language].months[m];
            return u$2.date._jsonLocale.months[m];
        },
        //date
        D: function(date) {
            return date.getDate();
        },
        DD: function(date) {
            var d = u$2.date._formats.D(date);
            return u$2.date.leftZeroFill(d, 2);
        },
        // weekday
        d: function(date) {
            return date.getDay();
        },
        dd: function(date, language) {
            var d = u$2.date._formats.d(date);
            // return u.date._dateLocale[language].weekdaysMin[d];
            return u$2.date._jsonLocale.weekdaysMin[d];
        },
        ddd: function(date, language) {
            var d = u$2.date._formats.d(date);
            // return u.date._dateLocale[language].weekdaysShort[d];
            return u$2.date._jsonLocale.weekdaysShort[d];
        },
        dddd: function(date, language) {
            var d = u$2.date._formats.d(date);
            // return u.date._dateLocale[language].weekdays[d];
            return u$2.date._jsonLocale.weekdays[d];
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
            var h = u$2.date._formats.h(date);
            return u$2.date.leftZeroFill(h, 2);
        },
        H: function(date) {
            return date.getHours();
        },
        HH: function(date) {
            return u$2.date.leftZeroFill(date.getHours(), 2);
        },
        // minutes
        m: function(date) {
            return date.getMinutes();
        },
        mm: function(date) {
            return u$2.date.leftZeroFill(date.getMinutes(), 2);
        },
        //seconds
        s: function(date) {
            return date.getSeconds();
        },
        ss: function(date) {
            return u$2.date.leftZeroFill(date.getSeconds(), 2);
        }
    },

    /**
     * 日期格式化
     * @param date
     * @param formatString
     */
    format: function(date, formatString, language) {
        if (!date && date != 0) return ''; // renturn date 改为 return '',因：setFormat初始会赋值为undefined,造成二次选择报错
        var array = formatString.match(u$2.date._formattingTokens),
            i, length, output = '';
        var _date = u$2.date.getDateObj(date);
        if (!_date) return date;
        language = language || core.getLanguages();
        for (i = 0, length = array.length; i < length; i++) {
            if (u$2.date._formats[array[i]]) {
                output += u$2.date._formats[array[i]](_date, language);
            } else {
                output += array[i];
            }
        }
        return output;
    },
    strToDateByTimezone: function(str, timezone) {
        var dateObj = u$2.date.getDateObj(str);
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
        var dateObj = u$2.date.getDateObj(date);
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
        var dateObj = u$2.date.getDateObj(date);
        var localTime = dateObj.getTime();
        var localOffset = dateObj.getTimezoneOffset() * 60000;
        var utc = localTime - (3600000 * parseFloat(timezone)) - localOffset;
        return new Date(utc)
    },

    _addOrSubtract: function(date, period, value, isAdding) {
        var times = date.getTime(),
            d = date.getDate(),
            m = date.getMonth(),
            _date = u$2.date.getDateObj(date);
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
        return u$2.date._addOrSubtract(date, period, value, 1);
    },
    sub: function(date, period, value) {
        return u$2.date._addOrSubtract(date, period, value, -1);
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
                _date = u$2.date.getDateByTimeZonec2z(_date, timezone);
            }
            return _date;
        } else
            return null;
    }

};

var date = u$2.date;

/**
 * Module : neoui-tooltip
 * Author : Kvkens(yueming@yonyou.com)
 * Date   : 2016-08-06 13:26:06
 */
var Tooltip = function(element, options) {
	this.init(element, options);
		//this.show()
};

Tooltip.prototype = {
	defaults: {
		animation: true,
		placement: 'top',
		//selector: false,
		template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow" ></div><div class="tooltip-inner"></div></div>',
		trigger: 'hover focus',
		title: '',
		delay: 0,
		html: false,
		container: false,
		viewport: {
			selector: 'body',
			padding: 0
		},
		showFix: false
	},
	init: function(element, options) {
		var oThis = this;
		this.options = extend({}, this.defaults, options);
		this._viewport = this.options.viewport && document.querySelector(this.options.viewport.selector || this.options.viewport);
		//tip模板对应的dom
		this.tipDom = makeDOM(this.options.template);
		addClass(this.tipDom, this.options.placement);
		if (this.options.colorLevel) {
			addClass(this.tipDom, this.options.colorLevel);
		}
		this.arrrow = this.tipDom.querySelector('.tooltip-arrow');

		//判断如果是批量插入tooltip的
		if(element&&element.length){
			$(element).each(function(){
				this.element = $(this)[0];
				var triggers = oThis.options.trigger.split(' ');
				for (var i = triggers.length; i--;) {
					var trigger$$1 = triggers[i];
					if (trigger$$1 == 'click') {
						on(this.element, 'click', this.toggle.bind(oThis,this.element));
					} else if (trigger$$1 != 'manual') {
						var eventIn = trigger$$1 == 'hover' ? 'mouseenter' : 'focusin';
						var eventOut = trigger$$1 == 'hover' ? 'mouseleave' : 'focusout';
						on(this.element, eventIn, oThis.enter.bind(oThis,this.element));		
 						on(this.element, eventOut, oThis.leave.bind(oThis,this.element));
					}
				}
				oThis.options.title = oThis.options.title || this.element.getAttribute('title');
				this.element.removeAttribute('title');
				if (oThis.options.delay && typeof oThis.options.delay == 'number') {
					oThis.options.delay = {
						show: oThis.options.delay,
						hide: oThis.options.delay
					};
				}
			});
		}else{
			this.element = element;
			var triggers = this.options.trigger.split(' ');

			for (var i = triggers.length; i--;) {
				var trigger$$1 = triggers[i];
				if (trigger$$1 == 'click') {
					on(this.element, 'click', this.toggle.bind(this));
				} else if (trigger$$1 != 'manual') {
					var eventIn = trigger$$1 == 'hover' ? 'mouseenter' : 'focusin';
					var eventOut = trigger$$1 == 'hover' ? 'mouseleave' : 'focusout';
					on(this.element, eventIn, oThis.enter.bind(this));		
 					on(this.element, eventOut, oThis.leave.bind(this));
				}
			}
			this.options.title = this.options.title || this.element.getAttribute('title');
			this.element.removeAttribute('title');
			if (this.options.delay && typeof this.options.delay == 'number') {
				this.options.delay = {
					show: this.options.delay,
					hide: this.options.delay
				};
			}
			// tip容器,默认为当前元素的parent
			this.container = this.options.container ? document.querySelector(this.options.container) : this.element.parentNode;
		}
	},
	enter: function (element) {
		if(arguments.length>1){
			//将tooltip中的element指定为其进入的当前element
			this.element = element;
			// tip容器,默认为当前元素的parent
			this.container = this.options.container ? document.querySelector(this.options.container) : element.parentNode;
		}
		var self = this;
		clearTimeout(this.timeout);
		this.hoverState = 'in';
		if (!this.options.delay || !this.options.delay.show) return this.show();

		this.timeout = setTimeout(function () {
			if (self.hoverState == 'in') self.show();
		}, this.options.delay.show);
	},
	leave: function () {
		var self = this;
		clearTimeout(this.timeout);
		self.hoverState = 'out';
		if (!self.options.delay || !self.options.delay.hide) return self.hide();
		self.timeout = setTimeout(function () {
			if (self.hoverState == 'out') self.hide();
		}, self.options.delay.hide);
	},
	show: function () {
		var self = this;
		this.tipDom.querySelector('.tooltip-inner').innerHTML = this.options.title;
		this.tipDom.style.zIndex = getZIndex();

		if (this.options.showFix) {
			document.body.appendChild(this.tipDom);
			this.tipDom.style.position = 'fixed';
			showPanelByEle({
				ele: this.element,
				panel: this.tipDom,
				position: "top"
			});
			// fix情况下滚动时隐藏
			on(document, 'scroll', function () {
				self.hide();
			});
		} else {
			this.container.appendChild(this.tipDom);
			var inputLeft = this.element.offsetLeft;
			var inputTop = this.element.offsetTop;
			var inputWidth = this.element.offsetWidth;
			var inputHeight = this.element.offsetHeight;
			var topWidth = this.tipDom.offsetWidth;
			var topHeight = this.tipDom.offsetHeight;
			var tipDomleft, tipDomTop;

			if (this.options.placement == 'top') {
				// 上部提示

				this.left = this.element.offsetLeft + inputWidth / 2;
				this.top = this.element.offsetTop - topHeight;
				// 水平居中
				tipDomleft = this.left - this.tipDom.clientWidth / 2 + 'px';
				tipDomTop = this.top + 'px';
			} else if (this.options.placement == 'bottom') {
				// 下边提示
				this.left = this.element.offsetLeft + inputWidth / 2;
				this.top = this.element.offsetTop + topHeight;
				// 水平居中
				tipDomleft = this.left - this.tipDom.clientWidth / 2 + 'px';
				tipDomTop = this.top + 'px';
			} else if (this.options.placement == 'left') {
				// 左边提示
				this.left = this.element.offsetLeft;
				this.top = this.element.offsetTop + topHeight / 2;
				tipDomleft = this.left - this.tipDom.clientWidth + 'px';

				tipDomTop = this.top - this.tipDom.clientHeight / 2 + 'px';
			} else {
				// 右边提示

				this.left = this.element.offsetLeft + inputWidth;
				this.top = this.element.offsetTop + topHeight / 2;
				tipDomleft = this.left + 'px';
				tipDomTop = this.top - this.tipDom.clientHeight / 2 + 'px';
			}

			this.tipDom.style.left = tipDomleft;
			this.tipDom.style.top = tipDomTop;
		}

		addClass(this.tipDom, 'active');

		// var placement = this.options.placement;
		// var pos = this.getPosition()
		// var actualWidth = this.tipDom.offsetWidth
		// var actualHeight = this.tipDom.offsetHeight
		// var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

		// this.applyPlacement(calculatedOffset, placement)
	},
	hide: function () {
		if (this.options.showFix) {
			if (document.body.contains(this.tipDom)) {
				removeClass(this.tipDom, 'active');
				document.body.removeChild(this.tipDom);
			}
		} else {
			if (this.container.contains(this.tipDom)) {
				removeClass(this.tipDom, 'active');
				this.container.removeChild(this.tipDom);
			}
		}
	},
	applyPlacement: function (offset, placement) {
		var width = this.tipDom.offsetWidth;
		var height = this.tipDom.offsetHeight;

		// manually read margins because getBoundingClientRect includes difference
		var marginTop = parseInt(this.tipDom.style.marginTop, 10);
		var marginLeft = parseInt(this.tipDom.style.marginTop, 10);

		// we must check for NaN for ie 8/9
		if (isNaN(marginTop)) marginTop = 0;
		if (isNaN(marginLeft)) marginLeft = 0;

		offset.top = offset.top + marginTop;
		offset.left = offset.left + marginLeft;

		// $.fn.offset doesn't round pixel values
		// so we use setOffset directly with our own function B-0
		this.tipDom.style.left = offset.left + 'px';
		this.tipDom.style.top = offset.top + 'px';

		addClass(this.tipDom, 'active');

		// check to see if placing tip in new offset caused the tip to resize itself
		var actualWidth = this.tipDom.offsetWidth;
		var actualHeight = this.tipDom.offsetHeight;

		if (placement == 'top' && actualHeight != height) {
			offset.top = offset.top + height - actualHeight;
		}
		var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

		if (delta.left) offset.left += delta.left;else offset.top += delta.top;

		var isVertical = /top|bottom/.test(placement);
		var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
		var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

		//$tip.offset(offset)
		this.tipDom.style.left = offset.left + 'px';
		this.tipDom.style.top = offset.top - 4 + 'px';

		// this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
	},
	getCalculatedOffset: function(placement, pos, actualWidth, actualHeight) {
		return placement == 'bottom' ? {
				top: pos.top + pos.height,
				left: pos.left + pos.width / 2 - actualWidth / 2
			} :
			placement == 'top' ? {
				top: pos.top - actualHeight,
				left: pos.left + pos.width / 2 - actualWidth / 2
			} :
			placement == 'left' ? {
				top: pos.top + pos.height / 2 - actualHeight / 2,
				left: pos.left - actualWidth
			} :
			/* placement == 'right' */
			{
				top: pos.top + pos.height / 2 - actualHeight / 2,
				left: pos.left + pos.width
			}
	},
	getPosition: function(el) {
		el = el || this.element;
		var isBody = el.tagName == 'BODY';
		var elRect = el.getBoundingClientRect();
		if(elRect.width == null) {
			// width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
			elRect = extend({}, elRect, {
				width: elRect.right - elRect.left,
				height: elRect.bottom - elRect.top
			});
		}
		var elOffset = isBody ? {
			top: 0,
			left: 0
		} : {
			top: el.offsetTop,
			left: el.offsetLeft
		};
		var scroll = {
			scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : el.scrollTop
		};
		var outerDims = isBody ? {
				width: window.innerWidth || document.body.clientWidth,
				height: window.innerHeight || document.body.clientHeight
			} : null;
			//return extend({}, elRect, scroll, outerDims, elOffset)
		return extend({}, elRect, scroll, outerDims)

	},
	getViewportAdjustedDelta: function(placement, pos, actualWidth, actualHeight) {
		var delta = {
			top: 0,
			left: 0
		};
		if(!this._viewport) return delta

		var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
		var viewportDimensions = this.getPosition(this._viewport);

		if(/right|left/.test(placement)) {
			var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
			var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
			if(topEdgeOffset < viewportDimensions.top) { // top overflow
				delta.top = viewportDimensions.top - topEdgeOffset;
			} else if(bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
				delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
			}
		} else {
			var leftEdgeOffset = pos.left - viewportPadding;
			var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
			if(leftEdgeOffset < viewportDimensions.left) { // left overflow
				delta.left = viewportDimensions.left - leftEdgeOffset;
			} else if(rightEdgeOffset > viewportDimensions.width) { // right overflow
				delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
			}
		}

		return delta
	},
	replaceArrow: function(delta, dimension, isHorizontal) {
		if(isHorizontal) {
			this.arrow.style.left = 50 * (1 - delta / dimension) + '%';
			this.arrow.style.top = '';
		} else {
			this.arrow.style.top = 50 * (1 - delta / dimension) + '%';
			this.arrow.style.left = '';
		}
	},
	destory: function() {

	},
	setTitle: function(title) {
		this.options.title = title;
	}

};

/**
 * Module : neoui-validate
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-06 14:03:15
 */
var Validate = u.BaseComponent.extend({

    init: function() {
        var self = this;
        this.$element = this.element;
        this.$form = this.form;
        this.referDom = this.$element;
        if (this.referDom.tagName !== 'INPUT' && this.referDom.tagName !== "TEXTAREA") {
            this.referDom = this.$element.querySelector('input');
            // 如果referDom的父元素不是this.$element说明时单选框、复选框。则referDom还为$element
            if (!this.referDom || this.referDom.parentNode !== this.$element) {
                this.referDom = this.$element;
            }
        }
        this.options = extend({}, this.DEFAULTS, this.options, JSON.parse(this.element.getAttribute('uvalidate')));
        this.required = false;
        this.timeout = null;
        this.tipAliveTime = this.options['tipAliveTime'] === undefined ? 3000 : this.options['tipAliveTime'];
        //所有属性优先级 ：  options参数  > attr属性  > 默认值
        this.required = this.options['required'] ? this.options['required'] : false;
        this.validType = this.options['validType'] ? this.options['validType'] : null;
        //校验模式  blur  submit
        this.validMode = this.options['validMode'] ? this.options['validMode'] : Validate.DEFAULTS.validMode;
        //空提示
        this.nullMsg = this.options['nullMsg'] ? this.options['nullMsg'] : Validate.NULLMSG[this.validType];
        // input输入提示
        this.inputMsg = Validate.INPUTMSG;
        //是否必填
        if (this.required && !this.nullMsg)
            this.nullMsg = Validate.NULLMSG['required'];
        //错误必填
        this.errorMsg = this.options['errorMsg'] ? this.options['errorMsg'] : Validate.ERRORMSG[this.validType];
        //正则校验
        this.regExp = this.options['reg'] ? this.options['reg'] : Validate.REG[this.validType];
        try {
            if (typeof this.regExp == 'string')
                this.regExp = eval(this.regExp);
        } catch (e) {

        }

        this.notipFlag = this.options['notipFlag']; // 错误信息提示方式是否为tip，默认为false
        this.hasSuccess = this.options['hasSuccess']; //是否含有正确提示

        this.showFix = this.options['showFix'];

        //提示div的id 为空时使用tooltop来提示
        this.tipId = this.options['tipId'] ? this.options['tipId'] : null;
        //校验成功提示信息的div
        this.successId = this.options['successId'] ? this.options['successId'] : null;

        // 要求显示成功提示，并没有成功提示dom的id时，则创建成功提示dom
        if (this.hasSuccess && !this.successId) {
            this.successId = makeDOM('<span class="u-form-control-success uf uf-correct" ></span>');
            // 因为参照获取的是第一个span，因此添加到最后
            // if (this.referDom.nextSibling) {
            //     this.referDom.parentNode.insertBefore(this.successId, this.referDom.nextSibling);
            // } else {
                this.referDom.parentNode.appendChild(this.successId);
            // }

        }
        //不是默认的tip提示方式并且tipId没有定义时创建默认tipid
        if (this.notipFlag && !this.tipId) {
            this.tipId = makeDOM('<span class="u-form-control-info uf uf-exc-c-o "></span>');
            this.referDom.parentNode.appendChild(this.tipId);
            // 因为参照获取的是第一个span，因此添加到最后
            // if (this.referDom.nextSibling) {
            //     this.referDom.parentNode.insertBefore(this.tipId, this.referDom.nextSibling);
            // } else {
                this.referDom.parentNode.appendChild(this.tipId);
            // }
        }
        //提示框位置
        this.placement = this.options['placement'] ? this.options['placement'] : Validate.DEFAULTS.placement;
        //
        this.minLength = this.options['minLength'] > 0 ? this.options['minLength'] : null;
        this.maxLength = this.options['maxLength'] > 0 ? this.options['maxLength'] : null;
        this.min = this.options['min'] !== undefined ? this.options['min'] : null;
        this.max = this.options['max'] !== undefined ? this.options['max'] : null;
        this.minNotEq = this.options['minNotEq'] !== undefined ? this.options['minNotEq'] : null;
        this.maxNotEq = this.options['maxNotEq'] !== undefined ? this.options['maxNotEq'] : null;
        this.min = isNumber$1(this.min) ? this.min : null;
        this.max = isNumber$1(this.max) ? this.max : null;
        this.minNotEq = isNumber$1(this.minNotEq) ? this.minNotEq : null;
        this.maxNotEq = isNumber$1(this.maxNotEq) ? this.maxNotEq : null;
        this.create();
    }
});

Validate.fn = Validate.prototype;
//Validate.tipTemplate = '<div class="tooltip" role="tooltip"><div class="tooltip-arrow tooltip-arrow-c"></div><div class="tooltip-arrow"></div><div class="tooltip-inner" style="color:#ed7103;border:1px solid #ed7103;background-color:#fff7f0;"></div></div>'

Validate.DEFAULTS = {
    validMode: 'blur',
    placement: "top"
};

Validate.NULLMSG = {
    "required": trans('validate.required', "不能为空！"),
    "integer": trans('validate.integer', "请填写整数！"),
    "float": trans('validate.float', "请填写数字！"),
    "zipCode": trans('validate.zipCode', "请填写邮政编码！"),
    "phone": trans('validate.phone', "请填写手机号码！"),
    "landline": trans('validate.landline', "请填写座机号码！"),
    "email": trans('validate.email', "请填写邮箱地址！"),
    "url": trans('validate.url', "请填写网址！"),
    "datetime": trans('validate.datetime', "请填写日期！"),
    "phoneNumber": trans('validate.phoneNumber', "请填写正确号码！")

};

Validate.ERRORMSG = {
    "integer": trans('validate.error_integer', "整数格式不对！"),
    "float": trans('validate.error_float', "数字格式不对！"),
    "zipCode": trans('validate.error_zipCode', "邮政编码格式不对！"),
    "phone": trans('validate.error_phone', "手机号码格式不对！"),
    "landline": trans('validate.error_landline', "座机号码格式不对！"),
    "email": trans('validate.error_email', "邮箱地址格式不对！"),
    "idcard": trans('validate.error_email', "身份证格式不对！"),
    "url": trans('validate.error_url', "网址格式不对！"),
    "datetime": trans('validate.error_datetime', "日期格式不对！"),
    "phoneNumber": trans('validate.error_phoneNumber', "号码格式不对！")
};

Validate.INPUTMSG = {
    "minLength": trans('validate.input_minlength', "输入长度不能小于"),
    "maxLength": trans('validate.input_maxlength', "输入长度不能大于"),
    "unit": trans('validate.input_unit', "位"),
    "maxValue": trans('validate.input_maxvalue', "输入值不能大于"),
    "minValue": trans('validate.input_minvalue', "输入值不能小于"),
    "equalMax": trans('validate.input_equalMax', "输入值不能大于或等于"),
    "equalMin": trans('validate.input_equalMin', "输入值不能小于或等于")

};

Validate.REG = {
    "integer": /^-?\d+$/,
    "float": /^-?\d+(\.\d+)?$/,
    "zipCode": /^[0-9]{6}$/,
    // "phone": /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/,
    "phone": /^1[3|4|5|7|8]\d{9}$/,
    "idcard": /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
    "landline": /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
    "email": /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    "url": /^(\w+:\/\/)?\w+(\.\w+)+.*$/,
    "datetime": /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/,
    "PhoneNumber": /^\d+$/
};

Validate.fn.create = function() {
    if ($(this.element).attr('hasValidate')) {
        return;
    }
    var self = this;
    on(this.element, 'blur', function(e) {
        if (self.validMode == 'blur') {
            self.passed = self.doValid();

        }
    });
    on(this.element, 'focus', function(e) {
        //隐藏错误信息
        self.hideMsg();
    });
    on(this.element, 'change', function(e) {
        //隐藏错误信息
        self.hideMsg();
    });
    on(this.element, 'keydown', function(e) {
        var event = window.event || e;
        if (self["validType"] == "float") {
            var tmp = self.element.value;
            if (event.shiftKey) {
                event.returnValue = false;
                return false;
            } else if (event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
                // tab键 左箭头 右箭头 delete键
                return true;
            } else if (event.ctrlKey && (event.keyCode == 67 || event.keyCode == 86)) {
                //复制粘贴
                return true;
            } else if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || (inArray(event.keyCode, [8, 110, 190, 189, 109]) > -1))) {
                event.returnValue = false;
                return false;
            } else if ((!tmp || tmp.indexOf(".") > -1) && (event.keyCode == 190 || event.keyCode == 110)) {
                event.returnValue = false;
                return false;

            }

            if (tmp && (tmp + '').split('.')[0].length >= 25) {
                return false;

            }

        }
        if (self["validType"] == "integer") {
            var tmp = self.element.value;

            if (event.shiftKey) {
                event.returnValue = false;
                return false;
            } else if (event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
                // tab键 左箭头 右箭头 delete键
                return true;
            } else if (event.ctrlKey && (event.keyCode == 67 || event.keyCode == 86)) {
                //复制粘贴
                return true;
            } else if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || (inArray(event.keyCode, [8, 109, 189]) > -1))) {
                event.returnValue = false;
                return false;
            }

            if (tmp && (tmp + '').split('.')[0].length >= 25) {
                return false;
            }
        }

    });

    $(this.element).attr('hasValidate', true);
};

Validate.fn.updateOptions = function(options) {

};

Validate.fn.doValid = function(options) {
    var self = this;
    var pValue;
    this.showMsgFlag = true;
    if (options) {
        pValue = options.pValue;
        this.showMsgFlag = options.showMsg;
    }
    this.needClean = false;
    //只读的也需要校验，所以注释
    // if (this.element && this.element.getAttribute("readonly")) return {passed:true}
    var value = null;
    if (typeof pValue != 'undefined')
        value = pValue;
    else if (this.element)
        // value = this.element.value
        value = this.element.value ? this.element.value : this.referDom.value;

    if (this.isEmpty(value) && this.required) {
        this.showMsg(this.nullMsg);
        return {
            passed: false,
            Msg: this.nullMsg
        }
    } else if (this.isEmpty(value) && !this.required) {
        return {
            passed: true
        }
    }
    if (this.regExp) {
        var reg = new RegExp(this.regExp);
        if (typeof value == 'number')
            value = value + "";
        else if (typeof value == 'boolean')
            return {
                passed: true
            }
        var r = value.match(reg);
        if (r === null || r === false) {
            this.showMsg(this.errorMsg);
            this.needClean = true;
            return {
                passed: false,
                Msg: this.errorMsg
            }
        }
    }
    if (this.minLength) {
        if (value.lengthb() < this.minLength) {
            var Msg = this.inputMsg.minLength + this.minLength + this.inputMsg.unit;
            this.showMsg(Msg);
            return {
                passed: false,
                Msg: Msg
            }
        }
    }
    if (this.maxLength) {
        if (value.lengthb() > this.maxLength) {
            var Msg = this.inputMsg.maxLength + this.maxLength + this.inputMsg.unit;
            this.showMsg(Msg);
            return {
                passed: false,
                Msg: Msg
            }
        }
    }
    if (this.max != undefined && this.max != null) {
        if (parseFloat(value) > this.max) {
            var Msg = this.inputMsg.maxValue + this.max;
            this.showMsg(Msg);
            return {
                passed: false,
                Msg: Msg
            }
        }
    }
    if (this.min != undefined && this.min != null) {
        if (parseFloat(value) < this.min) {
            var Msg = this.inputMsg.minValue + this.min;
            this.showMsg(Msg);
            return {
                passed: false,
                Msg: Msg
            }
        }
    }
    if (this.maxNotEq != undefined && this.maxNotEq != null) {
        if (parseFloat(value) >= this.maxNotEq) {
            var Msg = this.inputMsg.equalMax + this.maxNotEq;
            this.showMsg(Msg);
            return {
                passed: false,
                Msg: Msg
            }
        }
    }
    if (this.minNotEq != undefined && this.minNotEq != null) {
        if (parseFloat(value) <= this.minNotEq) {
            var Msg = this.inputMsg.equalMin + this.minNotEq;
            this.showMsg(Msg);
            return {
                passed: false,
                Msg: Msg
            }
        }
    }
    //succes时，将成功信息显示
    if (this.successId) {
        // addClass(this.element.parentNode,'u-has-success');
        var successDiv = this.successId;
        var successleft = this.referDom.offsetLeft + this.referDom.offsetWidth + 5;
        var successtop = this.referDom.offsetTop + 10;
        if (typeof successDiv === 'string')
            successDiv = document.getElementById(successDiv);
        successDiv.style.display = 'inline-block';
        successDiv.style.top = successtop + 'px';
        successDiv.style.left = successleft + 'px';
        clearTimeout(this.successtimeout);
        this.successtimeout = setTimeout(function() {
            // self.tooltip.hide();
            successDiv.style.display = 'none';
        }, this.tipAliveTime);

    }
    return {
        passed: true
    }
};

Validate.fn.check = Validate.fn.doValid;

//	Validate.fn.getValue = function() {
//		var inputval
//		if (this.$element.is(":radio")) {
//			inputval = this.$form.find(":radio[name='" + this.$element.attr("name") + "']:checked").val();
//		} else if (this.$element.is(":checkbox")) {
//			inputval = "";
//			this.$form.find(":checkbox[name='" + obj.attr("name") + "']:checked").each(function() {
//				inputval += $(this).val() + ',';
//			})
//		} else if (this.$element.is('div')) {
//			inputval = this.$element[0].trueValue;
//		} else {
//			inputval = this.$element.val();
//		}
//		inputval = $.trim(inputval);
//		return this.isEmpty(inputval) ? "" : inputval;
//	}

Validate.fn.some = Array.prototype.some ?
    Array.prototype.some : function() {
        var flag;
        for (var i = 0; i < this.length; i++) {
            if (typeof arguments[0] == "function") {
                flag = arguments[0](this[i]);
                if (flag) break;
            }
        }
        return flag;
    };

Validate.fn.getValue = function() {
    var inputval = '';
    //checkbox、radio为u-meta绑定时
    var bool = this.some.call(this.$element.querySelectorAll('[type="checkbox"],[type="radio"]'), function(ele) {
        return ele.type == "checkbox" || ele.type == "radio"
    });
    if (this.$element.childNodes.length > 0 && bool) {
        var eleArr = this.$element.querySelectorAll('[type="checkbox"],[type="radio"]');
        var ele = eleArr[0];
        if (ele.type == "checkbox") {
            this.$element.querySelectorAll(":checkbox[name='" + $(ele).attr("name") + "']:checked").each(function() {
                inputval += $(this).val() + ',';
            });
        } else if (ele.type == "radio") {
            inputval = this.$element.querySelectorAll(":radio[name='" + $(ele).attr("name") + "']:checked").value;
        }
    } else if (this.$element.is(":radio")) { //valid-type 绑定
        inputval = this.$element.parent().querySelectorAll(":radio[name='" + this.$element.attr("name") + "']:checked").val();
    } else if (this.$element.is(":checkbox")) {
        inputval = "";
        this.$element.parent().find(":checkbox[name='" + this.$element.attr("name") + "']:checked").each(function() {
            inputval += $(this).val() + ',';
        });
    } else if (this.$element.find('input').length > 0) {
        inputval = this.$element.find('input').val();
    } else {
        inputval = this.$element.val();
    }
    inputval = inputval.trim;
    return this.isEmpty(inputval) ? "" : inputval;
};

Validate.fn.isEmpty = function(val) {
    return val === "" || val === undefined || val === null //|| val === $.trim(this.$element.attr("tip"));
};

Validate.fn.showMsg = function(msg) {

    if (this.showMsgFlag == false || this.showMsgFlag == 'false') {
        return;
    }
    //因为grid中自定义的editType使用的是document.body,只处理校验不现实提示信息
    if (this.element == document.body) {
        return;
    }
    var self = this;
    if (this.tipId) {
        this.referDom.style.borderColor = 'rgb(241,90,74)';
        var tipdiv = this.tipId;
        if (typeof tipdiv === 'string') {
            tipdiv = document.getElementById(tipdiv);
        }
        tipdiv.innerHTML = msg;
        //如果notipFlag为true说明，可能是平台创建的，需要添加left、top值
        if (this.notipFlag) {
            var left = this.referDom.offsetLeft;
            var top = this.referDom.offsetTop + this.referDom.offsetHeight + 4;
            tipdiv.style.left = left + 'px';
            tipdiv.style.top = top + 'px';
        }

        tipdiv.style.display = 'block';
        // addClass(tipdiv.parentNode,'u-has-error');
        // $('#' + this.tipId).html(msg).show()
    } else {
        var tipOptions = {
            "title": msg,
            "trigger": "manual",
            "selector": "validtip",
            "placement": this.placement,
            "showFix": this.showFix
        };




        if (this.options.tipTemplate)
            tipOptions.template = this.options.tipTemplate;

        //月凯修改
        // if (!this.tooltip)
        this.referDom = this.$element;
        if (this.referDom.tagName !== 'INPUT' && this.referDom.tagName !== "TEXTAREA") {
            this.referDom = this.$element.querySelector('input');
            // 如果referDom的父元素不是this.$element说明时单选框、复选框。则referDom还为$element
            if (!this.referDom || this.referDom.parentNode !== this.$element) {
                this.referDom = this.$element;
            }
        }
        if (this.tooltip) {
            this.tooltip.hide();
        }

        this.tooltip = new Tooltip(this.referDom, tipOptions);
        this.tooltip.setTitle(msg);
        this.tooltip.show();

    }
    if (this.tipAliveTime !== -1) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function() {
            // self.tooltip.hide();
            self.hideMsg();
        }, this.tipAliveTime);

    }

};
Validate.fn.hideMsg = function() {
    //隐藏成功信息
    // if(this.successId||this.tipId){
    // 	document.getElementById(this.successId).style.display='none';
    // 	document.getElementById(this.tipId).style.display='none';
    // }

    // removeClass(this.element.parentNode,'u-has-error');
    // removeClass(this.element.parentNode,'u-has-success');

    if (this.tipId) {
        var tipdiv = this.tipId;
        if (typeof tipdiv === 'string') {
            tipdiv = document.getElementById(tipdiv);
        }
        tipdiv.style.display = 'none';
        this.referDom.style.borderColor = '';
        // removeClass(tipdiv.parentNode,'u-has-error');
    } else {
        if (this.tooltip)
            this.tooltip.hide();
    }

};

/**
 * 只有单一元素时使用
 */
Validate.fn._needClean = function() {
    return true; //this.validates[0].needClean
};

if (u.compMgr)
    u.compMgr.regComp({
        comp: Validate,
        compAsString: 'u.Validate',
        css: 'u-validate'
    });

/**
 * Module : Sparrow ripple
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-29 08:42:13
 */

var URipple = function URipple(element) {
    if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
    this._element = element;

    // Initialize instance.
    this.init();
  };
  //window['URipple'] = URipple;

  URipple.prototype._down = function(event) {
    if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
    if (!this._rippleElement.style.width && !this._rippleElement.style.height) {
      var rect = this._element.getBoundingClientRect();
      this.rippleSize_ = Math.sqrt(rect.width * rect.width + rect.height * rect.height) * 2 + 2;
      if(this.rippleSize_ > 0){
            this._rippleElement.style.width = this.rippleSize_ + 'px';
            this._rippleElement.style.height = this.rippleSize_ + 'px';
        }

    }

    addClass(this._rippleElement, 'is-visible');

    if (event.type === 'mousedown' && this._ignoringMouseDown) {
      this._ignoringMouseDown = false;
    } else {
      if (event.type === 'touchstart') {
        this._ignoringMouseDown = true;
      }
      var frameCount = this.getFrameCount();
      if (frameCount > 0) {
        return;
      }
      this.setFrameCount(1);
      var t = event.currentTarget || event.target || event.srcElement;
      var bound = t.getBoundingClientRect();
      var x;
      var y;
      // Check if we are handling a keyboard click.
      if (event.clientX === 0 && event.clientY === 0) {
        x = Math.round(bound.width / 2);
        y = Math.round(bound.height / 2);
      } else {
        var clientX = event.clientX ? event.clientX : event.touches[0].clientX;
        var clientY = event.clientY ? event.clientY : event.touches[0].clientY;
        x = Math.round(clientX - bound.left);
        y = Math.round(clientY - bound.top);
      }
      this.setRippleXY(x, y);
      this.setRippleStyles(true);
      if(window.requestAnimationFrame)
        window.requestAnimationFrame(this.animFrameHandler.bind(this));
    }
  };

  /**
   * Handle mouse / finger up on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  URipple.prototype._up = function(event) {
    if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
    var self = this;
    // Don't fire for the artificial "mouseup" generated by a double-click.
    if (event && event.detail !== 2) {
      removeClass(this._rippleElement,'is-visible');
    }
    // Allow a repaint to occur before removing this class, so the animation
    // shows for tap events, which seem to trigger a mouseup too soon after
    // mousedown.
    window.setTimeout(function() {
      removeClass(self._rippleElement,'is-visible');
    }, 0);
  };

  /**
       * Getter for frameCount_.
       * @return {number} the frame count.
       */
  URipple.prototype.getFrameCount = function() {
    if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
    return this.frameCount_;
  };
  /**
       * Setter for frameCount_.
       * @param {number} fC the frame count.
       */
  URipple.prototype.setFrameCount = function(fC) {
    if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
    this.frameCount_ = fC;
  };


  /**
       * Getter for _rippleElement.
       * @return {Element} the ripple element.
       */
      URipple.prototype.getRippleElement = function() {
        if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
        return this._rippleElement;
      };

      /**
       * Sets the ripple X and Y coordinates.
       * @param  {number} newX the new X coordinate
       * @param  {number} newY the new Y coordinate
       */
      URipple.prototype.setRippleXY = function(newX, newY) {
        if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
        this.x_ = newX;
        this.y_ = newY;
      };

      /**
       * Sets the ripple styles.
       * @param  {boolean} start whether or not this is the start frame.
       */
      URipple.prototype.setRippleStyles = function(start) {
        if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
        if (this._rippleElement !== null) {
          var transformString;
          var scale;
          var size;
          var offset = 'translate(' + this.x_ + 'px, ' + this.y_ + 'px)';

          if (start) {
            scale = 'scale(0.0001, 0.0001)';
            size = '1px';
          } else {
            scale = '';
            size = this.rippleSize_ + 'px';
          }

          transformString = 'translate(-50%, -50%) ' + offset + scale;

          this._rippleElement.style.webkitTransform = transformString;
          this._rippleElement.style.msTransform = transformString;
          this._rippleElement.style.transform = transformString;

          if (start) {
            removeClass(this._rippleElement,'is-animating');
          } else {
            addClass(this._rippleElement,'is-animating');
          }
        }
      };

    /**
       * Handles an animation frame.
       */
      URipple.prototype.animFrameHandler = function() {
        if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
        if (this.frameCount_-- > 0) {
          window.requestAnimationFrame(this.animFrameHandler.bind(this));
        } else {
          this.setRippleStyles(false);
        }
      };

  /**
   * Initialize element.
   */
  URipple.prototype.init = function() {
    if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
    var self = this;
    if (this._element) {
      this._rippleElement = this._element.querySelector('.u-ripple');
      if (!this._rippleElement){
        this._rippleElement = document.createElement('span');
        addClass(this._rippleElement,'u-ripple');
        this._element.appendChild(this._rippleElement);
        this._element.style.overflow = 'hidden';
        this._element.style.position = 'relative';
      }
      this.frameCount_ = 0;
      this.rippleSize_ = 0;
      this.x_ = 0;
      this.y_ = 0;

      // Touch start produces a compat mouse down event, which would cause a
      // second ripples. To avoid that, we use this property to ignore the first
      // mouse down after a touch start.
      this._ignoringMouseDown = false;
      on(this._element, 'mousedown',function(e){self._down(e);});
      on(this._element, 'touchstart',function(e){self._down(e);});

      on(this._element, 'mouseup',function(e){self._up(e);});
      on(this._element, 'mouseleave',function(e){self._up(e);});
      on(this._element, 'touchend',function(e){self._up(e);});
      on(this._element, 'blur',function(e){self._up(e);});
    }
  };

var DateTimePicker = u.BaseComponent.extend({});

DateTimePicker.fn = DateTimePicker.prototype;


DateTimePicker.fn.init = function() {

    var self = this,
        _fmt, _defaultFmt, cusFormat;
    this.enable = true;
    this._element = this.element;
    //this.type = 'datetime';
    //if (hasClass(this.element,'u-datepicker')){
    //    this.type = 'date';
    //}
    //addClass(this._element,'u-text')
    //this._element.style.display = "inline-table"; // 存在右侧图标，因此修改display
    //new UText(this._element);
    this._input = this._element.querySelector("input");
    if (this.options.placeholder)
        this._input.placeholder = this.options.placeholder;

    // if(env.isMobile){
    //     // setTimeout(function(){
    //     //     self._input.setAttribute('readonly','readonly');
    //     // },1000);
    // }

    setTimeout(function() {
        if (self._input) {
            self._input.setAttribute('readonly', 'readonly');
        }
    }, 1000);

    on(this._input, 'focus', function(e) {
        // 用来关闭键盘
        /*if(env.isMobile)
            this.blur();*/
        self._inputFocus = true;
        if (self.isShow !== true) {
            self.show(e);
        }
        stopEvent(e);
    });

    on(this._input, 'blur', function(e) {
        self._inputFocus = false;
    });
    this._span = this._element.querySelector("span");
    if (this._span) {
        on(this._span, 'click', function(e) {
            // if (self.isShow !== true){
            //     self.show(e);
            // }
            self._input.focus();
            //stopEvent(e);
        });
    }



    if (hasClass(this._element, 'time')) {
        this.type = 'datetime';
        _defaultFmt = 'YYYY-MM-DD hh:mm:ss';
    } else {
        this.type = 'date';
        _defaultFmt = 'YYYY-MM-DD';
    }
    _fmt = this._element.getAttribute("format");

    if (typeof getFormatFun == 'function') {
        cusFormat = getFormatFun();
    }
    this.format = _fmt || this.options['format'] || cusFormat || _defaultFmt;
    this.timezone = this.options['timezone'] || getCookie(U_TIMEZONE);
    this.isShow = false;
};


/**
 * 轮播动画效果
 * @private
 */
DateTimePicker.fn._carousel = function(newPage, direction) {
    if (direction == 'left') {
        addClass(newPage, 'right-page');
    } else {
        addClass(newPage, 'left-page');
    }
    this._dateContent.appendChild(newPage);
    if (env.isIE8 || env.isIE9 || env.isFF || true) { // 动画存在问题，禁用动画
        // this._dateContent.removeChild(this.contentPage);
        var pages = this._dateContent.querySelectorAll('.u-date-content-page');
        for (var i = 0; i < pages.length; i++) {
            this._dateContent.removeChild(pages[i]);
        }
        this.contentPage = newPage;
        this._dateContent.appendChild(newPage);
        if (direction == 'left') {
            removeClass(newPage, 'right-page');
        } else {
            removeClass(newPage, 'left-page');
        }
    } else {

        var cleanup = function() {
            newPage.removeEventListener('transitionend', cleanup);
            newPage.removeEventListener('webkitTransitionEnd', cleanup);
            // this._dateContent.removeChild(this.contentPage);
            var pages = this._dateContent.querySelectorAll('.u-date-content-page');
            for (var i = 0; i < pages.length; i++) {
                this._dateContent.removeChild(pages[i]);
            }
            this.contentPage = newPage;
            this._dateContent.appendChild(newPage);
        }.bind(this);

        newPage.addEventListener('transitionend', cleanup);
        newPage.addEventListener('webkitTransitionEnd', cleanup);
        if (window.requestAnimationFrame)
            window.requestAnimationFrame(function() {
                if (direction == 'left') {
                    addClass(this.contentPage, 'left-page');
                    removeClass(newPage, 'right-page');
                } else {
                    addClass(this.contentPage, 'right-page');
                    removeClass(newPage, 'left-page');
                }
            }.bind(this));
    }
};

/**
 * 淡入动画效果
 * @private
 */
DateTimePicker.fn._zoomIn = function(newPage) {
    if (!this.contentPage) {
        this._dateContent.appendChild(newPage);
        this.contentPage = newPage;
        return;
    }
    addClass(newPage, 'zoom-in');
    this._dateContent.appendChild(newPage);
    if (env.isIE8 || env.isIE9 || env.isFF) {
        var pages = this._dateContent.querySelectorAll('.u-date-content-page');
        for (var i = 0; i < pages.length; i++) {
            this._dateContent.removeChild(pages[i]);
        }
        // this._dateContent.removeChild(this.contentPage);
        this.contentPage = newPage;
        this._dateContent.appendChild(newPage);
        removeClass(newPage, 'zoom-in');
    } else {
        var cleanup = function() {
            newPage.removeEventListener('transitionend', cleanup);
            newPage.removeEventListener('webkitTransitionEnd', cleanup);
            // this._dateContent.removeChild(this.contentPage);
            var pages = this._dateContent.querySelectorAll('.u-date-content-page');
            for (var i = 0; i < pages.length; i++) {
                this._dateContent.removeChild(pages[i]);
            }
            this.contentPage = newPage;
            this._dateContent.appendChild(newPage);
        }.bind(this);
        if (this.contentPage) {
            newPage.addEventListener('transitionend', cleanup);
            newPage.addEventListener('webkitTransitionEnd', cleanup);
        }
        if (window.requestAnimationFrame)
            window.requestAnimationFrame(function() {
                addClass(this.contentPage, 'is-hidden');
                removeClass(newPage, 'zoom-in');
            }.bind(this));
    }

};


/**
 *填充年份选择面板
 * @private
 */
DateTimePicker.fn._fillYear = function(type) {
    var year, template, yearPage, titleDiv, yearDiv, _year, i, cell, language, year, month, date$$1, time, self = this;
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">',
        /*'<div class="u-date-content-title-year"></div>-',
        '<div class="u-date-content-title-month"></div>-',
        '<div class="u-date-content-title-date"></div>',
        '<div class="u-date-content-title-time"></div>',*/
        '</div>',
        '<div class="u-date-content-panel"></div>',
        '</div>'
    ].join("");
    type = type || 'current';
    _year = this.pickerDate.getFullYear();
    if ('current' === type) {
        this.startYear = _year - _year % 10 - 1;
    } else if (type === 'preivous') {
        this.startYear = this.startYear - 10;
    } else {
        this.startYear = this.startYear + 10;
    }
    yearPage = makeDOM(template);
    // titleDiv = yearPage.querySelector('.u-date-content-title');
    // titleDiv.innerHTML = (this.startYear - 1) + '-' + (this.startYear + 11);
    language = core.getLanguages();
    year = date._formats['YYYY'](this.pickerDate);
    month = date._formats['MM'](this.pickerDate, language);
    date$$1 = date._formats['DD'](this.pickerDate, language);
    time = date._formats['HH'](this.pickerDate, language) + ':' + date._formats['mm'](this.pickerDate, language) + ':' + date._formats['ss'](this.pickerDate, language);

    this._yearTitle = yearPage.querySelector('.u-date-content-title');
    this._yearTitle.innerHTML = year;
    /*this._headerYear = yearPage.querySelector('.u-date-content-title-year');
    this._headerYear.innerHTML = year;
    this._headerMonth = yearPage.querySelector('.u-date-content-title-month');
    this._headerMonth.innerHTML = month;
    this._headerDate = yearPage.querySelector('.u-date-content-title-date');
    this._headerDate.innerHTML = date;
    this._headerTime = yearPage.querySelector('.u-date-content-title-time');
    this._headerTime.innerHTML = time;*/
    if (this.type == 'date') {
        this._headerTime.style.display = 'none';
    }

    /*on(this._headerYear, 'click', function(e){
        self._fillYear();
        stopEvent(e)
    });

    on(this._headerMonth, 'click', function(e){
        self._fillMonth();
        stopEvent(e)
    });

    on(this._headerTime, 'click', function(e){
        self._fillTime();
        stopEvent(e)
    });*/

    yearDiv = yearPage.querySelector('.u-date-content-panel');
    for (var i = 0; i < 12; i++) {

        cell = makeDOM('<div class="u-date-content-year-cell">' + (this.startYear + i) + '</div>');
        new URipple(cell);
        if (this.startYear + i == _year) {
            addClass(cell, 'current');
        }
        if (this.beginYear) {
            if (this.startYear + i < this.beginYear) {
                addClass(cell, 'u-disabled');
            }
        }
        if (this.overYear) {
            if (this.startYear + i > this.overYear) {
                addClass(cell, 'u-disabled');
            }
        }

        cell._value = this.startYear + i;
        yearDiv.appendChild(cell);
    }
    on(yearDiv, 'click', function(e) {
        if (hasClass(e.target, 'u-disabled')) return;
        var _y = e.target._value;
        this.pickerDate.setYear(_y);
        this._updateDate();
        this._fillMonth();
    }.bind(this));

    if (type === 'current') {
        this._zoomIn(yearPage);
    } else if (type === 'next') {
        this._carousel(yearPage, 'left');
    } else if (type === 'preivous') {
        this._carousel(yearPage, 'right');
    }
    this.currentPanel = 'year';
};

/**
 * 填充月份选择面板
 * @private
 */
DateTimePicker.fn._fillMonth = function() {
    var template, monthPage, _month, cells, i, language, year, month, date$$1, time, self = this;
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">',
        /*'<div class="u-date-content-title-year"></div>-',
        '<div class="u-date-content-title-month"></div>-',
        '<div class="u-date-content-title-date"></div>',
        '<div class="u-date-content-title-time"></div>',*/
        '</div>',
        '<div class="u-date-content-panel">',
        '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[0] + '</div>',
        '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[1] + '</div>',
        '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[2] + '</div>',
        '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[3] + '</div>',
        '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[4] + '</div>',
        '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[5] + '</div>',
        '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[6] + '</div>',
        '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[7] + '</div>',
        '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[8] + '</div>',
        '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[9] + '</div>',
        '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[10] + '</div>',
        '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[11] + '</div>',
        '</div>',
        '</div>'
    ].join("");

    monthPage = makeDOM(template);
    language = core.getLanguages();
    year = date._formats['YYYY'](this.pickerDate);
    month = date._formats['MM'](this.pickerDate, language);
    date$$1 = date._formats['DD'](this.pickerDate, language);
    time = date._formats['HH'](this.pickerDate, language) + ':' + date._formats['mm'](this.pickerDate, language) + ':' + date._formats['ss'](this.pickerDate, language);

    this._monthTitle = monthPage.querySelector('.u-date-content-title');
    this._monthTitle.innerHTML = date._formats['MMM'](this.pickerDate, language);
    /*this._headerYear = monthPage.querySelector('.u-date-content-title-year');
    this._headerYear.innerHTML = year;
    this._headerMonth = monthPage.querySelector('.u-date-content-title-month');
    this._headerMonth.innerHTML = month;
    this._headerDate = monthPage.querySelector('.u-date-content-title-date');
    this._headerDate.innerHTML = date;
    this._headerTime = monthPage.querySelector('.u-date-content-title-time');
    this._headerTime.innerHTML = time;*/
    if (this.type == 'date') {
        this._headerTime.style.display = 'none';
    }

    /*on(this._headerYear, 'click', function(e){
        self._fillYear();
        stopEvent(e)
    });

    on(this._headerMonth, 'click', function(e){
        self._fillMonth();
        stopEvent(e)
    });

    on(this._headerTime, 'click', function(e){
        self._fillTime();
        stopEvent(e)
    });*/

    cells = monthPage.querySelectorAll('.u-date-content-year-cell');
    for (var i = 0; i < cells.length; i++) {
        if (_month - 1 == i) {
            addClass(cells[i], 'current');
        }
        if (this.beginYear) {
            if (this.pickerDate.getFullYear() == this.beginYear && i < this.beginMonth) {
                addClass(cells[i], 'u-disabled');
            }
            if (this.pickerDate.getFullYear() < this.beginYear) {
                addClass(cells[i], 'u-disabled');
            }
        }
        if (this.overYear) {
            if (this.pickerDate.getFullYear() == this.overYear && i > this.overMonth) {
                addClass(cells[i], 'u-disabled');
            }
            if (this.pickerDate.getFullYear() > this.overYear) {
                addClass(cells[i], 'u-disabled');
            }
        }

        cells[i]._value = i;
        new URipple(cells[i]);
    }
    on(monthPage, 'click', function(e) {
        if (hasClass(e.target, 'u-disabled')) return;
        if (hasClass(e.target, 'u-date-content-title')) return;
        var _m = e.target._value;
        this.pickerDate.setMonth(_m);
        this._updateDate();
        this._fillDate();
    }.bind(this));
    this._zoomIn(monthPage);
    this.currentPanel = 'month';
};

DateTimePicker.fn._getPickerStartDate = function(date$$1) {
    var d = new Date(dateFormat(date$$1));
    d.setDate(1);
    var day = d.getDay();
    d = date.sub(d, 'd', day);
    return d;
};

DateTimePicker.fn._getPickerEndDate = function(date$$1) {
    var d = new Date(dateFormat(date$$1));
    d.setDate(1);
    d.setDate(0);
    d.setMonth(d.getMonth() + 1);
    var day = d.getDay();
    d = date.add(d, 'd', 6 - day);
    return d;
};

/**
 * 渲染日历
 * @param type : previous  current  next
 * @private
 */
DateTimePicker.fn._fillDate = function(type) {
    // if (env.isMobile){
    //     this._dateMobileScroll()
    //     return
    // }
    var year, month, day, date$$1, time, template, datePage, titleDiv, dateDiv, weekSpans, language, tempDate, i, cell, self = this;
    self.timeOpen = false;
    type = type || 'current';
    if ('current' === type) {
        tempDate = this.pickerDate;
    } else if (type === 'preivous') {
        tempDate = date.sub(this.startDate, 'd', 1);
        // 默认显示每个月的1号
        tempDate = date.getDateObj(tempDate.setDate(1));
    } else {
        tempDate = date.add(this.endDate, 'd', 1);
        // 默认显示每个月的1号
        tempDate = date.getDateObj(tempDate.setDate(1));
    }
    this.startDate = this._getPickerStartDate(tempDate);
    this.endDate = this._getPickerEndDate(tempDate);

    language = core.getLanguages();
    year = date._formats['YYYY'](tempDate);
    month = date._formats['MM'](tempDate, language);
    date$$1 = date._formats['DD'](tempDate, language);
    time = date._formats['HH'](tempDate, language) + ':' + date._formats['mm'](tempDate, language) + ':' + date._formats['ss'](tempDate, language);
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">',
        '<div class="u-date-content-title-year"></div>-',
        '<div class="u-date-content-title-month"></div>-',
        '<div class="u-date-content-title-date"></div>',
        '<div class="u-date-content-title-time"></div>',
        '</div>',
        '<div class="u-date-week"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>',
        '<div class="u-date-content-panel"></div>',
        '</div>'
    ].join("");
    datePage = makeDOM(template);
    this._headerYear = datePage.querySelector('.u-date-content-title-year');
    this._headerYear.innerHTML = year;
    this._headerMonth = datePage.querySelector('.u-date-content-title-month');
    this._headerMonth.innerHTML = month;
    this._headerDate = datePage.querySelector('.u-date-content-title-date');
    this._headerDate.innerHTML = date$$1;
    this._headerTime = datePage.querySelector('.u-date-content-title-time');
    this._headerTime.innerHTML = time;
    if (this.type == 'date') {
        this._headerTime.style.display = 'none';
    }

    on(this._headerYear, 'click', function(e) {
        self._fillYear();
        stopEvent(e);
    });

    on(this._headerMonth, 'click', function(e) {
        self._fillMonth();
        stopEvent(e);
    });

    on(this._headerTime, 'click', function(e) {
        self._fillTime();
        stopEvent(e);
    });

    weekSpans = datePage.querySelectorAll('.u-date-week span');

    for (var i = 0; i < 7; i++) {
        weekSpans[i].innerHTML = date._jsonLocale.weekdaysMin[i];
    }
    dateDiv = datePage.querySelector('.u-date-content-panel');
    tempDate = this.startDate;


    while (tempDate <= this.endDate) {
        var tempDateMonth = tempDate.getMonth(),
            tempDateYear = tempDate.getFullYear(),
            tempDateDate = tempDate.getDate();
        cell = makeDOM('<div class="u-date-cell" unselectable="on" onselectstart="return false;">' + tempDateDate + '</div>');
        if (tempDateYear == this.pickerDate.getFullYear() && tempDateMonth == this.pickerDate.getMonth() &&
            tempDateDate == this.pickerDate.getDate()) {
            addClass(cell, 'current');
        }

        if (this.beginYear) {
            if (tempDateYear < this.beginYear || (tempDateYear == this.beginYear && tempDateMonth < this.beginMonth) ||
                (tempDateYear == this.beginYear && tempDateMonth == this.beginMonth &&
                    tempDateDate < this.beginDate)) {
                addClass(cell, 'u-disabled');
                removeClass(cell, 'current');
            }


        }
        if (this.overYear) {
            if (tempDateYear > this.overYear || (tempDateYear == this.overYear && tempDateMonth > this.overMonth) ||
                (tempDateYear == this.overYear && tempDateMonth == this.overMonth &&
                    tempDateDate > this.overDate)) {
                addClass(cell, 'u-disabled');
                removeClass(cell, 'current');
            }
        }

        cell._value = tempDateDate;
        cell._month = tempDateMonth;
        cell._year = tempDateYear;
        new URipple(cell);
        dateDiv.appendChild(cell);
        tempDate = date.add(tempDate, 'd', 1);
    }
    on(dateDiv, 'click', function(e) {
        if (hasClass(e.target, 'u-disabled')) return;
        var _d = e.target._value;
        if (!_d) return;
        this.pickerDate.setFullYear(e.target._year);
        this.pickerDate.setMonth(e.target._month);
        this.pickerDate.setDate(_d);
        this.pickerDate.setMonth(e.target._month);
        this.pickerDate.setDate(_d);
        if (this.pickerDate) {
            this.resetDataObj(this.pickerDate);
        }

        var _cell = e.target.parentNode.querySelector('.u-date-cell.current');
        if (_cell) {
            removeClass(_cell, 'current');
            if (env.isIE8 || env.isIE9)
                _cell.style.backgroundColor = "#fff";
        }
        addClass(e.target, 'current');
        if (env.isIE8 || env.isIE9)
            e.target.style.backgroundColor = '#3f51b5';
        this._updateDate();
        if (this.type === 'date') {
            this.onOk();
        }
    }.bind(this));
    if (type === 'current') {
        this._zoomIn(datePage);
    } else if (type === 'next') {
        this._carousel(datePage, 'left');
    } else if (type === 'preivous') {
        this._carousel(datePage, 'right');
    }
    this.currentPanel = 'date';
};


/**
 * 填充时间选择面板
 * @private
 */
DateTimePicker.fn._fillTime = function(type) {
    // if (env.isMobile) {
    //     this._timeMobileScroll()
    //     return;
    // }
    if (this.timeOpen) return;
    this.timeOpen = true;
    var year, month, day, date$$1, time, template, timePage, titleDiv, dateDiv, weekSpans, language, tempDate, i, cell, timetemplate;
    var self = this;
    type = type || 'current';
    if ('current' === type) {
        tempDate = this.pickerDate;
    } else if (type === 'preivous') {
        tempDate = date.sub(this.startDate, 'd', 1);
    } else {
        tempDate = date.add(this.endDate, 'd', 1);
    }
    this.startDate = this._getPickerStartDate(tempDate);
    this.endDate = this._getPickerEndDate(tempDate);

    language = core.getLanguages();
    year = date._formats['YYYY'](tempDate);
    month = date._formats['MM'](tempDate, language);
    date$$1 = date._formats['DD'](tempDate, language);
    time = date._formats['HH'](tempDate, language) + ':' + date._formats['mm'](tempDate, language) + ':' + date._formats['ss'](tempDate, language);


    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">',
        '<div class="u-date-content-title-year"></div>-',
        '<div class="u-date-content-title-month"></div>-',
        '<div class="u-date-content-title-date"></div>',
        '<div class="u-date-content-title-time"></div>',
        '</div>',
        '<div class="u-date-content-panel"></div>',
        '</div>'
    ].join("");
    timePage = makeDOM(template);
    //    titleDiv = timePage.querySelector('.u-date-content-title');
    //    titleDiv.innerHTML = year + ' ' + month + ' ' +day ;
    this._headerYear = timePage.querySelector('.u-date-content-title-year');
    this._headerYear.innerHTML = year;
    this._headerMonth = timePage.querySelector('.u-date-content-title-month');
    this._headerMonth.innerHTML = month;
    this._headerDate = timePage.querySelector('.u-date-content-title-date');
    this._headerDate.innerHTML = date$$1;
    this._headerTime = timePage.querySelector('.u-date-content-title-time');
    this._headerTime.innerHTML = time;


    this.editTimeShow = false;

    function editTime(obj) {
        var inputTemplate = "<div><input class='editTime' value='' maxlength='8' /></div>";
        obj._headerTime.innerHTML = inputTemplate;

        var editTime = timePage.querySelector('.editTime');
        obj.editTimeShow = true;
        editTime.focus();
        on(editTime, 'keydown', function(e) {
            var code = e.keyCode;
            var value = this.value;
            if (!((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 37 || code == 102 || code == 39 || code == 8 || code == 46 || code == 110 || code == 190)) {
                stopEvent(e);
            }
            var length = value.length;
            if (length && code != 8) {
                if (length == 2 || length == 5) {
                    value = value += ':';
                }
            }

            this.value = value;
        });

        on(editTime, 'keyup', function(e) {
            var value = this.value,
                length = value.length,
                valueArray = [];
            if (length == 8 && (value[0] <= 2 && value[0] >= 0) && (value[1] <= 3 && value[1] >= 0) && (value[3] <= 5 && value[3] >= 0) && (value[6] <= 5 && value[6] >= 0)) {
                valueArray = value.split(':');
                obj.pickerDate.setHours(valueArray[0]);
                obj.pickerDate.setMinutes(valueArray[1]);
                obj.pickerDate.setSeconds(valueArray[2]);
            }
        });

    }




    if (this.type == 'date') {
        this._headerTime.style.display = 'none';
    }

    on(this._headerYear, 'click', function(e) {
        self._fillYear();
        stopEvent(e);
    });

    on(this._headerMonth, 'click', function(e) {
        self._fillMonth();
        stopEvent(e);
    });

    on(this._headerTime, 'click', function(e) {
        if (self.currentView == 'hours' && !self.editTimeShow) {
            editTime(self);
        } else {
            self.editTimeShow = false;
        }
        self._fillTime();
        self.timeOpen = true;
        stopEvent(e);
    });

    dateDiv = timePage.querySelector('.u-date-content-panel');
    // tempDate = this.startDate;
    // while(tempDate <= this.endDate){
    // cell = makeDOM('<div class="u-date-cell">'+ udate._formats['HH'](tempDate,language) +'</div>');
    // if (tempDate.getFullYear() == this.pickerDate.getFullYear() && tempDate.getMonth() == this.pickerDate.getMonth()
    // && tempDate.getDate() == this.pickerDate.getDate()){
    // addClass(cell, 'current');
    // }
    // cell._value = tempDate.getDate();
    // new URipple(cell);
    // dateDiv.appendChild(cell);
    // tempDate = udate.add(tempDate, 'd', 1);
    // }
    if (env.isIE8) { // IE8/IE9保持原来，非IE8/IE9使用clockpicker
        timetemplate = ['<div class="u_time_box">',
            '<div class="u_time_cell">',
            //'<div class="add_hour_cell"><i class="add_hour_cell icon-angle-up"></i></div>',
            '<div class="show_hour_cell">' + date._formats['HH'](tempDate) + '</div>',
            //'<div class="subtract_hour_cell"><i class="subtract_hour_cell icon-angle-down"></i></div>',
            '</div>',
            '<div class="u_time_cell">',
            //'<div class="add_min_cell"><i class="add_min_cell icon-angle-up"></i></div>',
            '<div class="show_min_cell">' + date._formats['mm'](tempDate) + '</div>',
            //'<div class="subtract_min_cell"><i class="subtract_min_cell icon-angle-down"></i></div>',
            '</div>',
            '<div class="u_time_cell">',
            //'<div class="add_sec_cell"><i class="add_sec_cell icon-angle-up"></i></div>',
            '<div class="show_sec_cell">' + date._formats['ss'](tempDate) + '</div>',
            //'<div class="subtract_sec_cell"><i class="subtract_sec_cell icon-angle-down"></i></div>',
            '</div>',
            '</div>'
        ].join("");
        cell = makeDOM(timetemplate);
        dateDiv.appendChild(cell);
        on(dateDiv, 'click', function(e) {
            var _arrary = e.target.getAttribute("class").split("_");
            if (_arrary[0] == "add") {
                if (_arrary[1] == "hour") {
                    var tmph = Number(date._formats['HH'](this.pickerDate));
                    if (tmph < 23) {
                        tmph++;
                    } else {
                        tmph = 0;
                    }

                    this.pickerDate.setHours(tmph);
                    dateDiv.querySelector(".show_hour_cell").innerHTML = tmph;
                } else if (_arrary[1] == "min") {
                    var tmpm = Number(date._formats['mm'](this.pickerDate));
                    if (tmpm < 59) {
                        tmpm++;
                    } else {
                        tmpm = 0;
                    }
                    this.pickerDate.setMinutes(tmpm);
                } else if (_arrary[1] == "sec") {
                    var tmps = Number(date._formats['ss'](this.pickerDate));
                    if (tmps < 59) {
                        tmps++;
                    } else {
                        tmps = 0;
                    }
                    this.pickerDate.setSeconds(tmps);
                }
            } else if (_arrary[0] == "subtract") {
                if (_arrary[1] == "hour") {
                    var tmph = Number(date._formats['HH'](this.pickerDate));
                    if (tmph > 0) {
                        tmph--;
                    } else {
                        tmph = 23;
                    }
                    this.pickerDate.setHours(tmph);

                } else if (_arrary[1] == "min") {
                    var tmpm = Number(date._formats['mm'](this.pickerDate));
                    if (tmpm > 0) {
                        tmpm--;
                    } else {
                        tmpm = 59;
                    }
                    this.pickerDate.setMinutes(tmpm);
                } else if (_arrary[1] == "sec") {
                    var tmps = Number(date._formats['ss'](this.pickerDate));
                    if (tmps > 0) {
                        tmps--;
                    } else {
                        tmps = 59;
                    }
                    this.pickerDate.setSeconds(tmps);
                }
            } else if (_arrary[0] == "show") {
                var tmptarget = e.target;
                var tmpinput = makeDOM("<input type='text' class='u-input'>");
                if (tmptarget.querySelector('.u-input')) return;
                this._updateDate();
                tmpinput.value = tmptarget.innerHTML;
                tmptarget.innerHTML = "";
                tmptarget.appendChild(tmpinput);
                if (_arrary[1] == "hour") {
                    var vali = new Validate(tmpinput, {
                        validType: "integer",
                        minLength: 0,
                        maxLength: 2,
                        min: 0,
                        max: 23
                    });
                    on(tmpinput, 'blur', function() {
                        if (vali.passed) {
                            self.pickerDate.setHours(tmpinput.value);
                            self._updateDate();
                        }
                    });
                } else if (_arrary[1] == "min") {
                    var vali = new Validate(tmpinput, {
                        validType: "integer",
                        minLength: 0,
                        maxLength: 2,
                        min: 0,
                        max: 59
                    });
                    on(tmpinput, 'blur', function() {
                        if (vali.passed) {
                            self.pickerDate.setMinutes(tmpinput.value);
                            self._updateDate();
                        }
                    });
                } else if (_arrary[1] == "sec") {
                    var vali = new Validate(tmpinput, {
                        validType: "integer",
                        minLength: 0,
                        maxLength: 2,
                        min: 0,
                        max: 59
                    });
                    on(tmpinput, 'blur', function() {
                        if (vali.passed) {
                            self.pickerDate.setSeconds(tmpinput.value);
                            self._updateDate();
                        }
                    });
                }

                tmpinput.focus();
                return;

            } else {
                return false;
            }

            this._updateDate();
        }.bind(this));
    } else {
        timetemplate = '<div class="u-combo-ul clockpicker-popover is-visible" style="width:100%;padding:0px;">';
        //        timetemplate += '<div class="popover-title"><span class="clockpicker-span-hours">02</span> : <span class="clockpicker-span-minutes text-primary">01</span><span class="clockpicker-span-am-pm"></span></div>';
        timetemplate += '<div class="popover-content">';
        timetemplate += '  <div class="clockpicker-plate data-clockpicker-plate">';
        timetemplate += '      <div class="clockpicker-canvas">';
        timetemplate += '          <svg class="clockpicker-svg">';
        timetemplate += '              <g transform="translate(100,100)">';
        timetemplate += '                  <circle class="clockpicker-canvas-bg clockpicker-canvas-bg-trans" r="13" cx="8.362277061412277" cy="-79.56175162946187"></circle>';
        timetemplate += '                  <circle class="clockpicker-canvas-fg" r="3.5" cx="8.362277061412277" cy="-79.56175162946187"></circle>';
        timetemplate += '                  <line x1="0" y1="0" x2="8.362277061412277" y2="-79.56175162946187"></line>';
        timetemplate += '                  <circle class="clockpicker-canvas-bearing" cx="0" cy="0" r="2"></circle>';
        timetemplate += '              </g>';
        timetemplate += '          </svg>';
        timetemplate += '      </div>';
        timetemplate += '      <div class="clockpicker-dial clockpicker-hours" style="visibility: visible;">';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-1" >00</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-2" >1</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-3" >2</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-4" >3</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-5" >4</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-6" >5</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-7" >6</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-8" >7</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-9" >8</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-10" >9</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-11" >10</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-12" >11</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-13" >12</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-14" >13</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-15" >14</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-16" >15</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-17" >16</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-18" >17</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-19" >18</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-20" >19</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-21" >20</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-22" >21</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-23" >22</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-24" >23</div>';
        timetemplate += '      </div>';
        timetemplate += '      <div class="clockpicker-dial clockpicker-minutes" style="visibility: hidden;">';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-25" >00</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-26" >05</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-27" >10</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-28" >15</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-29" >20</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-30" >25</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-31" >30</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-32" >35</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-33" >40</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-34" >45</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-35" >50</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-36" >55</div>';
        timetemplate += '      </div>';

        timetemplate += '      <div class="clockpicker-dial clockpicker-seconds" style="visibility: hidden;">';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-25" >00</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-26" >05</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-27" >10</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-28" >15</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-29" >20</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-30" >25</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-31" >30</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-32" >35</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-33" >40</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-34" >45</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-35" >50</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-36" >55</div>';
        timetemplate += '      </div>';

        timetemplate += '  </div><span class="clockpicker-am-pm-block"></span></div>';
        timetemplate += '  </div>';
        cell = makeDOM(timetemplate);
        this.cell = cell;
        dateDiv.appendChild(cell);

        this.hand = cell.querySelector('line');
        this.bg = cell.querySelector('.clockpicker-canvas-bg');
        this.fg = cell.querySelector('.clockpicker-canvas-fg');
        this.titleHourSpan = cell.querySelector('.clockpicker-span-hours');
        this.titleMinSpan = cell.querySelector('.clockpicker-span-minutes');
        this.titleSecSpan = cell.querySelector('.clockpicker-span-seconds');
        this.hourDiv = cell.querySelector('.clockpicker-hours');
        this.minDiv = cell.querySelector('.clockpicker-minutes');
        this.secDiv = cell.querySelector('.clockpicker-seconds');
        this.currentView = 'hours';
        this.hours = date._formats['HH'](tempDate);
        this.min = date._formats['mm'](tempDate);
        this.sec = date._formats['ss'](tempDate);
        //this.titleHourSpan.innerHTML = this.hours;
        //this.titleMinSpan.innerHTML = this.min;



        on(this.hourDiv, 'click', function(e) {
            var target = e.target;
            if (hasClass(target, 'clockpicker-tick')) {
                this.hours = target.innerHTML;
                this.hours = this.hours > 9 || this.hours == 0 ? '' + this.hours : '0' + this.hours;
                // this.titleHourSpan.innerHTML = this.hours;
                self.pickerDate.setHours(this.hours);
                var language = core.getLanguages();
                var time = date._formats['HH'](this.pickerDate, language) + ':' + date._formats['mm'](this.pickerDate, language) + ':' + date._formats['ss'](this.pickerDate, language);
                this._headerTime.innerHTML = time;
                this.hourDiv.style.visibility = 'hidden';
                this.minDiv.style.visibility = 'visible';
                this.currentView = 'min';
                this.setHand();
            }
        }.bind(this));

        on(this.minDiv, 'click', function(e) {
            var target = e.target;
            if (hasClass(target, 'clockpicker-tick')) {
                this.min = target.innerHTML;
                // this.min = this.min > 9 || this.min  == 00? '' + this.min:'0' + this.min;
                // this.titleMinSpan.innerHTML = this.min;
                self.pickerDate.setMinutes(this.min);
                var language = core.getLanguages();
                var time = date._formats['HH'](this.pickerDate, language) + ':' + date._formats['mm'](this.pickerDate, language) + ':' + date._formats['ss'](this.pickerDate, language);
                this._headerTime.innerHTML = time;
                this.minDiv.style.visibility = 'hidden';
                this.secDiv.style.visibility = 'visible';
                this.currentView = 'sec';
                this.setHand();
            }
        }.bind(this));

        on(this.secDiv, 'click', function(e) {
            var target = e.target;
            if (hasClass(target, 'clockpicker-tick')) {
                this.sec = target.innerHTML;
                // this.min = this.min > 9 || this.min  == 00? '' + this.min:'0' + this.min;
                // this.titleMinSpan.innerHTML = this.min;
                self.pickerDate.setSeconds(this.sec);
                var language = core.getLanguages();
                var time = date._formats['HH'](this.pickerDate, language) + ':' + date._formats['mm'](this.pickerDate, language) + ':' + date._formats['ss'](this.pickerDate, language);
                this._headerTime.innerHTML = time;
                this.secDiv.style.visibility = 'hidden';
                this.hourDiv.style.visibility = 'visible';
                this.currentView = 'hours';
                this.setHand();
            }
        }.bind(this));

    }

    this._zoomIn(timePage);
    if (!env.isIE8)
        this.setHand();
    this.currentPanel = 'time';
    dateDiv.onselectstart = new Function("return false");

    var value = timePage.querySelector('.u-date-content-title-time').innerHTML;
    var inputTemplate = '<div><input value=' + value + ' /></div>';


};



DateTimePicker.fn.setHand = function() {
    var dialRadius = 100,
        innerRadius = 54,
        outerRadius = 80;
    var view = this.currentView,
        value = this[view],
        isHours = view === 'hours',
        unit = Math.PI / (isHours ? 6 : 30),
        radian = value * unit,
        radius = isHours && value > 0 && value < 13 ? innerRadius : outerRadius,
        x = Math.sin(radian) * radius,
        y = -Math.cos(radian) * radius;
    this.setHandFun(x, y);
};

DateTimePicker.fn.setHandFun = function(x, y, roundBy5, dragging) {
    var dialRadius = 100,
        innerRadius = 54,
        outerRadius = 80;

    var radian = Math.atan2(x, -y),
        isHours = this.currentView === 'hours',
        unit = Math.PI / (isHours ? 6 : 30),
        z = Math.sqrt(x * x + y * y),
        options = this.options,
        inner = isHours && z < (outerRadius + innerRadius) / 2,
        radius = inner ? innerRadius : outerRadius,
        value;

    if (this.twelvehour) {
        radius = outerRadius;
    }

    // Radian should in range [0, 2PI]
    if (radian < 0) {
        radian = Math.PI * 2 + radian;
    }

    // Get the round value
    value = Math.round(radian / unit);

    // Get the round radian
    radian = value * unit;

    // Correct the hours or minutes
    if (options.twelvehour) {
        if (isHours) {
            if (value === 0) {
                value = 12;
            }
        } else {
            if (roundBy5) {
                value *= 5;
            }
            if (value === 60) {
                value = 0;
            }
        }
    } else {
        if (isHours) {
            if (value === 12) {
                value = 0;
            }
            value = inner ? (value === 0 ? 12 : value) : value === 0 ? 0 : value + 12;
        } else {
            if (roundBy5) {
                value *= 5;
            }
            if (value === 60) {
                value = 0;
            }
        }
    }

    // Set clock hand and others' position
    var w = this._panel.offsetWidth;
    var u = w / 294;
    var cx = Math.sin(radian) * radius * u,
        cy = -Math.cos(radian) * radius * u;
    var iu = 100 * u;
    this.cell.querySelector('g').setAttribute('transform', 'translate(' + iu + ',' + iu + ')');
    this.hand.setAttribute('x2', cx);
    this.hand.setAttribute('y2', cy);
    this.bg.setAttribute('cx', cx);
    this.bg.setAttribute('cy', cy);
    this.fg.setAttribute('cx', cx);
    this.fg.setAttribute('cy', cy);
};

/**
 * 重新渲染面板
 * @private
 */
DateTimePicker.fn._updateDate = function() {
    var year, month, week, date$$1, time, hour, minute, seconds, language;

    language = core.getLanguages();
    year = date._formats['YYYY'](this.pickerDate);
    // week = udate._formats['ddd'](this.pickerDate, language);
    month = date._formats['MM'](this.pickerDate, language);
    time = date._formats['HH'](this.pickerDate, language) + ':' + date._formats['mm'](this.pickerDate, language) + ':' + date._formats['ss'](this.pickerDate, language);

    //TODO 多语
    // date = udate._formats['D'](this.pickerDate) + '日';
    date$$1 = date._formats['DD'](this.pickerDate, language);
    if (this._headerYear) {
        this._headerYear.innerHTML = '';
        this._headerYear.innerHTML = year;
    }
    // this._headerWeak.innerHTML = '';
    // this._headerWeak.innerHTML = week;
    if (this._headerMonth) {
        this._headerMonth.innerHTML = '';
        this._headerMonth.innerHTML = month;
    }
    if (this._headerDate) {
        this._headerDate.innerHTML = '';
        this._headerDate.innerHTML = date$$1;
    }
    if (this._headerTime) {
        this._headerTime.innerHTML = '';
        this._headerTime.innerHTML = time;
    }
    if (this.currentPanel == 'time') {
        if (env.isIE8) {
            this._panel.querySelector(".show_hour_cell").innerHTML = date._formats['HH'](this.pickerDate, language);
            this._panel.querySelector(".show_min_cell").innerHTML = date._formats['mm'](this.pickerDate, language);
            this._panel.querySelector(".show_sec_cell").innerHTML = date._formats['ss'](this.pickerDate, language);
        }
    }

};


DateTimePicker.fn._response = function() {
    return;
    var bodyHeight = document.body.offsetHeight; //395
    var _height = 430;
    if (this.type === 'date' && !(env.isMobile))
        _height = 395;
    if (bodyHeight > _height) {
        this._panel.style.height = _height;
    }
    //if (bodyHeight > 500){
    //    this._panel.style.height =  '500px';
    //}
    //this._dateContent.style.height =panelHeight - 158 + 'px';   // 106 52
};

var dateTimePickerTemplateArr = ['<div class="u-date-panel">',
    '<div class="u-date-body">',
    '<div class="u-date-content"></div>',
    '</div>',
    '<div class="u-date-nav">',
    '<button type="button" class="u-button u-date-ok right primary">',
    trans('public.confirm', '确定'),
    '</button>',
    '<button type="button" class="u-button u-date-cancel right">',
    trans('public.cancel', '取消'),
    '</button>',
    '<button type="button" class="u-button u-date-clean">',
    trans('public.clear', '清空'),
    '</button>',
    '</div>',
    '</div>'
];


/******************************
 *  Public method
 ******************************/

DateTimePicker.fn.show = function(evt) {
    if (!this.enable) {
        return;
    }
    var inputValue = this._input.value;
    if (typeof this.timezone != 'undefined' && this.timezone != null && this.timezone != '') {
        // inputValue = udate.strToDateByTimezone(inputValue, this.timezone);
        if (inputValue) {
            this.date = new Date(inputValue);
        } else {
            this.date = date.getDateByTimeZonec2z(new Date(), this.timezone, this.type);
        }
    } else {
        this.setDate(inputValue);
    }



    var self = this;
    if (!this._panel) {
        this._panel = makeDOM(dateTimePickerTemplateArr.join(""));
        /*if(env.isMobile){
            removeClass(this._panel,'u-date-panel')
            addClass(this._panel,'u-date-panel-mobile');
        }*/
        this._dateNav = this._panel.querySelector('.u-date-nav');
        // if (this.type === 'date' && !env.isMobile){
        //    this._dateNav.style.display = 'none';
        // }
        // 如果是日期类型，取消显示确认和取消按钮
        if (this.type === 'date' && !env.isMobile) {
            this._dateOk = this._panel.querySelector('.u-date-ok');
            this._dateCancel = this._panel.querySelector('.u-date-cancel');
            this._dateOk.style.display = 'none';
            this._dateCancel.style.display = 'none';
        }

        this._dateContent = this._panel.querySelector('.u-date-content');
        if (this.type == 'datetime') {
            /*if(env.isMobile){
                this._dateContent.style.height = '226/16*2rem';
            }
            else{
                this._dateContent.style.height = '226px';
            }*/
        }
        this.btnOk = this._panel.querySelector('.u-date-ok');
        this.btnCancel = this._panel.querySelector('.u-date-cancel');
        this.btnClean = this._panel.querySelector('.u-date-clean');
        var rippleContainer = document.createElement('span');
        addClass(rippleContainer, 'u-ripple');
        this.btnOk.appendChild(rippleContainer);
        var rippleContainer = document.createElement('span');
        addClass(rippleContainer, 'u-ripple');
        this.btnCancel.appendChild(rippleContainer);
        var rippleContainer = document.createElement('span');
        addClass(rippleContainer, 'u-ripple');
        this.btnClean.appendChild(rippleContainer);
        new URipple(this.btnOk);
        new URipple(this.btnCancel);
        new URipple(this.btnClean);
        on(this.btnOk, 'click', function(e) {
            this.onOk();
            stopEvent(e);
        }.bind(this));
        on(this.btnCancel, 'click', function(e) {
            self.onCancel();
            stopEvent(e);
        });
        on(this.btnClean, 'click', function(e) {
            self.pickerDate = null;
            self.onOk();
            stopEvent(e);
        });


        // this.preBtn = makeDOM('<button class="u-date-pre-button u-button flat floating mini">&lt;</button>');
        // this.nextBtn = makeDOM('<button class="u-date-next-button u-button flat floating mini">&gt;</button>');
        this.preBtn = makeDOM('<button class="u-date-pre-button u-button mini">&lt;</button>');
        this.nextBtn = makeDOM('<button class="u-date-next-button u-button mini">&gt;</button>');
        // new u.Button(this.nextBtn);

        on(this.preBtn, 'click', function(e) {
            if (self.currentPanel == 'date') {
                self._fillDate('preivous');
            } else if (self.currentPanel == 'year') {
                self._fillYear('preivous');
            }
            stopEvent(e);
        });
        on(this.nextBtn, 'click', function(e) {
            if (self.currentPanel == 'date') {
                self._fillDate('next');
            } else if (self.currentPanel == 'year') {
                self._fillYear('next');
            }
            stopEvent(e);
        });
        // if(!env.isMobile){
        this._dateContent.appendChild(this.preBtn);
        this._dateContent.appendChild(this.nextBtn);
        // }



    }
    this.pickerDate = this.date || new Date();
    this._updateDate();
    this._fillDate();
    this._response();
    on(window, 'resize', function() {
        self._response();
    });
    /*if(env.isMobile){
        this.overlayDiv = makeModal(this._panel);
        on(this.overlayDiv, 'click', function(){
            self.onCancel();
        })
    }*/
    addClass(this._panel, 'is-visible');
    if (!env.isMobile) {
        if (this.options.showFix) {
            document.body.appendChild(this._panel);
            this._panel.style.position = 'fixed';
            showPanelByEle({
                ele: this._input,
                panel: this._panel,
                position: "bottomLeft"
            });
        } else {
            var bodyWidth = document.body.clientWidth,
                bodyHeight = document.body.clientHeight,
                panelWidth = this._panel.offsetWidth,
                panelHeight = this._panel.offsetHeight;
            //调整left和top
            // this._element.parentNode.appendChild(this._panel);
            this._element.appendChild(this._panel);
            this._element.style.position = 'relative';
            // this.left = this.element.offsetLeft;
            //
            this.left = this._input.offsetLeft;
            var inputHeight = this._input.offsetHeight;
            // this.top = this.element.offsetTop + inputHeight;
            this.top = this._input.offsetTop + inputHeight;

            var abLeft = getElementLeft(this._input),
                abTop = getElementTop(this._input);

            if (abLeft + panelWidth > bodyWidth) {
                if (abLeft - bodyWidth > 0) {
                    this.left = -panelWidth;
                } else {
                    this.left = bodyWidth - panelWidth - abLeft;
                }
            }

            if ((abTop + panelHeight) > bodyHeight) {
                if (abTop - bodyHeight > 0) {
                    this.top = -panelHeight;
                } else {
                    this.top = bodyHeight - panelHeight - abTop;
                }
            }


            this._panel.style.left = this.left + 'px';
            this._panel.style.top = this.top + 'px';

        }


        this._panel.style.marginLeft = '0px';
        var callback = function(e) {
            if (e !== evt && e.target !== self._input && !hasClass(e.target, 'u-date-content-year-cell') && !hasClass(e.target, 'u-date-content-year-cell') && closest(e.target, 'u-date-panel') !== self._panel && self._inputFocus != true) {
                off(document, 'click', callback);
                self.onCancel();
            }
        };
        on(document, 'click', callback);


        //tab事件
        on(self._input, 'keydown', function(e) {
            var keyCode = e.keyCode;
            if (keyCode == 9) {
                self.onCancel();
            }
        });

    }

    this.isShow = true;
};


/**
 * 确定事件
 */
DateTimePicker.fn.onOk = function() {
    if (typeof this.options.beforeValueChangeFun == 'function') {
        if (!this.options.beforeValueChangeFun.call(this, this.pickerDate)) {
            return;
        }
    }
    if (this.pickerDate && this.pickerDate.setMilliseconds)
        this.pickerDate.setMilliseconds(0);
    var flag = true;
    if (this.beginDateObj) {
        if (this.pickerDate && this.pickerDate.getTime() < this.beginDateObj.getTime())
            flag = false;
    }
    if (this.overDateObj) {
        if (this.pickerDate && this.pickerDate.getTime() > this.overDateObj.getTime())
            flag = false;
    }
    if (flag) {
        if (typeof this.timezone != 'undefined' && this.timezone != null && this.timezone != '') {
            this.setDate(date.getDateByTimeZonez2c(this.pickerDate, this.timezone));
        } else {
            this.setDate(this.pickerDate);
        }

    }
    this.isShow = false;
    this.timeOpen = false;
    removeClass(this._panel, 'is-visible');
    try {
        document.body.removeChild(this.overlayDiv);
    } catch (e) {

    }
    if (flag) {
        var v = this.pickerDate;
        if (typeof this.timezone != 'undefined' && this.timezone != null && this.timezone != '') {
            v = date.getDateByTimeZonez2c(this.pickerDate, this.timezone);
        }
        this.trigger('select', {
            value: v
        });
        this.trigger('validate');
        if (u.isIE || u.isEdge) {
            this.element.querySelector('input').blur();
        }
    }

};

DateTimePicker.fn.hide = function() {
    this.isShow = false;
    this.timeOpen = false;
    removeClass(this._panel, 'is-visible');
};

/**
 * 确定事件
 */
DateTimePicker.fn.onCancel = function() {
    this.isShow = false;
    this.timeOpen = false;
    removeClass(this._panel, 'is-visible');
    try {
        document.body.removeChild(this.overlayDiv);
    } catch (e) {

    }
    this.trigger('validate');
};


DateTimePicker.fn.setDate = function(value) {
    if (!value) {
        this.date = null;
        this._input.value = '';
        return;
    }
    var obj = {};
    obj.timezone = this.timezone;
    var _date = date.getDateObj(value, obj);
    if (_date) {
        if (_date.setMilliseconds)
            _date.setMilliseconds(0);
        if (_date) {
            this.resetDataObj(_date);
        }
        if (this.beginDateObj) {
            if (this.beginDateObj) {
                this.resetDataObj(this.beginDateObj);
            }
            if (_date.getTime() < this.beginDateObj.getTime())
                return;
        }
        if (this.overDateObj) {
            if (this.overDateObj) {
                this.resetDataObj(this.overDateObj);
            }
            if (_date.getTime() > this.overDateObj.getTime())
                return;
        }
        this.date = _date;
        this._input.value = date.format(this.date, this.format);
    }

};
/**
 *设置format
 * @param format
 */
DateTimePicker.fn.setFormat = function(format) {
    this.format = format;
    this._input.value = date.format(this.date, this.format);
};

DateTimePicker.fn.setStartDate = function(startDate, type) {
    if (startDate) {
        var obj = {};
        obj.timezone = this.timezone;
        this.beginDateObj = date.getDateObj(startDate, obj);
        if (this.beginDateObj) {
            this.resetDataObj(this.beginDateObj);
            if (this.beginDateObj.setMilliseconds)
                this.beginDateObj.setMilliseconds(0);
        }
        /*if(type){
            switch (type) {
                case 'YYYY-MM':
                this.beginDateObj = udate.add(this.beginDateObj, 'M', 1);
                    break;
                case 'YYYY-MM-DD':
                this.beginDateObj = udate.add(this.beginDateObj, 'd', 1);
                    break;
            }
        }*/

        this.beginYear = this.beginDateObj.getFullYear();
        this.beginMonth = this.beginDateObj.getMonth();
        this.beginDate = this.beginDateObj.getDate();

    } else {
        this.beginDateObj = null;
        this.beginYear = null;
        this.beginMonth = null;
        this.beginDate = null;
    }

};


DateTimePicker.fn.setEndDate = function(endDate) {
    if (endDate) {
        var obj = {};
        obj.timezone = this.timezone;
        this.overDateObj = date.getDateObj(endDate, obj);
        if (this.overDateObj) {
            this.resetDataObj(this.overDateObj);
            if (this.overDateObj.setMilliseconds)
                this.overDateObj.setMilliseconds(0);
        }
        this.overYear = this.overDateObj.getFullYear();
        this.overMonth = this.overDateObj.getMonth();
        this.overDate = this.overDateObj.getDate();
    } else {
        this.overDateObj = null;
        this.overYear = null;
        this.overMonth = null;
        this.overDate = null;
    }
};

DateTimePicker.fn.setEnable = function(enable) {
    if (enable === true || enable === 'true') {
        this.enable = true;
    } else {
        this.enable = false;
    }
};

DateTimePicker.fn.resetDataObj = function(dataObj) {
    if (this.format.indexOf('h') < 0 && this.format.indexOf('H') < 0) {
        dataObj.setHours(0);
    }
    if (this.format.indexOf('m') < 0) {
        dataObj.setMinutes(0);
    }
    if (this.format.indexOf('s') < 0) {
        dataObj.setSeconds(0);
        dataObj.setMilliseconds(0);
    }
};

if (!env.isMobile) {
    if (u.compMgr)
        u.compMgr.regComp({
            comp: DateTimePicker,
            compAsString: 'u.DateTimePicker',
            css: 'u-datepicker'
        });
}

/**
 * Module : Kero datetime
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 14:59:37
 */


var DateTimeAdapter = u.BaseAdapter.extend({
    init: function() {
        var self = this,
            adapterType, format;
        if (this.options.type === 'u-date') {
            this.adapterType = 'date';
        } else {
            this.adapterType = 'datetime';
            addClass(this.element, 'time');
        }

        this.timezone = this.getOption('timezone') || getCookie(U_TIMEZONE);

        if(!this.options['format'] && typeof getFormatFun == 'function'){
          // 根据语种获取format
          this.options['format'] = getFormatFun();

        }

        this.beforeValueChangeFun = getFunction(this.viewModel, this.options['beforeValueChangeFun']);

        this.maskerMeta = core.getMaskerMeta(this.adapterType) || {};
        this.maskerMeta.format = this.options['format'] || this.maskerMeta.format;
        if (this.dataModel) {
            this.dataModel.on(this.field + '.format.' + DataTable$1.ON_CURRENT_META_CHANGE, function(event) {
                self.setFormat(event.newValue);
            });
        }

        if (this.dataModel && !this.options['format'])
            this.options.format = this.dataModel.getMeta(this.field, "format");

        if (!this.options['format']) {
            if (this.options.type === 'u-date') {
                this.options.format = "YYYY-MM-DD";
            } else if (this.options.type === 'year') {
                this.options.format = "YYYY";
            } else if (this.options.type === 'month') {
                this.options.format = "MM";
            } else if (this.options.type === 'yearmonth') {
                this.options.format = "YYYY-MM";
            } else {
                this.options.format = "YYYY-MM-DD HH:mm:ss";
            }
        }
        format = this.options.format;
        this.maskerMeta.format = format || this.maskerMeta.format;

        this.startField = this.options.startField ? this.options.startField : this.dataModel.getMeta(this.field, "startField");

        this.endField = this.options.endField ? this.options.endField : this.dataModel.getMeta(this.field, "endField");

        // this.formater = new $.DateFormater(this.maskerMeta.format);
        // this.masker = new DateTimeMasker(this.maskerMeta);
        this.op = {};
        var mobileDateFormat = "",
            mobileTimeFormat = "",
            dateOrder = "",
            timeOrder = "";
        if (env.isMobile) {
            switch (format) {
                case "YYYY-MM-DD":
                    mobileDateFormat = "yy-mm-dd";
                    dateOrder = mobileDateFormat.replace(/-/g, '');
                    break;
                case "YYYY-MM-DD HH:mm":
                    mobileDateFormat = "yy-mm-dd";
                    mobileTimeFormat = "HH:ii";
                    dateOrder = mobileDateFormat.replace(/-/g, '');
                    timeOrder = mobileTimeFormat.replace(/\:/g, '');
                    break;
                case "YYYY-MM":
                    mobileDateFormat = "yy-mm";
                    dateOrder = mobileDateFormat.replace(/-/g, '');
                    break;
                default:
                    mobileDateFormat = "yy-mm-dd";
                    mobileTimeFormat = "HH:ii:ss";
                    dateOrder = mobileDateFormat.replace(/-/g, '');
                    timeOrder = mobileTimeFormat.replace(/\:/g, '');
            }

            this.op = {
                theme: "android-holo-light",
                mode: "scroller",
                lang: "zh",
                endYear: '9999',
                cancelText: null,
                dateFormat: mobileDateFormat,
                timeWheels: timeOrder,
                dateWheels: dateOrder,
                timeFormat: mobileTimeFormat,
                onSelect: function(val) {
                    if (typeof self.options.beforeValueChangeFun == 'function') {
                        if (!self.options.beforeValueChangeFun.call(this, this.pickerDate)) {
                            return;
                        }
                    }
                    self.setValue(val);
                }
            };
            this._span = this.element.querySelector("span");
            this.element = this.element.querySelector("input");
            this.element.setAttribute('readonly', 'readonly');
            var placeholder = this.options['placeholder'];
            if (placeholder)
                this.element.placeholder = placeholder;
            if (this._span) {
                on(this._span, 'click', function(e) {
                    self.element.focus();
                    stopEvent(e);
                });
            }
            if (this.adapterType == 'date') {
                $(this.element).mobiscroll().date(this.op);
            } else {
                $(this.element).mobiscroll().datetime(this.op);
            }
        } else {
            this.comp = new DateTimePicker({
                el: this.element,
                placeholder: this.options.placeholder,
                format: this.maskerMeta.format,
                showFix: this.options.showFix,
                beforeValueChangeFun: this.beforeValueChangeFun,
                timezone: this.timezone
            });
        }

        this.element['u.DateTimePicker'] = this.comp;

        if (!env.isMobile) {
            this.comp.on('select', function(event) {
                self.setValue(event.value);
            });
        }

        this.setStartField(this.startField);
        this.setEndField(this.endField);
        if (!env.isMobile) {
            // 校验
            this.comp.on('validate', function(event) {
                self.doValidate();
            });
        }
    },

    setEndField: function(endField) {
        var self = this;
        self.endField = endField;
        if (self.dataModel) {
            if (self.endField) {
                self.dataModel.ref(self.endField).subscribe(function(value) {
                    if (env.isMobile) {
                        var valueObj = date.getDateObj(value);
                        if (valueObj) {
                            self.resetDataObj(valueObj);
                        }
                        self.op.minDate = valueObj;
                        if (self.adapterType == 'date') {
                            $(self.element).mobiscroll().date(self.op);
                        } else {
                            $(self.element).mobiscroll().datetime(self.op);
                        }
                        var nowDate = date.getDateObj(self.dataModel.getValue(self.field));
                        if (nowDate) {
                            self.resetDataObj(nowDate);
                        }
                        if (nowDate && nowDate.getTime() > valueObj.getTime() && value) {
                            self.dataModel.setValue(self.field, '');
                        }
                    } else {
                        self.comp.setEndDate(value);
                        var nowDate = self.comp.date;
                        if (nowDate) {
                            self.resetDataObj(nowDate);
                        }
                        var valueObj = date.getDateObj(value);
                        if (valueObj) {
                            self.resetDataObj(valueObj);
                        }
                        if (nowDate && value && nowDate.getTime() > valueObj.getTime()) {
                            self.dataModel.setValue(self.field, '');
                        }
                    }

                });
            }

            if (self.endField) {
                var endValue = self.dataModel.getValue(self.endField);
                if (endValue) {
                    if (env.isMobile) {
                        self.op.minDate = date.getDateObj(endValue);
                        if (self.adapterType == 'date') {
                            $(self.element).mobiscroll().date(self.op);
                        } else {
                            $(self.element).mobiscroll().datetime(self.op);
                        }
                    } else {
                        self.comp.setEndDate(endValue);
                    }
                }
            }
        }
    },

    setStartField: function(startField) {
        var self = this;
        self.startField = startField;
        if (self.dataModel) {
            if (self.startField) {
                self.dataModel.ref(self.startField).subscribe(function(value) {
                    if (env.isMobile) {
                        value = date.getDateObj(value);

                        // var valueObj = self.setMobileStartDate(value, self.options.format);
                        var valueObj = value;
                        if (valueObj) {
                            self.resetDataObj(valueObj);
                        }
                        self.op.minDate = valueObj;
                        if (self.adapterType == 'date') {
                            $(self.element).mobiscroll().date(self.op);
                        } else {
                            $(self.element).mobiscroll().datetime(self.op);
                        }
                        var nowDate = date.getDateObj(self.dataModel.getValue(self.field));
                        if (nowDate) {
                            self.resetDataObj(nowDate);
                        }
                        if (nowDate && nowDate.getTime() < valueObj.getTime() && value) {
                            self.dataModel.setValue(self.field, '');
                        }
                    } else {
                        self.comp.setStartDate(value, self.options.format);
                        var nowDate = self.comp.date;
                        if (nowDate) {
                            self.resetDataObj(nowDate);
                        }
                        var valueObj = date.getDateObj(value);
                        if (valueObj) {
                            self.resetDataObj(valueObj);
                        }
                        if (nowDate && value && nowDate.getTime() < valueObj.getTime()) {
                            self.dataModel.setValue(self.field, '');
                        }
                    }

                });
            }
            if (self.startField) {
                var startValue = self.dataModel.getValue(self.startField);
                if (startValue) {
                    if (env.isMobile) {
                        startValue = date.getDateObj(startValue);
                        self.op.minDate = self.setMobileStartDate(startValue, self.options.format);
                        if (self.adapterType == 'date') {
                            $(self.element).mobiscroll().date(self.op);
                        } else {
                            $(self.element).mobiscroll().datetime(self.op);
                        }
                    } else {
                        self.comp.setStartDate(startValue, self.options.format);
                    }
                }
            }
        }
    },

    setMobileStartDate: function(startDate, type) {

        if (startDate) {
            switch (type) {
                case 'YYYY-MM':
                    startDate = date.add(startDate, 'M', 1);
                    break;
                case 'YYYY-MM-DD':
                    startDate = date.add(startDate, 'd', 1);
                    break;
            }
        }
        return startDate;
    },


    modelValueChange: function(value) {
        if (this.slice) return;
        this.trueValue = value;
        if (env.isMobile) {
            if (value) {
                value = date.format(value, this.options.format);
                $(this.element).scroller('setDate', date.getDateObj(value), true);
            } else {
                this.setShowValue('');
            }
        } else {
            this.comp.setDate(value);
        }

    },
    setFormat: function(format) {
        if (this.maskerMeta.format == format) return;
        this.options.format = format;
        this.maskerMeta.format = format;
        if (!env.isMobile)
            this.comp.setFormat(format);
        // this.formater = new $.DateFormater(this.maskerMeta.format);
        // this.masker = new DateTimeMasker(this.maskerMeta);
    },


    beforeSetValue: function(value) {
        if (this.dataModel) {
            var valueObj = date.getDateObj(value);
            if (valueObj) {
                if (!(typeof this.timezone != 'undefined' && this.timezone != null && this.timezone != '')) {
                    this.resetDataObj(valueObj);
                }

            }
            if (this.startField) {
                var startValue = this.dataModel.getValue(this.startField);
                var startValueObj = date.getDateObj(startValue);
                if (startValueObj) {
                    if (!(typeof this.timezone != 'undefined' && this.timezone != null && this.timezone != '')) {
                        this.resetDataObj(startValueObj);
                    }
                }
                if (startValueObj && valueObj && valueObj.getTime() < startValueObj.getTime()) {
                    return;
                }
            }
            if (this.endField) {
                var endValue = this.dataModel.getValue(this.endField);
                var endValueObj = date.getDateObj(endValue);
                if (endValueObj) {
                    if (!(typeof this.timezone != 'undefined' && this.timezone != null && this.timezone != '')) {
                        this.resetDataObj(endValueObj);
                    }
                }
                if (endValueObj && valueObj && valueObj.getTime() > endValueObj.getTime()) {
                    return;
                }
            }
        }
        if (!(typeof this.timezone != 'undefined' && this.timezone != null && this.timezone != '')) {
            value = date.format(value, this.options.format);
        } else {
            value = value.getTime();
        }
        return value;
    },
    setEnable: function(enable) {
        if (enable === true || enable === 'true') {
            this.enable = true;
            if (env.isMobile) {
                this.element.removeAttribute('disabled');
            } else {
                this.comp._input.removeAttribute('readonly');
            }
            removeClass(this.element.parentNode, 'disablecover');
        } else if (enable === false || enable === 'false') {
            this.enable = false;
            if (env.isMobile) {
                this.element.setAttribute('disabled', 'disabled');
            } else {
                this.comp._input.setAttribute('readonly', 'readonly');
            }
            addClass(this.element.parentNode, 'disablecover');
        }
        if (!env.isMobile)
            this.comp.setEnable(enable);
    },

    resetDataObj: function(dataObj) {
        if (this.options.format.indexOf('h') < 0 && this.options.format.indexOf('H') < 0) {
            dataObj.setHours(0);
        }
        if (this.options.format.indexOf('m') < 0) {
            dataObj.setMinutes(0);
        }
        if (this.options.format.indexOf('s') < 0) {
            dataObj.setSeconds(0);
            dataObj.setMilliseconds(0);
        }
    }

});

if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: DateTimeAdapter,
        name: 'u-date'
    });

if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: DateTimeAdapter,
        name: 'u-datetime'
    });

exports.DateTimeAdapter = DateTimeAdapter;

}((this.bar = this.bar || {})));
