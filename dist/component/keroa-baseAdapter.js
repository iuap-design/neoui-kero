(function (exports) {
'use strict';

/**
 * Module : Sparrow class
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-28 08:45:39
 */

var Class = function(o) {
	if(!(this instanceof Class) && isFunction(o)) {
		return classify(o);
	}
};

// Create a new Class.
//
//  var SuperPig = Class.create({
//    Extends: Animal,
//    Implements: Flyable,
//    initialize: function() {
//      SuperPig.superclass.initialize.apply(this, arguments)
//    },
//    Statics: {
//      COLOR: 'red'
//    }
// })
//
Class.create = function(parent, properties) {
	if(!isFunction(parent)) {
		properties = parent;
		parent = null;
	}

	properties || (properties = {});
	parent || (parent = properties.Extends || Class);
	properties.Extends = parent;

	// The created class constructor
	function SubClass() {
		var ret;
		// Call the parent constructor.
		parent.apply(this, arguments);

		// Only call initialize in self constructor.
		if(this.constructor === SubClass && this.initialize) {
			ret = this.initialize.apply(this, arguments);
		}
		return ret ? ret : this;
	}

	// Inherit class (static) properties from parent.
	if(parent !== Class) {
		mix(SubClass, parent, parent.StaticsWhiteList);
	}

	// Add instance properties to the subclass.
	implement.call(SubClass, properties);

	// Make subclass extendable.
	return classify(SubClass);
};

function implement(properties) {
	var key, value;

	for(key in properties) {
		value = properties[key];

		if(Class.Mutators.hasOwnProperty(key)) {
			Class.Mutators[key].call(this, value);
		} else {
			this.prototype[key] = value;
		}
	}
}

// Create a sub Class based on `Class`.
Class.extend = function(properties) {
	properties || (properties = {});
	properties.Extends = this;

	return Class.create(properties);
};

function classify(cls) {
	cls.extend = Class.extend;
	cls.implement = implement;
	return cls;
}

// Mutators define special properties.
Class.Mutators = {

	'Extends': function(parent) {
		var existed = this.prototype;
		var proto = createProto(parent.prototype);

		// Keep existed properties.
		mix(proto, existed);

		// Enforce the constructor to be what we expect.
		proto.constructor = this;

		// Set the prototype chain to inherit from `parent`.
		this.prototype = proto;

		// Set a convenience property in case the parent's prototype is
		// needed later.
		this.superclass = parent.prototype;
	},

	'Implements': function(items) {
		isArray(items) || (items = [items]);
		var proto = this.prototype,
			item;

		while(item = items.shift()) {
			mix(proto, item.prototype || item);
		}
	},

	'Statics': function(staticProperties) {
		mix(this, staticProperties);
	}
};

// Shared empty constructor function to aid in prototype-chain creation.
function Ctor() {}

// See: http://jsperf.com/object-create-vs-new-ctor
var createProto = Object.__proto__ ?
	function(proto) {
		return {
			__proto__: proto
		}
	} :
	function(proto) {
		Ctor.prototype = proto;
		return new Ctor();
	};

// Helpers
// ------------

function mix(r, s, wl) {
	// Copy "all" properties including inherited ones.
	for(var p in s) {
		if(s.hasOwnProperty(p)) {
			if(wl && indexOf(wl, p) === -1) continue;

			// 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
			if(p !== 'prototype') {
				r[p] = s[p];
			}
		}
	}
}

var toString = Object.prototype.toString;

var isArray = Array.isArray || function(val) {
	return toString.call(val) === '[object Array]';
};

var isFunction = function(val) {
	return toString.call(val) === '[object Function]';
};

var indexOf = function(arr, item) {
	if(Array.prototype.indexOf && arr.indexOf) {
		return arr.indexOf(item);
	} else {
		for(var i = 0, len = arr.length; i < len; i++) {
			if(arr[i] === item) {
				return i;
			}
		}
		return -1;
	}
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

/**
 * Module : Kero Value Mixin
 * Author : Kvkens(yueming@yonyou.com)
 * Date   : 2016-08-08 15:58:49
 */


var ValueMixin = {
    init: function init() {
        var self = this;

        // 如果存在行对象则处理数据都针对此行进行处理
        if (parseInt(this.options.rowIndex) > -1) {
            if ((this.options.rowIndex + '').indexOf('.') > 0) {
                // 主子表的情况
                var childObj = this.getChildVariable();
                var lastRow = childObj.lastRow;
                var lastField = childObj.lastField;

                this.dataModel.on(DataTable.ON_VALUE_CHANGE, function (opt) {
                    var id = opt.rowId;
                    var field = opt.field;
                    var value = opt.newValue;
                    var obj = {
                        fullField: self.options.field,
                        index: self.options.rowIndex
                    };
                    var selfRow = self.dataModel.getChildRow(obj);
                    var row = opt.rowObj;
                    if (selfRow == row && field == lastField) {
                        self.modelValueChange(value);
                    }
                });

                this.dataModel.on(DataTable.ON_INSERT,function(opt){
                    var obj = {
                        fullField: self.options.field,
                        index: self.options.rowIndex
                    };
                    var rowObj = self.dataModel.getChildRow(obj);
                    if (rowObj) {
                        self.modelValueChange(rowObj.getValue(lastField));
                    }
                });

                if (lastRow) {
                    this.modelValueChange(lastRow.getValue(lastField));
                }
            } else {

                this.dataModel.on(DataTable.ON_VALUE_CHANGE, function (opt) {
                    var id = opt.rowId;
                    var field = opt.field;
                    var value = opt.newValue;
                    var row = opt.rowObj;
                    var rowIndex = self.dataModel.getRowIndex(row);
                    if (rowIndex == self.options.rowIndex && field == self.field) {
                        self.modelValueChange(value);
                    }
                });

                this.dataModel.on(DataTable.ON_INSERT,function(opt){
                    var rowObj = self.dataModel.getRow(self.options.rowIndex);
                    if (rowObj) {
                        self.modelValueChange(rowObj.getValue(self.field));
                    }
                });

                var rowObj = this.dataModel.getRow(this.options.rowIndex);
                if (rowObj) {
                    this.modelValueChange(rowObj.getValue(this.field));
                }
            }
        } else {
            this.dataModel.ref(this.field).subscribe(function (value) {
                self.modelValueChange(value);
            });
            this.modelValueChange(this.dataModel.getValue(this.field));
        }
    },
    methods: {
        /**
         * 获取与子表相关的变量
         * @param {Object} value
         */
        getChildVariable: function getChildVariable() {
            var indexArr = this.options.rowIndex.split('.');
            var lastIndex = indexArr[indexArr.length - 1];
            var fieldArr = this.options.field.split('.');
            var lastField = fieldArr[fieldArr.length - 1];
            var lastDataTable = this.dataModel;
            var lastRow = null;

            for (var i = 0; i < fieldArr.length; i++) {
                lastRow = lastDataTable.getRow(indexArr[i]);
                if(!lastRow)
                    break;
                if (i < fieldArr.length - 1) {
                    lastDataTable = lastRow.getValue(fieldArr[i]);
                }
            }
            return {
                lastField: lastField,
                lastIndex: lastIndex,
                lastDataTable: lastDataTable,
                lastRow: lastRow
            };
        },
        /**
         * 模型数据改变
         * @param {Object} value
         */
        modelValueChange: function (value) {
            if (this.slice) return;
            if (value === null || typeof value == "undefined")
                value = "";
            this.trueValue = this.formater ? this.formater.format(value) : value;
            //this.element.trueValue = this.trueValue;
            this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
            this.setShowValue(this.showValue);

            //this.trueValue = value;
            //this.showValue = value;
            //this.setShowValue(this.showValue);
        },

        ///**
        // * 设置模型值
        // * @param {Object} value
        // */
        //setModelValue: function (value) {
        //    if (!this.dataModel) return;
        //    this.dataModel.setValue(this.field, value)
        //},
        /**
         * 设置控件值
         * @param {Object} value
         */
        setValue: function (value) {
            value = this.beforeSetValue(value);
            this.trueValue = this.formater ? this.formater.format(value) : value;
            this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
            this.setShowValue(this.showValue);
            this.slice = true;
            if(parseInt(this.options.rowIndex) > -1){
                if((this.options.rowIndex + '').indexOf('.') > 0){
                    var childObj = this.getChildVariable();
                    var lastRow = childObj.lastRow;
                    var lastField = childObj.lastField;
                    if(lastRow)
                        lastRow.setValue(lastField, this.trueValue);
                }else{
                    var rowObj = this.dataModel.getRow(this.options.rowIndex);
                    if(rowObj)
                        rowObj.setValue(this.field, this.trueValue);
                }

            }else{
                this.dataModel.setValue(this.field, this.trueValue);
            }
            this.slice = false;
        },
        beforeSetValue: function(value){
          return value;
        },
        /**
         * 取控件的值
         */
        getValue: function () {
            return this.trueValue;
        },
        setShowValue: function (showValue) {
            this.showValue = showValue;
            this.element.value = showValue;
            this.element.title = showValue;

        },
        getShowValue: function () {
            return this.showValue
        },
        setModelValue: function (value) {
            if (!this.dataModel) return
            if(parseInt(this.options.rowIndex) > -1){
                if((this.options.rowIndex + '').indexOf('.') > 0){
                    var childObj = this.getChildVariable();
                    var lastRow = childObj.lastRow;
                    var lastField = childObj.lastField;
                    if(lastRow)
                        lastRow.setValue(lastField, this.trueValue);
                }else{
                    var rowObj = this.dataModel.getRow(this.options.rowIndex);
                    if(rowObj)
                        rowObj.setValue(this.field, value);
                }
            }else{
                this.dataModel.setValue(this.field, value);
            }
        }
    }
};

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

/**
 * Module : Kero Enable Mixin
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-08 16:32:54
 */
var EnableMixin = {
    init: function() {
        var self = this;
        //处理只读
        /*if (this.options['enable'] && (this.options['enable'] == 'false' || this.options['enable'] == false)){
                this.setEnable(false);
        }else {
            this.dataModel.refEnable(this.field).subscribe(function (value) {
                self.setEnable(value);
            });
            this.setEnable(this.dataModel.isEnable(this.field));
        }*/



        var oEnable = this.options.enable,enable;
        if(typeof oEnable == 'undefined'){
          enable = this.dataModel.getRowMeta(this.field, 'enable');
        }else{
          enable = oEnable;
        }
        this.enable = enable;
        this.setEnable(this.enable);
        this.dataModel.refEnable(this.field).subscribe(function(value) {
            self.setEnable(value);
        });
    },
    methods: {
        setEnable: function(enable) {
            if (enable === true || enable === 'true') {
                this.enable = true;
                this.element.removeAttribute('readonly');
                removeClass(this.element.parentNode, 'disablecover');
            } else if (enable === false || enable === 'false') {
                this.enable = false;
                this.element.setAttribute('readonly', 'readonly');
                addClass(this.element.parentNode, 'disablecover');
            }
        }
    }
};

/**
 * Module : Kero Enable Mixin
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-08 16:32:54
 */

var RequiredMixin = {
    init: function(){
        var self = this;
        this.required = this.getOption('required');
        this.dataModel.refRowMeta(this.field, "required").subscribe(function(value) {
            self.setRequired(value);
        });
        //this.setRequired(this.dataModel.getMeta(this.field, "required"));

    },
    methods:{
        setRequired: function (required) {
            if (required === true || required === 'true') {
                this.required = true;
            } else if (required === false || required === 'false') {
                this.required = false;
            }
        },
    }
};

/**
 * Module : Sparrow extend enum
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

var U_LOCALE = "u_locale";
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
 * Module : Sparrow cookies
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

var getCookie = function(sName) {
	var sRE = "(?:; )?" + sName + "=([^;]*);?";
	var oRE = new RegExp(sRE);

	if(oRE.test(document.cookie)) {
		return decodeURIComponent(RegExp["$1"]);
	} else
		return null;
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
 * Module : Kero Validate Mixin
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 14:53:43
 */
var ValidateMixin = {
    init: function(){
        this.placement = this.getOption('placement');
        this.tipId = this.getOption('tipId');
        this.tipAliveTime = this.getOption('tipAliveTime');
        this.errorMsg = this.getOption('errorMsg');
        this.nullMsg = this.getOption('nullMsg');
        this.regExp = this.getOption('regExp');
        this.successId=this.getOption('successId');
        this.hasSuccess=this.getOption('hasSuccess');
        this.notipFlag=this.getOption('notipFlag');
        this.showFix = this.getOption('showFix');

        // if (this.validType) {
            this.validate = new Validate({
                el: this.element,
                single: true,
                validMode: 'manually',
                required: this.required,
                validType: this.validType,
                placement: this.placement,
                tipId: this.tipId,
				tipAliveTime: this.tipAliveTime,
                successId:this.successId,
                notipFlag:this.notipFlag,
                hasSuccess:this.hasSuccess,
                errorMsg: this.errorMsg,
                nullMsg: this.nullMsg,
                maxLength: this.maxLength,
                minLength: this.minLength,
                max: this.max,
                min: this.min,
                maxNotEq: this.maxNotEq,
                minNotEq: this.minNotEq,
                reg: this.regExp,
                showFix: this.showFix
            });
        // };

    },
    methods:{
        /**
         *校验
         */
        doValidate: function (options) {
            if (this.validate) {
                if (options && options['trueValue'] === true) {
                    options['showMsg'] = options['showMsg'] || false;
                    var result = this.validate.check({pValue: this.getValue(), showMsg: options['showMsg']});
                }
                else{
                    var result = this.validate.check();
                }
                result.comp = this;
                return result;
            } else {
                return {passed:true,comp:this}
            }
        },
        /**
         * 是否需要清除数据
         */
        _needClean: function () {
            if (this.validate)
                return this.validate._needClean();
            else return false
        }
    }
};

/**
 * Module : Kero adapter 基类
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 10:00:00
 */
/**
 * adapter基类
 */

var BaseAdapter = Class.create({
    mixins:[ValueMixin,EnableMixin, RequiredMixin, ValidateMixin],
    /**
     *
     * @param comp
     * @param options ：
     *      el: '#content',  对应的dom元素
     *      options: {},     配置
     *      model:{}        模型，包括数据和事件
     */
    initialize: function (options) {
        this.initBefore();
        //组合mixin中的方法
        for (var i = 0; i < this.mixins.length; i++) {
            var mixin = this.mixins[i];
            for (var key in mixin['methods']){
                if (!this[key]){
                    this[key] = mixin['methods'][key];
                }
            }
        }

        //this.comp = comp;
        this.element = options['el'];
        this.options = options['options'];
        this.viewModel = options['model'];
        this.app = options['app'];
        this.dataModel = null;
        this.mixins = this.mixins || [];
        this.parseDataModel();
        this.init();
        //执行mixin中的初始化方法
        for(var i in this.mixins){
            var mixin = this.mixins[i];
            if (mixin['init'])
                mixin.init.call(this);
        }

    },
    initBefore: function () {

    },
    parseDataModel: function () {
        if (!this.options || !this.options["data"]) return;
        this.field = this.options["field"];
        var dtId = this.options["data"];
        this.dataModel = getJSObject(this.viewModel, this.options["data"]);
        if (this.dataModel){
            var opt = {};
            if (this.options.type === 'u-date'){
                opt.type = 'date';
            }
            if (this.field)
                this.dataModel.createField(this.field, opt);
        }
    },
    getOption: function(key){
        var rs = this.dataModel.getRowMeta(this.field, key);
        if (rs===0){
            return 0;
        }else {
            return rs || this.options[key];
        }

    },
    init: function(){

    }
});
window.u = window.u || {};
u.BaseAdapter = BaseAdapter;

exports.BaseAdapter = BaseAdapter;

}((this.bar = this.bar || {})));
