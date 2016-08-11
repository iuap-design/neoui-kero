/** 
 * kero-adapter v1.0.2
 * kero adapter
 * author : yonyou FED
 * homepage : https://github.com/iuap-design/kero-adapter#readme
 * bugs : https://github.com/iuap-design/kero-adapter/issues
 **/ 
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _baseAdapter = __webpack_require__(1);
	
	var _checkbox = __webpack_require__(4);
	
	var _ckeditor = __webpack_require__(15);
	
	var _combobox = __webpack_require__(16);
	
	var _float = __webpack_require__(19);
	
	var _integer = __webpack_require__(24);
	
	var _nativeCheckbox = __webpack_require__(25);
	
	var _nativeRadio = __webpack_require__(26);
	
	var _pagination = __webpack_require__(27);
	
	var _password = __webpack_require__(29);
	
	var _percent = __webpack_require__(31);
	
	var _string = __webpack_require__(30);
	
	var _progress = __webpack_require__(33);
	
	var _radio = __webpack_require__(35);
	
	var _switch = __webpack_require__(37);
	
	var _textarea = __webpack_require__(39);
	
	var _textfield = __webpack_require__(40);
	
	var _url = __webpack_require__(41);
	
	var _enableMixin = __webpack_require__(42);
	
	var _requiredMixin = __webpack_require__(43);
	
	var _validateMixin = __webpack_require__(44);
	
	var _valueMixin = __webpack_require__(5);
	
	//import {YearAdapter} from './year';
	//import {YearMonthAdapter} from './yearmonth';
	//import {TreeAdapter} from './tree';
	
	//import {MonthAdapter} from './month';
	
	//import {CurrencyAdapter} from './currency';
	//import {DateTimeAdapter} from './datetime';
	/**
	 * Module : Kero webpack entry index
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-10 14:51:05
	 */
	
	console.log(_textarea.TextAreaAdapter);
	//import {TimeAdapter} from './time';
	
	//import {GridAdapter} from './grid';

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.BaseAdapter = undefined;
	
	var _class = __webpack_require__(2);
	
	var _util = __webpack_require__(3);
	
	/**
	 * adapter基类
	 */
	
	/**
	 * Module : Kero adapter 基类
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-09 10:00:00
	 */
	var BaseAdapter = _class.Class.create({
	    /**
	     *
	     * @param comp
	     * @param options ：
	     *      el: '#content',  对应的dom元素
	     *      options: {},     配置
	     *      model:{}        模型，包括数据和事件
	     */
	    initialize: function initialize(options) {
	        //组合mixin中的方法
	        for (var i in this.mixins) {
	            var mixin = this.mixins[i];
	            for (var key in mixin['methods']) {
	                if (!this[key]) {
	                    this[key] = mixin['methods'][key];
	                }
	            }
	        }
	
	        //this.comp = comp;
	        this.element = options['el'];
	        this.options = options['options'];
	        this.viewModel = options['model'];
	        this.dataModel = null;
	        this.mixins = this.mixins || [];
	        this.parseDataModel();
	        this.init();
	        //执行mixin中的初始化方法
	        for (var i in this.mixins) {
	            var mixin = this.mixins[i];
	            if (mixin['init']) mixin.init.call(this);
	        }
	    },
	    parseDataModel: function parseDataModel() {
	        if (!this.options || !this.options["data"]) return;
	        this.field = this.options["field"];
	        var dtId = this.options["data"];
	        this.dataModel = (0, _util.getJSObject)(this.viewModel, this.options["data"]);
	        if (this.dataModel) {
	            var opt = {};
	            if (this.options.type === 'u-date') {
	                opt.type = 'date';
	            }
	            if (this.field) this.dataModel.createField(this.field, opt);
	        }
	    },
	    getOption: function getOption(key) {
	        var rs = this.dataModel.getRowMeta(this.field, key);
	        if (rs === 0) {
	            return 0;
	        } else {
	            return rs || this.options[key];
	        }
	    },
	    init: function init() {}
	});
	
	exports.BaseAdapter = BaseAdapter;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/**
	 * Module : Sparrow class
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-07-28 08:45:39
	 */
	
	var Class = function Class(o) {
		if (!(this instanceof Class) && isFunction(o)) {
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
	Class.create = function (parent, properties) {
		if (!isFunction(parent)) {
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
			if (this.constructor === SubClass && this.initialize) {
				ret = this.initialize.apply(this, arguments);
			}
			return ret ? ret : this;
		}
	
		// Inherit class (static) properties from parent.
		if (parent !== Class) {
			mix(SubClass, parent, parent.StaticsWhiteList);
		}
	
		// Add instance properties to the subclass.
		implement.call(SubClass, properties);
	
		// Make subclass extendable.
		return classify(SubClass);
	};
	
	function implement(properties) {
		var key, value;
	
		for (key in properties) {
			value = properties[key];
	
			if (Class.Mutators.hasOwnProperty(key)) {
				Class.Mutators[key].call(this, value);
			} else {
				this.prototype[key] = value;
			}
		}
	}
	
	// Create a sub Class based on `Class`.
	Class.extend = function (properties) {
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
	
		'Extends': function Extends(parent) {
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
	
		'Implements': function Implements(items) {
			isArray(items) || (items = [items]);
			var proto = this.prototype,
			    item;
	
			while (item = items.shift()) {
				mix(proto, item.prototype || item);
			}
		},
	
		'Statics': function Statics(staticProperties) {
			mix(this, staticProperties);
		}
	};
	
	// Shared empty constructor function to aid in prototype-chain creation.
	function Ctor() {}
	
	// See: http://jsperf.com/object-create-vs-new-ctor
	var createProto = Object.__proto__ ? function (proto) {
		return {
			__proto__: proto
		};
	} : function (proto) {
		Ctor.prototype = proto;
		return new Ctor();
	};
	
	// Helpers
	// ------------
	
	function mix(r, s, wl) {
		// Copy "all" properties including inherited ones.
		for (var p in s) {
			if (s.hasOwnProperty(p)) {
				if (wl && indexOf(wl, p) === -1) continue;
	
				// 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
				if (p !== 'prototype') {
					r[p] = s[p];
				}
			}
		}
	}
	
	var toString = Object.prototype.toString;
	
	var isArray = Array.isArray || function (val) {
		return toString.call(val) === '[object Array]';
	};
	
	var isFunction = function isFunction(val) {
		return toString.call(val) === '[object Function]';
	};
	
	var indexOf = function indexOf(arr, item) {
		if (Array.prototype.indexOf && arr.indexOf) {
			return arr.indexOf(item);
		} else {
			for (var i = 0, len = arr.length; i < len; i++) {
				if (arr[i] === item) {
					return i;
				}
			}
			return -1;
		}
	};
	
	exports.Class = Class;
	exports.isFunction = isFunction;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	/**
	 * Module : Sparrow util tools
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-07-27 21:46:50
	 */
	
	/**
	 * 创建一个带壳的对象,防止外部修改
	 * @param {Object} proto
	 */
	var createShellObject = function createShellObject(proto) {
		var exf = function exf() {};
		exf.prototype = proto;
		return new exf();
	};
	var execIgnoreError = function execIgnoreError(a, b, c) {
		try {
			a.call(b, c);
		} catch (e) {}
	};
	
	var getFunction = function getFunction(target, val) {
		if (!val || typeof val == 'function') return val;
		if (typeof target[val] == 'function') return target[val];else if (typeof window[val] == 'function') return window[val];else if (val.indexOf('.') != -1) {
			var func = getJSObject(target, val);
			if (typeof func == 'function') return func;
			func = getJSObject(window, val);
			if (typeof func == 'function') return func;
		}
		return val;
	};
	var getJSObject = function getJSObject(target, names) {
		if (!names) {
			return;
		}
		if ((typeof names === 'undefined' ? 'undefined' : _typeof(names)) == 'object') return names;
		var nameArr = names.split('.');
		var obj = target;
		for (var i = 0; i < nameArr.length; i++) {
			obj = obj[nameArr[i]];
			if (!obj) return null;
		}
		return obj;
	};
	var isDate = function isDate(input) {
		return Object.prototype.toString.call(input) === '[object Date]' || input instanceof Date;
	};
	var isNumber = function isNumber(obj) {
		//return obj === +obj
		return obj - parseFloat(obj) + 1 >= 0;
	};
	var isArray = Array.isArray || function (val) {
		return Object.prototype.toString.call(val) === '[object Array]';
	};
	var isEmptyObject = function isEmptyObject(obj) {
		var name;
		for (name in obj) {
			return false;
		}
		return true;
	};
	var inArray = function inArray(node, arr) {
		if (!arr instanceof Array) {
			throw "arguments is not Array";
		}
		for (var i = 0, k = arr.length; i < k; i++) {
			if (node == arr[i]) {
				return true;
			}
		}
		return false;
	};
	var isDomElement = function isDomElement(obj) {
		if (window['HTMLElement']) {
			return obj instanceof HTMLElement;
		} else {
			return obj && obj.tagName && obj.nodeType === 1;
		}
	};
	var each = function each(obj, callback) {
		if (obj.forEach) {
			obj.forEach(function (v, k) {
				callback(k, v);
			});
		} else if (obj instanceof Object) {
			for (var k in obj) {
				callback(k, obj[k]);
			}
		} else {
			return;
		}
	};
	
	NodeList.prototype.forEach = Array.prototype.forEach;
	
	/**
	 * 获得字符串的字节长度
	 */
	String.prototype.lengthb = function () {
		//	var str = this.replace(/[^\x800-\x10000]/g, "***");
		var str = this.replace(/[^\x00-\xff]/g, "**");
		return str.length;
	};
	
	/**
	 * 将AFindText全部替换为ARepText
	 */
	String.prototype.replaceAll = function (AFindText, ARepText) {
		//自定义String对象的方法
		var raRegExp = new RegExp(AFindText, "g");
		return this.replace(raRegExp, ARepText);
	};
	
	exports.createShellObject = createShellObject;
	exports.execIgnoreError = execIgnoreError;
	exports.getFunction = getFunction;
	exports.getJSObject = getJSObject;
	exports.isDate = isDate;
	exports.isNumber = isNumber;
	exports.isArray = isArray;
	exports.isEmptyObject = isEmptyObject;
	exports.inArray = inArray;
	exports.isDomElement = isDomElement;
	exports.each = each;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.CheckboxAdapter = undefined;
	
	var _baseAdapter = __webpack_require__(1);
	
	var _valueMixin = __webpack_require__(5);
	
	var _util = __webpack_require__(3);
	
	var _neouiCheckbox = __webpack_require__(6);
	
	var _compMgr = __webpack_require__(12);
	
	/**
	 * Module : Kero Check Adapter
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-08 15:50:03
	 */
	
	var CheckboxAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin, _valueMixin.RequiredMixin, _valueMixin.ValidateMixin],
	    init: function init(options) {
	        var self = this;
	        // CheckboxAdapter.superclass.initialize.apply(this, arguments); 
	        this.isGroup = this.options['isGroup'] === true || this.options['isGroup'] === 'true';
	        if (this.options['datasource'] || this.options['hasOther']) {
	            // 存在datasource或者有其他选项，将当前dom元素保存，以后用于复制新的dom元素
	            this.checkboxTemplateArray = [];
	            for (var i = 0, count = this.element.childNodes.length; i < count; i++) {
	                this.checkboxTemplateArray.push(this.element.childNodes[i]);
	            }
	        }
	        if (this.options['datasource']) {
	            this.isGroup = true;
	            var datasource = (0, _util.getJSObject)(this.viewModel, this.options['datasource']);
	
	            this.setComboData(datasource);
	        } else {
	            if (this.element['u.Checkbox']) {
	                this.comp = this.element['u.Checkbox'];
	            } else {
	                this.comp = new _neouiCheckbox.Checkbox(this.element);
	                this.element['u.Checkbox'] = this.comp;
	            }
	
	            this.checkedValue = this.options['checkedValue'] || this.comp._inputElement.value;
	            this.unCheckedValue = this.options["unCheckedValue"];
	
	            this.comp.on('change', function () {
	                if (self.slice) return;
	                if (!self.dataModel) return;
	                var modelValue = self.dataModel.getValue(self.field);
	                modelValue = modelValue ? modelValue : '';
	                if (self.isGroup) {
	                    var valueArr = modelValue == '' ? [] : modelValue.split(',');
	
	                    if (self.comp._inputElement.checked) {
	                        valueArr.push(self.checkedValue);
	                    } else {
	                        var index = valueArr.indexOf(self.checkedValue);
	                        valueArr.splice(index, 1);
	                    }
	                    self.dataModel.setValue(self.field, valueArr.join(','));
	                } else {
	                    if (self.comp._inputElement.checked) {
	                        self.dataModel.setValue(self.field, self.checkedValue);
	                    } else {
	                        self.dataModel.setValue(self.field, self.unCheckedValue);
	                    }
	                }
	            });
	        }
	        // 如果存在其他
	        if (this.options['hasOther']) {
	            var node = null;
	            for (var j = 0; j < this.checkboxTemplateArray.length; j++) {
	                this.element.appendChild(this.checkboxTemplateArray[j].cloneNode(true));
	            }
	            var LabelS = this.element.querySelectorAll('.u-checkbox');
	            self.lastLabel = LabelS[LabelS.length - 1];
	            var allCheckS = this.element.querySelectorAll('[type=checkbox]');
	            self.lastCheck = allCheckS[allCheckS.length - 1];
	            var nameDivs = this.element.querySelectorAll('[data-role=name]');
	            self.lastNameDiv = nameDivs[nameDivs.length - 1];
	            self.lastNameDiv.innerHTML = '其他';
	            self.otherInput = makeDOM('<input type="text">');
	            self.lastNameDiv.parentNode.appendChild(self.otherInput);
	            self.lastCheck.value = '';
	
	            var comp;
	            if (self.lastLabel['u.Checkbox']) {
	                comp = self.lastLabel['u.Checkbox'];
	            } else {
	                comp = new _neouiCheckbox.Checkbox(self.lastLabel);
	            }
	            self.lastLabel['u.Checkbox'] = comp;
	            self.otherComp = comp;
	            comp.on('change', function () {
	                if (self.slice) return;
	                var modelValue = self.dataModel.getValue(self.field);
	                modelValue = modelValue ? modelValue : '';
	                var valueArr = modelValue == '' ? [] : modelValue.split(',');
	                if (comp._inputElement.checked) {
	                    var oldIndex = valueArr.indexOf(comp._inputElement.oldValue);
	                    if (oldIndex > -1) {
	                        valueArr.splice(oldIndex, 1);
	                    }
	                    if (comp._inputElement.value) valueArr.push(comp._inputElement.value);
	                } else {
	                    var index = valueArr.indexOf(comp._inputElement.value);
	                    if (index > -1) {
	                        valueArr.splice(index, 1);
	                    }
	                }
	                //self.slice = true;
	                self.dataModel.setValue(self.field, valueArr.join(','));
	                //self.slice = false;
	            });
	
	            on(self.otherInput, 'blur', function (e) {
	                self.lastCheck.oldValue = self.lastCheck.value;
	                self.lastCheck.value = this.value;
	                self.otherComp.trigger('change');
	            });
	            on(self.otherInput, 'click', function (e) {
	                stopEvent(e);
	            });
	        }
	
	        if (this.dataModel) {
	            this.dataModel.ref(this.field).subscribe(function (value) {
	                self.modelValueChange(value);
	            });
	        }
	    },
	    setComboData: function setComboData(comboData) {
	        var self = this;
	        //this.element.innerHTML = '';
	        for (var i = 0, len = comboData.length; i < len - 1; i++) {
	            for (var j = 0; j < this.checkboxTemplateArray.length; j++) {
	                this.element.appendChild(this.checkboxTemplateArray[j].cloneNode(true));
	            }
	        }
	        var allCheck = this.element.querySelectorAll('[type=checkbox]');
	        var allName = this.element.querySelectorAll('[data-role=name]');
	        for (var k = 0; k < allCheck.length; k++) {
	            allCheck[k].value = comboData[k].pk || comboData[k].value;
	            allName[k].innerHTML = comboData[k].name;
	        }
	        this.element.querySelectorAll('.u-checkbox').forEach(function (ele) {
	            var comp;
	            if (ele['u.Checkbox']) {
	                comp = ele['u.Checkbox'];
	            } else {
	                comp = new _neouiCheckbox.Checkbox(ele);
	            }
	            ele['u.Checkbox'] = comp;
	            comp.on('change', function () {
	                if (self.slice) return;
	                var modelValue = self.dataModel.getValue(self.field);
	                modelValue = modelValue ? modelValue : '';
	                var valueArr = modelValue == '' ? [] : modelValue.split(',');
	                if (comp._inputElement.checked) {
	                    valueArr.push(comp._inputElement.value);
	                } else {
	                    var index = valueArr.indexOf(comp._inputElement.value);
	                    valueArr.splice(index, 1);
	                }
	                //self.slice = true;
	                self.dataModel.setValue(self.field, valueArr.join(','));
	                //self.slice = false;
	            });
	        });
	    },
	    modelValueChange: function modelValueChange(val) {
	        var self = this;
	        if (this.slice) return;
	
	        if (this.isGroup) {
	            this.trueValue = val;
	            if (this.options.hasOther) {
	                otherVal = '';
	                if (val) otherVal = val + ',';
	            }
	            this.element.querySelectorAll('.u-checkbox').forEach(function (ele) {
	                var comp = ele['u.Checkbox'];
	                var inputValue = comp._inputElement.value;
	                if (inputValue && comp._inputElement.checked != (val + ',').indexOf(inputValue + ',') > -1) {
	                    self.slice = true;
	                    comp.toggle();
	                    self.slice = false;
	                }
	                if (inputValue && (val + ',').indexOf(inputValue + ',') > -1) {
	                    if (self.options.hasOther) {
	                        otherVal = otherVal.replace(inputValue + ',', '');
	                    }
	                }
	            });
	            if (this.options.hasOther) {
	                otherVal = otherVal.replace(/\,/g, '');
	                if (otherVal) {
	                    self.lastCheck.value = otherVal;
	                    self.otherInput.value = otherVal;
	                }
	            }
	        } else {
	            if (this.comp._inputElement.checked != (val === this.checkedValue)) {
	                this.slice = true;
	                this.comp.toggle();
	                this.slice = false;
	            }
	        }
	    },
	
	    setEnable: function setEnable(enable) {
	        this.enable = enable === true || enable === 'true';
	        if (this.isGroup) {
	            this.element.querySelectorAll('.u-checkbox').forEach(function (ele) {
	                var comp = ele['u.Checkbox'];
	                if (enable === true || enable === 'true') {
	                    comp.enable();
	                } else {
	                    comp.disable();
	                }
	            });
	        } else {
	            if (this.enable) {
	                this.comp.enable();
	            } else {
	                this.comp.disable();
	            }
	        }
	    }
	});
	
	_compMgr.compMgr.addDataAdapter({
	    adapter: CheckboxAdapter,
	    name: 'u-checkbox'
	});
	
	exports.CheckboxAdapter = CheckboxAdapter;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Module : Kero Value Mixin
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-08 15:58:49
	 */
	
	var ValueMixin = {
	    init: function init() {
	        var self = this;
	        this.dataModel.ref(this.field).subscribe(function (value) {
	            self.modelValueChange(value);
	        });
	        this.modelValueChange(this.dataModel.getValue(this.field));
	    },
	    methods: {
	        /**
	         * 模型数据改变
	         * @param {Object} value
	         */
	        modelValueChange: function modelValueChange(value) {
	            if (this.slice) return;
	            if (value === null || typeof value == "undefined") value = "";
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
	        setValue: function setValue(value) {
	            this.trueValue = this.formater ? this.formater.format(value) : value;
	            this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
	            this.setShowValue(this.showValue);
	            this.slice = true;
	            this.dataModel.setValue(this.field, this.trueValue);
	            this.slice = false;
	        },
	        /**
	         * 取控件的值
	         */
	        getValue: function getValue() {
	            return this.trueValue;
	        },
	        setShowValue: function setShowValue(showValue) {
	            this.showValue = showValue;
	            this.element.value = showValue;
	            this.element.title = showValue;
	        },
	        getShowValue: function getShowValue() {
	            return this.showValue;
	        },
	        setModelValue: function setModelValue(value) {
	            if (!this.dataModel) return;
	            this.dataModel.setValue(this.field, value);
	        }
	    }
	};
	
	exports.ValueMixin = ValueMixin;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Checkbox = undefined;
	
	var _BaseComponent = __webpack_require__(7);
	
	var _dom = __webpack_require__(13);
	
	var _event = __webpack_require__(8);
	
	var _ripple = __webpack_require__(14);
	
	var _compMgr = __webpack_require__(12);
	
	var Checkbox = _BaseComponent.BaseComponent.extend({
	    _Constant: {
	        TINY_TIMEOUT: 0.001
	    },
	
	    _CssClasses: {
	        INPUT: 'u-checkbox-input',
	        BOX_OUTLINE: 'u-checkbox-outline',
	        FOCUS_HELPER: 'u-checkbox-focus-helper',
	        TICK_OUTLINE: 'u-checkbox-tick-outline',
	        IS_FOCUSED: 'is-focused',
	        IS_DISABLED: 'is-disabled',
	        IS_CHECKED: 'is-checked',
	        IS_UPGRADED: 'is-upgraded'
	    },
	    init: function init() {
	        this._inputElement = this.element.querySelector('input');
	
	        var boxOutline = document.createElement('span');
	        (0, _dom.addClass)(boxOutline, this._CssClasses.BOX_OUTLINE);
	
	        var tickContainer = document.createElement('span');
	        (0, _dom.addClass)(tickContainer, this._CssClasses.FOCUS_HELPER);
	
	        var tickOutline = document.createElement('span');
	        (0, _dom.addClass)(tickOutline, this._CssClasses.TICK_OUTLINE);
	
	        boxOutline.appendChild(tickOutline);
	
	        this.element.appendChild(tickContainer);
	        this.element.appendChild(boxOutline);
	
	        //if (this.element.classList.contains(this._CssClasses.RIPPLE_EFFECT)) {
	        //  addClass(this.element,this._CssClasses.RIPPLE_IGNORE_EVENTS);
	        this.rippleContainerElement_ = document.createElement('span');
	        //this.rippleContainerElement_.classList.add(this._CssClasses.RIPPLE_CONTAINER);
	        //this.rippleContainerElement_.classList.add(this._CssClasses.RIPPLE_EFFECT);
	        //this.rippleContainerElement_.classList.add(this._CssClasses.RIPPLE_CENTER);
	        this.boundRippleMouseUp = this._onMouseUp.bind(this);
	        this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);
	
	        //var ripple = document.createElement('span');
	        //ripple.classList.add(this._CssClasses.RIPPLE);
	
	        //this.rippleContainerElement_.appendChild(ripple);
	        this.element.appendChild(this.rippleContainerElement_);
	        new _ripple.URipple(this.rippleContainerElement_);
	
	        //}
	        this.boundInputOnChange = this._onChange.bind(this);
	        this.boundInputOnFocus = this._onFocus.bind(this);
	        this.boundInputOnBlur = this._onBlur.bind(this);
	        this.boundElementMouseUp = this._onMouseUp.bind(this);
	        //this._inputElement.addEventListener('change', this.boundInputOnChange);
	        //this._inputElement.addEventListener('focus', this.boundInputOnFocus);
	        //this._inputElement.addEventListener('blur', this.boundInputOnBlur);
	        //this.element.addEventListener('mouseup', this.boundElementMouseUp);
	        if (!(0, _dom.hasClass)(this.element, 'only-style')) {
	            (0, _event.on)(this.element, 'click', function (e) {
	                if (!this._inputElement.disabled) {
	                    this.toggle();
	                    (0, _event.stopEvent)(e);
	                }
	            }.bind(this));
	        }
	
	        this._updateClasses();
	        (0, _dom.addClass)(this.element, this._CssClasses.IS_UPGRADED);
	    },
	
	    _onChange: function _onChange(event) {
	        this._updateClasses();
	        this.trigger('change', { isChecked: this._inputElement.checked });
	    },
	
	    _onFocus: function _onFocus() {
	        (0, _dom.addClass)(this.element, this._CssClasses.IS_FOCUSED);
	    },
	
	    _onBlur: function _onBlur() {
	        (0, _dom.removeClass)(this.element, this._CssClasses.IS_FOCUSED);
	    },
	
	    _onMouseUp: function _onMouseUp(event) {
	        this._blur();
	    },
	
	    /**
	     * Handle class updates.
	     *
	     * @private
	     */
	    _updateClasses: function _updateClasses() {
	        this.checkDisabled();
	        this.checkToggleState();
	    },
	
	    /**
	     * Add blur.
	     *
	     * @private
	     */
	    _blur: function _blur() {
	        // TODO: figure out why there's a focus event being fired after our blur,
	        // so that we can avoid this hack.
	        window.setTimeout(function () {
	            this._inputElement.blur();
	        }.bind(this), /** @type {number} */this._Constant.TINY_TIMEOUT);
	    },
	
	    // Public methods.
	
	    /**
	     * Check the inputs toggle state and update display.
	     *
	     * @public
	     */
	    checkToggleState: function checkToggleState() {
	        if (this._inputElement.checked) {
	            (0, _dom.addClass)(this.element, this._CssClasses.IS_CHECKED);
	        } else {
	            (0, _dom.removeClass)(this.element, this._CssClasses.IS_CHECKED);
	        }
	    },
	
	    /**
	     * Check the inputs disabled state and update display.
	     *
	     * @public
	     */
	    checkDisabled: function checkDisabled() {
	        if (this._inputElement.disabled) {
	            (0, _dom.addClass)(this.element, this._CssClasses.IS_DISABLED);
	        } else {
	            (0, _dom.removeClass)(this.element, this._CssClasses.IS_DISABLED);
	        }
	    },
	
	    isChecked: function isChecked() {
	        //return hasClass(this.element,this._CssClasses.IS_CHECKED);
	        return this._inputElement.checked;
	    },
	
	    toggle: function toggle() {
	        //return;
	        if (this.isChecked()) {
	            this.uncheck();
	        } else {
	            this.check();
	        }
	    },
	
	    /**
	     * Disable checkbox.
	     *
	     * @public
	     */
	    disable: function disable() {
	        this._inputElement.disabled = true;
	        this._updateClasses();
	    },
	
	    /**
	     * Enable checkbox.
	     *
	     * @public
	     */
	    enable: function enable() {
	        this._inputElement.disabled = false;
	        this._updateClasses();
	    },
	
	    /**
	     * Check checkbox.
	     *
	     * @public
	     */
	    check: function check() {
	        this._inputElement.checked = true;
	        this._updateClasses();
	        this.boundInputOnChange();
	    },
	
	    /**
	     * Uncheck checkbox.
	     *
	     * @public
	     */
	    uncheck: function uncheck() {
	        this._inputElement.checked = false;
	        this._updateClasses();
	        this.boundInputOnChange();
	    }
	
	}); /**
	     * Module : neoui-checkbox
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-02 13:55:07
	     */
	
	
	_compMgr.compMgr.regComp({
	    comp: Checkbox,
	    compAsString: 'u.Checkbox',
	    css: 'u-checkbox'
	});
	if (document.readyState && document.readyState === 'complete') {
	    _compMgr.compMgr.updateComp();
	} else {
	    (0, _event.on)(window, 'load', function () {
	        //扫描并生成控件
	        _compMgr.compMgr.updateComp();
	    });
	}
	exports.Checkbox = Checkbox;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.BaseComponent = undefined;
	
	var _class = __webpack_require__(2);
	
	var _util = __webpack_require__(3);
	
	var _event = __webpack_require__(8);
	
	var _compMgr = __webpack_require__(12);
	
	/**
	 * Module : Sparrow base component
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-07-28 18:45:08
	 */
	
	var BaseComponent = _class.Class.create({
	    initialize: function initialize(element) {
	        if ((0, _util.isDomElement)(element)) {
	            this.element = element;
	            this.options = {};
	        } else {
	            this.element = element['el'];
	            this.options = element;
	        }
	        this.element = typeof this.element === 'string' ? document.querySelector(this.element) : this.element;
	
	        this.compType = this.compType || this.constructor.compType;
	        this.element[this.compType] = this;
	        this.element['init'] = true;
	        this.init();
	    },
	    /**
	     * 绑定事件
	     * @param {String} name
	     * @param {Function} callback
	     */
	    on: function on(name, callback) {
	        name = name.toLowerCase();
	        this._events || (this._events = {});
	        var events = this._events[name] || (this._events[name] = []);
	        events.push({
	            callback: callback
	        });
	        return this;
	    },
	    /**
	     * 触发事件
	     * @param {String} name
	     */
	    trigger: function trigger(name) {
	        name = name.toLowerCase();
	        if (!this._events || !this._events[name]) return this;
	        var args = Array.prototype.slice.call(arguments, 1);
	        var events = this._events[name];
	        for (var i = 0, count = events.length; i < count; i++) {
	            events[i].callback.apply(this, args);
	        }
	        return this;
	    },
	    /**
	     * 初始化
	     */
	    init: function init() {},
	    /**
	     * 渲染控件
	     */
	    render: function render() {},
	    /**
	     * 销毁控件
	     */
	    destroy: function destroy() {
	        delete this.element['comp'];
	        this.element.innerHTML = '';
	    },
	    /**
	     * 增加dom事件
	     * @param {String} name
	     * @param {Function} callback
	     */
	    addDomEvent: function addDomEvent(name, callback) {
	        (0, _event.on)(this.element, name, callback);
	        return this;
	    },
	    /**
	     * 移除dom事件
	     * @param {String} name
	     */
	    removeDomEvent: function removeDomEvent(name, callback) {
	        (0, _event.off)(this.element, name, callback);
	        return this;
	    },
	    setEnable: function setEnable(enable) {
	        return this;
	    },
	    /**
	     * 判断是否为DOM事件
	     */
	    isDomEvent: function isDomEvent(eventName) {
	        if (this.element['on' + eventName] === undefined) return false;else return true;
	    },
	    createDateAdapter: function createDateAdapter(options) {
	        var opt = options['options'],
	            model = options['model'];
	        var Adapter = _compMgr.compMgr.getDataAdapter(this.compType, opt['dataType']);
	        if (Adapter) {
	            this.dataAdapter = new Adapter(this, options);
	        }
	    },
	    Statics: {
	        compName: '',
	        EVENT_VALUE_CHANGE: 'valueChange',
	        getName: function getName() {
	            return this.compName;
	        }
	    }
	});
	
	function adjustDataType(options) {
	    var types = ['integer', 'float', 'currency', 'percent', 'string', 'textarea'];
	    var _type = options['type'],
	        _dataType = options['dataType'];
	    if (types.indexOf(_type) != -1) {
	        options['dataType'] = _type;
	        options['type'] = 'originText';
	    }
	}
	
	var BaseComponent = BaseComponent;
	
	exports.BaseComponent = BaseComponent;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.event = exports.stopEvent = exports.trigger = exports.off = exports.on = undefined;
	
	var _env = __webpack_require__(9);
	
	var u = {}; /**
	             * Module : Sparrow touch event
	             * Author : Kvkens(yueming@yonyou.com)
	             * Date	  : 2016-07-28 14:41:17
	             */
	
	u.event = {};
	
	var touchStartEvent = _env.env.hasTouch ? "touchstart" : "mousedown",
	    touchStopEvent = _env.env.hasTouch ? "touchend" : "mouseup",
	    touchMoveEvent = _env.env.hasTouch ? "touchmove" : "mousemove";
	
	// tap和taphold
	u.event.tap = {
		tapholdThreshold: 750,
		emitTapOnTaphold: true,
		touchstartFun: function touchstartFun() {
			trigger(this, 'vmousedown');
		},
		touchendFun: function touchendFun() {
			trigger(this, 'vmouseup');
			trigger(this, 'vclick');
		},
		setup: function setup() {
			var thisObject = this,
			    isTaphold = false;
	
			on(thisObject, "vmousedown", function (event) {
				isTaphold = false;
				if (event.which && event.which !== 1) {
					return false;
				}
	
				var origTarget = event.target,
				    timer;
	
				function clearTapTimer() {
					clearTimeout(timer);
				}
	
				function clearTapHandlers() {
					clearTapTimer();
	
					off(thisObject, 'vclick');
					off(thisObject, 'vmouseup');
					off(document, 'vmousecancel');
				}
	
				function clickHandler(event) {
					clearTapHandlers();
	
					// ONLY trigger a 'tap' event if the start target is
					// the same as the stop target.
					if (!isTaphold && origTarget === event.target) {
						trigger(thisObject, 'tap');
					} else if (isTaphold) {
						event.preventDefault();
					}
				}
				on(thisObject, 'vmouseup', clearTapTimer);
				on(thisObject, 'vclick', clickHandler);
				on(document, 'vmousecancel', clearTapHandlers);
	
				timer = setTimeout(function () {
					if (!u.event.tap.emitTapOnTaphold) {
						isTaphold = true;
					}
					trigger(thisObject, "taphold");
					clearTapHandlers();
				}, u.event.tap.tapholdThreshold);
			});
	
			on(thisObject, 'touchstart', u.event.tap.touchstartFun);
			on(thisObject, 'touchend', u.event.tap.touchendFun);
		},
		teardown: function teardown() {
			off(thisObject, 'vmousedown');
			off(thisObject, 'vclick');
			off(thisObject, 'vmouseup');
			off(document, 'vmousecancel');
		}
	};
	
	u.event.taphold = u.event.tap;
	
	u.event.swipe = {
	
		// More than this horizontal displacement, and we will suppress scrolling.
		scrollSupressionThreshold: 30,
	
		// More time than this, and it isn't a swipe.
		durationThreshold: 1000,
	
		// Swipe horizontal displacement must be more than this.
		horizontalDistanceThreshold: 30,
	
		// Swipe vertical displacement must be less than this.
		verticalDistanceThreshold: 30,
	
		getLocation: function getLocation(event) {
			var winPageX = window.pageXOffset,
			    winPageY = window.pageYOffset,
			    x = event.clientX,
			    y = event.clientY;
	
			if (event.pageY === 0 && Math.floor(y) > Math.floor(event.pageY) || event.pageX === 0 && Math.floor(x) > Math.floor(event.pageX)) {
	
				// iOS4 clientX/clientY have the value that should have been
				// in pageX/pageY. While pageX/page/ have the value 0
				x = x - winPageX;
				y = y - winPageY;
			} else if (y < event.pageY - winPageY || x < event.pageX - winPageX) {
	
				// Some Android browsers have totally bogus values for clientX/Y
				// when scrolling/zooming a page. Detectable since clientX/clientY
				// should never be smaller than pageX/pageY minus page scroll
				x = event.pageX - winPageX;
				y = event.pageY - winPageY;
			}
	
			return {
				x: x,
				y: y
			};
		},
	
		start: function start(event) {
			var data = event.touches ? event.touches[0] : event,
			    location = u.event.swipe.getLocation(data);
			return {
				time: new Date().getTime(),
				coords: [location.x, location.y],
				origin: event.target
			};
		},
	
		stop: function stop(event) {
			var data = event.touches ? event.touches[0] : event,
			    location = u.event.swipe.getLocation(data);
			return {
				time: new Date().getTime(),
				coords: [location.x, location.y]
			};
		},
	
		handleSwipe: function handleSwipe(start, stop, thisObject, origTarget) {
			if (stop.time - start.time < u.event.swipe.durationThreshold && Math.abs(start.coords[0] - stop.coords[0]) > u.event.swipe.horizontalDistanceThreshold && Math.abs(start.coords[1] - stop.coords[1]) < u.event.swipe.verticalDistanceThreshold) {
				var direction = start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight";
	
				trigger(thisObject, "swipe");
				trigger(thisObject, direction);
				return true;
			}
			return false;
		},
	
		// This serves as a flag to ensure that at most one swipe event event is
		// in work at any given time
		eventInProgress: false,
	
		setup: function setup() {
			var events,
			    thisObject = this,
			    context = {};
	
			// Retrieve the events data for this element and add the swipe context
			events = thisObject["mobile-events"];
			if (!events) {
				events = {
					length: 0
				};
				thisObject["mobile-events"] = events;
			}
			events.length++;
			events.swipe = context;
	
			context.start = function (event) {
	
				// Bail if we're already working on a swipe event
				if (u.event.swipe.eventInProgress) {
					return;
				}
				u.event.swipe.eventInProgress = true;
	
				var stop,
				    start = u.event.swipe.start(event),
				    origTarget = event.target,
				    emitted = false;
	
				context.move = function (event) {
					// if ( !start || event.isDefaultPrevented() ) {
					if (!start) {
						return;
					}
	
					stop = u.event.swipe.stop(event);
					if (!emitted) {
						emitted = u.event.swipe.handleSwipe(start, stop, thisObject, origTarget);
						if (emitted) {
	
							// Reset the context to make way for the next swipe event
							u.event.swipe.eventInProgress = false;
						}
					}
					// prevent scrolling
					if (Math.abs(start.coords[0] - stop.coords[0]) > u.event.swipe.scrollSupressionThreshold) {
						event.preventDefault();
					}
				};
	
				context.stop = function () {
					emitted = true;
	
					// Reset the context to make way for the next swipe event
					u.event.swipe.eventInProgress = false;
					off(document, touchMoveEvent, context.move);
					context.move = null;
				};
	
				on(document, touchMoveEvent, context.move);
				on(document, touchStopEvent, context.stop);
			};
			on(thisObject, touchStartEvent, context.start);
		},
	
		teardown: function teardown() {
			var events, context;
	
			events = thisObject["mobile-events"];
			if (events) {
				context = events.swipe;
				delete events.swipe;
				events.length--;
				if (events.length === 0) {
					thisObject["mobile-events"] = null;
				}
			}
	
			if (context) {
				if (context.start) {
					off(thisObject, touchStartEvent, context.start);
				}
				if (context.move) {
					off(document, touchMoveEvent, context.move);
				}
				if (context.stop) {
					off(document, touchStopEvent, context.stop);
				}
			}
		}
	};
	
	u.event.swipeleft = u.event.swipe;
	
	u.event.swiperight = u.event.swipe;
	
	var event = u.event;
	
	var on = function on(element, eventName, child, listener) {
		if (!element) return;
		if (arguments.length < 4) {
			listener = child;
			child = undefined;
		} else {
			var childlistener = function childlistener(e) {
				if (!e) {
					return;
				}
				var tmpchildren = element.querySelectorAll(child);
				tmpchildren.forEach(function (node) {
					if (node == e.target) {
						listener.call(e.target, e);
					}
				});
			};
		}
		//capture = capture || false;
	
		if (!element["uEvent"]) {
			//在dom上添加记录区
			element["uEvent"] = {};
		}
		//判断是否元素上是否用通过on方法填加进去的事件
		if (!element["uEvent"][eventName]) {
			element["uEvent"][eventName] = [child ? childlistener : listener];
			if (u.event && u.event[eventName] && u.event[eventName].setup) {
				u.event[eventName].setup.call(element);
			}
			element["uEvent"][eventName + 'fn'] = function (e) {
				//火狐下有问题修改判断
				if (!e) e = typeof event != 'undefined' && event ? event : window.event;
				element["uEvent"][eventName].forEach(function (fn) {
					try {
						e.target = e.target || e.srcElement; //兼容IE8
					} catch (e) {}
					if (fn) fn.call(element, e);
				});
			};
			if (element.addEventListener) {
				// 用于支持DOM的浏览器
				element.addEventListener(eventName, element["uEvent"][eventName + 'fn']);
			} else if (element.attachEvent) {
				// 用于IE浏览器
				element.attachEvent("on" + eventName, element["uEvent"][eventName + 'fn']);
			} else {
				// 用于其它浏览器
				element["on" + eventName] = element["uEvent"][eventName + 'fn'];
			}
		} else {
			//如果有就直接往元素的记录区添加事件
			var lis = child ? childlistener : listener;
			var hasLis = false;
			element["uEvent"][eventName].forEach(function (fn) {
				if (fn == lis) {
					hasLis = true;
				}
			});
			if (!hasLis) {
				element["uEvent"][eventName].push(child ? childlistener : listener);
			}
		}
	};
	
	var off = function off(element, eventName, listener) {
		//删除事件数组
		if (listener) {
			if (element && element["uEvent"] && element["uEvent"][eventName]) {
				element["uEvent"][eventName].forEach(function (fn, i) {
					if (fn == listener) {
						element["uEvent"][eventName].splice(i, 1);
					}
				});
			}
			return;
		}
		var eventfn = element["uEvent"][eventName + 'fn'];
		if (element.removeEventListener) {
			// 用于支持DOM的浏览器
			element.removeEventListener(eventName, eventfn);
		} else if (element.removeEvent) {
			// 用于IE浏览器
			element.removeEvent("on" + eventName, eventfn);
		} else {
			// 用于其它浏览器
			delete element["on" + eventName];
		}
		if (u.event && u.event[eventName] && u.event[eventName].teardown) {
			u.event[eventName].teardown.call(element);
		}
		element["uEvent"][eventName] = undefined;
		element["uEvent"][eventName + 'fn'] = undefined;
	};
	var trigger = function trigger(element, eventName) {
		if (element["uEvent"] && element["uEvent"][eventName]) {
			element["uEvent"][eventName + 'fn']();
		}
	};
	
	/**
	 * 阻止冒泡
	 */
	var stopEvent = function stopEvent(e) {
		if (typeof e != "undefined") {
			if (e.stopPropagation) e.stopPropagation();else {
				e.cancelBubble = true;
			}
			//阻止默认浏览器动作(W3C)
			if (e && e.preventDefault) e.preventDefault();
			//IE中阻止函数器默认动作的方式
			else window.event.returnValue = false;
		}
	};
	
	exports.on = on;
	exports.off = off;
	exports.trigger = trigger;
	exports.stopEvent = stopEvent;
	exports.event = event;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.env = undefined;
	
	var _extend = __webpack_require__(10);
	
	var u = {}; /**
	             * Module : Sparrow browser environment
	             * Author : Kvkens(yueming@yonyou.com)
	             * Date	  : 2016-07-27 21:46:50
	             */
	
	(0, _extend.extend)(u, {
		isIE: false,
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
		isIOS: false,
		isIphone: false,
		isIPAD: false,
		isStandard: false,
		version: 0,
		isWin: false,
		isUnix: false,
		isLinux: false,
		isAndroid: false,
		isMac: false,
		hasTouch: false,
		isMobile: false
	});
	
	(function () {
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
	
		if (match != null) {
			browserMatch = {
				browser: "IE",
				version: match[2] || "0"
			};
		}
		match = rFirefox.exec(ua);
		if (match != null) {
			browserMatch = {
				browser: match[1] || "",
				version: match[2] || "0"
			};
		}
		match = rOpera.exec(ua);
		if (match != null) {
			browserMatch = {
				browser: match[1] || "",
				version: match[2] || "0"
			};
		}
		match = rChrome.exec(ua);
		if (match != null) {
			browserMatch = {
				browser: match[1] || "",
				version: match[2] || "0"
			};
		}
		match = rSafari.exec(ua);
		if (match != null) {
			browserMatch = {
				browser: match[2] || "",
				version: match[1] || "0"
			};
		}
		if (match != null) {
			browserMatch = {
				browser: "",
				version: "0"
			};
		}
	
		if (s = ua.match(/opera.([\d.]+)/)) {
			u.isOpera = true;
		} else if (browserMatch.browser == "IE" && browserMatch.version == 11) {
			u.isIE11 = true;
			u.isIE = true;
		} else if (s = ua.match(/chrome\/([\d.]+)/)) {
			u.isChrome = true;
			u.isStandard = true;
		} else if (s = ua.match(/version\/([\d.]+).*safari/)) {
			u.isSafari = true;
			u.isStandard = true;
		} else if (s = ua.match(/gecko/)) {
			//add by licza : support XULRunner
			u.isFF = true;
			u.isStandard = true;
		} else if (s = ua.match(/msie ([\d.]+)/)) {
			u.isIE = true;
		} else if (s = ua.match(/firefox\/([\d.]+)/)) {
			u.isFF = true;
			u.isStandard = true;
		}
		if (ua.match(/webkit\/([\d.]+)/)) {
			u.isWebkit = true;
		}
		if (ua.match(/ipad/i)) {
			u.isIOS = true;
			u.isIPAD = true;
			u.isStandard = true;
		}
		if (ua.match(/iphone/i)) {
			u.isIOS = true;
			u.isIphone = true;
		}
	
		if (navigator.platform == "Mac68K" || navigator.platform == "MacPPC" || navigator.platform == "Macintosh" || navigator.platform == "MacIntel") {
			//u.isIOS = true;
			u.isMac = true;
		}
	
		if (navigator.platform == "Win32" || navigator.platform == "Windows" || navigator.platform == "Win64") {
			u.isWin = true;
		}
	
		if (navigator.platform == "X11" && !u.isWin && !u.isMac) {
			u.isUnix = true;
		}
		if (String(navigator.platform).indexOf("Linux") > -1) {
			u.isLinux = true;
		}
	
		if (ua.indexOf('Android') > -1 || ua.indexOf('android') > -1 || ua.indexOf('Adr') > -1 || ua.indexOf('adr') > -1) {
			u.isAndroid = true;
		}
	
		u.version = version ? browserMatch.version ? browserMatch.version : 0 : 0;
		if (u.isIE) {
			var intVersion = parseInt(u.version);
			var mode = document.documentMode;
			if (mode == null) {
				if (intVersion == 6 || intVersion == 7) {
					u.isIE8_BEFORE = true;
				}
			} else {
				if (mode == 7) {
					u.isIE8_BEFORE = true;
				} else if (mode == 8) {
					u.isIE8 = true;
				} else if (mode == 9) {
					u.isIE9 = true;
					u.isSTANDARD = true;
				} else if (mode == 10) {
					u.isIE10 = true;
					u.isSTANDARD = true;
					u.isIE10_ABOVE = true;
				} else {
					u.isSTANDARD = true;
				}
				if (intVersion == 8) {
					u.isIE8_CORE = true;
				} else if (intVersion == 9) {
					u.isIE9_CORE = true;
				} else if (browserMatch.version == 11) {
					u.isIE11 = true;
				} else {}
			}
		}
		if ("ontouchend" in document) {
			u.hasTouch = true;
		}
		if (u.isIOS || u.isAndroid) u.isMobile = true;
	})();
	
	var env = u;
	exports.env = env;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.extend = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                   * Module : Sparrow extend
	                                                                                                                                                                                                                                                   * Author : Kvkens(yueming@yonyou.com)
	                                                                                                                                                                                                                                                   * Date	  : 2016-07-27 21:46:50
	                                                                                                                                                                                                                                                   */
	
	var _enumerables = __webpack_require__(11);
	
	/**
	 * 复制对象属性
	 *
	 * @param {Object}  目标对象
	 * @param {config} 源对象
	 */
	var extend = function extend(object, config) {
		var args = arguments,
		    options;
		if (args.length > 1) {
			for (var len = 1; len < args.length; len++) {
				options = args[len];
				if (object && options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
					var i, j, k;
					for (i in options) {
						object[i] = options[i];
					}
					if (_enumerables.enumerables) {
						for (j = _enumerables.enumerables.length; j--;) {
							k = _enumerables.enumerables[j];
							if (options.hasOwnProperty && options.hasOwnProperty(k)) {
								object[k] = options[k];
							}
						}
					}
				}
			}
		}
		return object;
	};
	
	exports.extend = extend;

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/**
	 * Module : Sparrow extend enum
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-07-27 21:46:50
	 */
	
	var U_LANGUAGES = "i_languages";
	var U_THEME = "u_theme";
	var U_LOCALE = "u_locale";
	var U_USERCODE = "usercode";
	
	var enumerables = true,
	    enumerablesTest = {
		toString: 1
	},
	    toString = Object.prototype.toString;
	for (var i in enumerablesTest) {
		exports.enumerables = enumerables = null;
	}
	if (enumerables) {
		exports.enumerables = enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];
	}
	
	exports.enumerables = enumerables;
	exports.U_LANGUAGES = U_LANGUAGES;
	exports.U_THEME = U_THEME;
	exports.U_LOCALE = U_LOCALE;
	exports.U_USERCODE = U_USERCODE;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.compMgr = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                   * Module : Sparrow compMgr
	                                                                                                                                                                                                                                                   * Author : Kvkens(yueming@yonyou.com)
	                                                                                                                                                                                                                                                   * Date	  : 2016-07-28 18:41:06
	                                                                                                                                                                                                                                                   */
	
	var _dom = __webpack_require__(13);
	
	function _findRegisteredClass(name, optReplace) {
	    for (var i = 0; i < CompMgr.registeredControls.length; i++) {
	        if (CompMgr.registeredControls[i].className === name) {
	            if (typeof optReplace !== 'undefined') {
	                CompMgr.registeredControls[i] = optReplace;
	            }
	            return CompMgr.registeredControls[i];
	        }
	    }
	    return false;
	}
	
	function _getUpgradedListOfElement(element) {
	    var dataUpgraded = element.getAttribute('data-upgraded');
	    // Use `['']` as default value to conform the `,name,name...` style.
	    return dataUpgraded === null ? [''] : dataUpgraded.split(',');
	}
	
	function _isElementUpgraded(element, jsClass) {
	    var upgradedList = _getUpgradedListOfElement(element);
	    return upgradedList.indexOf(jsClass) != -1;
	}
	
	function _upgradeElement(element, optJsClass) {
	    if (!((typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && element instanceof Element)) {
	        throw new Error('Invalid argument provided to upgrade MDL element.');
	    }
	    var upgradedList = _getUpgradedListOfElement(element);
	    var classesToUpgrade = [];
	    if (!optJsClass) {
	        var className = element.className;
	        for (var i = 0; i < CompMgr.registeredControls.length; i++) {
	            var component = CompMgr.registeredControls[i];
	            if (className.indexOf(component.cssClass) > -1 && classesToUpgrade.indexOf(component) === -1 && !_isElementUpgraded(element, component.className)) {
	                classesToUpgrade.push(component);
	            }
	        }
	    } else if (!_isElementUpgraded(element, optJsClass)) {
	        classesToUpgrade.push(_findRegisteredClass(optJsClass));
	    }
	
	    // Upgrade the element for each classes.
	    for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
	        registeredClass = classesToUpgrade[i];
	        if (registeredClass) {
	            if (element[registeredClass.className]) {
	                continue;
	            }
	            // Mark element as upgraded.
	            upgradedList.push(registeredClass.className);
	            element.setAttribute('data-upgraded', upgradedList.join(','));
	            var instance = new registeredClass.classConstructor(element);
	            CompMgr.createdControls.push(instance);
	            // Call any callbacks the user has registered with this component type.
	            for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
	                registeredClass.callbacks[j](element);
	            }
	            element[registeredClass.className] = instance;
	        } else {
	            throw new Error('Unable to find a registered component for the given class.');
	        }
	    }
	}
	
	function _upgradeDomInternal(optJsClass, optCssClass, ele) {
	    if (typeof optJsClass === 'undefined' && typeof optCssClass === 'undefined') {
	        for (var i = 0; i < CompMgr.registeredControls.length; i++) {
	            _upgradeDomInternal(CompMgr.registeredControls[i].className, registeredControls[i].cssClass, ele);
	        }
	    } else {
	        var jsClass = optJsClass;
	        if (!optCssClass) {
	            var registeredClass = _findRegisteredClass(jsClass);
	            if (registeredClass) {
	                optCssClass = registeredClass.cssClass;
	            }
	        }
	        var elements;
	        if (ele) {
	            elements = (0, _dom.hasClass)(ele, optCssClass) ? [ele] : ele.querySelectorAll('.' + optCssClass);
	        } else {
	            elements = document.querySelectorAll('.' + optCssClass);
	        }
	        for (var n = 0; n < elements.length; n++) {
	            _upgradeElement(elements[n], jsClass);
	        }
	    }
	}
	
	var CompMgr = {
	    plugs: {},
	    dataAdapters: {},
	    /** 注册的控件*/
	    registeredControls: [],
	    createdControls: [],
	    /**
	     *
	     * @param options  {el:'#content', model:{}}
	     */
	    apply: function apply(options) {
	        if (options) {
	            var _el = options.el || document.body;
	            var model = options.model;
	        }
	        if (typeof _el == 'string') {
	            _el = document.body.querySelector(_el);
	        }
	        if (_el == null || (typeof _el === 'undefined' ? 'undefined' : _typeof(_el)) != 'object') _el = document.body;
	        var comps = _el.querySelectorAll('[u-meta]');
	        comps.forEach(function (element) {
	            if (element['comp']) return;
	            var options = JSON.parse(element.getAttribute('u-meta'));
	            if (options && options['type']) {
	                //var comp = CompMgr._createComp({el:element,options:options,model:model});
	                var comp = CompMgr.createDataAdapter({ el: element, options: options, model: model });
	                if (comp) {
	                    element['adpt'] = comp;
	                    element['u-meta'] = comp;
	                }
	            }
	        });
	    },
	    addPlug: function addPlug(config) {
	        var plug = config['plug'],
	            name = config['name'];
	        this.plugs || (this.plugs = {});
	        if (this.plugs[name]) {
	            throw new Error('plug has exist:' + name);
	        }
	        plug.compType = name;
	        this.plugs[name] = plug;
	    },
	    addDataAdapter: function addDataAdapter(config) {
	        var adapter = config['adapter'],
	            name = config['name'];
	        //dataType = config['dataType'] || ''
	        //var key = dataType ? name + '.' + dataType : name;
	        this.dataAdapters || (dataAdapters = {});
	        if (this.dataAdapters[name]) {
	            throw new Error('dataAdapter has exist:' + name);
	        }
	        this.dataAdapters[name] = adapter;
	    },
	    getDataAdapter: function getDataAdapter(name) {
	        if (!name) return;
	        this.dataAdapters || (dataAdapters = {});
	        //var key = dataType ? name + '.' + dataType : name;
	        return this.dataAdapters[name];
	    },
	    createDataAdapter: function createDataAdapter(options) {
	        var opt = options['options'];
	        var type = opt['type'],
	            id = opt['id'];
	        var adpt = this.dataAdapters[type];
	        if (!adpt) return null;
	        var comp = new adpt(options);
	        comp.type = type;
	        comp.id = id;
	        return comp;
	    },
	    _createComp: function _createComp(options) {
	        var opt = options['options'];
	        var type = opt['type'];
	        var plug = this.plugs[type];
	        if (!plug) return null;
	        var comp = new plug(options);
	        comp.type = type;
	        return comp;
	    },
	    /**
	     * 注册UI控件
	     */
	    regComp: function regComp(config) {
	        var newConfig = {
	            classConstructor: config.comp,
	            className: config.compAsString || config['compAsString'],
	            cssClass: config.css || config['css'],
	            callbacks: []
	        };
	        config.comp.prototype.compType = config.compAsString;
	        for (var i = 0; i < this.registeredControls.length; i++) {
	            var item = this.registeredControls[i];
	            //registeredControls.forEach(function(item) {
	            if (item.cssClass === newConfig.cssClass) {
	                throw new Error('The provided cssClass has already been registered: ' + item.cssClass);
	            }
	            if (item.className === newConfig.className) {
	                throw new Error('The provided className has already been registered');
	            }
	        };
	        this.registeredControls.push(newConfig);
	    },
	    updateComp: function updateComp(ele) {
	        for (var n = 0; n < this.registeredControls.length; n++) {
	            _upgradeDomInternal(this.registeredControls[n].className, null, ele);
	        }
	    }
	};
	
	var compMgr = CompMgr;
	exports.compMgr = compMgr;
	
	///**
	// * 加载控件
	// */
	//
	//if (document.readyState && document.readyState === 'complete'){
	//    compMgr.updateComp();
	//}else{
	//    on(window, 'load', function() {
	//
	//        //扫描并生成控件
	//        compMgr.updateComp();
	//    });
	//}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.showPanelByEle = exports.getScroll = exports.getOffset = exports.makeModal = exports.makeDOM = exports.getZIndex = exports.getStyle = exports.wrap = exports.css = exports.closest = exports.toggleClass = exports.hasClass = exports.removeClass = exports.addClass = undefined;
	
	var _event = __webpack_require__(8);
	
	/**
	 * 元素增加指定样式
	 * @param value
	 * @returns {*}
	 */
	var addClass = function addClass(element, value) {
		if (typeof element.classList === 'undefined') {
			if (u._addClass) u._addClass(element, value);
		} else {
			element.classList.add(value);
		}
		return this;
	};
	/**
	 * 删除元素上指定样式
	 * @param {Object} element
	 * @param {Object} value
	 */
	/**
	 * Module : Sparrow dom
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-07-27 21:46:50
	 */
	var removeClass = function removeClass(element, value) {
		if (typeof element.classList === 'undefined') {
			if (u._removeClass) u._removeClass(element, value);
		} else {
			element.classList.remove(value);
		}
		return this;
	};
	/**
	 * 元素上是否存在该类
	 * @param {Object} element
	 * @param {Object} value
	 */
	var hasClass = function hasClass(element, value) {
		if (!element) return false;
		if (element.nodeName && (element.nodeName === '#text' || element.nodeName === '#comment')) return false;
		if (typeof element.classList === 'undefined') {
			if (u._hasClass) return u._hasClass(element, value);
			return false;
		} else {
			return element.classList.contains(value);
		}
	};
	/**
	 * 选择元素类切换
	 * @param {Object} element
	 * @param {Object} value
	 */
	var toggleClass = function toggleClass(element, value) {
		if (typeof element.classList === 'undefined') {
			return u._toggleClass(element, value);
		} else {
			return element.classList.toggle(value);
		}
	};
	
	/**
	 * 向上查找指定类元素
	 * @param {Object} element
	 * @param {Object} selector
	 */
	var closest = function closest(element, selector) {
		var tmp = element;
		while (tmp != null && !hasClass(tmp, selector) && tmp != document.body) {
			tmp = tmp.parentNode;
		}
		if (tmp == document.body) return null;
		return tmp;
	};
	
	/**
	 * 元素CSS操作
	 * @param {Object} element
	 * @param {Object} csstext
	 * @param {Object} val
	 */
	var css = function css(element, csstext, val) {
		//TO DO : 实现u.相关方法
		if (csstext instanceof Object) {
			for (var k in csstext) {
				var tmpcss = csstext[k];
				if (["width", "height", "top", "bottom", "left", "right"].indexOf(k) > -1 && isNumber(tmpcss)) {
					tmpcss = tmpcss + "px";
				}
				element.style[k] = tmpcss;
			}
		} else {
			if (arguments.length > 2) {
				element.style[csstext] = val;
			} else {
				return getStyle(element, csstext);
			}
		}
	};
	
	var wrap = function wrap(element, parent) {
		var p = makeDOM(parent);
		element.parentNode.insertBefore(p, element);
		p.appendChild(element);
	};
	var getStyle = function getStyle(element, key) {
		//不要在循环里用
		var allCSS;
		if (window.getComputedStyle) {
			allCSS = window.getComputedStyle(element);
		} else {
			allCSS = element.currentStyle;
		}
		if (allCSS[key] !== undefined) {
			return allCSS[key];
		} else {
			return "";
		}
	};
	var globalZIndex;
	/**
	 * 统一zindex值, 不同控件每次显示时都取最大的zindex，防止显示错乱
	 */
	var getZIndex = function getZIndex() {
		if (!globalZIndex) {
			globalZIndex = 2000;
		}
		return globalZIndex++;
	};
	var makeDOM = function makeDOM(htmlString) {
		var tempDiv = document.createElement("div");
		tempDiv.innerHTML = htmlString;
		var _dom = tempDiv.children[0];
		return _dom;
	};
	/**
	 * element
	 */
	var makeModal = function makeModal(element, parEle) {
		var overlayDiv = document.createElement('div');
		addClass(overlayDiv, 'u-overlay');
		overlayDiv.style.zIndex = getZIndex();
		// 如果有父元素则插入到父元素上，没有则添加到body上
		if (parEle && parEle != document.body) {
			addClass(overlayDiv, 'hasPar');
			parEle.appendChild(overlayDiv);
		} else {
			document.body.appendChild(overlayDiv);
		}
	
		element.style.zIndex = getZIndex();
		(0, _event.on)(overlayDiv, 'click', function (e) {
			(0, _event.stopEvent)(e);
		});
		return overlayDiv;
	};
	
	var getOffset = function getOffset(Node, offset) {
		if (!offset) {
			offset = {};
			offset.top = 0;
			offset.left = 0;
		}
		if (Node == document.body) {
			return offset;
		}
		offset.top += Node.offsetTop;
		offset.left += Node.offsetLeft;
		if (Node.offsetParent) return getOffset(Node.offsetParent, offset);else return offset;
	};
	var getScroll = function getScroll(Node, offset) {
		if (!offset) {
			offset = {};
			offset.top = 0;
			offset.left = 0;
		}
		if (Node == document.body) {
			offset.top += Node.scrollTop || document.documentElement.scrollTop;
			offset.left += Node.scrollLeft || document.documentElement.scrollLeft;
			return offset;
		}
		offset.top += Node.scrollTop;
		offset.left += Node.scrollLeft;
		if (Node.parentNode) return getScroll(Node.parentNode, offset);else return offset;
	};
	var showPanelByEle = function showPanelByEle(obj) {
		var ele = obj.ele,
		    panel = obj.panel,
		    position = obj.position,
		    off = getOffset(ele),
		    scroll = getScroll(ele),
		    offLeft = off.left,
		    offTop = off.top,
		    scrollLeft = scroll.left,
		    scrollTop = scroll.top,
		    eleWidth = ele.offsetWidth,
		    eleHeight = ele.offsetHeight,
		    panelWidth = panel.offsetWidth,
		    panelHeight = panel.offsetHeight,
		    bodyWidth = document.body.clientWidth,
		    bodyHeight = document.body.clientHeight,
		    position = position || 'top',
		    left = offLeft - scrollLeft,
		    top = offTop - scrollTop;
		// 基准点为Ele的左上角
		// 后续根据需要完善
		if (position == 'left') {
			left = left - panelWidth;
			top = top + (eleHeight - panelHeight) / 2;
		} else if (position == 'right') {
			left = left + eleWidth;
			top = top + (eleHeight - panelHeight) / 2;
		} else if (position == 'top' || position == 'topCenter') {
			left = left + (eleWidth - panelWidth) / 2;
			top = top - panelHeight;
		} else if (position == 'bottom' || position == 'bottomCenter') {
			left = left + (eleWidth - panelWidth) / 2;
			top = top + eleHeight;
		} else if (position == 'bottomLeft') {
			left = left;
			top = top + eleHeight;
		}
	
		// if((left + panelWidth) > bodyWidth)
		//     left = bodyWidth - panelWidth;
		// if(left < 0)
		//     left = 0;
	
		// if((top + panelHeight) > bodyHeight)
		//     top = bodyHeight - panelHeight;
		// if(top < 0)
		//     top = 0;
		panel.style.left = left + 'px';
		panel.style.top = top + 'px';
	};
	
	exports.addClass = addClass;
	exports.removeClass = removeClass;
	exports.hasClass = hasClass;
	exports.toggleClass = toggleClass;
	exports.closest = closest;
	exports.css = css;
	exports.wrap = wrap;
	exports.getStyle = getStyle;
	exports.getZIndex = getZIndex;
	exports.makeDOM = makeDOM;
	exports.makeModal = makeModal;
	exports.getOffset = getOffset;
	exports.getScroll = getScroll;
	exports.showPanelByEle = showPanelByEle;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.URipple = exports.Ripple = undefined;
	
	var _env = __webpack_require__(9);
	
	var _dom = __webpack_require__(13);
	
	var _event = __webpack_require__(8);
	
	var URipple = function URipple(element) {
	  if (_env.isIE8) return;
	  this._element = element;
	
	  // Initialize instance.
	  this.init();
	};
	//window['URipple'] = URipple;
	
	/**
	 * Module : Sparrow ripple
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-07-29 08:42:13
	 */
	
	URipple.prototype._down = function (event) {
	  if (_env.isIE8) return;
	  if (!this._rippleElement.style.width && !this._rippleElement.style.height) {
	    var rect = this._element.getBoundingClientRect();
	    this.rippleSize_ = Math.sqrt(rect.width * rect.width + rect.height * rect.height) * 2 + 2;
	    this._rippleElement.style.width = this.rippleSize_ + 'px';
	    this._rippleElement.style.height = this.rippleSize_ + 'px';
	  }
	
	  (0, _dom.addClass)(this._rippleElement, 'is-visible');
	
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
	    if (window.requestAnimationFrame) window.requestAnimationFrame(this.animFrameHandler.bind(this));
	  }
	};
	
	/**
	 * Handle mouse / finger up on element.
	 *
	 * @param {Event} event The event that fired.
	 * @private
	 */
	URipple.prototype._up = function (event) {
	  if (_env.isIE8) return;
	  var self = this;
	  // Don't fire for the artificial "mouseup" generated by a double-click.
	  if (event && event.detail !== 2) {
	    (0, _dom.removeClass)(this._rippleElement, 'is-visible');
	  }
	  // Allow a repaint to occur before removing this class, so the animation
	  // shows for tap events, which seem to trigger a mouseup too soon after
	  // mousedown.
	  window.setTimeout(function () {
	    (0, _dom.removeClass)(self._rippleElement, 'is-visible');
	  }, 0);
	};
	
	/**
	     * Getter for frameCount_.
	     * @return {number} the frame count.
	     */
	URipple.prototype.getFrameCount = function () {
	  if (_env.isIE8) return;
	  return this.frameCount_;
	};
	/**
	     * Setter for frameCount_.
	     * @param {number} fC the frame count.
	     */
	URipple.prototype.setFrameCount = function (fC) {
	  if (_env.isIE8) return;
	  this.frameCount_ = fC;
	};
	
	/**
	     * Getter for _rippleElement.
	     * @return {Element} the ripple element.
	     */
	URipple.prototype.getRippleElement = function () {
	  if (_env.isIE8) return;
	  return this._rippleElement;
	};
	
	/**
	 * Sets the ripple X and Y coordinates.
	 * @param  {number} newX the new X coordinate
	 * @param  {number} newY the new Y coordinate
	 */
	URipple.prototype.setRippleXY = function (newX, newY) {
	  if (_env.isIE8) return;
	  this.x_ = newX;
	  this.y_ = newY;
	};
	
	/**
	 * Sets the ripple styles.
	 * @param  {boolean} start whether or not this is the start frame.
	 */
	URipple.prototype.setRippleStyles = function (start) {
	  if (_env.isIE8) return;
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
	      (0, _dom.removeClass)(this._rippleElement, 'is-animating');
	    } else {
	      (0, _dom.addClass)(this._rippleElement, 'is-animating');
	    }
	  }
	};
	
	/**
	   * Handles an animation frame.
	   */
	URipple.prototype.animFrameHandler = function () {
	  if (_env.isIE8) return;
	  if (this.frameCount_-- > 0) {
	    window.requestAnimationFrame(this.animFrameHandler.bind(this));
	  } else {
	    this.setRippleStyles(false);
	  }
	};
	
	/**
	 * Initialize element.
	 */
	URipple.prototype.init = function () {
	  if (_env.isIE8) return;
	  var self = this;
	  if (this._element) {
	    this._rippleElement = this._element.querySelector('.u-ripple');
	    if (!this._rippleElement) {
	      this._rippleElement = document.createElement('span');
	      (0, _dom.addClass)(this._rippleElement, 'u-ripple');
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
	    (0, _event.on)(this._element, 'mousedown', function (e) {
	      self._down(e);
	    });
	    (0, _event.on)(this._element, 'touchstart', function (e) {
	      self._down(e);
	    });
	
	    (0, _event.on)(this._element, 'mouseup', function (e) {
	      self._up(e);
	    });
	    (0, _event.on)(this._element, 'mouseleave', function (e) {
	      self._up(e);
	    });
	    (0, _event.on)(this._element, 'touchend', function (e) {
	      self._up(e);
	    });
	    (0, _event.on)(this._element, 'blur', function (e) {
	      self._up(e);
	    });
	  }
	};
	
	var Ripple = URipple;
	
	exports.Ripple = Ripple;
	exports.URipple = URipple;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.CkEditorAdapter = undefined;
	
	var _baseAdapter = __webpack_require__(1);
	
	var _valueMixin = __webpack_require__(5);
	
	var _compMgr = __webpack_require__(12);
	
	/**
	 * Module : Kero webpack entry index
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-09 09:52:13
	 */
	var CkEditorAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin, _valueMixin.RequiredMixin, _valueMixin.ValidateMixin],
	    init: function init() {
	        var self = this;
	        this.e_editor = this.id + "-ckeditor";
	        this.render(this.options);
	    },
	
	    render: function render(data) {
	        var cols = data.cols || 80;
	        var rows = data.rows || 10;
	        var self = this;
	        var tpls = '<textarea cols="' + cols + '" id="' + this.e_editor + '" name="' + this.e_editor + '_name' + '" rows="' + rows + '"></textarea>';
	        $(this.element).append(tpls);
	        CKEDITOR.replace(this.e_editor + '_name');
	        var tmpeditor = CKEDITOR.instances[this.e_editor];
	        this.tmpeditor = tmpeditor;
	        this.tmpeditor.on('blur', function () {
	            self.setValue(tmpeditor.getData());
	        });
	
	        this.tmpeditor.on('focus', function () {
	            self.setShowValue(self.getValue());
	        });
	    },
	
	    modelValueChange: function modelValueChange(value) {
	        if (this.slice) return;
	        value = value || "";
	        this.trueValue = value;
	        this.showValue = value;
	        this.setShowValue(this.showValue);
	    },
	
	    setValue: function setValue(value) {
	        this.trueValue = value;
	        this.showValue = value;
	        this.setShowValue(this.showValue);
	        this.slice = true;
	        this.dataModel.setValue(this.field, this.trueValue);
	        this.slice = false;
	        //this.trigger(Editor.EVENT_VALUE_CHANGE, this.trueValue)
	    },
	
	    getValue: function getValue() {
	        return this.trueValue;
	    },
	
	    setShowValue: function setShowValue(showValue) {
	        var self = this;
	        this.showValue = showValue;
	        this.element.value = showValue;
	        this.tmpeditor.setData(showValue);
	
	        //同一页面多次复制有些时候会不生效，setData为异步方法导致。
	        if (self.setShowValueInter) clearInterval(self.setShowValueInter);
	        self.setShowValueInter = setInterval(function () {
	            if (self.tmpeditor.document && self.tmpeditor.document.$ && self.tmpeditor.document.$.body) {
	                self.tmpeditor.document.$.body.innerHTML = showValue;
	                clearInterval(self.setShowValueInter);
	            }
	        }, 100);
	    },
	
	    getShowValue: function getShowValue() {
	        return this.showValue;
	    },
	
	    getContent: function getContent() {
	        return $('#' + this.e_editor).html();
	    },
	
	    setContent: function setContent(txt) {
	        $('#' + this.e_editor).html(txt);
	    }
	
	});
	
	_compMgr.compMgr.addDataAdapter({
	    adapter: CkEditorAdapter,
	    name: 'u-ckeditor'
	});
	
	exports.CkEditorAdapter = CkEditorAdapter;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ComboboxAdapter = undefined;
	
	var _baseAdapter = __webpack_require__(1);
	
	var _valueMixin = __webpack_require__(5);
	
	var _util = __webpack_require__(3);
	
	var _neouiCombo = __webpack_require__(17);
	
	var _env = __webpack_require__(9);
	
	var _event = __webpack_require__(8);
	
	var _dom = __webpack_require__(13);
	
	var _compMgr = __webpack_require__(12);
	
	var ComboboxAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin, _valueMixin.RequiredMixin, _valueMixin.ValidateMixin],
	    init: function init() {
	        var self = this;
	        //ComboboxAdapter.superclass.initialize.apply(this, arguments);
	        this.datasource = (0, _util.getJSObject)(this.viewModel, this.options['datasource']);
	        this.mutil = this.options.mutil || false;
	        this.onlySelect = this.options.onlySelect || false;
	        this.showFix = this.options.showFix || false;
	        this.validType = 'combobox';
	        this.comp = new _neouiCombo.Combo({ el: this.element, mutilSelect: this.mutil, onlySelect: this.onlySelect, showFix: this.showFix });
	        this.element['u.Combo'] = this.comp;
	        if (this.datasource) {
	            this.comp.setComboData(this.datasource);
	        } else {
	            if (_env.env.isIE8 || _env.env.isIE9) alert("IE8/IE9必须设置datasource");
	        }
	        ////TODO 后续支持多选
	        //if (this.mutil) {
	        //    //$(this.comboEle).on("mutilSelect", function (event, value) {
	        //    //    self.setValue(value)
	        //    //})
	        //}
	        this.comp.on('select', function (event) {
	            // self.slice = true;
	            // if(self.dataModel)
	            //     self.dataModel.setValue(self.field, event.value);
	            // self.slice = false;
	            self.setValue(event.value);
	        });
	        //if(this.dataModel){
	        //    this.dataModel.ref(this.field).subscribe(function(value) {
	        //        self.modelValueChange(value)
	        //    })
	        //}
	    },
	    modelValueChange: function modelValueChange(value) {
	        if (this.slice) return;
	        //this.trueValue = value;
	        if (value === null || typeof value == "undefined") value = "";
	        this.comp.setValue(value);
	        // this.trueValue = this.formater ? this.formater.format(value) : value;
	        // this.element.trueValue = this.trueValue;
	        // this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
	        // this.setShowValue(this.showValue);
	    },
	    //setValue: function (value) {
	    //    this.trueValue = value;
	    //    this.slice = true;
	    //    this.setModelValue(this.trueValue);
	    //    this.slice = false;
	    //},
	    //getValue: function () {
	    //    return this.trueValue
	    //},
	    setEnable: function setEnable(enable) {
	        var self = this;
	        if (enable === true || enable === 'true') {
	            this.enable = true;
	            this.element.removeAttribute('readonly');
	            this.comp._input.removeAttribute('readonly');
	            (0, _dom.removeClass)(this.element.parentNode, 'disablecover');
	            (0, _event.on)(this.comp._input, 'focus', function (e) {
	                self.comp.show(e);
	                (0, _event.stopEvent)(e);
	            });
	            if (this.comp.iconBtn) {
	                (0, _event.on)(this.comp.iconBtn, 'click', function (e) {
	                    self.comp.show(e);
	                    (0, _event.stopEvent)(e);
	                });
	            }
	        } else if (enable === false || enable === 'false') {
	            this.enable = false;
	            this.element.setAttribute('readonly', 'readonly');
	            this.comp._input.setAttribute('readonly', 'readonly');
	            addClass(this.element.parentNode, 'disablecover');
	            (0, _event.off)(this.comp._input, 'focus');
	            if (this.comp.iconBtn) {
	                (0, _event.off)(this.comp.iconBtn, 'click');
	            }
	        }
	    }
	}); /**
	     * Module : Kero webpack entry index
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-09 09:52:13
	     */
	
	
	_compMgr.compMgr.addDataAdapter({
	    adapter: ComboboxAdapter,
	    name: 'u-combobox'
	});
	
	exports.ComboboxAdapter = ComboboxAdapter;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Combo = undefined;
	
	var _BaseComponent = __webpack_require__(7);
	
	var _dom = __webpack_require__(13);
	
	var _env = __webpack_require__(9);
	
	var _event = __webpack_require__(8);
	
	var _neouiTextfield = __webpack_require__(18);
	
	var _ripple = __webpack_require__(14);
	
	var _compMgr = __webpack_require__(12);
	
	var Combo = _BaseComponent.BaseComponent.extend({
	
	    init: function init() {
	        this.mutilSelect = this.options['mutilSelect'] || false;
	        if ((0, _dom.hasClass)(this.element, 'mutil-select')) {
	            this.mutilSelect = true;
	        }
	
	        this.onlySelect = this.options['onlySelect'] || false;
	        if (this.mutilSelect) this.onlySelect = true;
	
	        this.comboDatas = [];
	        var i,
	            option,
	            datas = [],
	            self = this;
	        //addClass(this.element, 'u-text')
	        new _neouiTextfield.Text(this.element);
	        var options = this.element.getElementsByTagName('option');
	        for (i = 0; i < options.length; i++) {
	            option = options[i];
	            datas.push({ value: option.value, name: option.text });
	        }
	
	        this.setComboData(datas);
	        this._input = this.element.querySelector("input");
	        if (this.onlySelect || _env.env.isMobile) {
	            setTimeout(function () {
	                self._input.setAttribute('readonly', 'readonly');
	            }, 1000);
	        } else {
	            (0, _event.on)(this._input, 'blur', function (e) {
	                var v = this.value;
	                /*校验数值是否存在于datasource的name中*/
	                for (var i = 0; i < self.comboDatas.length; i++) {
	                    if (v == self.comboDatas[i].name) {
	                        v = self.comboDatas[i].value;
	                        break;
	                    }
	                }
	                self.setValue(v);
	            });
	        }
	        this._combo_name_par = this.element.querySelector(".u-combo-name-par");
	        (0, _event.on)(this._input, 'focus', function (e) {
	            self._inputFocus = true;
	            self.show(e);
	            (0, _event.stopEvent)(e);
	        });
	        (0, _event.on)(this._input, 'blur', function (e) {
	            self._inputFocus = false;
	        });
	
	        (0, _event.on)(this.input, 'keydown', function (e) {
	            var keyCode = e.keyCode;
	            if (e.keyCode == 13) {
	                // 回车
	                this.blur();
	            }
	        });
	        this.iconBtn = this.element.querySelector("[data-role='combo-button']");
	        if (this.iconBtn) {
	            (0, _event.on)(this.iconBtn, 'click', function (e) {
	                self._input.focus();
	                (0, _event.stopEvent)(e);
	            });
	        }
	    },
	
	    show: function show(evt) {
	
	        var self = this,
	            width = this._input.offsetWidth;
	        if (this.options.showFix) {
	            document.body.appendChild(this._ul);
	            this._ul.style.position = 'fixed';
	            (0, _dom.showPanelByEle)({
	                ele: this._input,
	                panel: this._ul,
	                position: "bottomLeft"
	            });
	        } else {
	            // this.element.parentNode.appendChild(this._ul);
	            // var left = this.element.offsetLeft,
	            // inputHeight = this.element.offsetHeight,
	            // top = this.element.offsetTop + inputHeight;
	            // this._ul.style.left = left + 'px';
	            // this._ul.style.top = top + 'px';
	            var bodyWidth = document.body.clientWidth,
	                bodyHeight = document.body.clientHeight,
	                panelWidth = this._ul.offsetWidth,
	                panelHeight = this._ul.offsetHeight;
	            this.element.appendChild(this._ul);
	            this.element.style.position = 'relative';
	            this.left = this._input.offsetLeft;
	            var inputHeight = this._input.offsetHeight;
	            this.top = this._input.offsetTop + inputHeight;
	            if (this.left + panelWidth > bodyWidth) {
	                this.left = bodyWidth - panelWidth;
	            }
	
	            if (this.top + panelHeight > bodyHeight) {
	                this.top = bodyHeight - panelHeight;
	            }
	
	            this._ul.style.left = this.left + 'px';
	            this._ul.style.top = this.top + 'px';
	        }
	        this._ul.style.width = width + 'px';
	        (0, _dom.addClass)(this._ul, 'is-animating');
	        this._ul.style.zIndex = (0, _dom.getZIndex)();
	        (0, _dom.addClass)(this._ul, 'is-visible');
	
	        var callback = function (e) {
	            if (e === evt || e.target === this._input || self._inputFocus == true) return;
	            if (this.mutilSelect && ((0, _dom.closest)(e.target, 'u-combo-ul') === self._ul || (0, _dom.closest)(e.target, 'u-combo-name-par') || (0, _dom.closest)(e.target, 'u-combo-name'))) return;
	            (0, _event.off)(document, 'click', callback);
	            // document.removeEventListener('click', callback);
	            this.hide();
	        }.bind(this);
	        (0, _event.on)(document, 'click', callback);
	        (0, _event.on)(document.body, 'touchend', callback);
	        // document.addEventListener('click', callback);
	    },
	
	    hide: function hide() {
	        (0, _dom.removeClass)(this._ul, 'is-visible');
	        this._ul.style.zIndex = -1;
	        this.trigger('select', { value: this.value });
	    },
	
	    /**
	     * 设置下拉数据
	     * @param datas  数据项
	     * @param options  指定name value对应字段 可以为空
	     */
	    setComboData: function setComboData(datas, options) {
	        var i,
	            li,
	            self = this;
	        if (!options) this.comboDatas = datas;else {
	            this.comboDatas = [];
	            for (var i = 0; i < datas.length; i++) {
	                this.comboDatas.push({ name: datas[i][options.name], value: datas[i][options.value] });
	            }
	        }
	        if (!this._ul) {
	            this._ul = (0, _dom.makeDOM)('<ul class="u-combo-ul"></ul>');
	
	            // document.body.appendChild(this._ul);
	        }
	        this._ul.innerHTML = '';
	        //TODO 增加filter
	        for (i = 0; i < this.comboDatas.length; i++) {
	            li = (0, _dom.makeDOM)('<li class="u-combo-li">' + this.comboDatas[i].name + '</li>'); //document.createElement('li');
	            li._index = i;
	            (0, _event.on)(li, 'click', function () {
	                self.selectItem(this._index);
	            });
	            var rippleContainer = document.createElement('span');
	            (0, _dom.addClass)(rippleContainer, 'u-ripple-container');
	            var _rippleElement = document.createElement('span');
	            (0, _dom.addClass)(_rippleElement, 'u-ripple');
	
	            rippleContainer.appendChild(_rippleElement);
	            li.appendChild(rippleContainer);
	            new _ripple.URipple(li);
	            this._ul.appendChild(li);
	        }
	    },
	
	    selectItem: function selectItem(index) {
	        var self = this;
	
	        if (this.mutilSelect) {
	            var val = this.comboDatas[index].value;
	            var name = this.comboDatas[index].name;
	            var index = (this.value + ',').indexOf(val + ',');
	            var l = val.length + 1;
	            var flag;
	            if (index != -1) {
	                // 已经选中
	                this.value = this.value.substring(0, index) + this.value.substring(index + l);
	                flag = '-';
	            } else {
	                this.value = !this.value ? val + ',' : this.value + val + ',';
	                flag = '+';
	            }
	
	            if (flag == '+') {
	                var nameDiv = (0, _dom.makeDOM)('<div class="u-combo-name" key="' + val + '">' + name + /*<a href="javascript:void(0)" class="remove">x</a>*/'</div>');
	                var parNameDiv = (0, _dom.makeDOM)('<div class="u-combo-name-par" style="position:absolute"></div>');
	                /*var _a = nameDiv.querySelector('a');
	                on(_a, 'click', function(){
	                    var values = self.value.split(',');
	                    values.splice(values.indexOf(val),1);
	                    self.value = values.join(',');
	                    self._combo_name_par.removeChild(nameDiv);
	                    self._updateItemSelect();
	                    self.trigger('select', {value: self.value, name: name});
	                });*/
	                if (!this._combo_name_par) {
	                    this._input.parentNode.insertBefore(parNameDiv, this._input);
	                    this._combo_name_par = parNameDiv;
	                }
	                this._combo_name_par.appendChild(nameDiv);
	            } else {
	                if (this._combo_name_par) {
	                    var comboDiv = this._combo_name_par.querySelector('[key="' + val + '"]');
	                    if (comboDiv) this._combo_name_par.removeChild(comboDiv);
	                }
	            }
	
	            this._updateItemSelect();
	
	            // this.trigger('select', {value: this.value, name: name});
	        } else {
	            this.value = this.comboDatas[index].value;
	            this._input.value = this.comboDatas[index].name;
	            this._updateItemSelect();
	            // this.trigger('select', {value: this.value, name: this._input.value});
	        }
	    },
	
	    _updateItemSelect: function _updateItemSelect() {
	        var lis = this._ul.querySelectorAll('.u-combo-li');
	        if (this.mutilSelect) {
	            var values = this.value.split(',');
	            for (var i = 0; i < lis.length; i++) {
	                if (values.indexOf(this.comboDatas[i].value) > -1) {
	                    (0, _dom.addClass)(lis[i], 'is-selected');
	                } else {
	                    (0, _dom.removeClass)(lis[i], 'is-selected');
	                }
	            }
	            /*根据多选区域div的高度调整input的高度*/
	            var h = this._combo_name_par.offsetHeight;
	            if (h < 25) h = 25;
	            this._input.style.height = h + 'px';
	        } else {
	            for (var i = 0; i < lis.length; i++) {
	                if (this.value == this.comboDatas[i].value) {
	                    (0, _dom.addClass)(lis[i], 'is-selected');
	                } else {
	                    (0, _dom.removeClass)(lis[i], 'is-selected');
	                }
	            }
	        }
	    },
	
	    /**
	     *设置值
	     * @param value
	     */
	    setValue: function setValue(value) {
	        var self = this;
	        value = value + '';
	        value = value || '';
	
	        var values = value.split(',');
	        if (this.mutilSelect === true) {
	            if (self._combo_name_par) self._combo_name_par.innerHTML = '';
	            this.value = '';
	        }
	        if (!value) {
	            this._input.value = '';
	            this.value = '';
	        }
	        var matched = false;
	        this.comboDatas.forEach(function (item, index) {
	            if (this.mutilSelect === true) {
	                if (values.indexOf(item.value) != -1) {
	                    this.selectItem(index);
	                }
	            } else {
	                if (item.value + '' === value) {
	                    this.selectItem(index);
	                    matched = true;
	                    return;
	                }
	            }
	        }.bind(this));
	        if (!this.onlySelect && !matched) {
	            this.value = value;
	            this._input.value = value;
	            this.trigger('select', { value: this.value, name: this._input.value });
	        }
	    },
	
	    /**
	     * 设置显示名
	     * @param name
	     */
	    setName: function setName(name) {
	        this.comboDatas.forEach(function (item, index) {
	            if (item.name === name) {
	                this.selectItem(index);
	                return;
	            }
	        }.bind(this));
	    }
	
	}); /**
	     * Module : neoui-combo
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-06 13:19:10
	     */
	
	_compMgr.compMgr.regComp({
	    comp: Combo,
	    compAsString: 'u.Combo',
	    css: 'u-combo'
	});
	if (document.readyState && document.readyState === 'complete') {
	    _compMgr.compMgr.updateComp();
	} else {
	    (0, _event.on)(window, 'load', function () {
	        //扫描并生成控件
	        _compMgr.compMgr.updateComp();
	    });
	}
	exports.Combo = Combo;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Text = undefined;
	
	var _BaseComponent = __webpack_require__(7);
	
	var _dom = __webpack_require__(13);
	
	var _env = __webpack_require__(9);
	
	var _event = __webpack_require__(8);
	
	var _compMgr = __webpack_require__(12);
	
	var Text = _BaseComponent.BaseComponent.extend({
	    _Constant: {
	        NO_MAX_ROWS: -1,
	        MAX_ROWS_ATTRIBUTE: 'maxrows'
	    },
	
	    _CssClasses: {
	        LABEL: 'u-label',
	        INPUT: 'u-input',
	        IS_DIRTY: 'is-dirty',
	        IS_FOCUSED: 'is-focused',
	        IS_DISABLED: 'is-disabled',
	        IS_INVALID: 'is-invalid',
	        IS_UPGRADED: 'is-upgraded'
	    },
	
	    init: function init() {
	        var oThis = this;
	        this.maxRows = this._Constant.NO_MAX_ROWS;
	        this.label_ = this.element.querySelector('.' + this._CssClasses.LABEL);
	        this._input = this.element.querySelector('input');
	
	        if (this._input) {
	            if (this._input.hasAttribute(
	            /** @type {string} */this._Constant.MAX_ROWS_ATTRIBUTE)) {
	                this.maxRows = parseInt(this._input.getAttribute(
	                /** @type {string} */this._Constant.MAX_ROWS_ATTRIBUTE), 10);
	                if (isNaN(this.maxRows)) {
	                    this.maxRows = this._Constant.NO_MAX_ROWS;
	                }
	            }
	
	            this.boundUpdateClassesHandler = this._updateClasses.bind(this);
	            this.boundFocusHandler = this._focus.bind(this);
	            this.boundBlurHandler = this._blur.bind(this);
	            this.boundResetHandler = this._reset.bind(this);
	            this._input.addEventListener('input', this.boundUpdateClassesHandler);
	            if (_env.env.isIE8) {
	                this._input.addEventListener('propertychange', function () {
	                    oThis._updateClasses();
	                });
	            }
	            this._input.addEventListener('focus', this.boundFocusHandler);
	            if (_env.env.isIE8 || _env.env.isIE9) {
	                if (this.label_) {
	                    this.label_.addEventListener('click', function () {
	                        this._input.focus();
	                    }.bind(this));
	                }
	            }
	
	            this._input.addEventListener('blur', this.boundBlurHandler);
	            this._input.addEventListener('reset', this.boundResetHandler);
	
	            if (this.maxRows !== this._Constant.NO_MAX_ROWS) {
	                // TODO: This should handle pasting multi line text.
	                // Currently doesn't.
	                this.boundKeyDownHandler = this._down.bind(this);
	                this._input.addEventListener('keydown', this.boundKeyDownHandler);
	            }
	            var invalid = (0, _dom.hasClass)(this.element, this._CssClasses.IS_INVALID);
	            this._updateClasses();
	            (0, _dom.addClass)(this.element, this._CssClasses.IS_UPGRADED);
	            if (invalid) {
	                (0, _dom.addClass)(this.element, this._CssClasses.IS_INVALID);
	            }
	        }
	    },
	
	    /**
	     * Handle input being entered.
	     *
	     * @param {Event} event The event that fired.
	     * @private
	     */
	    _down: function _down(event) {
	        var currentRowCount = event.target.value.split('\n').length;
	        if (event.keyCode === 13) {
	            if (currentRowCount >= this.maxRows) {
	                event.preventDefault();
	            }
	        }
	    },
	    /**
	     * Handle focus.
	     *
	     * @param {Event} event The event that fired.
	     * @private
	     */
	    _focus: function _focus(event) {
	        (0, _dom.addClass)(this.element, this._CssClasses.IS_FOCUSED);
	    },
	    /**
	     * Handle lost focus.
	     *
	     * @param {Event} event The event that fired.
	     * @private
	     */
	    _blur: function _blur(event) {
	        (0, _dom.removeClass)(this.element, this._CssClasses.IS_FOCUSED);
	    },
	    /**
	     * Handle reset event from out side.
	     *
	     * @param {Event} event The event that fired.
	     * @private
	     */
	    _reset: function _reset(event) {
	        this._updateClasses();
	    },
	    /**
	     * Handle class updates.
	     *
	     * @private
	     */
	    _updateClasses: function _updateClasses() {
	        this.checkDisabled();
	        this.checkValidity();
	        this.checkDirty();
	    },
	
	    // Public methods.
	
	    /**
	     * Check the disabled state and update field accordingly.
	     *
	     * @public
	     */
	    checkDisabled: function checkDisabled() {
	        if (this._input.disabled) {
	            (0, _dom.addClass)(this.element, this._CssClasses.IS_DISABLED);
	        } else {
	            (0, _dom.removeClass)(this.element, this._CssClasses.IS_DISABLED);
	        }
	    },
	    /**
	     * Check the validity state and update field accordingly.
	     *
	     * @public
	     */
	    checkValidity: function checkValidity() {
	        if (this._input.validity) {
	            if (this._input.validity.valid) {
	                (0, _dom.removeClass)(this.element, this._CssClasses.IS_INVALID);
	            } else {
	                (0, _dom.addClass)(this.element, this._CssClasses.IS_INVALID);
	            }
	        }
	    },
	    /**
	     * Check the dirty state and update field accordingly.
	     *
	     * @public
	     */
	    checkDirty: function checkDirty() {
	        if (this._input.value && this._input.value.length > 0) {
	            (0, _dom.addClass)(this.element, this._CssClasses.IS_DIRTY);
	        } else {
	            (0, _dom.removeClass)(this.element, this._CssClasses.IS_DIRTY);
	        }
	    },
	    /**
	     * Disable text field.
	     *
	     * @public
	     */
	    disable: function disable() {
	        this._input.disabled = true;
	        this._updateClasses();
	    },
	    /**
	     * Enable text field.
	     *
	     * @public
	     */
	    enable: function enable() {
	        this._input.disabled = false;
	        this._updateClasses();
	    },
	    /**
	     * Update text field value.
	     *
	     * @param {string} value The value to which to set the control (optional).
	     * @public
	     */
	    change: function change(value) {
	        this._input.value = value || '';
	        this._updateClasses();
	    }
	
	});
	
	//if (compMgr)
	//    compMgr.addPlug({
	//        name:'text',
	//        plug: Text
	//    })
	
	/**
	 * Module : neoui-combo
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-02 14:22:46
	 */
	
	_compMgr.compMgr.regComp({
	    comp: Text,
	    compAsString: 'u.Text',
	    css: 'u-text'
	});
	if (document.readyState && document.readyState === 'complete') {
	    _compMgr.compMgr.updateComp();
	} else {
	    (0, _event.on)(window, 'load', function () {
	        //扫描并生成控件
	        _compMgr.compMgr.updateComp();
	    });
	}
	exports.Text = Text;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.FloatAdapter = undefined;
	
	var _baseAdapter = __webpack_require__(1);
	
	var _valueMixin = __webpack_require__(5);
	
	var _event = __webpack_require__(8);
	
	var _dom = __webpack_require__(13);
	
	var _core = __webpack_require__(20);
	
	var _formater = __webpack_require__(22);
	
	var _env = __webpack_require__(9);
	
	var _dateUtils = __webpack_require__(23);
	
	var _compMgr = __webpack_require__(12);
	
	//miss DateTimePicker
	
	//miss DataTable;
	/**
	 * Module : Kero float adapter
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-09 15:16:08
	 */
	var FloatAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin, _valueMixin.RequiredMixin, _valueMixin.ValidateMixin],
	    init: function init() {
	        var self = this;
	        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
	        if (!this.element) {
	            throw new Error('not found INPUT element, u-meta:' + JSON.stringify(this.options));
	        };
	        this.maskerMeta = _core.core.getMaskerMeta('float') || {};
	        this.validType = 'float';
	        this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
	        this.max = this.getOption('max');
	        this.min = this.getOption('min');
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
	        this.dataModel.refRowMeta(this.field, "precision").subscribe(function (precision) {
	            if (precision === undefined) return;
	            self.setPrecision(precision);
	        });
	        this.formater = new _formater.NumberFormater(this.maskerMeta.precision);
	        this.masker = new NumberMasker(this.maskerMeta);
	        (0, _event.on)(this.element, 'focus', function () {
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
	
	        (0, _event.on)(this.element, 'blur', function () {
	            if (self.enable) {
	                if (!self.doValidate() && self._needClean()) {
	                    if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
	                        // 因必输项清空导致检验没通过的情况
	                        self.setValue('');
	                    } else {
	                        self.element.value = self.getShowValue();
	                    }
	                } else self.setValue(self.element.value);
	            }
	        });
	    },
	    /**
	     * 修改精度
	     * @param {Integer} precision
	     */
	    setPrecision: function setPrecision(precision) {
	        if (this.maskerMeta.precision == precision) return;
	        this.maskerMeta.precision = precision;
	        this.formater = new _formater.NumberFormater(this.maskerMeta.precision);
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
	    onFocusin: function onFocusin() {
	        var v = this.dataModel.getCurrentRow().getValue(this.field),
	            vstr = v + '',
	            focusValue = v;
	        if (_env.env.isNumber(v) && _env.env.isNumber(this.maskerMeta.precision)) {
	            if (vstr.indexOf('.') >= 0) {
	                var sub = vstr.substr(vstr.indexOf('.') + 1);
	                if (sub.length < this.maskerMeta.precision || parseInt(sub.substr(this.maskerMeta.precision)) == 0) {
	                    focusValue = this.formater.format(v);
	                }
	            } else if (this.maskerMeta.precision > 0) {
	                focusValue = this.formater.format(v);
	            }
	        }
	        focusValue = parseFloat(focusValue) || '';
	        this.setShowValue(focusValue);
	    },
	    _needClean: function _needClean() {
	        return true;
	    }
	});
	
	_compMgr.compMgr.addDataAdapter({
	    adapter: FloatAdapter,
	    name: 'float'
	});
	
	exports.FloatAdapter = FloatAdapter;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.core = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                   * Module : Sparrow core context
	                                                                                                                                                                                                                                                   * Author : Kvkens(yueming@yonyou.com)
	                                                                                                                                                                                                                                                   * Date	  : 2016-07-28 13:52:19
	                                                                                                                                                                                                                                                   */
	
	
	var _extend = __webpack_require__(10);
	
	var _extend2 = _interopRequireDefault(_extend);
	
	var _util = __webpack_require__(3);
	
	var _cookies = __webpack_require__(21);
	
	var _enumerables = __webpack_require__(11);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
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
		'percent': {}
	};
	/**
	 * 获取环境信息
	 * @return {environment}
	 */
	fn.getEnvironment = function () {
		return (0, _util.createShellObject)(environment);
	};
	
	/**
	 * 获取客户端参数对象
	 * @return {clientAttributes}
	 */
	fn.getClientAttributes = function () {
		var exf = function exf() {};
		return (0, _util.createShellObject)(clientAttributes);
	};
	
	fn.setContextPath = function (contextPath) {
		return environment[IWEB_CONTEXT_PATH] = contextPath;
	};
	fn.getContextPath = function (contextPath) {
		return environment[IWEB_CONTEXT_PATH];
	};
	/**
	 * 设置客户端参数对象
	 * @param {Object} k 对象名称
	 * @param {Object} v 对象值(建议使用简单类型)
	 */
	fn.setClientAttribute = function (k, v) {
		clientAttributes[k] = v;
	};
	/**
	 * 获取会话级参数对象
	 * @return {clientAttributes}
	 */
	fn.getSessionAttributes = function () {
		var exf = function exf() {};
		return (0, _util.createShellObject)(sessionAttributes);
	};
	
	/**
	 * 设置会话级参数对象
	 * @param {Object} k 对象名称
	 * @param {Object} v 对象值(建议使用简单类型)
	 */
	fn.setSessionAttribute = function (k, v) {
		sessionAttributes[k] = v;
		(0, _cookies.setCookie)("ISES_" + k, v);
	};
	
	/**
	 * 移除客户端参数
	 * @param {Object} k 对象名称
	 */
	fn.removeClientAttribute = function (k) {
		clientAttributes[k] = null;
		execIgnoreError(function () {
			delete clientAttributes[k];
		});
	};
	
	/**
	 * 获取地区信息编码
	 */
	fn.getLocale = function () {
		return this.getEnvironment().locale;
	};
	
	/**
	 * 获取多语信息
	 */
	fn.getLanguages = function () {
		return this.getEnvironment().languages;
	};
	/**
	 * 收集环境信息(包括客户端参数)
	 * @return {Object}
	 */
	fn.collectEnvironment = function () {
		var _env = this.getEnvironment();
		var _ses = this.getSessionAttributes();
	
		for (var i in clientAttributes) {
			_ses[i] = clientAttributes[i];
		}
		_env.clientAttributes = _ses;
		return _env;
	};
	
	/**
	 * 设置数据格式信息
	 * @param {String} type
	 * @param {Object} meta
	 */
	fn.setMaskerMeta = function (type, meta) {
		if (typeof type == 'function') {
			getMetaFunc = type;
		} else {
			if (!maskerMeta[type]) maskerMeta[type] = meta;else {
				if ((typeof meta === 'undefined' ? 'undefined' : _typeof(meta)) != 'object') maskerMeta[type] = meta;else for (var key in meta) {
					maskerMeta[type][key] = meta[key];
				}
			}
		}
	};
	fn.getMaskerMeta = function (type) {
		if (typeof getMetaFunc == 'function') {
			var meta = getMetaFunc.call(this);
			return meta[type];
		} else return (0, _extend2.default)({}, maskerMeta[type]);
	};
	environment.languages = (0, _cookies.getCookie)(_enumerables.U_LANGUAGES) ? (0, _cookies.getCookie)(_enumerables.U_LANGUAGES).split(',') : navigator.language ? navigator.language : 'zh-CN';
	if (environment.languages == 'zh-cn') environment.languages = 'zh-CN';
	if (environment.languages == 'en-us') environment.languages = 'en-US';
	
	environment.theme = (0, _cookies.getCookie)(_enumerables.U_THEME);
	environment.locale = (0, _cookies.getCookie)(_enumerables.U_LOCALE);
	//environment.timezoneOffset = (new Date()).getTimezoneOffset()
	environment.usercode = (0, _cookies.getCookie)(_enumerables.U_USERCODE);
	//init session attribute
	document.cookie.replace(/ISES_(\w*)=([^;]*);?/ig, function (a, b, c) {
		sessionAttributes[b] = c;
	});
	
	var Core = function Core() {};
	Core.prototype = fn;
	
	var core = new Core();
	
	exports.core = core;

/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/**
	 * Module : Sparrow cookies
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-07-27 21:46:50
	 */
	
	var setCookie = function setCookie(sName, sValue, oExpires, sPath, sDomain, bSecure) {
		var sCookie = sName + "=" + encodeURIComponent(sValue);
		if (oExpires) sCookie += "; expires=" + oExpires.toGMTString();
		if (sPath) sCookie += "; path=" + sPath;
		if (sDomain) sCookie += "; domain=" + sDomain;
		if (bSecure) sCookie += "; secure=" + bSecure;
		document.cookie = sCookie;
	};
	
	var getCookie = function getCookie(sName) {
		var sRE = "(?:; )?" + sName + "=([^;]*);?";
		var oRE = new RegExp(sRE);
	
		if (oRE.test(document.cookie)) {
			return decodeURIComponent(RegExp["$1"]);
		} else return null;
	};
	
	exports.setCookie = setCookie;
	exports.getCookie = getCookie;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.DateFormater = exports.NumberFormater = undefined;
	
	var _util = __webpack_require__(3);
	
	function NumberFormater(precision) {
	    this.precision = precision;
	} /**
	   * Module : Sparrow data formater tools
	   * Author : Kvkens(yueming@yonyou.com)
	   * Date	  : 2016-07-28 15:39:01
	   */
	;
	
	NumberFormater.prototype.update = function (precision) {
	    this.precision = precision;
	};
	
	NumberFormater.prototype.format = function (value) {
	    if (!(0, _util.isNumber)(value)) return "";
	
	    // 以0开头的数字将其前面的0去掉
	    while ((value + "").charAt(0) == "0" && value.length > 1 && (value + "").indexOf('0.') != 0) {
	        value = value.substring(1);
	    }
	    var result = value;
	    if ((0, _util.isNumber)(this.precision)) {
	        if (window.BigNumber) {
	            // 已经引入BigNumber
	            result = new BigNumber(value).toFixed(this.precision);
	        } else {
	            var digit = parseFloat(value);
	            // 解决toFixed四舍五入问题，如1.345
	            result = (Math.round(digit * Math.pow(10, this.precision)) / Math.pow(10, this.precision)).toFixed(this.precision);
	        }
	        if (result == "NaN") return "";
	    }
	
	    return result;
	};
	
	function DateFormater(pattern) {
	    this.pattern = pattern;
	};
	
	DateFormater.prototype.update = function (pattern) {
	    this.pattern = pattern;
	};
	
	DateFormater.prototype.format = function (value) {
	    return moment(value).format(this.pattern);
	};
	
	//var NumberFormater = NumberFormater;
	//var DateFormater = DateFormater;
	exports.NumberFormater = NumberFormater;
	exports.DateFormater = DateFormater;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.date = undefined;
	
	var _core = __webpack_require__(20);
	
	var u = {}; /**
	             * Module : Sparrow date util
	             * Author : Kvkens(yueming@yonyou.com)
	             * Date	  : 2016-08-06 13:37:20
	             */
	
	u.date = {
	
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
	
		_formattingTokens: /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYY|YY|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,
	
		leftZeroFill: function leftZeroFill(number, targetLength, forceSign) {
			var output = '' + Math.abs(number),
			    sign = number >= 0;
			while (output.length < targetLength) {
				output = '0' + output;
			}
			return (sign ? forceSign ? '+' : '' : '-') + output;
		},
	
		_formats: {
			//year
			YY: function YY(date) {
				return u.date.leftZeroFill(date.getFullYear() % 100, 2);
			},
			YYYY: function YYYY(date) {
				return date.getFullYear();
			},
			//month
			M: function M(date) {
				return date.getMonth() + 1;
			},
			MM: function MM(date) {
				var m = u.date._formats.M(date);
				return u.date.leftZeroFill(m, 2);
			},
			MMM: function MMM(date, language) {
				var m = date.getMonth();
				return u.date._dateLocale[language].monthsShort[m];
			},
			MMMM: function MMMM(date, language) {
				var m = date.getMonth();
				return u.date._dateLocale[language].months[m];
			},
			//date
			D: function D(date) {
				return date.getDate();
			},
			DD: function DD(date) {
				var d = u.date._formats.D(date);
				return u.date.leftZeroFill(d, 2);
			},
			// weekday
			d: function d(date) {
				return date.getDay();
			},
			dd: function dd(date, language) {
				var d = u.date._formats.d(date);
				return u.date._dateLocale[language].weekdaysMin[d];
			},
			ddd: function ddd(date, language) {
				var d = u.date._formats.d(date);
				return u.date._dateLocale[language].weekdaysShort[d];
			},
			dddd: function dddd(date, language) {
				var d = u.date._formats.d(date);
				return u.date._dateLocale[language].weekdays[d];
			},
			// am pm
			a: function a(date) {
				if (date.getHours() > 12) {
					return 'pm';
				} else {
					return 'am';
				}
			},
			//hour
			h: function h(date) {
				var h = date.getHours();
				h = h > 12 ? h - 12 : h;
				return h;
			},
			hh: function hh(date) {
				var h = u.date._formats.h(date);
				return u.date.leftZeroFill(h, 2);
			},
			H: function H(date) {
				return date.getHours();
			},
			HH: function HH(date) {
				return u.date.leftZeroFill(date.getHours(), 2);
			},
			// minutes
			m: function m(date) {
				return date.getMinutes();
			},
			mm: function mm(date) {
				return u.date.leftZeroFill(date.getMinutes(), 2);
			},
			//seconds
			s: function s(date) {
				return date.getSeconds();
			},
			ss: function ss(date) {
				return u.date.leftZeroFill(date.getSeconds(), 2);
			}
		},
	
		/**
	  * 日期格式化
	  * @param date
	  * @param formatString
	  */
		format: function format(date, formatString, language) {
			if (!date) return date;
			var array = formatString.match(u.date._formattingTokens),
			    i,
			    length,
			    output = '';
			var _date = u.date.getDateObj(date);
			if (!_date) return date;
			language = language || _core.core.getLanguages();
			for (i = 0, length = array.length; i < length; i++) {
				if (u.date._formats[array[i]]) {
					output += u.date._formats[array[i]](_date, language);
				} else {
					output += array[i];
				}
			}
			return output;
		},
	
		_addOrSubtract: function _addOrSubtract(date, period, value, isAdding) {
			var times = date.getTime(),
			    d = date.getDate(),
			    m = date.getMonth(),
			    _date = u.date.getDateObj(date);
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
				_date.setMonth(d);
			} else if (period == 'y') {
				m = m + value * 12 * isAdding;
				_date.setMonth(d);
			}
			return _date;
		},
	
		add: function add(date, period, value) {
			return u.date._addOrSubtract(date, period, value, 1);
		},
		sub: function sub(date, period, value) {
			return u.date._addOrSubtract(date, period, value, -1);
		},
		getDateObj: function getDateObj(value) {
			if (!value || typeof value == 'undefined') return value;
			var dateFlag = false;
			var _date = new Date(value);
			if (isNaN(_date)) {
				// IE的话对"2016-2-13 12:13:22"进行处理
				var index1, index2, index3, s1, s2, s3;
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
						} else if (index1 > 0) {
							s1 = value.split('-');
						} else if (index2 > 0) {
							s2 = value.split(':');
						}
						if (s1 && s1.length > 0) {
							_date.setYear(s1[0]);
							_date.setMonth(parseInt(s1[1] - 1));
							_date.setDate(s1[2] ? s1[2] : 0);
							dateFlag = true;
						}
						if (s2 && s2.length > 0) {
							_date.setHours(s2[0] ? s2[0] : 0);
							_date.setMinutes(s2[1] ? s2[1] : 0);
							_date.setSeconds(s2[2] ? s2[2] : 0);
							dateFlag = true;
						}
					} else {
						_date = new Date(parseInt(value));
						if (isNaN(_date)) {
							throw new TypeError('invalid Date parameter');
						} else {
							dateFlag = true;
						}
					}
				}
			} else {
				dateFlag = true;
			}
	
			if (dateFlag) return _date;else return null;
		}
	
	};
	
	var date = u.date;
	exports.date = date;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.IntegerAdapter = undefined;
	
	var _baseAdapter = __webpack_require__(1);
	
	var _valueMixin = __webpack_require__(5);
	
	var _util = __webpack_require__(3);
	
	var _event = __webpack_require__(8);
	
	var _env = __webpack_require__(9);
	
	var _compMgr = __webpack_require__(12);
	
	var IntegerAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin, _valueMixin.RequiredMixin, _valueMixin.ValidateMixin],
	    init: function init() {
	        var self = this;
	        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
	        if (!this.element) {
	            throw new Error('not found INPUT element, u-meta:' + JSON.stringify(this.options));
	        };
	        this.validType = this.options['validType'] || 'integer';
	        this.max = this.options['max'];
	        this.min = this.options['min'];
	        this.maxNotEq = this.options['maxNotEq'];
	        this.minNotEq = this.options['minNotEq'];
	        this.maxLength = this.options['maxLength'] ? options['maxLength'] : 25;
	        this.minLength = this.options['mixLength'] ? options['mixLength'] : 0;
	        if (this.dataModel) {
	            this.min = this.dataModel.getMeta(this.field, "min") !== undefined ? this.dataModel.getMeta(this.field, "min") : this.min;
	            this.max = this.dataModel.getMeta(this.field, "max") !== undefined ? this.dataModel.getMeta(this.field, "max") : this.max;
	            this.minNotEq = this.dataModel.getMeta(this.field, "minNotEq") !== undefined ? this.dataModel.getMeta(this.field, "minNotEq") : this.minNotEq;
	            this.maxNotEq = this.dataModel.getMeta(this.field, "maxNotEq") !== undefined ? this.dataModel.getMeta(this.field, "maxNotEq") : this.maxNotEq;
	            this.minLength = (0, _util.isNumber)(this.dataModel.getMeta(this.field, "minLength")) ? this.dataModel.getMeta(this.field, "minLength") : this.minLength;
	            this.maxLength = (0, _util.isNumber)(this.dataModel.getMeta(this.field, "maxLength")) ? this.dataModel.getMeta(this.field, "maxLength") : this.maxLength;
	        }
	        (0, _event.on)(this.element, 'focus', function () {
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
	
	        (0, _event.on)(this.element, 'blur', function () {
	            if (self.enable) {
	                if (!self.doValidate() && self._needClean()) {
	                    if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
	                        // 因必输项清空导致检验没通过的情况
	                        self.setValue('');
	                    } else {
	                        self.element.value = self.getShowValue();
	                    }
	                } else self.setValue(self.element.value);
	            }
	        });
	    }
	}); /**
	     * Module : Kero integer
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-09 18:29:59
	     */
	
	_compMgr.compMgr.addDataAdapter({
	    adapter: IntegerAdapter,
	    name: 'integer'
	});
	
	exports.IntegerAdapter = IntegerAdapter;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.NativeCheckAdapter = undefined;
	
	var _baseAdapter = __webpack_require__(1);
	
	var _valueMixin = __webpack_require__(5);
	
	var _util = __webpack_require__(3);
	
	var _event = __webpack_require__(8);
	
	var _compMgr = __webpack_require__(12);
	
	/**
	 * Module : Kero native-checkbox
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-09 18:55:51
	 */
	
	var NativeCheckAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin],
	    init: function init() {
	        var self = this;
	        this.isGroup = false;
	        //如果存在datasource，动态创建checkbox
	        if (this.options['datasource']) {
	            this.isGroup = true;
	            var datasource = (0, _util.getJSObject)(this.viewModel, this.options['datasource']);
	
	            this.checkboxTemplateArray = [];
	            for (var i = 0, count = this.element.childNodes.length; i < count; i++) {
	                this.checkboxTemplateArray.push(this.element.childNodes[i]);
	            }
	            this.setComboData(datasource);
	        } else {
	            this.checkedValue = this.options['checkedValue'] || 'Y';
	            this.unCheckedValue = this.options["unCheckedValue"] || 'N';
	            (0, _event.on)(this.element, 'click', function () {
	                if (this.checked) {
	                    self.dataModel.setValue(self.field, self.checkedValue);
	                } else {
	                    self.dataModel.setValue(self.field, self.unCheckedValue);
	                }
	            });
	        }
	    },
	    setComboData: function setComboData(comboData) {
	        var self = this;
	        this.element.innerHTML = '';
	        for (var i = 0, len = comboData.length; i < len; i++) {
	            for (var j = 0; j < this.checkboxTemplateArray.length; j++) {
	                try {
	                    this.element.appendChild(this.checkboxTemplateArray[j].cloneNode());
	                } catch (e) {}
	            }
	            //this.radioTemplate.clone().appendTo(this.element)
	        }
	
	        var allCheck = this.element.querySelectorAll('[type=checkbox]');
	        var allName = this.element.querySelectorAll('[data-role=name]');
	        for (var k = 0; k < allCheck.length; k++) {
	            allCheck[k].value = comboData[k].pk || comboData[k].value;
	            allName[k].innerHTML = comboData[k].name;
	        }
	
	        this.element.querySelectorAll('[type=checkbox]').forEach(function (ele) {
	            (0, _event.on)(ele, 'click', function () {
	                var modelValue = self.dataModel.getValue(self.field);
	
	                var valueArr = modelValue == '' ? [] : modelValue.split(',');
	
	                if (this.checked) {
	                    valueArr.push(this.value);
	                } else {
	                    var index = valueArr.indexOf(this.value);
	                    valueArr.splice(index, 1);
	                }
	                self.slice = true;
	                self.dataModel.setValue(self.field, valueArr.join(','));
	                self.slice = false;
	            });
	        });
	    },
	    modelValueChange: function modelValueChange(val) {
	        if (this.slice) return;
	        if (this.isGroup) {
	            this.element.querySelectorAll('[type=checkbox]').forEach(function (ele) {
	                if (ele.checked != (val + ',').indexOf(ele.value) > -1) {
	                    this.slice = true;
	                    ele.checked = !ele.checked;
	                    this.slice = false;
	                }
	            });
	        } else {
	            if (this.element.checked != (val === this.checkedValue)) {
	                this.slice = true;
	                this.element.checked = !this.element.checked;
	                this.slice = false;
	            }
	        }
	    },
	    setValue: function setValue(value) {
	        this.trueValue = value;
	        this.element.querySelectorAll('[type=checkbox]').forEach(function (ele) {
	            if (ele.value == value) {
	                ele.checked = true;
	            } else {
	                ele.checked = false;
	            }
	        });
	        this.slice = true;
	        this.dataModel.setValue(this.field, this.trueValue);
	        this.slice = false;
	    },
	    getValue: function getValue() {
	        return this.trueValue;
	    }
	
	});
	
	_compMgr.compMgr.addDataAdapter({
	    adapter: NativeCheckAdapter,
	    name: 'checkbox'
	});
	exports.NativeCheckAdapter = NativeCheckAdapter;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.NativeRadioAdapter = undefined;
	
	var _baseAdapter = __webpack_require__(1);
	
	var _valueMixin = __webpack_require__(5);
	
	var _util = __webpack_require__(3);
	
	var _event = __webpack_require__(8);
	
	var _compMgr = __webpack_require__(12);
	
	/**
	 * Module : Kero native-radio
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-09 19:03:30
	 */
	
	var NativeRadioAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin],
	    init: function init() {
	        this.isDynamic = false;
	        //如果存在datasource，动态创建radio
	        if (this.options['datasource']) {
	            this.isDynamic = true;
	            var datasource = (0, _util.getJSObject)(this.viewModel, this.options['datasource']);
	            //if(!u.isArray(datasource)) return;
	
	            this.radioTemplateArray = [];
	            for (var i = 0, count = this.element.childNodes.length; i < count; i++) {
	                this.radioTemplateArray.push(this.element.childNodes[i]);
	            }
	            this.setComboData(datasource);
	        } else {}
	    },
	    setComboData: function setComboData(comboData) {
	        var self = this;
	        //if(!this.radioTemplate.is(":radio")) return;
	        this.element.innerHTML = '';
	        for (var i = 0, len = comboData.length; i < len; i++) {
	            for (var j = 0; j < this.radioTemplateArray.length; j++) {
	                try {
	                    this.element.appendChild(this.radioTemplateArray[j].cloneNode(true));
	                } catch (e) {}
	            }
	            //this.radioTemplate.clone().appendTo(this.element)
	        }
	
	        var allRadio = this.element.querySelectorAll('[type=radio]');
	        var allName = this.element.querySelectorAll('[data-role=name]');
	        for (var k = 0; k < allRadio.length; k++) {
	            allRadio[k].value = comboData[k].pk || comboData[k].value;
	            allName[k].innerHTML = comboData[k].name;
	        }
	
	        this.radioInputName = allRadio[0].name;
	
	        this.element.querySelectorAll('[type=radio][name="' + this.radioInputName + '"]').forEach(function (ele) {
	            (0, _event.on)(ele, 'click', function () {
	                if (this.checked) {
	                    self.setValue(this.value);
	                }
	            });
	        });
	    },
	    modelValueChange: function modelValueChange(value) {
	        if (this.slice) return;
	        this.setValue(value);
	    },
	    setValue: function setValue(value) {
	        this.trueValue = value;
	        this.element.querySelectorAll('[type=radio][name="' + this.radioInputName + '"]').forEach(function (ele) {
	            if (ele.value == value) {
	                ele.checked = true;
	            } else {
	                ele.checked = false;
	            }
	        });
	        this.slice = true;
	        this.dataModel.setValue(this.field, this.trueValue);
	        this.slice = false;
	    },
	    getValue: function getValue() {
	        return this.trueValue;
	    }
	
	});
	
	_compMgr.compMgr.addDataAdapter({
	    adapter: NativeRadioAdapter,
	    name: 'radio'
	});
	exports.NativeRadioAdapter = NativeRadioAdapter;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.PaginationAdapter = undefined;
	
	var _baseAdapter = __webpack_require__(1);
	
	var _extend = __webpack_require__(10);
	
	var _neouiPagination = __webpack_require__(28);
	
	var _util = __webpack_require__(3);
	
	var _compMgr = __webpack_require__(12);
	
	var PaginationAdapter = _baseAdapter.BaseAdapter.extend({
	    initialize: function initialize(comp, options) {
	        var self = this;
	        PaginationAdapter.superclass.initialize.apply(this, arguments);
	
	        //var Pagination = function(element, options, viewModel) {
	
	        if (!this.dataModel.pageSize() && this.options.pageSize) this.dataModel.pageSize(this.options.pageSize);
	        this.options.pageSize = this.dataModel.pageSize() || this.options.pageSize;
	        //this.$element.pagination(options);
	        //this.comp = this.$element.data('u.pagination');
	        var options = (0, _extend.extend)({}, { el: this.element, jumppage: true }, this.options);
	        this.comp = new _neouiPagination.pagination(options);
	        this.element['u.pagination'] = this.comp;
	        this.comp.dataModel = this.dataModel;
	        this.pageChange = (0, _util.getFunction)(this.viewModel, this.options['pageChange']);
	        this.sizeChange = (0, _util.getFunction)(this.viewModel, this.options['sizeChange']);
	
	        this.comp.on('pageChange', function (pageIndex) {
	            if (typeof self.pageChange == 'function') {
	                self.pageChange(pageIndex);
	            } else {
	                self.defaultPageChange(pageIndex);
	            }
	        });
	        this.comp.on('sizeChange', function (size, pageIndex) {
	            if (typeof self.sizeChange == 'function') {
	                self.sizeChange(size, pageIndex);
	            } else {
	                self.defaultSizeChange(size, pageIndex);
	                // showMessage({msg:"没有注册sizeChange事件"});
	            }
	        });
	
	        this.dataModel.totalPages.subscribe(function (value) {
	            self.comp.update({ totalPages: value });
	        });
	
	        this.dataModel.pageSize.subscribe(function (value) {
	            self.comp.update({ pageSize: value });
	        });
	
	        this.dataModel.pageIndex.subscribe(function (value) {
	            self.comp.update({ currentPage: value + 1 });
	        });
	
	        this.dataModel.totalRow.subscribe(function (value) {
	            self.comp.update({ totalCount: value });
	        });
	
	        if (this.comp.options.pageList.length > 0) {
	            this.comp.options.pageSize = this.comp.options.pageList[0];
	            ///this.comp.trigger('sizeChange', options.pageList[0])
	            this.dataModel.pageSize(this.comp.options.pageList[0]);
	        }
	
	        // 如果datatable已经创建则根据datatable设置分页组件
	        // self.comp.update({totalPages: this.dataModel.totalPages()})
	        // self.comp.update({pageSize: this.dataModel.pageSize()})
	        // self.comp.update({currentPage: this.dataModel.pageIndex() + 1})
	        // self.comp.update({totalCount: this.dataModel.totalRow()})
	        self.comp.update({ totalPages: this.dataModel.totalPages(), pageSize: this.dataModel.pageSize(), currentPage: this.dataModel.pageIndex() + 1, totalCount: this.dataModel.totalRow() });
	    },
	
	    defaultPageChange: function defaultPageChange(pageIndex) {
	        if (this.dataModel.hasPage(pageIndex)) {
	            this.dataModel.setCurrentPage(pageIndex);
	        } else {}
	    },
	
	    defaultSizeChange: function defaultSizeChange(size, pageIndex) {
	        this.dataModel.pageSize(size);
	    },
	
	    disableChangeSize: function disableChangeSize() {
	        this.comp.disableChangeSize();
	    },
	
	    enableChangeSize: function enableChangeSize() {
	        this.comp.enableChangeSize();
	    }
	}); /**
	     * Module : Kero pagination
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-09 19:09:39
	     */
	
	
	_compMgr.compMgr.addDataAdapter({
	    adapter: PaginationAdapter,
	    name: 'pagination'
	});
	
	exports.PaginationAdapter = PaginationAdapter;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.pagination = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                   * Module : neoui-pagination
	                                                                                                                                                                                                                                                   * Author : Kvkens(yueming@yonyou.com)
	                                                                                                                                                                                                                                                   * Date	  : 2016-08-03 08:45:49
	                                                                                                                                                                                                                                                   */
	
	var _BaseComponent = __webpack_require__(7);
	
	var _extend = __webpack_require__(10);
	
	var _dom = __webpack_require__(13);
	
	var _util = __webpack_require__(3);
	
	var _event = __webpack_require__(8);
	
	var _compMgr = __webpack_require__(12);
	
	var pagination = _BaseComponent.BaseComponent.extend({});
	
	var PageProxy = function PageProxy(options, page) {
		this.isCurrent = function () {
			return page == options.currentPage;
		};
	
		this.isFirst = function () {
			return page == 1;
		};
	
		this.isLast = function () {
			return page == options.totalPages;
		};
	
		this.isPrev = function () {
			return page == options.currentPage - 1;
		};
	
		this.isNext = function () {
			return page == options.currentPage + 1;
		};
	
		this.isLeftOuter = function () {
			return page <= options.outerWindow;
		};
	
		this.isRightOuter = function () {
			return options.totalPages - page < options.outerWindow;
		};
	
		this.isInsideWindow = function () {
			if (options.currentPage < options.innerWindow + 1) {
				return page <= options.innerWindow * 2 + 1;
			} else if (options.currentPage > options.totalPages - options.innerWindow) {
				return options.totalPages - page <= options.innerWindow * 2;
			} else {
				return Math.abs(options.currentPage - page) <= options.innerWindow;
			}
		};
	
		this.number = function () {
			return page;
		};
		this.pageSize = function () {
			return options.pageSize;
		};
	};
	
	var View = {
		firstPage: function firstPage(pagin, options, currentPageProxy) {
			return '<li role="first"' + (currentPageProxy.isFirst() ? 'class="disabled"' : '') + '><a >' + options.first + '</a></li>';
		},
	
		prevPage: function prevPage(pagin, options, currentPageProxy) {
			return '<li role="prev"' + (currentPageProxy.isFirst() ? 'class="disabled"' : '') + '><a  rel="prev">' + options.prev + '</a></li>';
		},
	
		nextPage: function nextPage(pagin, options, currentPageProxy) {
			return '<li role="next"' + (currentPageProxy.isLast() ? 'class="disabled"' : '') + '><a  rel="next">' + options.next + '</a></li>';
		},
	
		lastPage: function lastPage(pagin, options, currentPageProxy) {
	
			return '<li role="last"' + (currentPageProxy.isLast() ? 'class="disabled"' : '') + '><a >' + options.last + '</a></li>';
		},
	
		gap: function gap(pagin, options) {
			return '<li role="gap" class="disabled"><a href="#">' + options.gap + '</a></li>';
		},
	
		page: function page(pagin, options, pageProxy) {
			return '<li role="page"' + (pageProxy.isCurrent() ? 'class="active"' : '') + '><a ' + (pageProxy.isNext() ? ' rel="next"' : '') + (pageProxy.isPrev() ? 'rel="prev"' : '') + '>' + pageProxy.number() + '</a></li>';
		}
	
	};
	
	//pagination.prototype.compType = 'pagination';
	pagination.prototype.init = function (element, options) {
		var self = this;
		var element = this.element;
		this.$element = element;
		this.options = (0, _extend.extend)({}, this.DEFAULTS, this.options);
		this.$ul = this.$element; //.find("ul");
		this.render();
	};
	
	pagination.prototype.DEFAULTS = {
		currentPage: 1,
		totalPages: 1,
		pageSize: 10,
		pageList: [5, 10, 20, 50, 100],
		innerWindow: 2,
		outerWindow: 0,
		first: '&laquo;',
		prev: '<i class="uf uf-anglepointingtoleft"></i>',
		next: '<i class="uf uf-anglearrowpointingtoright"></i>',
		last: '&raquo;',
		gap: '···',
		//totalText: '合计:',
		totalText: '共',
		truncate: false,
		showState: true,
		page: function page(_page) {
			return true;
		}
	};
	
	pagination.prototype.update = function (options) {
		this.$ul.innerHTML = "";
		this.options = (0, _extend.extend)({}, this.options, options);
		this.render();
	};
	pagination.prototype.render = function () {
		var a = new Date().valueOf();
	
		var options = this.options;
	
		if (!options.totalPages) {
			this.$element.style.display = "none";
			return;
		} else {
			this.$element.style.display = "block";
		}
	
		var htmlArr = [];
		var currentPageProxy = new PageProxy(options, options.currentPage);
	
		//update pagination by pengyic@yonyou.com
		//预设显示页码数
		var windows = 2;
		var total = options.totalPages - 0;
		var current = options.currentPage - 0;
		//预设显示页码数截断修正
		var fix = 0;
		var pageProxy;
		if (current - 2 <= windows + 1) {
			for (var i = 1; i <= current; i++) {
				pageProxy = new PageProxy(options, i);
				htmlArr.push(View.page(this, options, pageProxy));
			}
	
			fix = windows - (current - 1) < 0 ? 0 : windows - (current - 1);
	
			if (total - current - fix <= windows + 1) {
				for (var i = current + 1; i <= total; i++) {
					pageProxy = new PageProxy(options, i);
					htmlArr.push(View.page(this, options, pageProxy));
				}
			} else {
				for (var i = current + 1; i <= current + windows + fix; i++) {
					pageProxy = new PageProxy(options, i);
					htmlArr.push(View.page(this, options, pageProxy));
				}
				//添加分割'...'
				htmlArr.push(View.gap(this, options));
	
				pageProxy = new PageProxy(options, total);
				htmlArr.push(View.page(this, options, pageProxy));
			}
		} else {
			if (total - current <= windows + 1) {
				fix = windows - (total - current) < 0 ? 0 : windows - (total - current);
	
				for (var i = current - windows - fix; i <= total; i++) {
					pageProxy = new PageProxy(options, i);
					htmlArr.push(View.page(this, options, pageProxy));
				}
				if (i >= 2) {
					//添加分割'...'
					htmlArr.unshift(View.gap(this, options));
					pageProxy = new PageProxy(options, 1);
					htmlArr.unshift(View.page(this, options, pageProxy));
				}
			} else {
				for (var i = current - windows; i <= current + windows; i++) {
					pageProxy = new PageProxy(options, i);
					htmlArr.push(View.page(this, options, pageProxy));
				}
				//添加分割'...'
				htmlArr.push(View.gap(this, options));
	
				pageProxy = new PageProxy(options, total);
				htmlArr.push(View.page(this, options, pageProxy));
	
				//添加分割'...'
				htmlArr.unshift(View.gap(this, options));
				pageProxy = new PageProxy(options, 1);
				htmlArr.unshift(View.page(this, options, pageProxy));
			}
		}
		htmlArr.unshift(View.prevPage(this, options, currentPageProxy));
		htmlArr.push(View.nextPage(this, options, currentPageProxy));
		/*
	 if (!currentPageProxy.isFirst() || !options.truncate) {
	 		if (options.first) {
	 		htmlArr.push(View.firstPage(this, options, currentPageProxy))
	 	}
	 	if (options.prev) {
	 		htmlArr.push(View.prevPage(this, options, currentPageProxy));
	 	}
	 }
	 
	 var wasTruncated = false;
	 	for (var i = 1, length = options.totalPages; i <= length; i++) {
	 	var pageProxy = new PageProxy(options, i);
	 	if (pageProxy.isLeftOuter() || pageProxy.isRightOuter() || pageProxy.isInsideWindow()) {
	 		htmlArr.push(View.page(this, options, pageProxy));
	 		wasTruncated = false;
	 	} else {
	 		if (!wasTruncated && options.outerWindow > 0) {
	 			htmlArr.push(View.gap(this, options));
	 			wasTruncated = true;
	 		}
	 	}
	 }
	 	if (!currentPageProxy.isLast() || !options.truncate) {
	 	if (options.next) {
	 		htmlArr.push(View.nextPage(this, options, currentPageProxy));
	 	}
	 		if (options.last) {
	 		htmlArr.push(View.lastPage(this, options, currentPageProxy));
	 	}
	 }
	 */
		if (options.totalCount === undefined || options.totalCount <= 0) {
			options.totalCount = 0;
		}
		if (options.showState) {
			var htmlStr = '<div class="pagination-state">' + options.totalText + '&nbsp;' + options.totalCount + '&nbsp;条</div>';
			htmlArr.push(htmlStr);
	
			if (options.jumppage || options.pageSize) {
	
				var pageOption = '';
				options.pageList.forEach(function (item) {
					if (options.pageSize - 0 == item) {
						pageOption += '<option selected>' + item + '</option>';
					} else {
						pageOption += '<option>' + item + '</option>';
					}
				});
				var jumppagehtml = '到<input class="page_j" value=' + options.currentPage + '>页<input class="pagination-jump" type="button" value="确定"/>';
				var sizehtml = '显示<select  class="page_z">' + pageOption + '</select>条&nbsp;&nbsp;';
				var tmpjump = "<div class='pagination-state'>" + (options.pageSize ? sizehtml : "") + (options.jumppage ? jumppagehtml : "") + "</div>";
				htmlArr.push(tmpjump);
				//<i class='jump_page fa fa-arrow-circle-right' style='margin-left: 8px; cursor: pointer;'></i>
			}
		}
	
		this.$ul.innerHTML = "";
		this.$ul.insertAdjacentHTML('beforeEnd', htmlArr.join(''));
	
		var me = this;
		(0, _event.on)(this.$ul.querySelector(".pagination-jump"), "click", function () {
			var jp, pz;
			jp = me.$ul.querySelector(".page_j").value || options.currentPage;
			pz = me.$ul.querySelector(".page_z").value || options.pageSize;
	
			//if (pz != options.pageSize){
			//	me.$element.trigger('sizeChange', [pz, jp - 1])
			//}else{
			//	me.$element.trigger('pageChange', jp - 1)
			//}
			me.page(jp, options.totalPages, pz);
			//me.$element.trigger('pageChange', jp - 1)
			//me.$element.trigger('sizeChange', pz)
			return false;
		});
	
		(0, _event.on)(this.$ul.querySelector('[role="first"] a'), 'click', function () {
			if (options.currentPage <= 1) return;
			me.firstPage();
			//me.$element.trigger('pageChange', 0)
			return false;
		});
		(0, _event.on)(this.$ul.querySelector('[role="prev"] a'), 'click', function () {
			if (options.currentPage <= 1) return;
			me.prevPage();
			//me.$element.trigger('pageChange', options.currentPage - 1)
			return false;
		});
		(0, _event.on)(this.$ul.querySelector('[role="next"] a'), 'click', function () {
			if (parseInt(options.currentPage) + 1 > options.totalPages) return;
			me.nextPage();
			//me.$element.trigger('pageChange', parseInt(options.currentPage) + 1)
			return false;
		});
		(0, _event.on)(this.$ul.querySelector('[role="last"] a'), 'click', function () {
			if (options.currentPage == options.totalPages) return;
			me.lastPage();
			//me.$element.trigger('pageChange', options.totalPages - 1)
			return false;
		});
		(0, _util.each)(this.$ul.querySelectorAll('[role="page"] a'), function (i, node) {
			(0, _event.on)(node, 'click', function () {
				var pz = me.$element.querySelector(".page_z") && me.$element.querySelector(".page_z").value || options.pageSize;
				me.page(parseInt(this.innerHTML), options.totalPages, pz);
				//me.$element.trigger('pageChange', parseInt($(this).html()) - 1)
	
				return false;
			});
		});
		(0, _event.on)(this.$ul.querySelector('.page_z'), 'change', function () {
			var pz = me.$element.querySelector(".page_z") && me.$element.querySelector(".page_z").value || options.pageSize;
			me.trigger('sizeChange', pz);
		});
	};
	
	pagination.prototype.page = function (pageIndex, totalPages, pageSize) {
	
		var options = this.options;
	
		if (totalPages === undefined) {
			totalPages = options.totalPages;
		}
		if (pageSize === undefined) {
			pageSize = options.pageSize;
		}
		var oldPageSize = options.pageSize;
		// if (pageIndex > 0 && pageIndex <= totalPages) {
		// 	if (options.page(pageIndex)) {
	
		// 		this.$ul.innerHTML="";
		// 		options.pageSize = pageSize;
		// 		options.currentPage = pageIndex;
		// 		options.totalPages = totalPages;
		// 		this.render();
	
		// 	}
		// }else{
		// 	return false;
		// }
	
		if (options.page(pageIndex)) {
			if (pageIndex < 0) {
				pageIndex = 0;
			}
	
			if (pageIndex > totalPages) {
				pageIndex = totalPages;
			}
			this.$ul.innerHTML = "";
			options.pageSize = pageSize;
			options.currentPage = pageIndex;
			options.totalPages = totalPages;
			this.render();
		}
		if (pageSize != oldPageSize) {
			this.trigger('sizeChange', [pageSize, pageIndex - 1]);
		} else {
			this.trigger('pageChange', pageIndex - 1);
		}
	
		//this.$element.trigger('pageChange', pageIndex)
	
		return false;
	};
	
	pagination.prototype.firstPage = function () {
		return this.page(1);
	};
	
	pagination.prototype.lastPage = function () {
		return this.page(this.options.totalPages);
	};
	
	pagination.prototype.nextPage = function () {
		return this.page(parseInt(this.options.currentPage) + 1);
	};
	
	pagination.prototype.prevPage = function () {
		return this.page(this.options.currentPage - 1);
	};
	
	pagination.prototype.disableChangeSize = function () {
		this.$element.querySelector('.page_z').setAttribute('readonly', true);
	};
	
	pagination.prototype.enableChangeSize = function () {
		this.$element.querySelector('.page_z').removeAttribute('readonly');
	};
	
	function Plugin(option) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('u.pagination');
			var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;
	
			if (!data) $this.data('u.pagination', data = new Pagination(this, options));else data.update(options);
		});
	}
	
	// var old = $.fn.pagination;
	
	// $.fn.pagination = Plugin
	// $.fn.pagination.Constructor = Pagination
	
	if (_compMgr.compMgr) _compMgr.compMgr.regComp({
		comp: pagination,
		compAsString: 'u.pagination',
		css: 'u-pagination'
	});
	
	if (document.readyState && document.readyState === 'complete') {
		_compMgr.compMgr.updateComp();
	} else {
		(0, _event.on)(window, 'load', function () {
			//扫描并生成控件
			_compMgr.compMgr.updateComp();
		});
	}
	
	exports.pagination = pagination;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.PassWordAdapter = undefined;
	
	var _string = __webpack_require__(30);
	
	var _util = __webpack_require__(3);
	
	var _env = __webpack_require__(9);
	
	var _event = __webpack_require__(8);
	
	var _compMgr = __webpack_require__(12);
	
	/**
	 * 密码控件
	 */
	var PassWordAdapter = _string.StringAdapter.extend({
	    init: function init() {
	        PassWordAdapter.superclass.init.apply(this);
	        var oThis = this;
	        if (_env.env.isIE8) {
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
	        if (_env.env.isIE8) {
	            this.span.style.display = 'none';
	        }
	        if (this.span) {
	            (0, _event.on)(this.span, 'click', function () {
	                if (oThis.element.type == 'password') {
	                    oThis.element.type = 'text';
	                } else {
	                    oThis.element.type = 'password';
	                }
	            });
	        }
	    },
	    setShowValue: function setShowValue(showValue) {
	        this.showValue = showValue;
	        this.element.value = showValue;
	        this.element.title = '';
	    }
	}); /**
	     * Module : Kero password
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-09 19:19:33
	     */
	
	_compMgr.compMgr.addDataAdapter({
	    adapter: PassWordAdapter,
	    name: 'password'
	});
	
	exports.PassWordAdapter = PassWordAdapter;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.StringAdapter = undefined;
	
	var _baseAdapter = __webpack_require__(1);
	
	var _extend = __webpack_require__(10);
	
	var _valueMixin = __webpack_require__(5);
	
	var _event = __webpack_require__(8);
	
	var _compMgr = __webpack_require__(12);
	
	/**
	 * Module : Kero string adapter
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-09 20:12:42
	 */
	var StringAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin, _valueMixin.RequiredMixin, _valueMixin.ValidateMixin],
	    init: function init() {
	        var self = this;
	        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
	        if (!this.element) {
	            throw new Error('not found INPUT element, u-meta:' + JSON.stringify(this.options));
	        };
	        this.validType = this.options['validType'] || 'string';
	        this.minLength = this.getOption('minLength');
	        this.maxLength = this.getOption('maxLength');
	
	        (0, _event.on)(this.element, 'focus', function () {
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
	
	        (0, _event.on)(this.element, 'blur', function (e) {
	            if (self.enable) {
	                if (!self.doValidate() && self._needClean()) {
	                    if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
	                        // 因必输项清空导致检验没通过的情况
	                        self.setValue('');
	                    } else {
	                        self.element.value = self.getShowValue();
	                    }
	                } else self.setValue(self.element.value);
	            }
	        });
	    }
	});
	_compMgr.compMgr.addDataAdapter({
	    adapter: StringAdapter,
	    name: 'string'
	});
	
	exports.StringAdapter = StringAdapter;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.PercentAdapter = undefined;
	
	var _float = __webpack_require__(19);
	
	var _formater = __webpack_require__(22);
	
	var _masker = __webpack_require__(32);
	
	var _core = __webpack_require__(20);
	
	var _compMgr = __webpack_require__(12);
	
	/**
	 * 百分比控件
	 */
	var PercentAdapter = _float.FloatAdapter.extend({
	  init: function init() {
	    PercentAdapter.superclass.init.apply(this);
	    this.validType = 'float';
	    this.maskerMeta = _core.core.getMaskerMeta('percent') || {};
	    this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
	    if (this.maskerMeta.precision) {
	      this.maskerMeta.precision = parseInt(this.maskerMeta.precision) + 2;
	    }
	    this.formater = new _formater.NumberFormater(this.maskerMeta.precision);
	    this.masker = new _masker.PercentMasker(this.maskerMeta);
	  }
	}); /**
	     * Module : Kero percent
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-09 20:02:50
	     */
	
	_compMgr.compMgr.addDataAdapter({
	  adapter: PercentAdapter,
	  name: 'percent'
	});
	exports.PercentAdapter = PercentAdapter;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.PercentMasker = exports.CurrencyMasker = exports.NumberMasker = exports.AddressMasker = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                   * Module : Sparrow abstract formater class
	                                                                                                                                                                                                                                                   * Author : Kvkens(yueming@yonyou.com)
	                                                                                                                                                                                                                                                   * Date	  : 2016-07-28 19:35:26
	                                                                                                                                                                                                                                                   */
	
	var _extend = __webpack_require__(10);
	
	function AbstractMasker() {};
	
	AbstractMasker.prototype.format = function (obj) {
		if (obj == null) return null;
	
		var fObj = this.formatArgument(obj);
		return this.innerFormat(fObj);
	};
	
	/**
	 * 统一被格式化对象结构
	 *
	 * @param obj
	 * @return
	 */
	AbstractMasker.prototype.formatArgument = function (obj) {};
	
	/**
	 * 格式化
	 *
	 * @param obj
	 * @return
	 */
	AbstractMasker.prototype.innerFormat = function (obj) {};
	
	/**
	 * 拆分算法格式化虚基类
	 */
	AbstractSplitMasker.prototype = new AbstractMasker();
	
	function AbstractSplitMasker() {};
	AbstractSplitMasker.prototype.elements = new Array();
	AbstractSplitMasker.prototype.format = function (obj) {
		if (obj == null) return null;
	
		var fObj = this.formatArgument(obj);
		return this.innerFormat(fObj);
	};
	
	/**
	 * 统一被格式化对象结构
	 *
	 * @param obj
	 * @return
	 */
	AbstractSplitMasker.prototype.formatArgument = function (obj) {
		return obj;
	};
	
	/**
	 * 格式化
	 *
	 * @param obj
	 * @return
	 */
	AbstractSplitMasker.prototype.innerFormat = function (obj) {
		if (obj == null || obj == "") return new FormatResult(obj);
		this.doSplit();
		var result = "";
		//dingrf 去掉concat合并数组的方式，换用多维数组来实现 提高效率
		result = this.getElementsValue(this.elements, obj);
	
		return new FormatResult(result);
	};
	
	/**
	 * 合并多维数组中的elementValue
	 * @param {} element
	 * @param {} obj
	 * @return {}
	 */
	AbstractSplitMasker.prototype.getElementsValue = function (element, obj) {
		var result = "";
		if (element instanceof Array) {
			for (var i = 0; i < element.length; i++) {
				result = result + this.getElementsValue(element[i], obj);
			}
		} else {
			if (element.getValue) result = element.getValue(obj);
		}
		return result;
	};
	
	AbstractSplitMasker.prototype.getExpress = function () {};
	
	AbstractSplitMasker.prototype.doSplit = function () {
		var express = this.getExpress();
		if (this.elements == null || this.elements.length == 0) this.elements = this.doQuotation(express, this.getSeperators(), this.getReplaceds(), 0);
	};
	
	/**
	 * 处理引号
	 *
	 * @param express
	 * @param seperators
	 * @param replaced
	 * @param curSeperator
	 * @param obj
	 * @param result
	 */
	AbstractSplitMasker.prototype.doQuotation = function (express, seperators, replaced, curSeperator) {
		if (express.length == 0) return null;
		var elements = new Array();
		var pattern = new RegExp('".*?"', "g");
		var fromIndex = 0;
		var result;
		do {
			result = pattern.exec(express);
			if (result != null) {
				var i = result.index;
				var j = pattern.lastIndex;
				if (i != j) {
					if (fromIndex < i) {
						var childElements = this.doSeperator(express.substring(fromIndex, i), seperators, replaced, curSeperator);
						if (childElements != null && childElements.length > 0) {
							//						elements = elements.concat(childElements);
							elements.push(childElements);
						}
					}
				}
				elements.push(new StringElement(express.substring(i + 1, j - 1)));
				fromIndex = j;
			}
		} while (result != null);
	
		if (fromIndex < express.length) {
			var childElements = this.doSeperator(express.substring(fromIndex, express.length), seperators, replaced, curSeperator);
			if (childElements != null && childElements.length > 0)
				//			elements = elements.concat(childElements);
				elements.push(childElements);
		}
		return elements;
	};
	
	/**
	 * 处理其它分隔符
	 *
	 * @param express
	 * @param seperators
	 * @param replaced
	 * @param curSeperator
	 * @param obj
	 * @param result
	 */
	AbstractSplitMasker.prototype.doSeperator = function (express, seperators, replaced, curSeperator) {
		if (curSeperator >= seperators.length) {
			var elements = new Array();
			elements.push(this.getVarElement(express));
			return elements;
		}
	
		if (express.length == 0) return null;
		var fromIndex = 0;
		var elements = new Array();
		var pattern = new RegExp(seperators[curSeperator], "g");
		var result;
		do {
			result = pattern.exec(express);
			if (result != null) {
				var i = result.index;
				var j = pattern.lastIndex;
				if (i != j) {
					if (fromIndex < i) {
						var childElements = this.doSeperator(express.substring(fromIndex, i), seperators, replaced, curSeperator + 1);
						if (childElements != null && childElements.length > 0)
							//						elements = elements.concat(childElements);
							elements.push(childElements);
					}
	
					if (replaced[curSeperator] != null) {
						elements.push(new StringElement(replaced[curSeperator]));
					} else {
						elements.push(new StringElement(express.substring(i, j)));
					}
					fromIndex = j;
				}
			}
		} while (result != null);
	
		if (fromIndex < express.length) {
			var childElements = this.doSeperator(express.substring(fromIndex, express.length), seperators, replaced, curSeperator + 1);
			if (childElements != null && childElements.length > 0)
				//			elements = elements.concat(childElements);
				elements.push(childElements);
		}
		return elements;
	};
	
	/**
	 * 地址格式
	 */
	AddressMasker.prototype = new AbstractSplitMasker();
	
	function AddressMasker(formatMeta) {
		this.update(formatMeta);
	};
	
	AddressMasker.prototype.update = function (formatMeta) {
		this.formatMeta = (0, _extend.extend)({}, AddressMasker.DefaultFormatMeta, formatMeta);
	};
	
	AddressMasker.prototype.getExpress = function () {
		return this.formatMeta.express;
	};
	
	AddressMasker.prototype.getReplaceds = function () {
		return [this.formatMeta.separator];
	};
	
	AddressMasker.prototype.getSeperators = function () {
		return ["(\\s)+?"];
	};
	
	AddressMasker.prototype.getVarElement = function (express) {
		var ex = {};
	
		if (express == "C") ex.getValue = function (obj) {
			return obj.country;
		};
	
		if (express == "S") ex.getValue = function (obj) {
			return obj.state;
		};
	
		if (express == "T") ex.getValue = function (obj) {
			return obj.city;
		};
	
		if (express == "D") ex.getValue = function (obj) {
			return obj.section;
		};
	
		if (express == "R") ex.getValue = function (obj) {
			return obj.road;
		};
	
		if (express == "P") ex.getValue = function (obj) {
			return obj.postcode;
		};
	
		if (_typeof(ex.getValue) == undefined) return new StringElement(express);else return ex;
	};
	
	AddressMasker.prototype.formatArgument = function (obj) {
		return obj;
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
	NumberMasker.prototype = new AbstractMasker();
	NumberMasker.prototype.formatMeta = null;
	
	/**
	 *构造方法
	 */
	function NumberMasker(formatMeta) {
		this.update(formatMeta);
	};
	
	NumberMasker.prototype.update = function (formatMeta) {
		this.formatMeta = (0, _extend.extend)({}, NumberMasker.DefaultFormatMeta, formatMeta);
	};
	
	/**
	 *格式化对象
	 */
	NumberMasker.prototype.innerFormat = function (obj) {
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
	NumberMasker.prototype.setTheMark = function (str, seperatorIndex) {
		var endIndex, first, index;
		if (!this.formatMeta.isMarkEnable) return str;
		if (seperatorIndex <= 0) seperatorIndex = str.length;
		first = str.charCodeAt(0);
		endIndex = 0;
		if (first == 45) endIndex = 1;
		index = seperatorIndex - 3;
		while (index > endIndex) {
			str = str.substr(0, index - 0) + this.formatMeta.markSymbol + str.substr(index, str.length - index);
			index = index - 3;
		}
		return str;
	};
	NumberMasker.prototype.setTheSeperator = function (str, seperatorIndex) {
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
	NumberMasker.toCharArray = function (str) {
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
	NumberMasker.prototype.formatArgument = function (obj) {
		var numberObj = {};
		numberObj.value = obj;
		return numberObj;
	};
	
	/**
	 * 货币格式
	 */
	CurrencyMasker.prototype = new NumberMasker();
	CurrencyMasker.prototype.formatMeta = null;
	
	function CurrencyMasker(formatMeta) {
		this.update(formatMeta);
	};
	
	CurrencyMasker.prototype.update = function (formatMeta) {
		this.formatMeta = (0, _extend.extend)({}, CurrencyMasker.DefaultFormatMeta, formatMeta);
	};
	
	/**
	 * 重载格式方法
	 * @param {} obj
	 * @return {}
	 */
	CurrencyMasker.prototype.innerFormat = function (obj) {
		if (!obj.value) {
			return { value: "" };
		}
		var fo = new NumberMasker(this.formatMeta).innerFormat(obj);
		fo.value = this.formatMeta.curSymbol + fo.value; //fo.value.replace("$", this.formatMeta.curSymbol);
		return fo;
	};
	
	PercentMasker.prototype = new NumberMasker();
	
	function PercentMasker(formatMeta) {
		this.update(formatMeta);
	};
	
	PercentMasker.prototype.update = function (formatMeta) {
		this.formatMeta = (0, _extend.extend)({}, NumberMasker.DefaultFormatMeta, formatMeta);
	};
	
	PercentMasker.prototype.formatArgument = function (obj) {
		return obj;
	};
	
	PercentMasker.prototype.innerFormat = function (value) {
		var val = "";
		if (value != "") {
			var obj = new NumberMasker(this.formatMeta).innerFormat({ value: value }).value;
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
	 * 将结果输出成HTML代码
	 * @param {} result
	 * @return {String}
	 */
	function toColorfulString(result) {
		var color;
		if (!result) {
			return '';
		}
		if (result.color == null) {
			return result.value;
		}
		color = result.color;
		return '<font color="' + color + '">' + result.value + '<\/font>';
	};
	
	/**
	 * 格式解析后形成的单个格式单元
	 * 适用于基于拆分算法的AbstractSplitFormat，表示拆分后的变量单元
	 */
	StringElement.prototype = new Object();
	
	function StringElement(value) {
		this.value = value;
	};
	StringElement.prototype.value = "";
	
	StringElement.prototype.getValue = function (obj) {
		return this.value;
	};
	/**
	 *格式结果
	 */
	FormatResult.prototype = new Object();
	/**
	 *默认构造方法
	 */
	function FormatResult(value, color) {
		this.value = value;
		this.color = color;
	};
	
	NumberMasker.DefaultFormatMeta = {
		isNegRed: true,
		isMarkEnable: true,
		markSymbol: ",",
		pointSymbol: ".",
		positiveFormat: "n",
		negativeFormat: "-n"
	};
	
	CurrencyMasker.DefaultFormatMeta = (0, _extend.extend)({}, NumberMasker.DefaultFormatMeta, {
		//curSymbol: "",
		positiveFormat: "n",
		negativeFormat: "-n"
	});
	
	AddressMasker.defaultFormatMeta = {
		express: "C S T R P",
		separator: " "
	};
	
	exports.AddressMasker = AddressMasker;
	exports.NumberMasker = NumberMasker;
	exports.CurrencyMasker = CurrencyMasker;
	exports.PercentMasker = PercentMasker;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ProgressAdapter = undefined;
	
	var _baseAdapter = __webpack_require__(1);
	
	var _neouiProgress = __webpack_require__(34);
	
	var _compMgr = __webpack_require__(12);
	
	var ProgressAdapter = _baseAdapter.BaseAdapter.extend({
	    initialize: function initialize(options) {
	        var self = this;
	        ProgressAdapter.superclass.initialize.apply(this, arguments);
	
	        this.comp = new _neouiProgress.Progress(this.element);
	        this.element['u.Progress'] = this.comp;
	
	        this.dataModel.ref(this.field).subscribe(function (value) {
	            self.modelValueChange(value);
	        });
	    },
	
	    modelValueChange: function modelValueChange(val) {
	        this.comp.setProgress(val);
	    }
	}); /**
	     * Module : Kero percent
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-09 20:02:50
	     */
	
	_compMgr.compMgr.addDataAdapter({
	    adapter: ProgressAdapter,
	    name: 'u-progress'
	});
	
	exports.ProgressAdapter = ProgressAdapter;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Progress = undefined;
	
	var _BaseComponent = __webpack_require__(7);
	
	var _dom = __webpack_require__(13);
	
	var _env = __webpack_require__(9);
	
	var _event = __webpack_require__(8);
	
	var _compMgr = __webpack_require__(12);
	
	var Progress = _BaseComponent.BaseComponent.extend({
		_Constant: {},
		_CssClasses: {
			INDETERMINATE_CLASS: 'u-progress__indeterminate'
		},
		setProgress: function setProgress(p) {
	
			if ((0, _dom.hasClass)(this.element, this._CssClasses.INDETERMINATE_CLASS)) {
				return;
			}
	
			this.progressbar_.style.width = p + '%';
			return this;
		},
		/**
	  * 设置竖向进度条的进度
	  * @param p 要设置的进度
	  * @returns {u.Progress}
	     */
		setProgressHeight: function setProgressHeight(p) {
	
			if ((0, _dom.hasClass)(this.element, this._CssClasses.INDETERMINATE_CLASS)) {
				return;
			}
	
			this.progressbar_.style.height = p + '%';
			this.progressbar_.style.width = '100%';
			return this;
		},
		/**
	  * 设置进度条中的html内容
	  * @param p 要设置的html内容
	  * @returns {u.Progress}
	  */
		setProgressHTML: function setProgressHTML(html) {
	
			if ((0, _dom.hasClass)(this.element, this._CssClasses.INDETERMINATE_CLASS)) {
				return;
			}
	
			this.progressbar_.innerHTML = html;
			return this;
		},
		setBuffer: function setBuffer(p) {
			this.bufferbar_.style.width = p + '%';
			this.auxbar_.style.width = 100 - p + '%';
			return this;
		},
	
		init: function init() {
			var el = document.createElement('div');
			el.className = 'progressbar bar bar1';
			this.element.appendChild(el);
			this.progressbar_ = el;
	
			el = document.createElement('div');
			el.className = 'bufferbar bar bar2';
			this.element.appendChild(el);
			this.bufferbar_ = el;
	
			el = document.createElement('div');
			el.className = 'auxbar bar bar3';
			this.element.appendChild(el);
			this.auxbar_ = el;
	
			this.progressbar_.style.width = '0%';
			this.bufferbar_.style.width = '100%';
			this.auxbar_.style.width = '0%';
	
			(0, _dom.addClass)(this.element, 'is-upgraded');
	
			if (_env.env.isIE8 || _env.env.isIE9) {
	
				if ((0, _dom.hasClass)(this.element, this._CssClasses.INDETERMINATE_CLASS)) {
					var p = 0;
					var oThis = this;
					setInterval(function () {
						p += 5;
						p = p % 100;
						oThis.progressbar_.style.width = p + '%';
					}, 100);
				}
			}
		}
	
	}); /**
	     * Module : neoui-progress
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-03 10:46:37
	     */
	
	_compMgr.compMgr.regComp({
		comp: Progress,
		compAsString: 'u.Progress',
		css: 'u-progress'
	});
	if (document.readyState && document.readyState === 'complete') {
		_compMgr.compMgr.updateComp();
	} else {
		(0, _event.on)(window, 'load', function () {
			//扫描并生成控件
			_compMgr.compMgr.updateComp();
		});
	}
	exports.Progress = Progress;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.RadioAdapter = undefined;
	
	var _baseAdapter = __webpack_require__(1);
	
	var _valueMixin = __webpack_require__(5);
	
	var _util = __webpack_require__(3);
	
	var _dom = __webpack_require__(13);
	
	var _event = __webpack_require__(8);
	
	var _neouiRadio = __webpack_require__(36);
	
	var _compMgr = __webpack_require__(12);
	
	/**
	 * Module : Kero percent
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-10 10:33:09
	 */
	
	var RadioAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin, _valueMixin.RequiredMixin, _valueMixin.ValidateMixin],
	    init: function init(options) {
	        var self = this;
	        //RadioAdapter.superclass.initialize.apply(this, arguments);
	        this.dynamic = false;
	        if (this.options['datasource'] || this.options['hasOther']) {
	            // 存在datasource或者有其他选项，将当前dom元素保存，以后用于复制新的dom元素
	            this.radioTemplateArray = [];
	            for (var i = 0, count = this.element.childNodes.length; i < count; i++) {
	                this.radioTemplateArray.push(this.element.childNodes[i]);
	            }
	        }
	        if (this.options['datasource']) {
	            this.dynamic = true;
	            var datasource = (0, _util.getJSObject)(this.viewModel, this.options['datasource']);
	            this.setComboData(datasource);
	        } else {
	            this.comp = new _neouiRadio.Radio(this.element);
	            this.element['u.Radio'] = this.comp;
	            this.eleValue = this.comp._btnElement.value;
	
	            this.comp.on('change', function (event) {
	                if (self.slice) return;
	                var modelValue = self.dataModel.getValue(self.field);
	                //var valueArr = modelValue == '' ?  [] : modelValue.split(',');
	                if (self.comp._btnElement.checked) {
	                    self.dataModel.setValue(self.field, self.eleValue);
	                }
	            });
	        }
	
	        // 如果存在其他
	        if (this.options['hasOther']) {
	            var node = null;
	            for (var j = 0; j < this.radioTemplateArray.length; j++) {
	                this.element.appendChild(this.radioTemplateArray[j].cloneNode(true));
	            }
	            var LabelS = this.element.querySelectorAll('.u-radio');
	            self.lastLabel = LabelS[LabelS.length - 1];
	            var allRadioS = this.element.querySelectorAll('[type=radio]');
	            self.lastRadio = allRadioS[allRadioS.length - 1];
	            var nameDivs = this.element.querySelectorAll('.u-radio-label');
	            self.lastNameDiv = nameDivs[nameDivs.length - 1];
	            self.lastNameDiv.innerHTML = '其他';
	            self.otherInput = (0, _dom.makeDOM)('<input type="text" style="height:32px;box-sizing:border-box;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;">');
	            self.lastNameDiv.parentNode.appendChild(self.otherInput);
	            self.lastRadio.value = '';
	
	            var comp;
	            if (self.lastLabel['u.Radio']) {
	                comp = self.lastLabel['u.Radio'];
	            } else {
	                comp = new _neouiRadio.Radio(self.lastLabel);
	            }
	            self.lastLabel['u.Radio'] = comp;
	            self.otherComp = comp;
	            comp.on('change', function () {
	                if (comp._btnElement.checked) {
	                    self.dataModel.setValue(self.field, comp._btnElement.value);
	                }
	            });
	
	            (0, _event.on)(self.otherInput, 'blur', function (e) {
	                self.lastRadio.oldValue = self.lastRadio.value;
	                self.lastRadio.value = this.value;
	                self.otherComp.trigger('change');
	            });
	            (0, _event.on)(self.otherInput, 'click', function (e) {
	                (0, _event.stopEvent)(e);
	            });
	        }
	
	        this.dataModel.ref(this.field).subscribe(function (value) {
	            self.modelValueChange(value);
	        });
	    },
	    setComboData: function setComboData(comboData) {
	        var self = this;
	        // this.element.innerHTML = '';
	        for (var i = 0, len = comboData.length; i < len - 1; i++) {
	            for (var j = 0; j < this.radioTemplateArray.length; j++) {
	                this.element.appendChild(this.radioTemplateArray[j].cloneNode(true));
	            }
	            //this.radioTemplate.clone().appendTo(this.element)
	        }
	
	        var allRadio = this.element.querySelectorAll('[type=radio]');
	        var allName = this.element.querySelectorAll('.u-radio-label');
	        for (var k = 0; k < allRadio.length; k++) {
	            allRadio[k].value = comboData[k].pk || comboData[k].value;
	            allName[k].innerHTML = comboData[k].name;
	        }
	
	        this.radioInputName = allRadio[0].name;
	
	        this.element.querySelectorAll('.u-radio').forEach(function (ele) {
	            var comp = new _neouiRadio.Radio(ele);
	            ele['u.Radio'] = comp;
	
	            comp.on('change', function (event) {
	                if (comp._btnElement.checked) {
	                    self.dataModel.setValue(self.field, comp._btnElement.value);
	                }
	            });
	        });
	    },
	
	    modelValueChange: function modelValueChange(value) {
	        if (this.slice) return;
	        var fetch = false;
	        if (this.dynamic) {
	            this.trueValue = value;
	            this.element.querySelectorAll('.u-radio').forEach(function (ele) {
	                var comp = ele['u.Radio'];
	                var inptuValue = comp._btnElement.value;
	                if (inptuValue && inptuValue == value) {
	                    fetch = true;
	                    comp._btnElement.click();
	                }
	            });
	        } else {
	            if (this.eleValue == value) {
	                fetch = true;
	                this.slice = true;
	                this.comp._btnElement.click();
	                this.slice = false;
	            }
	        }
	        if (this.options.hasOther && !fetch && value) {
	            this.lastRadio.checked = true;
	            this.otherInput.value = value;
	        }
	    },
	
	    setEnable: function setEnable(enable) {
	        this.enable = enable === true || enable === 'true';
	        if (this.dynamic) {
	            this.element.querySelectorAll('.u-radio').forEach(function (ele) {
	                var comp = ele['u.Radio'];
	                if (enable === true || enable === 'true') {
	                    comp.enable();
	                } else {
	                    comp.disable();
	                }
	            });
	        } else {
	            if (this.enable) {
	                this.comp.enable();
	            } else {
	                this.comp.disable();
	            }
	        }
	    }
	});
	
	_compMgr.compMgr.addDataAdapter({
	    adapter: RadioAdapter,
	    name: 'u-radio'
	});
	exports.RadioAdapter = RadioAdapter;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Radio = undefined;
	
	var _BaseComponent = __webpack_require__(7);
	
	var _dom = __webpack_require__(13);
	
	var _env = __webpack_require__(9);
	
	var _event = __webpack_require__(8);
	
	var _ripple = __webpack_require__(14);
	
	var _compMgr = __webpack_require__(12);
	
	/**
	 * Module : neoui-radio
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-03 11:16:00
	 */
	
	var Radio = _BaseComponent.BaseComponent.extend({
	    Constant_: {
	        TINY_TIMEOUT: 0.001
	    },
	
	    _CssClasses: {
	        IS_FOCUSED: 'is-focused',
	        IS_DISABLED: 'is-disabled',
	        IS_CHECKED: 'is-checked',
	        IS_UPGRADED: 'is-upgraded',
	        JS_RADIO: 'u-radio',
	        RADIO_BTN: 'u-radio-button',
	        RADIO_OUTER_CIRCLE: 'u-radio-outer-circle',
	        RADIO_INNER_CIRCLE: 'u-radio-inner-circle'
	    },
	
	    init: function init() {
	        this._btnElement = this.element.querySelector('input');
	
	        this._boundChangeHandler = this._onChange.bind(this);
	        this._boundFocusHandler = this._onChange.bind(this);
	        this._boundBlurHandler = this._onBlur.bind(this);
	        this._boundMouseUpHandler = this._onMouseup.bind(this);
	
	        var outerCircle = document.createElement('span');
	        (0, _dom.addClass)(outerCircle, this._CssClasses.RADIO_OUTER_CIRCLE);
	
	        var innerCircle = document.createElement('span');
	        (0, _dom.addClass)(innerCircle, this._CssClasses.RADIO_INNER_CIRCLE);
	
	        this.element.appendChild(outerCircle);
	        this.element.appendChild(innerCircle);
	
	        var rippleContainer;
	        //if (this.element.classList.contains( this._CssClasses.RIPPLE_EFFECT)) {
	        //  addClass(this.element,this._CssClasses.RIPPLE_IGNORE_EVENTS);
	        rippleContainer = document.createElement('span');
	        //rippleContainer.classList.add(this._CssClasses.RIPPLE_CONTAINER);
	        //rippleContainer.classList.add(this._CssClasses.RIPPLE_EFFECT);
	        //rippleContainer.classList.add(this._CssClasses.RIPPLE_CENTER);
	        rippleContainer.addEventListener('mouseup', this._boundMouseUpHandler);
	
	        //var ripple = document.createElement('span');
	        //ripple.classList.add(this._CssClasses.RIPPLE);
	
	        //rippleContainer.appendChild(ripple);
	        this.element.appendChild(rippleContainer);
	        new _ripple.URipple(rippleContainer);
	        //}
	
	        this._btnElement.addEventListener('change', this._boundChangeHandler);
	        this._btnElement.addEventListener('focus', this._boundFocusHandler);
	        this._btnElement.addEventListener('blur', this._boundBlurHandler);
	        this.element.addEventListener('mouseup', this._boundMouseUpHandler);
	
	        this._updateClasses();
	        (0, _dom.addClass)(this.element, this._CssClasses.IS_UPGRADED);
	    },
	
	    _onChange: function _onChange(event) {
	        // Since other radio buttons don't get change events, we need to look for
	        // them to update their classes.
	        var radios = document.querySelectorAll('.' + this._CssClasses.JS_RADIO);
	        for (var i = 0; i < radios.length; i++) {
	            var button = radios[i].querySelector('.' + this._CssClasses.RADIO_BTN);
	            // Different name == different group, so no point updating those.
	            if (button.getAttribute('name') === this._btnElement.getAttribute('name')) {
	                if (radios[i]['u.Radio']) {
	                    radios[i]['u.Radio']._updateClasses();
	                }
	            }
	        }
	        this.trigger('change', { isChecked: this._btnElement.checked });
	    },
	
	    /**
	     * Handle focus.
	     *
	     * @param {Event} event The event that fired.
	     * @private
	     */
	    _onFocus: function _onFocus(event) {
	        (0, _dom.addClass)(this.element, this._CssClasses.IS_FOCUSED);
	    },
	
	    /**
	     * Handle lost focus.
	     *
	     * @param {Event} event The event that fired.
	     * @private
	     */
	    _onBlur: function _onBlur(event) {
	        (0, _dom.removeClass)(this.element, this._CssClasses.IS_FOCUSED);
	    },
	
	    /**
	     * Handle mouseup.
	     *
	     * @param {Event} event The event that fired.
	     * @private
	     */
	    _onMouseup: function _onMouseup(event) {
	        this._blur();
	    },
	
	    /**
	     * Update classes.
	     *
	     * @private
	     */
	    _updateClasses: function _updateClasses() {
	        this.checkDisabled();
	        this.checkToggleState();
	    },
	
	    /**
	     * Add blur.
	     *
	     * @private
	     */
	    _blur: function _blur() {
	
	        // TODO: figure out why there's a focus event being fired after our blur,
	        // so that we can avoid this hack.
	        window.setTimeout(function () {
	            this._btnElement.blur();
	        }.bind(this), /** @type {number} */this.Constant_.TINY_TIMEOUT);
	    },
	
	    // Public methods.
	
	    /**
	     * Check the components disabled state.
	     *
	     * @public
	     */
	    checkDisabled: function checkDisabled() {
	        if (this._btnElement.disabled) {
	            (0, _dom.addClass)(this.element, this._CssClasses.IS_DISABLED);
	        } else {
	            (0, _dom.removeClass)(this.element, this._CssClasses.IS_DISABLED);
	        }
	    },
	
	    /**
	     * Check the components toggled state.
	     *
	     * @public
	     */
	    checkToggleState: function checkToggleState() {
	        if (this._btnElement.checked) {
	            (0, _dom.addClass)(this.element, this._CssClasses.IS_CHECKED);
	        } else {
	            (0, _dom.removeClass)(this.element, this._CssClasses.IS_CHECKED);
	        }
	    },
	
	    /**
	     * Disable radio.
	     *
	     * @public
	     */
	    disable: function disable() {
	        this._btnElement.disabled = true;
	        this._updateClasses();
	    },
	
	    /**
	     * Enable radio.
	     *
	     * @public
	     */
	    enable: function enable() {
	        this._btnElement.disabled = false;
	        this._updateClasses();
	    },
	
	    /**
	     * Check radio.
	     *
	     * @public
	     */
	    check: function check() {
	        this._btnElement.checked = true;
	        this._updateClasses();
	    },
	
	    uncheck: function uncheck() {
	        this._btnElement.checked = false;
	        this._updateClasses();
	    }
	
	});
	
	_compMgr.compMgr.regComp({
	    comp: Radio,
	    compAsString: 'u.Radio',
	    css: 'u-radio'
	});
	
	if (document.readyState && document.readyState === 'complete') {
	    _compMgr.compMgr.updateComp();
	} else {
	    (0, _event.on)(window, 'load', function () {
	        //扫描并生成控件
	        _compMgr.compMgr.updateComp();
	    });
	}
	
	exports.Radio = Radio;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SwitchAdapter = undefined;
	
	var _baseAdapter = __webpack_require__(1);
	
	var _neouiSwitch = __webpack_require__(38);
	
	var _compMgr = __webpack_require__(12);
	
	var SwitchAdapter = _baseAdapter.BaseAdapter.extend({
	    initialize: function initialize(options) {
	        var self = this;
	        SwitchAdapter.superclass.initialize.apply(this, arguments);
	
	        this.comp = new _neouiSwitch.Switch(this.element);
	        this.element['u.Switch'] = this.comp;
	        this.checkedValue = this.options['checkedValue'] || this.comp._inputElement.value;
	        this.unCheckedValue = this.options["unCheckedValue"];
	        this.comp.on('change', function (event) {
	            if (self.slice) return;
	            if (self.comp._inputElement.checked) {
	                self.dataModel.setValue(self.field, self.checkedValue);
	            } else {
	                self.dataModel.setValue(self.field, self.unCheckedValue);
	            }
	        });
	
	        this.dataModel.ref(this.field).subscribe(function (value) {
	            self.modelValueChange(value);
	        });
	    },
	
	    modelValueChange: function modelValueChange(val) {
	        if (this.slice) return;
	        if (this.comp._inputElement.checked != (val === this.checkedValue)) {
	            this.slice = true;
	            this.comp.toggle();
	            this.slice = false;
	        }
	    },
	    setEnable: function setEnable(enable) {
	        if (enable === true || enable === 'true') {
	            this.enable = true;
	        } else if (enable === false || enable === 'false') {
	            this.enable = false;
	        }
	    }
	}); /**
	     * Module : Kero switch adapter
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-10 10:42:15
	     */
	
	_compMgr.compMgr.addDataAdapter({
	    adapter: SwitchAdapter,
	    name: 'u-switch'
	});
	
	exports.SwitchAdapter = SwitchAdapter;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Switch = undefined;
	
	var _BaseComponent = __webpack_require__(7);
	
	var _dom = __webpack_require__(13);
	
	var _event = __webpack_require__(8);
	
	var _ripple = __webpack_require__(14);
	
	var _compMgr = __webpack_require__(12);
	
	var Switch = _BaseComponent.BaseComponent.extend({
		_Constant: {
			TINY_TIMEOUT: 0.001
		},
	
		_CssClasses: {
			INPUT: 'u-switch-input',
			TRACK: 'u-switch-track',
			THUMB: 'u-switch-thumb',
			FOCUS_HELPER: 'u-switch-focus-helper',
			IS_FOCUSED: 'is-focused',
			IS_DISABLED: 'is-disabled',
			IS_CHECKED: 'is-checked'
		},
	
		init: function init() {
			this._inputElement = this.element.querySelector('.' + this._CssClasses.INPUT);
	
			var track = document.createElement('div');
			(0, _dom.addClass)(track, this._CssClasses.TRACK);
	
			var thumb = document.createElement('div');
			(0, _dom.addClass)(thumb, this._CssClasses.THUMB);
	
			var focusHelper = document.createElement('span');
			(0, _dom.addClass)(focusHelper, this._CssClasses.FOCUS_HELPER);
	
			thumb.appendChild(focusHelper);
	
			this.element.appendChild(track);
			this.element.appendChild(thumb);
	
			this.boundMouseUpHandler = this._onMouseUp.bind(this);
	
			//if (this.element.classList.contains(this._CssClasses.RIPPLE_EFFECT)) {
			//  addClass(this.element,this._CssClasses.RIPPLE_IGNORE_EVENTS);
			this._rippleContainerElement = document.createElement('span');
			//this._rippleContainerElement.classList.add(this._CssClasses.RIPPLE_CONTAINER);
			//this._rippleContainerElement.classList.add(this._CssClasses.RIPPLE_EFFECT);
			//this._rippleContainerElement.classList.add(this._CssClasses.RIPPLE_CENTER);
			this._rippleContainerElement.addEventListener('mouseup', this.boundMouseUpHandler);
	
			//var ripple = document.createElement('span');
			//ripple.classList.add(this._CssClasses.RIPPLE);
	
			//this._rippleContainerElement.appendChild(ripple);
			this.element.appendChild(this._rippleContainerElement);
			new _ripple.URipple(this._rippleContainerElement);
			//}
	
			this.boundChangeHandler = this._onChange.bind(this);
			this.boundFocusHandler = this._onFocus.bind(this);
			this.boundBlurHandler = this._onBlur.bind(this);
	
			this._inputElement.addEventListener('change', this.boundChangeHandler);
			this._inputElement.addEventListener('focus', this.boundFocusHandler);
			this._inputElement.addEventListener('blur', this.boundBlurHandler);
			this.element.addEventListener('mouseup', this.boundMouseUpHandler);
	
			this._updateClasses();
			(0, _dom.addClass)(this.element, 'is-upgraded');
		},
	
		_onChange: function _onChange(event) {
			this._updateClasses();
			this.trigger('change', {
				isChecked: this._inputElement.checked
			});
		},
	
		_onFocus: function _onFocus(event) {
			(0, _dom.addClass)(this.element, this._CssClasses.IS_FOCUSED);
		},
	
		_onBlur: function _onBlur(event) {
			(0, _dom.removeClass)(this.element, this._CssClasses.IS_FOCUSED);
		},
	
		_onMouseUp: function _onMouseUp(event) {
			this._blur();
		},
	
		_updateClasses: function _updateClasses() {
			this.checkDisabled();
			this.checkToggleState();
		},
	
		_blur: function _blur() {
			// TODO: figure out why there's a focus event being fired after our blur,
			// so that we can avoid this hack.
			window.setTimeout(function () {
				this._inputElement.blur();
			}.bind(this), /** @type {number} */this._Constant.TINY_TIMEOUT);
		},
	
		// Public methods.
	
		checkDisabled: function checkDisabled() {
			if (this._inputElement.disabled) {
				(0, _dom.addClass)(this.element, this._CssClasses.IS_DISABLED);
			} else {
				(0, _dom.removeClass)(this.element, this._CssClasses.IS_DISABLED);
			}
		},
	
		checkToggleState: function checkToggleState() {
			if (this._inputElement.checked) {
				(0, _dom.addClass)(this.element, this._CssClasses.IS_CHECKED);
			} else {
				(0, _dom.removeClass)(this.element, this._CssClasses.IS_CHECKED);
			}
		},
	
		isChecked: function isChecked() {
			//return hasClass(this.element,this._CssClasses.IS_CHECKED);
			return this._inputElement.checked;
		},
	
		toggle: function toggle() {
			//return;
			if (this.isChecked()) {
				this.uncheck();
			} else {
				this.check();
			}
		},
	
		disable: function disable() {
			this._inputElement.disabled = true;
			this._updateClasses();
		},
	
		enable: function enable() {
			this._inputElement.disabled = false;
			this._updateClasses();
		},
	
		check: function check() {
			this._inputElement.checked = true;
			this._updateClasses();
		},
	
		uncheck: function uncheck() {
			this._inputElement.checked = false;
			this._updateClasses();
		}
	
	}); /**
	     * Module : neoui-switch
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-03 13:39:55
	     */
	
	_compMgr.compMgr.regComp({
		comp: Switch,
		compAsString: 'u.Switch',
		css: 'u-switch'
	});
	
	if (document.readyState && document.readyState === 'complete') {
		_compMgr.compMgr.updateComp();
	} else {
		(0, _event.on)(window, 'load', function () {
			//扫描并生成控件
			_compMgr.compMgr.updateComp();
		});
	}
	
	exports.Switch = Switch;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.TextAreaAdapter = undefined;
	
	var _baseAdapter = __webpack_require__(1);
	
	var _valueMixin = __webpack_require__(5);
	
	var _event = __webpack_require__(8);
	
	var _compMgr = __webpack_require__(12);
	
	var TextAreaAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin, _valueMixin.RequiredMixin, _valueMixin.ValidateMixin],
	    init: function init() {
	        var self = this;
	        this.element = this.element.nodeName === 'TEXTAREA' ? this.element : this.element.querySelector('textarea');
	        if (!this.element) {
	            throw new Error('not found TEXTAREA element, u-meta:' + JSON.stringify(this.options));
	        };
	
	        (0, _event.on)(this.element, 'focus', function () {
	            self.setShowValue(self.getValue());
	        });
	        (0, _event.on)(this.element, 'blur', function () {
	            self.setValue(self.element.value);
	        });
	    }
	}); /**
	     * Module : Kero textarea adapter
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-10 12:40:46
	     */
	
	_compMgr.compMgr.addDataAdapter({
	    adapter: TextAreaAdapter,
	    name: 'textarea'
	});
	
	exports.TextAreaAdapter = TextAreaAdapter;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.TextFieldAdapter = undefined;
	
	var _baseAdapter = __webpack_require__(1);
	
	var _extend = __webpack_require__(10);
	
	var _neouiTextfield = __webpack_require__(18);
	
	var _float = __webpack_require__(19);
	
	var _string = __webpack_require__(30);
	
	var _integer = __webpack_require__(24);
	
	var _compMgr = __webpack_require__(12);
	
	var TextFieldAdapter = _baseAdapter.BaseAdapter.extend({
	    /**
	     *
	     * @param comp
	     * @param options ：
	     *      el: '#content',  对应的dom元素
	     *      options: {},     配置
	     *      model:{}        模型，包括数据和事件
	     */
	    initialize: function initialize(options) {
	        TextFieldAdapter.superclass.initialize.apply(this, arguments);
	        //this.comp = comp;
	        //this.element = options['el'];
	        //this.options = options['options'];
	        //this.viewModel = options['model'];
	        var dataType = this.dataModel.getMeta(this.field, 'type') || 'string';
	        //var dataType = this.options['dataType'] || 'string';
	
	        this.comp = new _neouiTextfield.Text(this.element);
	        this.element['u.Text'] = this.comp;
	
	        if (dataType === 'float') {
	            this.trueAdpt = new _float.FloatAdapter(options);
	        } else if (dataType === 'string') {
	            this.trueAdpt = new _string.StringAdapter(options);
	        } else if (dataType === 'integer') {
	            this.trueAdpt = new _integer.IntegerAdapter(options);
	        } else {
	            throw new Error("'u-text' only support 'float' or 'string' or 'integer' field type, not support type: '" + dataType + "', field: '" + this.field + "'");
	        }
	        (0, _extend.extend)(this, this.trueAdpt);
	
	        this.trueAdpt.comp = this.comp;
	        this.trueAdpt.setShowValue = function (showValue) {
	            this.showValue = showValue;
	            //if (this.comp.compType === 'text')
	            this.comp.change(showValue);
	            this.element.title = showValue;
	        };
	        return this.trueAdpt;
	    }
	}); /**
	     * Module : Kero textfield adapter
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-10 13:00:27
	     */
	
	_compMgr.compMgr.addDataAdapter({
	    adapter: TextFieldAdapter,
	    name: 'u-text'
	    //dataType: 'float'
	});
	
	exports.TextFieldAdapter = TextFieldAdapter;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.UrlAdapter = undefined;
	
	var _string = __webpack_require__(30);
	
	var _dom = __webpack_require__(13);
	
	/**
	 * Module : Kero url adapter
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-10 13:51:26
	 */
	var UrlAdapter = _string.StringAdapter.extend({
	    init: function init() {
	        UrlAdapter.superclass.init.apply(this);
	        this.validType = 'url';
	
	        /*
	         * 因为需要输入，因此不显示为超链接
	         */
	    },
	    // 如果enable为false则显示<a>标签
	    setEnable: function setEnable(enable) {
	        if (enable === true || enable === 'true') {
	            this.enable = true;
	            this.element.removeAttribute('readonly');
	            (0, _dom.removeClass)(this.element.parentNode, 'disablecover');
	            if (this.aDom) {
	                this.aDom.style.display = 'none';
	            }
	        } else if (enable === false || enable === 'false') {
	            this.enable = false;
	            this.element.setAttribute('readonly', 'readonly');
	            (0, _dom.addClass)(this.element.parentNode, 'disablecover');
	            if (!this.aDom) {
	                this.aDom = (0, _dom.makeDOM)('<div style="position:absolute;background:#fff;z-index:999;"><a href="' + this.trueValue + '" target="_blank" style="position:absolue;">' + this.trueValue + '</a></div>');
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
	exports.UrlAdapter = UrlAdapter;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.EnableMixin = undefined;
	
	var _dom = __webpack_require__(13);
	
	var EnableMixin = {
	    init: function init() {
	        var self = this;
	        //处理只读
	        if (this.options['enable'] && (this.options['enable'] == 'false' || this.options['enable'] == false)) {
	            this.setEnable(false);
	        } else {
	            this.dataModel.refEnable(this.field).subscribe(function (value) {
	                self.setEnable(value);
	            });
	            this.setEnable(this.dataModel.isEnable(this.field));
	        }
	    },
	    methods: {
	        setEnable: function setEnable(enable) {
	            if (enable === true || enable === 'true') {
	                this.enable = true;
	                this.element.removeAttribute('readonly');
	                (0, _dom.removeClass)(this.element.parentNode, 'disablecover');
	            } else if (enable === false || enable === 'false') {
	                this.enable = false;
	                this.element.setAttribute('readonly', 'readonly');
	                (0, _dom.addClass)(this.element.parentNode, 'disablecover');
	            }
	        }
	    }
	}; /**
	    * Module : Kero Enable Mixin
	    * Author : Kvkens(yueming@yonyou.com)
	    * Date	  : 2016-08-08 16:32:54
	    */
	exports.EnableMixin = EnableMixin;

/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Module : Kero Enable Mixin
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-08 16:32:54
	 */
	
	var RequiredMixin = {
	    init: function init() {
	        var self = this;
	        this.required = this.getOption('required');
	        this.dataModel.refRowMeta(this.field, "required").subscribe(function (value) {
	            self.setRequired(value);
	        });
	        //this.setRequired(this.dataModel.getMeta(this.field, "required"));
	    },
	    methods: {
	        setRequired: function setRequired(required) {
	            if (required === true || required === 'true') {
	                this.required = true;
	            } else if (required === false || required === 'false') {
	                this.required = false;
	            }
	        }
	    }
	};
	
	exports.RequiredMixin = RequiredMixin;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ValidateMixin = undefined;
	
	var _neouiValidate = __webpack_require__(45);
	
	var ValidateMixin = {
	    init: function init() {
	        this.placement = this.getOption('placement');
	        this.tipId = this.getOption('tipId');
	        this.tipAliveTime = this.getOption('tipAliveTime');
	        this.errorMsg = this.getOption('errorMsg');
	        this.nullMsg = this.getOption('nullMsg');
	        this.regExp = this.getOption('regExp');
	        this.successId = this.getOption('successId');
	        this.hasSuccess = this.getOption('hasSuccess');
	        this.notipFlag = this.getOption('notipFlag');
	
	        // if (this.validType) {
	        this.validate = new _neouiValidate.Validate({
	            el: this.element,
	            single: true,
	            validMode: 'manually',
	            required: this.required,
	            validType: this.validType,
	            placement: this.placement,
	            tipId: this.tipId,
	            tipAliveTime: this.tipAliveTime,
	            successId: this.successId,
	            notipFlag: this.notipFlag,
	            hasSuccess: this.hasSuccess,
	            errorMsg: this.errorMsg,
	            nullMsg: this.nullMsg,
	            maxLength: this.maxLength,
	            minLength: this.minLength,
	            max: this.max,
	            min: this.min,
	            maxNotEq: this.maxNotEq,
	            minNotEq: this.minNotEq,
	            reg: this.regExp
	        });
	        // };
	    },
	    methods: {
	        /**
	         *校验
	         */
	        doValidate: function doValidate(options) {
	            if (this.validate) {
	                if (options && options['trueValue'] === true) {
	                    options['showMsg'] = options['showMsg'] || false;
	                    var result = this.validate.check({ pValue: this.getValue(), showMsg: options['showMsg'] });
	                } else {
	                    var result = this.validate.check();
	                }
	                result.comp = this;
	                return result;
	            } else {
	                return { passed: true, comp: this };
	            }
	        },
	        /**
	         * 是否需要清除数据
	         */
	        _needClean: function _needClean() {
	            if (this.validate) return this.validate._needClean();else return false;
	        }
	    }
	}; /**
	    * Module : Kero Validate Mixin
	    * Author : Kvkens(yueming@yonyou.com)
	    * Date	  : 2016-08-10 14:53:43
	    */
	exports.ValidateMixin = ValidateMixin;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.doValidate = exports.validate = exports.Validate = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                   * Module : neoui-validate
	                                                                                                                                                                                                                                                   * Author : Kvkens(yueming@yonyou.com)
	                                                                                                                                                                                                                                                   * Date	  : 2016-08-06 14:03:15
	                                                                                                                                                                                                                                                   */
	
	
	var _BaseComponent = __webpack_require__(7);
	
	var _extend = __webpack_require__(10);
	
	var _dom = __webpack_require__(13);
	
	var _event = __webpack_require__(8);
	
	var _util = __webpack_require__(3);
	
	var _neouiTooltip = __webpack_require__(46);
	
	var _i18n = __webpack_require__(47);
	
	var _compMgr = __webpack_require__(12);
	
	var Validate = _BaseComponent.BaseComponent.extend({
	
		init: function init() {
			var self = this;
			this.$element = this.element;
			this.$form = this.form;
			this.options = (0, _extend.extend)({}, this.DEFAULTS, this.options, JSON.parse(this.element.getAttribute('uvalidate')));
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
			//是否必填
			if (this.required && !this.nullMsg) this.nullMsg = Validate.NULLMSG['required'];
			//错误必填
			this.errorMsg = this.options['errorMsg'] ? this.options['errorMsg'] : Validate.ERRORMSG[this.validType];
			//正则校验
			this.regExp = this.options['reg'] ? this.options['reg'] : Validate.REG[this.validType];
			try {
				if (typeof this.regExp == 'string') this.regExp = eval(this.regExp);
			} catch (e) {}
	
			this.notipFlag = this.options['notipFlag']; // 错误信息提示方式是否为tip，默认为true
			this.hasSuccess = this.options['hasSuccess']; //是否含有正确提示
	
			this.showFix = this.options['showFix'];
	
			//提示div的id 为空时使用tooltop来提示
			this.tipId = this.options['tipId'] ? this.options['tipId'] : null;
			//校验成功提示信息的div
			this.successId = this.options['successId'] ? this.options['successId'] : null;
	
			// 要求显示成功提示，并没有成功提示dom的id时，则创建成功提示dom
			if (this.hasSuccess && !this.successId) {
				this.successId = (0, _dom.makeDOM)('<span class="u-form-control-success uf uf-checkedsymbol" ></span>');
	
				if (this.$element.nextSibling) {
					this.$element.parentNode.insertBefore(this.successId, this.$element.nextSibling);
				} else {
					this.$element.parentNode.appendChild(this.successId);
				}
			}
			//不是默认的tip提示方式并且tipId没有定义时创建默认tipid	
			if (this.notipFlag && !this.tipId) {
				this.tipId = (0, _dom.makeDOM)('<span class="u-form-control-info uf uf-exclamationsign "></span>');
				this.$element.parentNode.appendChild(this.tipId);
	
				if (this.$element.nextSibling) {
					this.$element.parentNode.insertBefore(this.tipId, this.$element.nextSibling);
				} else {
					this.$element.parentNode.appendChild(this.tipId);
				}
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
			this.min = env.isNumber(this.min) ? this.min : null;
			this.max = env.isNumber(this.max) ? this.max : null;
			this.minNotEq = env.isNumber(this.minNotEq) ? this.minNotEq : null;
			this.maxNotEq = env.isNumber(this.maxNotEq) ? this.maxNotEq : null;
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
		"required": (0, _i18n.trans)('validate.required', "不能为空！"),
		"integer": (0, _i18n.trans)('validate.integer', "请填写整数！"),
		"float": (0, _i18n.trans)('validate.float', "请填写数字！"),
		"zipCode": (0, _i18n.trans)('validate.zipCode', "请填写邮政编码！"),
		"phone": (0, _i18n.trans)('validate.phone', "请填写手机号码！"),
		"landline": (0, _i18n.trans)('validate.landline', "请填写座机号码！"),
		"email": (0, _i18n.trans)('validate.email', "请填写邮箱地址！"),
		"url": (0, _i18n.trans)('validate.url', "请填写网址！"),
		"datetime": (0, _i18n.trans)('validate.datetime', "请填写日期！")
	
	};
	
	Validate.ERRORMSG = {
		"integer": (0, _i18n.trans)('validate.error_integer', "整数格式不对！"),
		"float": (0, _i18n.trans)('validate.error_float', "数字格式不对！"),
		"zipCode": (0, _i18n.trans)('validate.error_zipCode', "邮政编码格式不对！"),
		"phone": (0, _i18n.trans)('validate.error_phone', "手机号码格式不对！"),
		"landline": (0, _i18n.trans)('validate.error_landline', "座机号码格式不对！"),
		"email": (0, _i18n.trans)('validate.error_email', "邮箱地址格式不对！"),
		"url": (0, _i18n.trans)('validate.error_url', "网址格式不对！"),
		"datetime": (0, _i18n.trans)('validate.error_datetime', "日期格式不对！")
	};
	
	Validate.REG = {
		"integer": /^-?\d+$/,
		"float": /^-?\d+(\.\d+)?$/,
		"zipCode": /^[0-9]{6}$/,
		"phone": /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/,
		"landline": /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
		"email": /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		"url": /^(\w+:\/\/)?\w+(\.\w+)+.*$/,
		"datetime": /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/
	};
	
	Validate.fn.create = function () {
		var self = this;
		(0, _event.on)(this.element, 'blur', function (e) {
			if (self.validMode == 'blur') {
				self.passed = self.doValid();
			}
		});
		(0, _event.on)(this.element, 'focus', function (e) {
			//隐藏错误信息
			self.hideMsg();
		});
		(0, _event.on)(this.element, 'change', function (e) {
			//隐藏错误信息
			self.hideMsg();
		});
		(0, _event.on)(this.element, 'keydown', function (e) {
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
				} else if (!(event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 105 || (0, _util.inArray)(event.keyCode, [8, 110, 190, 189, 109]) > -1)) {
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
				} else if (!(event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 105 || (0, _util.inArray)(event.keyCode, [8, 109, 189]) > -1)) {
					event.returnValue = false;
					return false;
				}
	
				if (tmp && (tmp + '').split('.')[0].length >= 25) {
					return false;
				}
			}
		});
	};
	
	Validate.fn.updateOptions = function (options) {};
	
	Validate.fn.doValid = function (options) {
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
		if (typeof pValue != 'undefined') value = pValue;else if (this.element) value = this.element.value;
	
		if (this.isEmpty(value) && this.required) {
			this.showMsg(this.nullMsg);
			return {
				passed: false,
				Msg: this.nullMsg
			};
		} else if (this.isEmpty(value) && !this.required) {
			return {
				passed: true
			};
		}
		if (this.regExp) {
			var reg = new RegExp(this.regExp);
			if (typeof value == 'number') value = value + "";
			var r = value.match(reg);
			if (r === null || r === false) {
				this.showMsg(this.errorMsg);
				this.needClean = true;
				return {
					passed: false,
					Msg: this.errorMsg
				};
			}
		}
		if (this.minLength) {
			if (value.lengthb() < this.minLength) {
				var Msg = "输入长度不能小于" + this.minLength + "位";
				this.showMsg(Msg);
				return {
					passed: false,
					Msg: Msg
				};
			}
		}
		if (this.maxLength) {
			if (value.lengthb() > this.maxLength) {
				var Msg = "输入长度不能大于" + this.maxLength + "位";
				this.showMsg(Msg);
				return {
					passed: false,
					Msg: Msg
				};
			}
		}
		if (this.max != undefined && this.max != null) {
			if (parseFloat(value) > this.max) {
				var Msg = "输入值不能大于" + this.max;
				this.showMsg(Msg);
				return {
					passed: false,
					Msg: Msg
				};
			}
		}
		if (this.min != undefined && this.min != null) {
			if (parseFloat(value) < this.min) {
				var Msg = "输入值不能小于" + this.min;
				this.showMsg(Msg);
				return {
					passed: false,
					Msg: Msg
				};
			}
		}
		if (this.maxNotEq != undefined && this.maxNotEq != null) {
			if (parseFloat(value) >= this.maxNotEq) {
				var Msg = "输入值不能大于或等于" + this.maxNotEq;
				this.showMsg(Msg);
				return {
					passed: false,
					Msg: Msg
				};
			}
		}
		if (this.minNotEq != undefined && this.minNotEq != null) {
			if (parseFloat(value) <= this.minNotEq) {
				var Msg = "输入值不能小于或等于" + this.minNotEq;
				this.showMsg(Msg);
				return {
					passed: false,
					Msg: Msg
				};
			}
		}
		//succes时，将成功信息显示
		if (this.successId) {
			// addClass(this.element.parentNode,'u-has-success');
			var successDiv = this.successId;
			var successleft = this.$element.offsetLeft + this.$element.offsetWidth + 5;
			var successtop = this.$element.offsetTop + 10;
			if (typeof successDiv === 'string') successDiv = document.getElementById(successDiv);
			successDiv.style.display = 'inline-block';
			successDiv.style.top = successtop + 'px';
			successDiv.style.left = successleft + 'px';
			clearTimeout(this.timeout);
			this.timeout = setTimeout(function () {
				// self.tooltip.hide();
				successDiv.style.display = 'none';
			}, 3000);
		}
		return {
			passed: true
		};
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
	
	Validate.fn.some = Array.prototype.some ? Array.prototype.some : function () {
		var flag;
		for (var i = 0; i < this.length; i++) {
			if (typeof arguments[0] == "function") {
				flag = arguments[0](this[i]);
				if (flag) break;
			}
		}
		return flag;
	};
	
	Validate.fn.getValue = function () {
		var inputval = '';
		//checkbox、radio为u-meta绑定时
		var bool = this.some.call(this.$element.querySelectorAll('[type="checkbox"],[type="radio"]'), function (ele) {
			return ele.type == "checkbox" || ele.type == "radio";
		});
		if (this.$element.childNodes.length > 0 && bool) {
			var eleArr = this.$element.querySelectorAll('[type="checkbox"],[type="radio"]');
			var ele = eleArr[0];
			if (ele.type == "checkbox") {
				this.$element.querySelectorAll(":checkbox[name='" + $(ele).attr("name") + "']:checked").each(function () {
					inputval += $(this).val() + ',';
				});
			} else if (ele.type == "radio") {
				inputval = this.$element.querySelectorAll(":radio[name='" + $(ele).attr("name") + "']:checked").value;
			}
		} else if (this.$element.is(":radio")) {
			//valid-type 绑定
			inputval = this.$element.parent().querySelectorAll(":radio[name='" + this.$element.attr("name") + "']:checked").val();
		} else if (this.$element.is(":checkbox")) {
			inputval = "";
			this.$element.parent().find(":checkbox[name='" + this.$element.attr("name") + "']:checked").each(function () {
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
	
	Validate.fn.isEmpty = function (val) {
		return val === "" || val === undefined || val === null; //|| val === $.trim(this.$element.attr("tip"));
	};
	
	Validate.fn.showMsg = function (msg) {
	
		if (this.showMsgFlag == false || this.showMsgFlag == 'false') {
			return;
		}
		var self = this;
		if (this.tipId) {
			this.$element.style.borderColor = 'rgb(241,90,74)';
			var tipdiv = this.tipId;
			if (typeof tipdiv === 'string') {
				tipdiv = document.getElementById(tipdiv);
			}
			tipdiv.innerHTML = msg;
			//如果notipFlag为true说明，可能是平台创建的，需要添加left、top值
			if (this.notipFlag) {
				var left = this.$element.offsetLeft;
				var top = this.$element.offsetTop + this.$element.offsetHeight + 4;
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
			if (this.options.tipTemplate) tipOptions.template = this.options.tipTemplate;
			if (!this.tooltip) this.tooltip = new _neouiTooltip.Tooltip(this.element, tipOptions);
			this.tooltip.setTitle(msg);
			this.tooltip.show();
		}
		if (this.tipAliveTime !== -1) {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(function () {
				// self.tooltip.hide();
				self.hideMsg();
			}, this.tipAliveTime);
		}
	};
	Validate.fn.hideMsg = function () {
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
			this.$element.style.borderColor = '';
			// removeClass(tipdiv.parentNode,'u-has-error');
		} else {
			if (this.tooltip) this.tooltip.hide();
		}
	};
	
	/**
	 * 只有单一元素时使用
	 */
	Validate.fn._needClean = function () {
		return true; //this.validates[0].needClean
	};
	
	var validate = function validate(element) {
		var self = this,
		    options,
		    childEle;
		if (typeof element === 'string') {
			element = document.querySelector(element);
		}
		//element本身需要校验
		if (element.attributes["uvalidate"]) {
			options = element.attributes["uvalidate"] ? JSON.parse(element.attributes["uvalidate"].value) : {};
			options = (0, _extend.extend)({
				el: element
			}, options);
			element['Validate'] = new Validate(options);
		}
	
		//element是个父元素，校验子元素
		childEle = element.querySelectorAll('[uvalidate]');
		(0, _util.each)(childEle, function (i, child) {
			if (!child['Validate']) {
				//如果该元素上没有校验
				options = child.attributes["validate"] ? JSON.parse(child.attributes["validate"].value) : {};
				options = (0, _extend.extend)({
					el: child
				}, options);
				child['Validate'] = new Validate(options);
			}
		});
	};
	
	// 对某个dom容器内的元素进行校验
	var doValidate = function doValidate(element) {
		var passed = true,
		    childEle,
		    result;
		if (typeof element === 'string') {
			element = document.querySelector(element);
		}
		childEle = element.querySelectorAll('input');
		(0, _util.each)(childEle, function (i, child) {
			if (child['Validate'] && child['Validate'].check) {
				result = child['Validate'].check({
					trueValue: true,
					showMsg: true
				});
				if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') passed = result['passed'] && passed;else passed = result && passed;
			}
		});
		return passed;
	};
	
	_compMgr.compMgr.regComp({
		comp: Validate,
		compAsString: 'u.Validate',
		css: 'u-validate'
	});
	if (document.readyState && document.readyState === 'complete') {
		_compMgr.compMgr.updateComp();
	} else {
		(0, _event.on)(window, 'load', function () {
			//扫描并生成控件
			_compMgr.compMgr.updateComp();
		});
	}
	exports.Validate = Validate;
	exports.validate = validate;
	exports.doValidate = doValidate;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Tooltip = undefined;
	
	var _extend = __webpack_require__(10);
	
	var _event = __webpack_require__(8);
	
	var _dom = __webpack_require__(13);
	
	var Tooltip = function Tooltip(element, options) {
		this.init(element, options);
		//this.show()
	}; /**
	    * Module : neoui-tooltip
	    * Author : Kvkens(yueming@yonyou.com)
	    * Date   : 2016-08-06 13:26:06
	    */
	
	
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
		init: function init(element, options) {
			this.element = element;
			this.options = (0, _extend.extend)({}, this.defaults, options);
			this._viewport = this.options.viewport && document.querySelector(this.options.viewport.selector || this.options.viewport);
	
			var triggers = this.options.trigger.split(' ');
	
			for (var i = triggers.length; i--;) {
				var trigger = triggers[i];
				if (trigger == 'click') {
					(0, _event.on)(this.element, 'click', this.toggle.bind(this));
				} else if (trigger != 'manual') {
					var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
					var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';
					(0, _event.on)(this.element, eventIn, this.enter.bind(this));
					(0, _event.on)(this.element, eventOut, this.leave.bind(this));
				}
			}
			this.options.title = this.options.title || this.element.getAttribute('title');
			this.element.removeAttribute('title');
			if (this.options.delay && typeof this.options.delay == 'number') {
				this.options.delay = {
					show: this.options.delay,
					hide: this.options.delay
				};
			};
			//tip模板对应的dom
			this.tipDom = (0, _dom.makeDOM)(this.options.template);
			(0, _dom.addClass)(this.tipDom, this.options.placement);
			if (this.options.colorLevel) {
				(0, _dom.addClass)(this.tipDom, this.options.colorLevel);
			}
			this.arrrow = this.tipDom.querySelector('.tooltip-arrow');
	
			// tip容器,默认为当前元素的parent
			this.container = this.options.container ? document.querySelector(this.options.container) : this.element.parentNode;
		},
		enter: function enter() {
			var self = this;
			clearTimeout(this.timeout);
			this.hoverState = 'in';
			if (!this.options.delay || !this.options.delay.show) return this.show();
	
			this.timeout = setTimeout(function () {
				if (self.hoverState == 'in') self.show();
			}, this.options.delay.show);
		},
		leave: function leave() {
			var self = this;
			clearTimeout(this.timeout);
			self.hoverState = 'out';
			if (!self.options.delay || !self.options.delay.hide) return self.hide();
			self.timeout = setTimeout(function () {
				if (self.hoverState == 'out') self.hide();
			}, self.options.delay.hide);
		},
		show: function show() {
			var self = this;
			this.tipDom.querySelector('.tooltip-inner').innerHTML = this.options.title;
			this.tipDom.style.zIndex = (0, _dom.getZIndex)();
	
			if (this.options.showFix) {
				document.body.appendChild(this.tipDom);
				this.tipDom.style.position = 'fixed';
				showPanelByEle({
					ele: this.element,
					panel: this.tipDom,
					position: "top"
				});
				// fix情况下滚动时隐藏
				(0, _event.on)(document, 'scroll', function () {
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
				if (this.options.placement == 'top') {
					this.left = this.element.offsetLeft + inputWidth / 2;
					this.top = this.element.offsetTop - topHeight;
				}
				// 水平居中
				this.tipDom.style.left = this.left - this.tipDom.clientWidth / 2 + 'px';
				// this.tipDom.style.left = this.left + 'px';
				this.tipDom.style.top = this.top + 'px';
			}
	
			(0, _dom.addClass)(this.tipDom, 'active');
	
			// var placement = this.options.placement;
			// var pos = this.getPosition()
			// var actualWidth = this.tipDom.offsetWidth
			// var actualHeight = this.tipDom.offsetHeight
			// var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)
	
			// this.applyPlacement(calculatedOffset, placement)
		},
		hide: function hide() {
			if (this.options.showFix) {
				if (document.body.contains(this.tipDom)) {
					(0, _dom.removeClass)(this.tipDom, 'active');
					document.body.removeChild(this.tipDom);
				}
			} else {
				if (this.container.contains(this.tipDom)) {
					(0, _dom.removeClass)(this.tipDom, 'active');
					this.container.removeChild(this.tipDom);
				}
			}
		},
		applyPlacement: function applyPlacement(offset, placement) {
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
	
			(0, _dom.addClass)(this.tipDom, 'active');
	
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
		getCalculatedOffset: function getCalculatedOffset(placement, pos, actualWidth, actualHeight) {
			return placement == 'bottom' ? {
				top: pos.top + pos.height,
				left: pos.left + pos.width / 2 - actualWidth / 2
			} : placement == 'top' ? {
				top: pos.top - actualHeight,
				left: pos.left + pos.width / 2 - actualWidth / 2
			} : placement == 'left' ? {
				top: pos.top + pos.height / 2 - actualHeight / 2,
				left: pos.left - actualWidth
			} :
			/* placement == 'right' */
			{
				top: pos.top + pos.height / 2 - actualHeight / 2,
				left: pos.left + pos.width
			};
		},
		getPosition: function getPosition(el) {
			el = el || this.element;
			var isBody = el.tagName == 'BODY';
			var elRect = el.getBoundingClientRect();
			if (elRect.width == null) {
				// width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
				elRect = (0, _extend.extend)({}, elRect, {
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
			return (0, _extend.extend)({}, elRect, scroll, outerDims);
		},
		getViewportAdjustedDelta: function getViewportAdjustedDelta(placement, pos, actualWidth, actualHeight) {
			var delta = {
				top: 0,
				left: 0
			};
			if (!this._viewport) return delta;
	
			var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
			var viewportDimensions = this.getPosition(this._viewport);
	
			if (/right|left/.test(placement)) {
				var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
				var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
				if (topEdgeOffset < viewportDimensions.top) {
					// top overflow
					delta.top = viewportDimensions.top - topEdgeOffset;
				} else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
					// bottom overflow
					delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
				}
			} else {
				var leftEdgeOffset = pos.left - viewportPadding;
				var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
				if (leftEdgeOffset < viewportDimensions.left) {
					// left overflow
					delta.left = viewportDimensions.left - leftEdgeOffset;
				} else if (rightEdgeOffset > viewportDimensions.width) {
					// right overflow
					delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
				}
			}
	
			return delta;
		},
		replaceArrow: function replaceArrow(delta, dimension, isHorizontal) {
			if (isHorizontal) {
				this.arrow.style.left = 50 * (1 - delta / dimension) + '%';
				this.arrow.style.top = '';
			} else {
				this.arrow.style.top = 50 * (1 - delta / dimension) + '%';
				this.arrow.style.left = '';
			}
		},
		destory: function destory() {},
		setTitle: function setTitle(title) {
			this.options.title = title;
		}
	
	};
	
	exports.Tooltip = Tooltip;

/***/ },
/* 47 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Module : Sparrow i18n
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-07-29 10:16:54
	 */
	//import {uuii18n} from '?';//缺失故修改为default值
	var trans = function trans(key, dftValue) {
	  //return  uuii18n ?  uuii18n.t('uui-trans:' + key) : dftValue;
	  return dftValue;
	};
	
	exports.trans = trans;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=kero-adapter.js.map