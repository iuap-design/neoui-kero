/** 
 * kero-adapter v1.5.7
 * kero adapter
 * author : yonyou FED
 * homepage : https://github.com/iuap-design/kero-adapter#readme
 * bugs : https://github.com/iuap-design/kero-adapter/issues
 **/ 
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(75);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
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

	var _dom = __webpack_require__(5);

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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.showPanelByEle = exports.getScroll = exports.getOffset = exports.makeModal = exports.makeDOM = exports.getZIndex = exports.getStyle = exports.wrap = exports.css = exports.closest = exports.toggleClass = exports.hasClass = exports.removeClass = exports.addClass = undefined;

	var _event = __webpack_require__(6);

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
	 * Date	  : 2016-08-16 13:59:17
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

		// off = u.getOffset(ele),scroll = u.getScroll(ele),
		// offLeft = off.left,offTop = off.top,
		// scrollLeft = scroll.left,scrollTop = scroll.top,
		// eleWidth = ele.offsetWidth,eleHeight = ele.offsetHeight,
		// panelWidth = panel.offsetWidth,panelHeight = panel.offsetHeight,
		bodyWidth = document.body.clientWidth,
		    bodyHeight = document.body.clientHeight,
		    position = position || 'top',

		// left = offLeft - scrollLeft,top = offTop - scrollTop,
		eleRect = obj.ele.getBoundingClientRect(),
		    panelRect = obj.panel.getBoundingClientRect(),
		    eleWidth = eleRect.width,
		    eleHeight = eleRect.height,
		    left = eleRect.left,
		    top = eleRect.top,
		    panelWidth = panelRect.width,
		    panelHeight = panelRect.height,
		    docWidth = document.documentElement.clientWidth,
		    docHeight = document.documentElement.clientHeight;

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

		if (left + panelWidth > docWidth) left = docWidth - panelWidth - 10;
		if (left < 0) left = 0;

		if (top + panelHeight > docHeight) {
			top = docHeight - panelHeight - 10;
		}

		if (top < 0) top = 0;
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.event = exports.stopEvent = exports.trigger = exports.off = exports.on = undefined;

	var _env = __webpack_require__(7);

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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.env = undefined;

	var _extend = __webpack_require__(8);

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
		isAndroidPAD: false,
		isAndroidPhone: false,
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
		if (u.isAndroid) {
			if (window.screen.width >= 768 && window.screen.width < 1024) {
				u.isAndroidPAD = true;
			}
			if (window.screen.width <= 768) {
				u.isAndroidPhone = true;
			}
		}
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
				}
			}
		}
		if ("ontouchend" in document) {
			u.hasTouch = true;
		}
		if (u.isIphone || u.isAndroidPhone) u.isMobile = true;
	})();

	var env = u;
	exports.env = env;

/***/ },
/* 8 */
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

	var _enumerables = __webpack_require__(9);

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
/* 9 */
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
/* 10 */
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
/* 11 */,
/* 12 */
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
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.DataTable = undefined;

	var _extend = __webpack_require__(8);

	var _indexEvents = __webpack_require__(30);

	var _copyRow = __webpack_require__(32);

	var _data = __webpack_require__(33);

	var _enable = __webpack_require__(34);

	var _getCurrent = __webpack_require__(35);

	var _getData = __webpack_require__(36);

	var _getFocus = __webpack_require__(37);

	var _getMeta = __webpack_require__(38);

	var _getPage = __webpack_require__(39);

	var _getParam = __webpack_require__(40);

	var _getSelect = __webpack_require__(41);

	var _getSimpleData = __webpack_require__(42);

	var _meta = __webpack_require__(43);

	var _page = __webpack_require__(44);

	var _param = __webpack_require__(45);

	var _ref = __webpack_require__(46);

	var _removeRow = __webpack_require__(47);

	var _row = __webpack_require__(49);

	var _rowCurrent = __webpack_require__(50);

	var _rowDelete = __webpack_require__(51);

	var _rowSelect = __webpack_require__(52);

	var _rowFocus = __webpack_require__(53);

	var _simpleData = __webpack_require__(54);

	var _util = __webpack_require__(48);

	var _events = __webpack_require__(31);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
	                                                                                                                                                           * Module : Kero webpack entry dataTable index
	                                                                                                                                                           * Author : liuyk(liuyuekai@yonyou.com)
	                                                                                                                                                           * Date   : 2016-08-09 15:24:46
	                                                                                                                                                           */

	var DataTable =
	// class DataTable extends Events{
	function DataTable(options) {
	    _classCallCheck(this, DataTable);

	    // IE9下转化之后的代码有问题，无法获得superClass方法
	    // super();
	    this.on = _events.on;
	    this.off = _events.off;
	    this.one = _events.one;
	    this.trigger = _events.trigger;
	    this.getEvent = _events.getEvent;

	    options = options || {};
	    this.id = options['id'];
	    this.strict = options['strict'] || false;
	    this.meta = DataTable.createMetaItems(options['meta']);
	    this.enable = options['enable'] || DataTable.DEFAULTS.enable;
	    this.pageSize = ko.observable(options['pageSize'] || DataTable.DEFAULTS.pageSize);
	    this.pageIndex = ko.observable(options['pageIndex'] || DataTable.DEFAULTS.pageIndex);
	    this.totalPages = ko.observable(options['totalPages'] || DataTable.DEFAULTS.totalPages);
	    this.totalRow = ko.observable();
	    this.pageCache = options['pageCache'] === undefined ? DataTable.DEFAULTS.pageCache : options['pageCache'];
	    this.rows = ko.observableArray([]);
	    this.selectedIndices = ko.observableArray([]);
	    this._oldCurrentIndex = -1;
	    this.focusIndex = ko.observable(-1);
	    this.cachedPages = [];
	    this.metaChange = {};
	    this.valueChange = {}; //ko.observable(1);
	    this.currentRowChange = ko.observable(1);
	    this.enableChange = ko.observable(1);
	    this.params = options['params'] || {};
	    this.master = options['master'] || '';
	    this.allSelected = ko.observable(false);
	    if (options['root']) {
	        this.root = options['root'];
	    } else {
	        this.root = this;
	    }
	    if (options['ns']) {
	        this.ns = options['ns'];
	    } else {
	        this.ns = '';
	    }

	    //copyRow
	    this.copyRow = _copyRow.copyRow;
	    this.copyRows = _copyRow.copyRows;

	    //data
	    this.setData = _data.setData;
	    this.setValue = _data.setValue;

	    //enable
	    this.isEnable = _enable.isEnable;
	    this.setEnable = _enable.setEnable;

	    //getData
	    this.getData = _getData.getData;
	    this.getDataByRule = _getData.getDataByRule;
	    this.getRow = _getData.getRow;
	    this.getRowByRowId = _getData.getRowByRowId;
	    this.getRowIndex = _getData.getRowIndex;
	    this.getRowsByField = _getData.getRowsByField;
	    this.getRowByField = _getData.getRowByField;
	    this.getAllRows = _getData.getAllRows;
	    this.getAllPageRows = _getData.getAllPageRows;
	    this.getChangedDatas = _getData.getChangedDatas;
	    this.getChangedRows = _getData.getChangedRows;
	    this.getValue = _getData.getValue;
	    this.getIndexByRowId = _getData.getIndexByRowId;
	    this.getAllDatas = _getData.getAllDatas;
	    this.getRowIdsByIndices = _getData.getRowIdsByIndices;

	    //getCurrent
	    this.getCurrentRow = _getCurrent.getCurrentRow;
	    this.getCurrentIndex = _getCurrent.getCurrentIndex;

	    //getFocus
	    this.getFocusRow = _getFocus.getFocusRow;
	    this.getFocusIndex = _getFocus.getFocusIndex;

	    //getMeta
	    this.getMeta = _getMeta.getMeta;
	    this.getRowMeta = _getMeta.getRowMeta;

	    //getPage
	    this.getPage = _getPage.getPage;
	    this.getPages = _getPage.getPages;

	    //getParam
	    this.getParam = _getParam.getParam;

	    //getSelect
	    this.getSelectedIndex = _getSelect.getSelectedIndex;
	    this.getSelectedIndices = _getSelect.getSelectedIndices;
	    this.getSelectedIndexs = _getSelect.getSelectedIndexs;
	    this.getSelectedDatas = _getSelect.getSelectedDatas;
	    this.getSelectedRows = _getSelect.getSelectedRows;

	    //getSimpleData
	    this.getSimpleData = _getSimpleData.getSimpleData;

	    //meta
	    this.setMeta = _meta.setMeta;
	    this.updateMeta = _meta.updateMeta;
	    this.createField = _meta.createField;

	    //page
	    this.setCurrentPage = _page.setCurrentPage;
	    this.updatePages = _page.updatePages;
	    this.setPages = _page.setPages;
	    this.hasPage = _page.hasPage;
	    this.clearCache = _page.clearCache;
	    this.cacheCurrentPage = _page.cacheCurrentPage;

	    //param
	    this.addParam = _param.addParam;
	    this.addParams = _param.addParams;

	    //ref
	    this.refSelectedRows = _ref.refSelectedRows;
	    this.ref = _ref.ref;
	    this.refMeta = _ref.refMeta;
	    this.refRowMeta = _ref.refRowMeta;
	    this.refEnable = _ref.refEnable;

	    //row
	    this.setRows = _row.setRows;
	    this.addRow = _row.addRow;
	    this.addRows = _row.addRows;
	    this.insertRow = _row.insertRow;
	    this.insertRows = _row.insertRows;
	    this.createEmptyRow = _row.createEmptyRow;

	    //removeRow
	    this.removeRowByRowId = _removeRow.removeRowByRowId;
	    this.removeRow = _removeRow.removeRow;
	    this.removeAllRows = _removeRow.removeAllRows;
	    this.removeRows = _removeRow.removeRows;
	    this.clear = _removeRow.clear;

	    //rowCurrent
	    this.updateCurrIndex = _rowCurrent.updateCurrIndex;

	    //rowDelete
	    this.setRowDelete = _rowDelete.setRowDelete;
	    this.setAllRowsDelete = _rowDelete.setAllRowsDelete;
	    this.setRowsDelete = _rowDelete.setRowsDelete;

	    //rowFocus
	    this.setRowFocus = _rowFocus.setRowFocus;
	    this.setRowUnFocus = _rowFocus.setRowUnFocus;
	    this.updateFocusIndex = _rowFocus.updateFocusIndex;

	    //rowSelect
	    this.setAllRowsSelect = _rowSelect.setAllRowsSelect;
	    this.setRowSelect = _rowSelect.setRowSelect;
	    this.setRowsSelect = _rowSelect.setRowsSelect;
	    this.addRowSelect = _rowSelect.addRowSelect;
	    this.addRowsSelect = _rowSelect.addRowsSelect;
	    this.setAllRowsUnSelect = _rowSelect.setAllRowsUnSelect;
	    this.setRowUnSelect = _rowSelect.setRowUnSelect;
	    this.setRowsUnSelect = _rowSelect.setRowsUnSelect;
	    this.toggleAllSelect = _rowSelect.toggleAllSelect;
	    this.updateSelectedIndices = _rowSelect.updateSelectedIndices;

	    //simpleData
	    this.setSimpleData = _simpleData.setSimpleData;
	    this.addSimpleData = _simpleData.addSimpleData;

	    //util
	    this.isChanged = _util.isChanged;
	};

	DataTable.DEFAULTS = {
	    pageSize: 20,
	    pageIndex: 0,
	    totalPages: 20,
	    pageCache: false,
	    enable: true
	};

	DataTable.META_DEFAULTS = {
	    enable: true,
	    required: false,
	    descs: {}
	};

	//事件类型
	DataTable.ON_ROW_SELECT = 'select';
	DataTable.ON_ROW_UNSELECT = 'unSelect';
	DataTable.ON_ROW_ALLSELECT = 'allSelect';
	DataTable.ON_ROW_ALLUNSELECT = 'allUnselect';
	DataTable.ON_VALUE_CHANGE = 'valueChange';
	DataTable.ON_CURRENT_VALUE_CHANGE = 'currentValueChange'; //当前行变化
	//  DataTable.ON_AFTER_VALUE_CHANGE = 'afterValueChange'
	//  DataTable.ON_ADD_ROW = 'addRow'
	DataTable.ON_INSERT = 'insert';
	DataTable.ON_UPDATE = 'update';
	DataTable.ON_CURRENT_UPDATE = 'currentUpdate';
	DataTable.ON_DELETE = 'delete';
	DataTable.ON_DELETE_ALL = 'deleteAll';
	DataTable.ON_ROW_FOCUS = 'focus';
	DataTable.ON_ROW_UNFOCUS = 'unFocus';
	DataTable.ON_LOAD = 'load';
	DataTable.ON_ENABLE_CHANGE = 'enableChange';
	DataTable.ON_META_CHANGE = 'metaChange';
	DataTable.ON_ROW_META_CHANGE = 'rowMetaChange';
	DataTable.ON_CURRENT_META_CHANGE = 'currentMetaChange';
	DataTable.ON_CURRENT_ROW_CHANGE = 'currentRowChange';

	DataTable.SUBMIT = {
	    current: 'current',
	    focus: 'focus',
	    all: 'all',
	    select: 'select',
	    change: 'change',
	    empty: 'empty',
	    allSelect: 'allSelect',
	    allPages: 'allPages'
	};

	DataTable.createMetaItems = function (metas) {
	    var newMetas = {};
	    for (var key in metas) {
	        var meta = metas[key];
	        if (typeof meta == 'string') meta = {};
	        newMetas[key] = (0, _extend.extend)({}, DataTable.META_DEFAULTS, meta);
	    }
	    return newMetas;
	};

	exports.DataTable = DataTable;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Events = undefined;

	var _events = __webpack_require__(31);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
	                                                                                                                                                           * Module : Kero webpack entry events index
	                                                                                                                                                           * Author : liuyk(liuyuekai@yonyou.com)
	                                                                                                                                                           * Date   : 2016-08-09 15:24:46
	                                                                                                                                                           */

	//相关依赖导入


	var Events = function Events() {
	  _classCallCheck(this, Events);

	  this.on = _events.on;
	  this.off = _events.off;
	  this.one = _events.one;
	  this.trigger = _events.trigger;
	  this.getEvent = _events.getEvent;
	};

	exports.Events = Events;

/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * Module : kero dataTable events
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date   : 2016-07-30 14:34:01
	 */

	/**
	 * 绑定事件
	 * 支持的格式： 1. on(u.DataTable.ON_ROW_FOCUS, function() {}) // 普通
	 * 2. on([u.DataTable.ON_INSERT, u.DataTable.ON_DELETE], function() {}) // 数组
	 * 3. on({u.DataTable.ON_INSERT: function() {}, u.DataTable.ON_DELETE: function() {}}) // map
	 */
	var on = function on(name, _callback, one) {
	    var self = this,
	        origCb = _callback;
	    if (Object.prototype.toString.call(name) == '[object Array]') {
	        // 数组
	        for (var i in name) {
	            this.on(name[i], _callback);
	        }
	        return this;
	    } else if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) == 'object') {
	        // map
	        for (var key in name) {
	            this.on(key, name[key]);
	        }
	        return this;
	    }
	    if (one) {
	        _callback = function callback() {
	            self.off(name, _callback);
	            origCb.apply(this, arguments);
	        };
	    }
	    name = name.toLowerCase();
	    this._events || (this._events = {});
	    var events = this._events[name] || (this._events[name] = []);
	    events.push({
	        callback: _callback
	    });
	    return this;
	};

	/**
	 * 解绑事件
	 * 
	**/
	var off = function off(name, callback) {
	    if (Object.prototype.toString.call(name) == '[object Array]') {
	        // 数组
	        for (var i in name) {
	            this.off(name[i], callback);
	        }
	        return this;
	    } else if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) == 'object') {
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
	    return this;
	};

	/**
	 * 
	**/
	var one = function one(name, callback) {
	    this.on(name, callback, 1);
	};

	/**
	 * 触发事件
	 */
	var trigger = function trigger(name) {
	    name = name.toLowerCase();
	    if (!this._events || !this._events[name]) return this;
	    var args = Array.prototype.slice.call(arguments, 1);
	    var events = this._events[name];
	    for (var i = 0, count = events.length; i < count; i++) {
	        events[i].callback.apply(this, args);
	    }
	    return this;
	};

	var getEvent = function getEvent(name) {
	    name = name.toLowerCase();
	    this._events || (this._events = {});
	    return this._events[name];
	};

	exports.on = on;
	exports.off = off;
	exports.one = one;
	exports.trigger = trigger;
	exports.getEvent = getEvent;

/***/ },
/* 32 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Module : kero dataTable copyRow
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date	  : 2016-08-01 14:34:01
	 */

	var copyRow = function copyRow(index, row) {
	    this.copyRows(index, [row]);
	};

	var copyRows = function copyRows(index, rows) {
	    for (var i = 0; i < rows.length; i++) {
	        var newRow = new Row({ parent: this });
	        if (rows[i]) {
	            newRow.setData(rows[i].getData());
	        }
	        this.insertRows(index === undefined ? this.rows().length : index, [newRow]);
	    }
	};

	exports.copyRow = copyRow;
	exports.copyRows = copyRows;

/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Module : kero dataTable data
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date	  : 2016-07-30 14:34:01
	 */

	/** 
	 *设置数据
	 *
	 */
	var setData = function setData(data, options) {
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
	        var newTotalRow = data.rows.length; //后续要考虑状态，del的不计算在内
	    }
	    var select,
	        focus,
	        unSelect = options ? options.unSelect : false;

	    this.pageCache = data.pageCache || this.pageCache;
	    if (this.pageCache === true) {
	        this.updatePages(data.pages);
	        if (newIndex != this.pageIndex()) {
	            this.setCurrentPage(newIndex, true);
	            this.totalPages(newTotalPages);
	            this.totalRow(newTotalRow);
	            return;
	        } else {
	            select = this.getPage(newIndex).selectedIndices;
	            focus = this.getPage(newIndex).focus;
	            this.setRows(this.getPage(newIndex).rows);
	        }
	    } else {
	        select = data.select || (!unSelect ? [0] : []);
	        focus = data.focus !== undefined ? data.focus : data.current;
	        this.setRows(data.rows);
	    }
	    this.pageIndex(newIndex);
	    this.pageSize(newSize);
	    this.totalPages(newTotalPages);
	    this.totalRow(newTotalRow);

	    this.updateSelectedIndices();

	    if (select && select.length > 0 && this.rows().length > 0) this.setRowsSelect(select);
	    if (focus !== undefined) this.setRowFocus(focus);
	};

	var setValue = function setValue(fieldName, value, row, ctx) {
	    if (arguments.length === 1) {
	        value = fieldName;
	        fieldName = '$data';
	    }

	    row = row ? row : this.getCurrentRow();
	    if (row) row.setValue(fieldName, value, ctx);
	};

	exports.setData = setData;
	exports.setValue = setValue;

/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Module : kero dataTable enable
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date   : 2016-08-08 09:59:01
	 */

	var isEnable = function isEnable(fieldName) {
	    var fieldEnable = this.getMeta(fieldName, 'enable');
	    if (typeof fieldEnable == 'undefined' || fieldEnable == null) fieldEnable = true;
	    return fieldEnable && this.enable;
	};

	var setEnable = function setEnable(enable) {
	    if (this.enable == enable) return;
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

	exports.isEnable = isEnable;
	exports.setEnable = setEnable;

/***/ },
/* 35 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Module : kero dataTable getCurrent
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date   : 2016-08-08 09:59:01
	 */

	/**
	 * 获取当前操作行
	 * 规则： focus 行优先，没有focus行时，取第一选中行
	 */
	var getCurrentRow = function getCurrentRow() {
	    if (this.focusIndex() != -1) return this.getFocusRow();
	    var index = this.getSelectedIndex();
	    if (index == -1) return null;else return this.getRow(index);
	};

	var getCurrentIndex = function getCurrentIndex() {
	    if (this.focusIndex() != -1) return this.focusIndex();
	    var index = this.getSelectedIndex();
	    if (index == -1) return -1;else return index;
	};

	exports.getCurrentRow = getCurrentRow;
	exports.getCurrentIndex = getCurrentIndex;

/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Module : kero dataTable getData
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date   : 2016-07-30 14:34:01
	 */

	/**
	 * 获取当前页数据
	 */
	var getData = function getData() {
	    var datas = [],
	        rows = this.rows();
	    for (var i = 0; i < rows.length; i++) {
	        datas.push(rows[i].getData());
	    }
	    return datas;
	};

	var getDataByRule = function getDataByRule(rule) {
	    var returnData = {},
	        datas = null,
	        rows;
	    returnData.meta = this.meta;
	    returnData.params = this.params;
	    rule = rule || DataTable.SUBMIT.current;
	    if (rule == DataTable.SUBMIT.current) {
	        datas = [];
	        var currIndex = this.focusIndex();
	        if (currIndex == -1) currIndex = this.getSelectedIndex();
	        rows = this.rows();
	        for (var i = 0, count = rows.length; i < count; i++) {
	            if (i == currIndex) datas.push(rows[i].getData());else datas.push(rows[i].getEmptyData());
	        }
	    } else if (rule == DataTable.SUBMIT.focus) {
	        datas = [];
	        rows = this.rows();
	        for (var i = 0, count = rows.length; i < count; i++) {
	            if (i == this.focusIndex()) datas.push(rows[i].getData());else datas.push(rows[i].getEmptyData());
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
	    if (this.pageCache && datas != null) {
	        datas = [{ index: this.pageIndex(), select: this.getSelectedIndexs(), focus: this.focusIndex(), rows: datas }];
	    }
	    if (rule == DataTable.SUBMIT.allSelect) {
	        datas = [];
	        var totalPages = this.totalPages();
	        //缓存页数据
	        for (var i = 0; i < totalPages; i++) {
	            if (i == this.pageIndex()) {
	                //当前页数据
	                datas.push({
	                    index: this.pageIndex(),
	                    select: this.getSelectedIndexs(),
	                    focus: this.focusIndex(),
	                    rows: this.getSelectedDatas()
	                });
	            } else {
	                var page = this.cachedPages[i];
	                if (page) {
	                    datas.push({
	                        index: i,
	                        select: page.selectedIndices,
	                        focus: page.focus,
	                        rows: page.getSelectDatas()
	                    });
	                }
	            }
	        }
	    } else if (rule == DataTable.SUBMIT.allPages) {
	        datas = [];
	        var totalPages = this.totalPages();
	        //缓存页数据
	        for (var i = 0; i < totalPages; i++) {
	            if (i == this.pageIndex()) {
	                //当前页数据
	                datas.push({
	                    index: this.pageIndex(),
	                    select: this.getSelectedIndexs(),
	                    focus: this.focusIndex(),
	                    rows: this.getData()
	                });
	            } else {
	                var page = this.cachedPages[i];
	                if (page) {
	                    datas.push({ index: i, select: page.selectedIndices, focus: page.focus, rows: page.getData() });
	                }
	            }
	        }
	    }
	    if (this.pageCache) {
	        returnData.pages = datas;
	    } else {
	        returnData.rows = datas;
	        returnData.select = this.getSelectedIndexs();
	        returnData.focus = this.getFocusIndex();
	    }

	    returnData.pageSize = this.pageSize();
	    returnData.pageIndex = this.pageIndex();
	    returnData.isChanged = this.isChanged();
	    returnData.master = this.master;
	    returnData.pageCache = this.pageCache;
	    return returnData;
	};

	var getRow = function getRow(index) {
	    //return this.rows()[index]   //modify by licza.   improve performance
	    return this.rows.peek()[index];
	};

	/**
	 * 根据rowid取row对象
	 * @param rowid
	 * @returns {*}
	 */
	var getRowByRowId = function getRowByRowId(rowid) {
	    var rows = this.rows.peek();
	    for (var i = 0, count = rows.length; i < count; i++) {
	        if (rows[i].rowId == rowid) return rows[i];
	    }
	    return null;
	};

	/**
	 * 取行索引
	 * @param row
	 * @returns {*}
	 */
	var getRowIndex = function getRowIndex(row) {
	    var rows = this.rows.peek();
	    for (var i = 0, count = rows.length; i < count; i++) {
	        if (rows[i].rowId === row.rowId) return i;
	    }
	    return -1;
	};

	var getRowsByField = function getRowsByField(field, value) {
	    var rows = this.rows.peek();
	    var returnRows = new Array();
	    for (var i = 0, count = rows.length; i < count; i++) {
	        if (rows[i].getValue(field) === value) returnRows.push(rows[i]);
	    }
	    return returnRows;
	};

	var getRowByField = function getRowByField(field, value) {
	    var rows = this.rows.peek();
	    for (var i = 0, count = rows.length; i < count; i++) {
	        if (rows[i].getValue(field) === value) return rows[i];
	    }
	    return null;
	};

	var getAllRows = function getAllRows() {
	    return this.rows.peek();
	};

	var getAllPageRows = function getAllPageRows() {
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
	 * 获取变动的数据(新增、修改)
	 */
	var getChangedDatas = function getChangedDatas(withEmptyRow) {
	    var datas = [],
	        rows = this.rows();
	    for (var i = 0, count = rows.length; i < count; i++) {
	        if (rows[i] && rows[i].status != Row.STATUS.NORMAL) {
	            datas.push(rows[i].getData());
	        } else if (withEmptyRow == true) {
	            datas.push(rows[i].getEmptyData());
	        }
	    }
	    return datas;
	};

	/**
	 * 取改变的行
	 */
	var getChangedRows = function getChangedRows() {
	    var changedRows = [],
	        rows = this.rows.peek();
	    for (var i = 0, count = rows.length; i < count; i++) {
	        if (rows[i] && rows[i].status != Row.STATUS.NORMAL) {
	            changedRows.push(rows[i]);
	        }
	    }
	    return changedRows;
	};

	var getValue = function getValue(fieldName, row) {
	    row = row || this.getCurrentRow();
	    if (row) return row.getValue(fieldName);else return '';
	};

	/**
	 * 根据行号获取行索引
	 * @param {String} rowId
	 */
	var getIndexByRowId = function getIndexByRowId(rowId) {
	    var rows = this.rows();
	    for (var i = 0, count = rows.length; i < count; i++) {
	        if (rows[i].rowId == rowId) return i;
	    }
	    return -1;
	};

	/**
	 * 获取所有行数据
	 */
	var getAllDatas = function getAllDatas() {
	    var rows = this.getAllRows();
	    var datas = [];
	    for (var i = 0, count = rows.length; i < count; i++) {
	        if (rows[i]) datas.push(rows[i].getData());
	    }return datas;
	};

	/**
	 * 根据索引取rowid
	 * @param {Object} indices
	 */
	var getRowIdsByIndices = function getRowIdsByIndices(indices) {
	    var rowIds = [];
	    for (var i = 0; i < indices.length; i++) {
	        rowIds.push(this.getRow(indices[i]).rowId);
	    }
	    return rowIds;
	};

	exports.getData = getData;
	exports.getDataByRule = getDataByRule;
	exports.getRow = getRow;
	exports.getRowByRowId = getRowByRowId;
	exports.getRowIndex = getRowIndex;
	exports.getRowsByField = getRowsByField;
	exports.getRowByField = getRowByField;
	exports.getAllRows = getAllRows;
	exports.getAllPageRows = getAllPageRows;
	exports.getChangedDatas = getChangedDatas;
	exports.getChangedRows = getChangedRows;
	exports.getValue = getValue;
	exports.getIndexByRowId = getIndexByRowId;
	exports.getAllDatas = getAllDatas;
	exports.getRowIdsByIndices = getRowIdsByIndices;

/***/ },
/* 37 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Module : kero dataTable getFocus
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date   : 2016-08-08 09:59:01
	 */

	/**
	 * 获取焦点行
	 */
	var getFocusRow = function getFocusRow() {
	  if (this.focusIndex() != -1) return this.getRow(this.focusIndex());else return null;
	};

	/**
	 * 获取焦点行
	 */
	var getFocusIndex = function getFocusIndex() {
	  return this.focusIndex();
	};

	exports.getFocusRow = getFocusRow;
	exports.getFocusIndex = getFocusIndex;

/***/ },
/* 38 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Module : kero dataTable getMete
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date	  : 2016-07-30 14:34:01
	 */

	/**
	 * 获取meta信息，先取row上的信息，没有时，取dataTable上的信息
	 * @param {Object} fieldName
	 * @param {Object} key
	 * @param {Object} row
	 */
	var getMeta = function getMeta(fieldName, key) {
	    if (arguments.length === 0) return this.meta;else if (arguments.length === 1) return this.meta[fieldName];

	    if (this.meta[fieldName] && typeof this.meta[fieldName][key] !== 'undefined') {
	        return this.meta[fieldName][key];
	    } else {
	        return null;
	    }
	};

	var getRowMeta = function getRowMeta(fieldName, key) {
	    var row = this.getCurrentRow();
	    if (row) return row.getMeta(fieldName, key);else return this.getMeta(fieldName, key);
	};

	exports.getMeta = getMeta;
	exports.getRowMeta = getRowMeta;

/***/ },
/* 39 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Module : kero dataTable getPage
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date	  : 2016-08-01 14:34:01
	 */

	var getPage = function getPage(pageIndex) {
	    if (this.pageCache) {
	        return this.cachedPages[pageIndex];
	    }
	    return -1;
	};

	var getPages = function getPages() {
	    if (this.pageCache) {
	        return this.cachedPages;
	    }
	    return [];
	};

	exports.getPage = getPage;
	exports.getPages = getPages;

/***/ },
/* 40 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Module : kero dataTable getParam
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date	  : 2016-07-30 14:34:01
	 */

	var getParam = function getParam(key) {
	  return this.params[key];
	};

	exports.getParam = getParam;

/***/ },
/* 41 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Module : kero dataTable getSelect
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date   : 2016-08-01 14:34:01
	 */

	/**
	 * 获取选中行索引，多选时，只返回第一个行索引
	 */
	var getSelectedIndex = function getSelectedIndex() {
	    var selectedIndices = this.selectedIndices();
	    if (selectedIndices == null || selectedIndices.length == 0) return -1;
	    return selectedIndices[0];
	};

	/**
	 *获取选中的所有行索引数组索引
	 */
	var getSelectedIndices = function getSelectedIndices() {
	    var selectedIndices = this.selectedIndices();
	    if (selectedIndices == null || selectedIndices.length == 0) return [];
	    return selectedIndices;
	};

	/**
	 * 兼容保留，不要用
	 */
	var getSelectedIndexs = function getSelectedIndexs() {
	    return this.getSelectedIndices();
	};

	/**
	 * 获取选中行数据
	 */
	var getSelectedDatas = function getSelectedDatas(withEmptyRow) {
	    var selectedIndices = this.selectedIndices();
	    var datas = [];
	    var sIndices = [];
	    for (var i = 0, count = selectedIndices.length; i < count; i++) {
	        sIndices.push(selectedIndices[i]);
	    }
	    var rows = this.rows();
	    for (var i = 0, count = rows.length; i < count; i++) {
	        if (sIndices.indexOf(i) != -1) datas.push(rows[i].getData());else if (withEmptyRow == true) datas.push(rows[i].getEmptyData());
	    }
	    return datas;
	};

	/**
	 * 取选中行
	 */
	var getSelectedRows = function getSelectedRows() {
	    var selectedIndices = this.selectedIndices();
	    var selectRows = [];
	    var rows = this.rows.peek();
	    var sIndices = [];
	    for (var i = 0, count = selectedIndices.length; i < count; i++) {
	        sIndices.push(selectedIndices[i]);
	    }
	    for (var i = 0, count = rows.length; i < count; i++) {
	        if (sIndices.indexOf(i) != -1) selectRows.push(rows[i]);
	    }
	    return selectRows;
	};

	exports.getSelectedIndex = getSelectedIndex;
	exports.getSelectedIndices = getSelectedIndices;
	exports.getSelectedIndexs = getSelectedIndexs;
	exports.getSelectedDatas = getSelectedDatas;
	exports.getSelectedRows = getSelectedRows;

/***/ },
/* 42 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Module : kero dataTable getSimpleData
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date	  : 2016-08-01 14:34:01
	 */

	/**
	 * 获取数据,只取字段名与字段值
	 */
	var getSimpleData = function getSimpleData(options) {
	    options = options || {};
	    var rows,
	        _rowData = [],
	        type = options['type'] || 'all',
	        fields = options['fields'] || null;

	    if (type === 'all') {
	        rows = this.rows.peek();
	    } else if (type === 'current') {
	        var currRow = this.getCurrentRow();
	        rows = currRow == null ? [] : [currRow];
	    } else if (type === 'focus') {
	        var focusRow = this.getFocusRow();
	        rows = focusRow == null ? [] : [focusRow];
	    } else if (type === 'select') {
	        rows = this.getSelectedRows();
	    } else if (type === 'change') {
	        rows = this.getChangedRows();
	    }

	    for (var i = 0; i < rows.length; i++) {
	        _rowData.push(rows[i].getSimpleData({ fields: fields }));
	    }
	    return _rowData;
	};

	exports.getSimpleData = getSimpleData;

/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * Module : kero dataTable mete
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date	  : 2016-07-30 14:34:01
	 */

	var setMeta = function setMeta(fieldName, key, value) {
	    if (!this.meta[fieldName]) return;
	    var oldValue = this.meta[fieldName][key];
	    var currRow = this.getCurrentRow();
	    this.meta[fieldName][key] = value;
	    if (this.metaChange[fieldName + '.' + key]) this.metaChange[fieldName + '.' + key](-this.metaChange[fieldName + '.' + key]());
	    if (key == 'enable') this.enableChange(-this.enableChange());
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
	 * example: meta: {supplier: {meta: {precision:'3', default: '0239900x', display:'显示名称'}}}
	 */
	var updateMeta = function updateMeta(meta) {
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
	            if (this.metaChange[fieldKey + '.' + propKey]) this.metaChange[fieldKey + '.' + propKey](-this.metaChange[fieldKey + '.' + propKey]());

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

	/**
	 * 字段不存在时，创建字段
	 * @param fieldName
	 * @param options
	 */
	var createField = function createField(fieldName, options) {
	    //字段不主动定义，则不创建
	    if (this.root.strict == true) return;
	    //有子表的情况不创建字段
	    if (fieldName.indexOf('.') != -1) {
	        var fNames = fieldName.split('.');
	        var _name = fNames[0];
	        for (var i = 0, count = fNames.length; i < count; i++) {
	            if (this.meta[_name] && this.meta[_name]['type'] === 'child') return;
	            if (i + 1 < count) _name = _name + '.' + fNames[i + 1];
	        }
	    }
	    if (!this.meta[fieldName]) {
	        this.meta[fieldName] = {};
	    }
	    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
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
	        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
	            for (var key in options) {
	                if (!_fieldMeta[fieldName][key]) {
	                    _fieldMeta[fieldName][key] = options[key];
	                }
	            }
	        }
	    }
	};

	exports.setMeta = setMeta;
	exports.updateMeta = updateMeta;
	exports.createField = createField;

/***/ },
/* 44 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Module : kero dataTable page
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date	  : 2016-08-01 14:34:01
	 */

	var setCurrentPage = function setCurrentPage(pageIndex, notCacheCurrentPage) {
	    if (pageIndex != this.pageIndex() && notCacheCurrentPage != true) this.cacheCurrentPage();
	    this.pageIndex(pageIndex);
	    var cachedPage = this.cachedPages[this.pageIndex()];
	    if (cachedPage) {
	        this.removeAllRows();
	        this.setRows(cachedPage.rows);
	        this.setRowsSelect(cachedPage.selectedIndcies);
	    }
	};

	/**
	 * 更新分页数据
	 */
	var updatePages = function updatePages(pages) {
	    var pageSize = this.pageSize(),
	        pageIndex = 0,
	        page,
	        r,
	        row;
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
	            page = new Page({ parent: this });
	            page.rows = rows;
	            for (var j = 0; j < page.rows.length; j++) {
	                page.rows[j].rowId = page.rows[j].id;
	                delete page.rows[j].id;
	            }
	            this.cachedPages[index] = page;
	        } else {
	            //如果是当前页，先把this.rows数据更新到page中
	            if (index == this.pageIndex()) {
	                this.cacheCurrentPage();
	            }
	            page = this.cachedPages[index];
	            for (var j = 0; j < rows.length; j++) {
	                r = rows[j];
	                if (!r.id) r.id = Row.getRandomRowId();
	                if (r.status == Row.STATUS.DELETE) {
	                    this.removeRowByRowId(r.id);
	                } else {
	                    row = page.getRowByRowId(r.id);
	                    if (row) {
	                        page.updateRow(row, r);
	                    } else {
	                        r.rowId = r.id;
	                        delete r.id;
	                        page.rows.push(r);
	                    }
	                }
	            }
	        }
	        page.selectedIndices = selectIndices;
	        page.focus = focus;
	    }
	};

	/**
	 * 前端分页方法，不建议使用，建议在后端进行分页
	 * @param allRows
	 */
	var setPages = function setPages(allRows) {
	    var pageSize = this.pageSize(),
	        pageIndex = 0,
	        page;
	    this.cachedPages = [];
	    for (var i = 0; i < allRows.length; i++) {
	        pageIndex = Math.floor(i / pageSize);
	        if (!this.cachedPages[pageIndex]) {
	            page = new Page({ parent: this });
	            this.cachedPages[pageIndex] = page;
	        }
	        page.rows.push(allRows[i]);
	    }
	    if (this.pageIndex() > -1) this.setCurrentPage(this.pageIndex());
	    this.totalRow(allRows.length);
	    this.totalPages(pageIndex + 1);
	};

	var hasPage = function hasPage(pageIndex) {
	    return this.pageCache && this.cachedPages[pageIndex] ? true : false;
	};

	var clearCache = function clearCache() {
	    this.cachedPages = [];
	};

	var cacheCurrentPage = function cacheCurrentPage() {
	    if (this.pageCache && this.pageIndex() > -1) {
	        var page = new Page({ parent: this });
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

	exports.setCurrentPage = setCurrentPage;
	exports.updatePages = updatePages;
	exports.setPages = setPages;
	exports.hasPage = hasPage;
	exports.clearCache = clearCache;
	exports.cacheCurrentPage = cacheCurrentPage;

/***/ },
/* 45 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Module : kero dataTable param
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date	  : 2016-07-30 14:34:01
	 */

	var addParam = function addParam(key, value) {
	    this.params[key] = value;
	};

	var addParams = function addParams(params) {
	    for (var key in params) {
	        this.params[key] = params[key];
	    }
	};

	exports.addParam = addParam;
	exports.addParams = addParams;

/***/ },
/* 46 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Module : kero dataTable ref
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date   : 2016-08-01 14:34:01
	 */

	var refSelectedRows = function refSelectedRows() {
	    return ko.pureComputed({
	        read: function read() {
	            var ins = this.selectedIndices() || [];
	            var rs = this.rows();
	            var selectedRows = [];
	            for (var i = 0; i < ins.length; i++) {
	                selectedRows.push(rs[i]);
	            }
	            return selectedRows;
	        }, owner: this
	    });
	};

	/**
	 * 绑定字段值
	 * @param {Object} fieldName
	 */
	var ref = function ref(fieldName) {
	    this.createField(fieldName);
	    if (!this.valueChange[fieldName]) this.valueChange[fieldName] = ko.observable(1);
	    return ko.pureComputed({
	        read: function read() {
	            this.valueChange[fieldName]();
	            this.currentRowChange();
	            var row = this.getCurrentRow();
	            if (row) {
	                return row.getChildValue(fieldName);
	            } else return '';
	        },
	        write: function write(value) {
	            var row = this.getCurrentRow();
	            if (row) row.setChildValue(fieldName, value);
	        },
	        owner: this
	    });
	};

	/**
	 * 绑定字段属性
	 * @param {Object} fieldName
	 * @param {Object} key
	 */
	var refMeta = function refMeta(fieldName, key) {
	    if (!this.metaChange[fieldName + '.' + key]) this.metaChange[fieldName + '.' + key] = ko.observable(1);
	    return ko.pureComputed({
	        read: function read() {
	            this.metaChange[fieldName + '.' + key]();
	            this.currentRowChange();
	            return this.getMeta(fieldName, key);
	        },
	        write: function write(value) {
	            this.setMeta(fieldName, key, value);
	        },
	        owner: this
	    });
	};

	var refRowMeta = function refRowMeta(fieldName, key) {
	    if (!this.metaChange[fieldName + '.' + key]) this.metaChange[fieldName + '.' + key] = ko.observable(1);
	    return ko.pureComputed({
	        read: function read() {
	            this.metaChange[fieldName + '.' + key]();
	            this.currentRowChange();
	            var row = this.getCurrentRow();
	            if (row) return row.getMeta(fieldName, key);else return this.getMeta(fieldName, key);
	        },
	        write: function write(value) {
	            var row = this.getCurrentRow();
	            if (row) row.setMeta(fieldName, value);
	        },
	        owner: this
	    });
	};

	var refEnable = function refEnable(fieldName) {
	    return ko.pureComputed({
	        //enable优先级： dataTable.enable >  row上的enable >  field中的enable定义
	        read: function read() {
	            this.enableChange();
	            if (!fieldName) return this.enable;
	            var fieldEnable = this.getRowMeta(fieldName, 'enable');
	            if (typeof fieldEnable == 'undefined' || fieldEnable == null) fieldEnable = true;
	            return fieldEnable && this.enable;
	        },
	        owner: this
	    });
	};

	exports.refSelectedRows = refSelectedRows;
	exports.ref = ref;
	exports.refMeta = refMeta;
	exports.refRowMeta = refRowMeta;
	exports.refEnable = refEnable;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.clear = exports.removeRows = exports.removeAllRows = exports.removeRow = exports.removeRowByRowId = undefined;

	var _util = __webpack_require__(48);

	var removeRowByRowId = function removeRowByRowId(rowId) {
	    var index = this.getIndexByRowId(rowId);
	    if (index != -1) this.removeRow(index);
	}; /**
	    * Module : kero dataTable removeRow
	    * Author : liuyk(liuyk@yonyou.com)
	    * Date   : 2016-08-01 14:34:01
	    */


	var removeRow = function removeRow(index) {
	    if (index instanceof Row) {
	        index = this.getIndexByRowId(index.rowId);
	    }
	    this.removeRows([index]);
	};

	var removeAllRows = function removeAllRows() {
	    this.rows([]);
	    this.selectedIndices([]);
	    this.focusIndex(-1);
	    this.trigger(DataTable.ON_DELETE_ALL);
	    this.updateCurrIndex();
	};

	var removeRows = function removeRows(indices) {
	    indices = (0, _util._formatToIndicesArray)(this, indices);
	    indices = indices.sort();
	    var rowIds = [],
	        rows = this.rows(),
	        deleteRows = [];
	    for (var i = indices.length - 1; i >= 0; i--) {
	        var index = indices[i];
	        var delRow = rows[index];
	        if (delRow == null) {
	            continue;
	        }
	        rowIds.push(delRow.rowId);
	        var deleteRow = rows.splice(index, 1);
	        deleteRows.push(deleteRow[0]);
	        this.updateSelectedIndices(index, '-');
	        this.updateFocusIndex(index, '-');
	    }
	    this.rows(rows);
	    this.deleteRows = deleteRows;
	    this.trigger(DataTable.ON_DELETE, {
	        indices: indices,
	        rowIds: rowIds,
	        deleteRows: deleteRows
	    });
	    this.updateCurrIndex();
	};

	/**
	 * 清空datatable的所有数据以及分页数据以及index
	 */
	var clear = function clear() {
	    this.removeAllRows();
	    this.cachedPages = [];
	    this.totalPages(1);
	    this.pageIndex(0);
	    this.focusIndex(-1);
	    this.selectedIndices([]);
	};

	exports.removeRowByRowId = removeRowByRowId;
	exports.removeRow = removeRow;
	exports.removeAllRows = removeAllRows;
	exports.removeRows = removeRows;
	exports.clear = clear;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports._formatToIndicesArray = exports.isChanged = undefined;

	var _util = __webpack_require__(10);

	var isChanged = function isChanged() {
	    var rows = this.getAllRows();
	    for (var i = 0; i < rows.length; i++) {
	        if (rows[i].status != Row.STATUS.NORMAL) return true;
	    }
	    return false;
	}; /**
	    * Module : kero dataTable util
	    * Author : liuyk(liuyk@yonyou.com)
	    * Date   : 2016-08-08 09:59:01
	    */


	var _formatToIndicesArray = function _formatToIndicesArray(dataTableObj, indices) {
	    if (typeof indices == 'string' || typeof indices == 'number') {
	        indices = [indices];
	    } else if (indices instanceof Row) {
	        indices = dataTableObj.getIndexByRowId(indices.rowId);
	    } else if ((0, _util.isArray)(indices) && indices.length > 0 && indices[0] instanceof Row) {
	        for (var i = 0; i < indices.length; i++) {
	            indices[i] = dataTableObj.getIndexByRowId(indices[i].rowId);
	        }
	    }
	    return indices;
	};

	exports.isChanged = isChanged;
	exports._formatToIndicesArray = _formatToIndicesArray;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.createEmptyRow = exports.insertRows = exports.insertRow = exports.addRows = exports.addRow = exports.setRows = undefined;

	var _util = __webpack_require__(10);

	/**
	 * 设置行数据
	 * @param {Object} rows
	 */
	var setRows = function setRows(rows) {
	    var insertRows = [],
	        _id;
	    for (var i = 0; i < rows.length; i++) {
	        var r = rows[i];
	        _id = r.rowId || r.id;
	        if (!_id) _id = Row.getRandomRowId();
	        if (r.status == Row.STATUS.DELETE) {
	            this.removeRowByRowId(_id);
	        } else {
	            var row = this.getRowByRowId(_id);
	            if (row) {
	                row.updateRow(r);
	                if (!(0, _util.isEmptyObject)(r.data)) {
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
	                row = new Row({ parent: this, id: _id });
	                row.setData(rows[i]);
	                insertRows.push(row);
	            }
	        }
	    }
	    if (insertRows.length > 0) this.addRows(insertRows);
	};

	/**
	 *追加行
	 */
	/**
	 * Module : kero dataTable row
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date	  : 2016-08-01 14:34:01
	 */
	var addRow = function addRow(row) {
	    this.insertRow(this.rows().length, row);
	};

	/**
	 *追加多行
	 */
	var addRows = function addRows(rows) {
	    this.insertRows(this.rows().length, rows);
	};

	var insertRow = function insertRow(index, row) {
	    if (!row) {
	        row = new Row({ parent: this });
	    }
	    this.insertRows(index, [row]);
	};

	var insertRows = function insertRows(index, rows) {
	    var args = [index, 0];
	    for (var i = 0; i < rows.length; i++) {
	        args.push(rows[i]);
	    }
	    this.rows.splice.apply(this.rows, args);

	    this.updateSelectedIndices(index, '+', rows.length);
	    this.updateFocusIndex(index, '+', rows.length);

	    this.trigger(DataTable.ON_INSERT, {
	        index: index,
	        rows: rows
	    });
	    if (this.ns) {
	        if (this.root.valueChange[this.ns]) this.root.valueChange[this.ns](-this.root.valueChange[this.ns]());
	    }
	};

	/**
	 * 创建空行
	 */
	var createEmptyRow = function createEmptyRow() {
	    var r = new Row({ parent: this });
	    this.addRow(r);
	    if (!this.getCurrentRow()) this.setRowSelect(r);
	    return r;
	};

	exports.setRows = setRows;
	exports.addRow = addRow;
	exports.addRows = addRows;
	exports.insertRow = insertRow;
	exports.insertRows = insertRows;
	exports.createEmptyRow = createEmptyRow;

/***/ },
/* 50 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Module : kero dataTable rowCurrent
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date   : 2016-08-08 09:59:01
	 */

	var updateCurrIndex = function updateCurrIndex() {
	    var currentIndex = this.focusIndex() != -1 ? this.focusIndex() : this.getSelectedIndex();
	    if (this._oldCurrentIndex != currentIndex) {
	        this._oldCurrentIndex = currentIndex;
	        this.trigger(DataTable.ON_CURRENT_ROW_CHANGE);
	        this.currentRowChange(-this.currentRowChange());
	        if (this.ns) {
	            if (this.root.valueChange[this.ns]) this.root.valueChange[this.ns](-this.root.valueChange[this.ns]());
	        }
	    }
	};

	exports.updateCurrIndex = updateCurrIndex;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.setRowsDelete = exports.setAllRowsDelete = exports.setRowDelete = undefined;

	var _util = __webpack_require__(48);

	/**
	 * 设置行删除
	 * @param {Object} index
	 */
	var setRowDelete = function setRowDelete(index) {
	    if (index instanceof Row) {
	        index = this.getIndexByRowId(index.rowId);
	    }
	    this.setRowsDelete([index]);
	};

	/**
	 * 设置所有行删除
	 */
	/**
	 * Module : kero dataTable rowDelete
	 * Desc: 不建议使用此库方法
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date   : 2016-08-01 14:34:01
	 */
	var setAllRowsDelete = function setAllRowsDelete() {
	    var indices = new Array(this.rows().length);
	    for (var i = 0; i < indices.length; i++) {
	        indices[i] = i;
	    }
	    this.setRowsDelete(indices);
	};

	/**
	 * 设置行删除
	 * @param {Array} indices
	 */
	var setRowsDelete = function setRowsDelete(indices) {
	    indices = (0, _util._formatToIndicesArray)(this, indices);
	    for (var i = 0; i < indices.length; i++) {
	        var row = this.getRow(indices[i]);
	        if (row.status == Row.STATUS.NEW) {
	            this.rows(this.rows().splice(indices[i], 1));
	            this.updateSelectedIndices(indices[i], '-');
	            this.updateFocusIndex(index, '-');
	        } else {
	            row.status = Row.STATUS.FALSE_DELETE;
	        }
	    }
	    var rowIds = this.getRowIdsByIndices(indices);
	    this.trigger(DataTable.ON_ROW_DELETE, {
	        falseDelete: true,
	        indices: indices,
	        rowIds: rowIds
	    });
	};

	exports.setRowDelete = setRowDelete;
	exports.setAllRowsDelete = setAllRowsDelete;
	exports.setRowsDelete = setRowsDelete;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.updateSelectedIndices = exports.toggleAllSelect = exports.setRowsUnSelect = exports.setRowUnSelect = exports.setAllRowsUnSelect = exports.addRowsSelect = exports.addRowSelect = exports.setRowsSelect = exports.setRowSelect = exports.setAllRowsSelect = undefined;

	var _util = __webpack_require__(10);

	var _util2 = __webpack_require__(48);

	/**
	 * Module : kero dataTable rowSelect
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date   : 2016-08-01 14:34:01
	 */
	var setAllRowsSelect = function setAllRowsSelect() {
	    var indices = new Array(this.rows().length);
	    for (var i = 0; i < indices.length; i++) {
	        indices[i] = i;
	    }
	    this.setRowsSelect(indices);
	    this.allSelected(true);
	    this.trigger(DataTable.ON_ROW_ALLSELECT, {});
	};

	/**
	 * 设置选中行，清空之前已选中的所有行
	 */
	var setRowSelect = function setRowSelect(index) {
	    if (index instanceof Row) {
	        index = this.getIndexByRowId(index.rowId);
	    }
	    this.setRowsSelect([index]);
	    this.setRowFocus(this.getSelectedIndex());
	};

	var setRowsSelect = function setRowsSelect(indices) {
	    indices = indices || -1;
	    if (indices == -1) {
	        this.setAllRowsUnSelect({ quiet: true });
	        return;
	    }
	    indices = (0, _util2._formatToIndicesArray)(this, indices);
	    var sIns = this.selectedIndices();
	    if ((0, _util.isArray)(indices) && (0, _util.isArray)(sIns) && indices.join() == sIns.join()) {
	        // 避免与控件循环触发
	        return;
	    }
	    this.setAllRowsUnSelect({ quiet: true });
	    try {
	        this.selectedIndices(indices);
	    } catch (e) {}

	    var rowIds = this.getRowIdsByIndices(indices);
	    this.currentRowChange(-this.currentRowChange());
	    this.trigger(DataTable.ON_ROW_SELECT, {
	        indices: indices,
	        rowIds: rowIds
	    });
	    this.updateCurrIndex();
	};

	/**
	 * 添加选中行，不会清空之前已选中的行
	 */
	var addRowSelect = function addRowSelect(index) {
	    if (index instanceof Row) {
	        index = this.getIndexByRowId(index.rowId);
	    }
	    this.addRowsSelect([index]);
	};

	/**
	 * 添加选中行，不会清空之前已选中的行
	 */
	var addRowsSelect = function addRowsSelect(indices) {
	    indices = (0, _util2._formatToIndicesArray)(this, indices);
	    var selectedIndices = this.selectedIndices().slice();
	    for (var i = 0; i < indices.length; i++) {
	        var ind = indices[i],
	            toAdd = true;
	        for (var j = 0; j < selectedIndices.length; j++) {
	            if (selectedIndices[j] == ind) {
	                toAdd = false;
	            }
	        }
	        if (toAdd) {
	            selectedIndices.push(indices[i]);
	        }
	    }
	    this.selectedIndices(selectedIndices);
	    var rowIds = this.getRowIdsByIndices(indices);
	    this.trigger(DataTable.ON_ROW_SELECT, {
	        indices: indices,
	        rowIds: rowIds
	    });
	    this.updateCurrIndex();
	};

	/**
	 * 全部取消选中
	 */
	var setAllRowsUnSelect = function setAllRowsUnSelect(options) {
	    this.selectedIndices([]);
	    if (!(options && options.quiet)) {
	        this.trigger(DataTable.ON_ROW_ALLUNSELECT);
	    }
	    this.updateCurrIndex();
	    this.allSelected(false);
	};

	/**
	 * 取消选中
	 */
	var setRowUnSelect = function setRowUnSelect(index) {
	    if (index instanceof Row) {
	        index = this.getIndexByRowId(index.rowId);
	    }
	    this.setRowsUnSelect([index]);
	};

	var setRowsUnSelect = function setRowsUnSelect(indices) {
	    indices = (0, _util2._formatToIndicesArray)(this, indices);
	    var selectedIndices = this.selectedIndices().slice();

	    // 避免与控件循环触发
	    if (selectedIndices.indexOf(indices[0]) == -1) return;

	    for (var i = 0; i < indices.length; i++) {
	        var index = indices[i];
	        var pos = selectedIndices.indexOf(index);
	        if (pos != -1) selectedIndices.splice(pos, 1);
	    }
	    this.selectedIndices(selectedIndices);
	    var rowIds = this.getRowIdsByIndices(indices);
	    this.trigger(DataTable.ON_ROW_UNSELECT, {
	        indices: indices,
	        rowIds: rowIds
	    });
	    this.updateCurrIndex();
	    this.allSelected(false);
	};

	var toggleAllSelect = function toggleAllSelect() {
	    if (this.allSelected()) {
	        this.setAllRowsUnSelect();
	    } else {
	        this.setAllRowsSelect();
	    }
	};

	/**
	 *
	 * @param {Object} index 要处理的起始行索引
	 * @param {Object} type   增加或减少  + -
	 */
	var updateSelectedIndices = function updateSelectedIndices(index, type, num) {
	    if (!(0, _util.isNumber)(num)) {
	        num = 1;
	    }
	    var selectedIndices = this.selectedIndices().slice();
	    if (selectedIndices == null || selectedIndices.length == 0) return;
	    for (var i = 0, count = selectedIndices.length; i < count; i++) {
	        if (type == '+') {
	            if (selectedIndices[i] >= index) selectedIndices[i] = parseInt(selectedIndices[i]) + num;
	        } else if (type == '-') {
	            if (selectedIndices[i] >= index && selectedIndices[i] <= index + num - 1) {
	                selectedIndices.splice(i, 1);
	            } else if (selectedIndices[i] > index + num - 1) selectedIndices[i] = selectedIndices[i] - num;
	        }
	    }
	    this.selectedIndices(selectedIndices);
	};
	exports.setAllRowsSelect = setAllRowsSelect;
	exports.setRowSelect = setRowSelect;
	exports.setRowsSelect = setRowsSelect;
	exports.addRowSelect = addRowSelect;
	exports.addRowsSelect = addRowsSelect;
	exports.setAllRowsUnSelect = setAllRowsUnSelect;
	exports.setRowUnSelect = setRowUnSelect;
	exports.setRowsUnSelect = setRowsUnSelect;
	exports.toggleAllSelect = toggleAllSelect;
	exports.updateSelectedIndices = updateSelectedIndices;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.updateFocusIndex = exports.setRowUnFocus = exports.setRowFocus = undefined;

	var _util = __webpack_require__(10);

	/**
	 * 设置焦点行
	 * @param {Object} index 行对象或者行index
	 * @param quiet 不触发事件
	 * @param force 当index行与已focus的行相等时，仍然触发事件
	 */
	var setRowFocus = function setRowFocus(index, quiet, force) {
	    var rowId = null;
	    if (index instanceof Row) {
	        index = this.getIndexByRowId(index.rowId);
	        rowId = index.rowId;
	    }
	    if (index === -1 || index === this.focusIndex() && !force) {
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
	 */
	/**
	 * Module : kero dataTable rowFocus
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date   : 2016-08-08 09:59:01
	 */
	var setRowUnFocus = function setRowUnFocus() {
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

	var updateFocusIndex = function updateFocusIndex(opIndex, opType, num) {
	    if (!(0, _util.isNumber)(num)) {
	        num = 1;
	    }
	    if (opIndex <= this.focusIndex() && this.focusIndex() != -1) {
	        if (opType === '+') {
	            this.focusIndex(this.focusIndex() + num);
	        } else if (opType === '-') {
	            if (this.focusIndex() >= opIndex && this.focusIndex() <= opIndex + num - 1) {
	                this.focusIndex(this.focusIndex() - 1);
	            } else if (this.focusIndex() > opIndex + num - 1) {
	                this.focusIndex(this.focusIndex() - num);
	            }
	        }
	    }
	};

	exports.setRowFocus = setRowFocus;
	exports.setRowUnFocus = setRowUnFocus;
	exports.updateFocusIndex = updateFocusIndex;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.addSimpleData = exports.setSimpleData = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                   * Module : kero dataTable simpleData
	                                                                                                                                                                                                                                                   * Author : liuyk(liuyk@yonyou.com)
	                                                                                                                                                                                                                                                   * Date	  : 2016-08-01 14:34:01
	                                                                                                                                                                                                                                                   */


	var _util = __webpack_require__(10);

	/**
	 * 设置数据, 只设置字段值
	 * @param {array} data
	 *options{} unSelect为true：不选中，为false则选中，默认选中0行
	 */
	var setSimpleData = function setSimpleData(data, options) {
	    this.removeAllRows();
	    this.cachedPages = [];
	    this.focusIndex(-1);
	    this.selectedIndices([]);

	    if (!data) {
	        // throw new Error("dataTable.setSimpleData param can't be null!");
	        return;
	    }

	    var rows = [];
	    if (!(0, _util.isArray)(data)) data = [data];
	    for (var i = 0; i < data.length; i++) {
	        var _data = data[i];
	        /* 判断data中的字段在datatable中是否存在，如果不存在则创建 */
	        // for(var f in _data){
	        //     this.createField(f)
	        // }
	        if (_typeof(data[i]) !== 'object') _data = { $data: data[i] };
	        rows.push({
	            status: Row.STATUS.NORMAL,
	            data: _data
	        });
	    }
	    var _data = {
	        rows: rows
	    };
	    this.setData(_data, options);
	};

	/**
	 * 追加数据
	 * @param data
	 */
	var addSimpleData = function addSimpleData(data, status) {
	    if (!data) {
	        throw new Error("dataTable.addSimpleData param can't be null!");
	    }
	    if (!(0, _util.isArray)(data)) data = [data];
	    for (var i = 0; i < data.length; i++) {
	        var r = this.createEmptyRow();
	        r.setSimpleData(data[i], status);
	    }
	};

	exports.setSimpleData = setSimpleData;
	exports.addSimpleData = addSimpleData;

/***/ },
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.date = undefined;

	var _core = __webpack_require__(71);

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
/* 71 */
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


	var _extend = __webpack_require__(8);

	var _util = __webpack_require__(10);

	var _cookies = __webpack_require__(72);

	var _enumerables = __webpack_require__(9);

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
		} else return (0, _extend.extend)({}, maskerMeta[type]);
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
/* 72 */
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
/* 73 */,
/* 74 */,
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.u = undefined;

	var _extend = __webpack_require__(8);

	var _baseAdapter = __webpack_require__(76);

	var _checkbox = __webpack_require__(77);

	var _ckeditor = __webpack_require__(88);

	var _combobox = __webpack_require__(89);

	var _currency = __webpack_require__(92);

	var _datetime = __webpack_require__(96);

	var _float = __webpack_require__(94);

	var _grid = __webpack_require__(98);

	var _integer = __webpack_require__(101);

	var _month = __webpack_require__(108);

	var _nativeCheckbox = __webpack_require__(110);

	var _nativeRadio = __webpack_require__(111);

	var _pagination = __webpack_require__(112);

	var _password = __webpack_require__(105);

	var _percent = __webpack_require__(106);

	var _string = __webpack_require__(100);

	var _progress = __webpack_require__(114);

	var _radio = __webpack_require__(102);

	var _switch = __webpack_require__(116);

	var _textarea = __webpack_require__(118);

	var _textfield = __webpack_require__(119);

	var _time = __webpack_require__(120);

	var _url = __webpack_require__(104);

	var _year = __webpack_require__(123);

	var _yearmonth = __webpack_require__(125);

	var _tree = __webpack_require__(127);

	var _enableMixin = __webpack_require__(79);

	var _requiredMixin = __webpack_require__(80);

	var _validateMixin = __webpack_require__(81);

	var _valueMixin = __webpack_require__(78);

	// console.log(TextAreaAdapter);

	var ex = {
		BaseAdapter: _baseAdapter.BaseAdapter,
		CheckboxAdapter: _checkbox.CheckboxAdapter,
		CkEditorAdapter: _ckeditor.CkEditorAdapter,
		ComboboxAdapter: _combobox.ComboboxAdapter,
		CurrencyAdapter: _currency.CurrencyAdapter,
		DateTimeAdapter: _datetime.DateTimeAdapter,
		FloatAdapter: _float.FloatAdapter,
		IntegerAdapter: _integer.IntegerAdapter,
		MonthAdapter: _month.MonthAdapter,
		NativeCheckAdapter: _nativeCheckbox.NativeCheckAdapter,
		NativeRadioAdapter: _nativeRadio.NativeRadioAdapter,
		PaginationAdapter: _pagination.PaginationAdapter,
		PassWordAdapter: _password.PassWordAdapter,
		PercentAdapter: _percent.PercentAdapter,
		StringAdapter: _string.StringAdapter,
		ProgressAdapter: _progress.ProgressAdapter,
		RadioAdapter: _radio.RadioAdapter,
		SwitchAdapter: _switch.SwitchAdapter,
		TextAreaAdapter: _textarea.TextAreaAdapter,
		TextFieldAdapter: _textfield.TextFieldAdapter,
		TimeAdapter: _time.TimeAdapter,
		UrlAdapter: _url.UrlAdapter,
		YearAdapter: _year.YearAdapter,
		YearMonthAdapter: _yearmonth.YearMonthAdapter,
		EnableMixin: _enableMixin.EnableMixin,
		RequiredMixin: _requiredMixin.RequiredMixin,
		ValidateMixin: _validateMixin.ValidateMixin,
		ValueMixin: _valueMixin.ValueMixin
	}; /**
	    * Module : Kero webpack entry index
	    * Author : Kvkens(yueming@yonyou.com)
	    * Date	  : 2016-08-10 14:51:05
	    */


	(0, _extend.extend)(ex, window.u || {});
	window.u = ex;
	exports.u = ex;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.BaseAdapter = undefined;

	var _class = __webpack_require__(12);

	var _util = __webpack_require__(10);

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
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.CheckboxAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _valueMixin = __webpack_require__(78);

	var _enableMixin = __webpack_require__(79);

	var _requiredMixin = __webpack_require__(80);

	var _validateMixin = __webpack_require__(81);

	var _util = __webpack_require__(10);

	var _neouiCheckbox = __webpack_require__(86);

	var _compMgr = __webpack_require__(4);

	var _dom = __webpack_require__(5);

	var _event = __webpack_require__(6);

	/**
	 * Module : Kero Check Adapter
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-08 15:50:03
	 */

	var CheckboxAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _enableMixin.EnableMixin, _requiredMixin.RequiredMixin, _validateMixin.ValidateMixin],
	    init: function init(options) {
	        var self = this;
	        // CheckboxAdapter.superclass.initialize.apply(this, arguments); 
	        this.isGroup = this.options['isGroup'] === true || this.options['isGroup'] === 'true';
	        this.otherValue = this.options['otherValue'] || 'ovOV~!';
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

	            // 由于不同浏览器input的value不一样，所以默认checkedValue修改为true

	            this.checkedValue = this.options['checkedValue'] || true;
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
	            self.otherInput = (0, _dom.makeDOM)('<input disabled type="text">');
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
	                    var oldIndex = valueArr.indexOf(self.otherInput.oldValue);
	                    if (oldIndex > -1) {
	                        valueArr.splice(oldIndex, 1);
	                    }
	                    if (self.otherInput.value) {
	                        valueArr.push(self.otherInput.value);
	                    }
	                    var otherValueIndex = valueArr.indexOf(self.otherValue);
	                    if (otherValueIndex < 0) {
	                        valueArr.push(self.otherValue);
	                    }

	                    // 选中后可编辑
	                    comp.element.querySelectorAll('input[type="text"]').forEach(function (ele) {
	                        ele.removeAttribute('disabled');
	                    });
	                } else {
	                    var index = valueArr.indexOf(self.otherInput.value);
	                    if (index > -1) {
	                        valueArr.splice(index, 1);
	                    }

	                    var otherValueIndex = valueArr.indexOf(self.otherValue);
	                    if (otherValueIndex > -1) {
	                        valueArr.splice(otherValueIndex, 1);
	                    }

	                    // 未选中则不可编辑
	                    comp.element.querySelectorAll('input[type="text"]').forEach(function (ele) {
	                        ele.setAttribute('disabled', 'true');
	                    });
	                }
	                //self.slice = true;
	                self.dataModel.setValue(self.field, valueArr.join(','));
	                //self.slice = false;
	            });

	            (0, _event.on)(self.otherInput, 'blur', function (e) {
	                self.lastCheck.value = this.value;
	                self.otherComp.trigger('change');
	                this.oldValue = this.value;
	            });
	            (0, _event.on)(self.otherInput, 'click', function (e) {
	                (0, _event.stopEvent)(e);
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
	                var otherVal = '';
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
	                if (otherVal.indexOf(this.otherValue + ',') > -1) {
	                    self.lastCheck.value = this.otherValue;
	                    otherVal = otherVal.replace(this.otherValue + ',', '');
	                }
	                otherVal = otherVal.replace(/\,/g, '');
	                if (otherVal) {
	                    self.otherInput.oldValue = otherVal;
	                    self.otherInput.value = otherVal;
	                    self.otherInput.removeAttribute('disabled');
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
/* 78 */
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
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.EnableMixin = undefined;

	var _dom = __webpack_require__(5);

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
/* 80 */
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
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ValidateMixin = undefined;

	var _neouiValidate = __webpack_require__(82);

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
	            reg: this.regExp,
	            showFix: this.showFix
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
/* 82 */
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


	var _BaseComponent = __webpack_require__(83);

	var _extend = __webpack_require__(8);

	var _dom = __webpack_require__(5);

	var _event = __webpack_require__(6);

	var _util = __webpack_require__(10);

	var _neouiTooltip = __webpack_require__(84);

	var _i18n = __webpack_require__(85);

	var _compMgr = __webpack_require__(4);

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
			this.min = (0, _util.isNumber)(this.min) ? this.min : null;
			this.max = (0, _util.isNumber)(this.max) ? this.max : null;
			this.minNotEq = (0, _util.isNumber)(this.minNotEq) ? this.minNotEq : null;
			this.maxNotEq = (0, _util.isNumber)(this.maxNotEq) ? this.maxNotEq : null;
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
		// "phone": /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/,
		"phone": /^1[3|4|5|7|8]\d{9}$/,
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
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.BaseComponent = undefined;

	var _class = __webpack_require__(12);

	var _util = __webpack_require__(10);

	var _event = __webpack_require__(6);

	var _compMgr = __webpack_require__(4);

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
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Tooltip = undefined;

	var _extend = __webpack_require__(8);

	var _event = __webpack_require__(6);

	var _dom = __webpack_require__(5);

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
/* 85 */
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

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Checkbox = undefined;

	var _BaseComponent = __webpack_require__(83);

	var _dom = __webpack_require__(5);

	var _event = __webpack_require__(6);

	var _ripple = __webpack_require__(87);

	var _compMgr = __webpack_require__(4);

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
	                if (e.target.nodeName != 'INPUT') {
	                    if (!this._inputElement.disabled) {
	                        this.toggle();
	                        (0, _event.stopEvent)(e);
	                    }
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
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.URipple = exports.Ripple = undefined;

	var _env = __webpack_require__(7);

	var _dom = __webpack_require__(5);

	var _event = __webpack_require__(6);

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
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.CkEditorAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _valueMixin = __webpack_require__(78);

	var _enableMixin = __webpack_require__(79);

	var _requiredMixin = __webpack_require__(80);

	var _validateMixin = __webpack_require__(81);

	var _compMgr = __webpack_require__(4);

	/**
	 * Module : Kero webpack entry index
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-09 09:52:13
	 */
	var CkEditorAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _enableMixin.EnableMixin, _requiredMixin.RequiredMixin, _validateMixin.ValidateMixin],
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
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ComboboxAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _valueMixin = __webpack_require__(78);

	var _enableMixin = __webpack_require__(79);

	var _requiredMixin = __webpack_require__(80);

	var _validateMixin = __webpack_require__(81);

	var _util = __webpack_require__(10);

	var _neouiCombo = __webpack_require__(90);

	var _env = __webpack_require__(7);

	var _event = __webpack_require__(6);

	var _dom = __webpack_require__(5);

	var _compMgr = __webpack_require__(4);

	var ComboboxAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _enableMixin.EnableMixin, _requiredMixin.RequiredMixin, _validateMixin.ValidateMixin],
	    init: function init() {
	        var self = this;
	        //ComboboxAdapter.superclass.initialize.apply(this, arguments);
	        this.datasource = (0, _util.getJSObject)(this.viewModel, this.options['datasource']);
	        this.mutil = this.options.mutil || false;
	        this.onlySelect = this.options.onlySelect || false;
	        this.showFix = this.options.showFix || false;
	        this.validType = 'combobox';
	        this.isAutoTip = this.options.isAutoTip || false;
	        this.comp = new _neouiCombo.Combo({ el: this.element, mutilSelect: this.mutil, onlySelect: this.onlySelect, showFix: this.showFix, isAutoTip: this.isAutoTip });
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
	        //下面两句会在校验中用到
	        this.trueValue = this.formater ? this.formater.format(value) : value;
	        this.element.trueValue = this.trueValue;
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
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Combo = undefined;

	var _BaseComponent = __webpack_require__(83);

	var _dom = __webpack_require__(5);

	var _env = __webpack_require__(7);

	var _event = __webpack_require__(6);

	var _neouiTextfield = __webpack_require__(91);

	var _ripple = __webpack_require__(87);

	var _compMgr = __webpack_require__(4);

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

	        this.isAutoTip = this.options['isAutoTip'] || false; //是否支持自动提示
	        //if (hasClass(this.element, 'is-auto-tip')){
	        //    this.isAutoTip = true;
	        //}
	        (0, _event.on)(this._input, 'keydown', function (e) {
	            var keyCode = e.keyCode;

	            if (self.isAutoTip) {
	                switch (keyCode) {
	                    case 38:
	                        // up
	                        u.stopEvent(e);
	                        break;
	                    case 40:
	                        // down
	                        u.stopEvent(e);
	                        break;
	                    case 9: // tab
	                    case 13:
	                        // return
	                        // make sure to blur off the current field
	                        // self.element.blur();
	                        u.stopEvent(e);
	                        break;
	                    default:
	                        if (self.timeout) clearTimeout(self.timeout);
	                        self.timeout = setTimeout(function () {
	                            self.onChange();
	                        }, 400);
	                        break;
	                }
	            } else {
	                // 回车
	                if (keyCode == 13) this.blur();
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

	    //输入框内容发生变化时修改提示词.
	    onChange: function onChange() {
	        var v = this._input.value;
	        if (!v) v = '';
	        var filterData = [];
	        for (var i = 0, len = this.initialComboData.length; i < len; i++) {
	            if (this.initialComboData[i].name.indexOf(v) >= 0 || this.initialComboData[i].value.indexOf(v) >= 0) {
	                filterData.push(this.initialComboData[i]);
	            }
	        }
	        this.setComboData(filterData);
	        this.show();
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

	        //统一指定datas格式为[{name:"",value:""}].
	        if (!options) this.comboDatas = datas;else {
	            this.comboDatas = [];
	            for (var i = 0; i < datas.length; i++) {
	                this.comboDatas.push({ name: datas[i][options.name], value: datas[i][options.value] });
	            }
	        }

	        //将初始数据保留一份,以便input输入内容改变时自动提示的数据从全部数据里头筛选.
	        if (!(this.initialComboData && this.initialComboData.length)) {
	            this.initialComboData = this.comboDatas;
	        }

	        //若没有下拉的ul,新生成一个ul结构.
	        if (!this._ul) {
	            this._ul = (0, _dom.makeDOM)('<ul class="u-combo-ul"></ul>');
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
	            /*实际上input的高度并不需要调整*/
	            /*var h = this._combo_name_par.offsetHeight;
	            if(h < 25){
	                h = 25;
	                this._input.style.height = h + 'px';
	            }*/
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
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Text = undefined;

	var _BaseComponent = __webpack_require__(83);

	var _dom = __webpack_require__(5);

	var _env = __webpack_require__(7);

	var _event = __webpack_require__(6);

	var _compMgr = __webpack_require__(4);

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
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.CurrencyAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _valueMixin = __webpack_require__(78);

	var _enableMixin = __webpack_require__(79);

	var _requiredMixin = __webpack_require__(80);

	var _validateMixin = __webpack_require__(81);

	var _util = __webpack_require__(10);

	var _neouiCheckbox = __webpack_require__(86);

	var _indexDataTable = __webpack_require__(29);

	var _formater = __webpack_require__(93);

	var _float = __webpack_require__(94);

	var _compMgr = __webpack_require__(4);

	var _core = __webpack_require__(71);

	var _masker = __webpack_require__(95);

	/**
	 * 货币控件
	 */
	/**
	 * Module : Kero currency
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-09 13:42:14
	 */

	var CurrencyAdapter = _float.FloatAdapter.extend({
	    init: function init() {
	        var self = this;
	        CurrencyAdapter.superclass.init.apply(this);
	        this.maskerMeta = _core.core.getMaskerMeta('currency') || {};
	        this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
	        this.maskerMeta.curSymbol = this.getOption('curSymbol') || this.maskerMeta.curSymbol;
	        this.validType = 'float';
	        this.dataModel.on(this.field + '.curSymbol.' + _indexDataTable.DataTable.ON_CURRENT_META_CHANGE, function (event) {
	            self.setCurSymbol(event.newValue);
	        });
	        this.formater = new _formater.NumberFormater(this.maskerMeta.precision);
	        this.masker = new _masker.CurrencyMasker(this.maskerMeta);
	    },
	    /**
	     * 修改精度
	     * @param {Integer} precision
	     */
	    setPrecision: function setPrecision(precision) {
	        if (this.maskerMeta.precision == precision) return;
	        this.maskerMeta.precision = precision;
	        this.formater = new _formater.NumberFormater(this.maskerMeta.precision);
	        this.masker = new _masker.CurrencyMasker(this.maskerMeta);
	        var currentRow = this.dataModel.getCurrentRow();
	        if (currentRow) {
	            var v = this.dataModel.getCurrentRow().getValue(this.field);
	            this.showValue = this.masker.format(this.formater.format(v)).value;
	        } else {
	            this.showValue = this.masker.format(this.formater.format(this.trueValue)).value;
	        }
	        this.setShowValue(this.showValue);
	    },
	    /**
	     * 修改币符
	     * @param {String} curSymbol
	     */
	    setCurSymbol: function setCurSymbol(curSymbol) {
	        if (this.maskerMeta.curSymbol == curSymbol) return;
	        this.maskerMeta.curSymbol = curSymbol;
	        this.masker.formatMeta.curSymbol = this.maskerMeta.curSymbol;
	        this.element.trueValue = this.trueValue;
	        this.showValue = this.masker.format(this.trueValue).value;
	        this.setShowValue(this.showValue);
	    },
	    onFocusin: function onFocusin(e) {
	        var v = this.getValue(),
	            vstr = v + '',
	            focusValue = v;
	        if ((0, _util.isNumber)(v) && (0, _util.isNumber)(this.maskerMeta.precision)) {
	            if (vstr.indexOf('.') >= 0) {
	                var sub = vstr.substr(vstr.indexOf('.') + 1);
	                if (sub.length < this.maskerMeta.precision || parseInt(sub.substr(this.maskerMeta.precision)) == 0) {
	                    focusValue = this.formater.format(v);
	                }
	            } else if (this.maskerMeta.precision > 0) {
	                focusValue = this.formater.format(v);
	            }
	        }
	        this.setShowValue(focusValue);
	    }
	});

	_compMgr.compMgr.addDataAdapter({
	    adapter: CurrencyAdapter,
	    name: 'currency'
	});

	exports.CurrencyAdapter = CurrencyAdapter;

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.DateFormater = exports.NumberFormater = undefined;

	var _util = __webpack_require__(10);

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
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.FloatAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _valueMixin = __webpack_require__(78);

	var _enableMixin = __webpack_require__(79);

	var _requiredMixin = __webpack_require__(80);

	var _validateMixin = __webpack_require__(81);

	var _event = __webpack_require__(6);

	var _dom = __webpack_require__(5);

	var _core = __webpack_require__(71);

	var _formater = __webpack_require__(93);

	var _dateUtils = __webpack_require__(70);

	var _compMgr = __webpack_require__(4);

	var _masker = __webpack_require__(95);

	var _util = __webpack_require__(10);

	var FloatAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _enableMixin.EnableMixin, _requiredMixin.RequiredMixin, _validateMixin.ValidateMixin],
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
	        this.masker = new _masker.NumberMasker(this.maskerMeta);
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

	        (0, _event.on)(this.element, 'keydown', function (e) {
	            if (self.enable) {
	                var code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
	                if (!(code >= 48 && code <= 57 || code == 37 || code == 39 || code == 8 || code == 46)) {
	                    //阻止默认浏览器动作(W3C)
	                    if (e && e.preventDefault) e.preventDefault();
	                    //IE中阻止函数器默认动作的方式
	                    else window.event.returnValue = false;
	                    return false;
	                }
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
	        this.masker = new _masker.NumberMasker(this.maskerMeta);
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
	        if ((0, _util.isNumber)(v) && (0, _util.isNumber)(this.maskerMeta.precision)) {
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
	}); /**
	     * Module : Kero float adapter
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-09 15:16:08
	     */


	_compMgr.compMgr.addDataAdapter({
	    adapter: FloatAdapter,
	    name: 'float'
	});

	exports.FloatAdapter = FloatAdapter;

/***/ },
/* 95 */
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

	var _extend = __webpack_require__(8);

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
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.DateTimeAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _valueMixin = __webpack_require__(78);

	var _enableMixin = __webpack_require__(79);

	var _requiredMixin = __webpack_require__(80);

	var _validateMixin = __webpack_require__(81);

	var _event = __webpack_require__(6);

	var _dom = __webpack_require__(5);

	var _core = __webpack_require__(71);

	var _indexDataTable = __webpack_require__(29);

	var _env = __webpack_require__(7);

	var _neouiDatetimepicker = __webpack_require__(97);

	var _dateUtils = __webpack_require__(70);

	var _compMgr = __webpack_require__(4);

	var DateTimeAdapter = _baseAdapter.BaseAdapter.extend({
		mixins: [_valueMixin.ValueMixin, _enableMixin.EnableMixin, _requiredMixin.RequiredMixin, _validateMixin.ValidateMixin],
		init: function init(options) {
			var self = this,
			    adapterType,
			    format;
			// DateTimeAdapter.superclass.initialize.apply(this, arguments);
			if (this.options.type === 'u-date') {
				this.adapterType = 'date';
			} else {
				this.adapterType = 'datetime';
				(0, _dom.addClass)(this.element, 'time');
			}

			this.maskerMeta = _core.core.getMaskerMeta(this.adapterType) || {};
			this.maskerMeta.format = this.options['format'] || this.maskerMeta.format;
			if (this.dataModel) {
				this.dataModel.on(this.field + '.format.' + _indexDataTable.DataTable.ON_CURRENT_META_CHANGE, function (event) {
					self.setFormat(event.newValue);
				});
			}

			if (this.dataModel && !this.options['format']) this.options.format = this.dataModel.getMeta(this.field, "format");

			if (!this.options['format']) {
				if (this.options.type === 'u-date') {
					this.options.format = "YYYY-MM-DD";
				} else {
					this.options.format = "YYYY-MM-DD HH:mm:ss";
				}
			}
			format = this.options.format;
			this.maskerMeta.format = format || this.maskerMeta.format;

			this.startField = this.options.startField ? this.options.startField : this.dataModel.getMeta(this.field, "startField");

			// this.formater = new $.DateFormater(this.maskerMeta.format);
			// this.masker = new DateTimeMasker(this.maskerMeta);
			var op;
			if (_env.env.isMobile) {
				op = {
					theme: "ios",
					mode: "scroller",
					lang: "zh",
					cancelText: null,
					onSelect: function onSelect(val) {
						self.setValue(val);
					}
				};
				this._span = this.element.querySelector("span");
				this.element = this.element.querySelector("input");
				this.element.setAttribute('readonly', 'readonly');
				if (this._span) {
					(0, _event.on)(this._span, 'click', function (e) {
						self.element.focus();
						(0, _event.stopEvent)(e);
					});
				}
				if (this.adapterType == 'date') {
					$(this.element).mobiscroll().date(op);
				} else {
					$(this.element).mobiscroll().datetime(op);
				}
			} else {
				this.comp = new _neouiDatetimepicker.DateTimePicker({ el: this.element, format: this.maskerMeta.format, showFix: this.options.showFix });
			}

			this.element['u.DateTimePicker'] = this.comp;

			if (!_env.env.isMobile) {
				this.comp.on('select', function (event) {
					self.setValue(event.value);
				});
			}
			if (this.dataModel) {
				this.dataModel.ref(this.field).subscribe(function (value) {
					self.modelValueChange(value);
				});
				if (this.startField) {
					this.dataModel.ref(this.startField).subscribe(function (value) {
						if (_env.env.isMobile) {
							var valueObj = _dateUtils.date.getDateObj(value);
							op.minDate = valueObj;
							if (self.adapterType == 'date') {
								$(self.element).mobiscroll().date(op);
							} else {
								$(self.element).mobiscroll().datetime(op);
							}
							var nowDate = _dateUtils.date.getDateObj(self.dataModel.getValue(self.field));
							if (nowDate < valueObj || !value) {
								self.dataModel.setValue(self.field, '');
							}
						} else {
							self.comp.setStartDate(value);
							if (self.comp.date < _dateUtils.date.getDateObj(value) || !value) {
								self.dataModel.setValue(self.field, '');
							}
						}
					});
				}
				if (this.startField) {
					var startValue = this.dataModel.getValue(this.startField);
					if (startValue) {
						if (_env.env.isMobile) {
							op.minDate = _dateUtils.date.getDateObj(startValue);
							if (this.adapterType == 'date') {
								$(this.element).mobiscroll().date(op);
							} else {
								$(this.element).mobiscroll().datetime(op);
							}
						} else {
							self.comp.setStartDate(startValue);
						}
					}
				}
			}
		},
		modelValueChange: function modelValueChange(value) {
			if (this.slice) return;
			this.trueValue = value;
			if (_env.env.isMobile) {
				if (value) {
					value = _dateUtils.date.format(value, this.options.format);
					$(this.element).scroller('setDate', _dateUtils.date.getDateObj(value), true);
				}
			} else {
				this.comp.setDate(value);
			}
		},
		setFormat: function setFormat(format) {
			if (this.maskerMeta.format == format) return;
			this.options.format = format;
			this.maskerMeta.format = format;
			if (!_env.env.isMobile) this.comp.setFormat(format);
			// this.formater = new $.DateFormater(this.maskerMeta.format);
			// this.masker = new DateTimeMasker(this.maskerMeta);
		},
		setValue: function setValue(value) {
			value = _dateUtils.date.format(value, this.options.format);
			this.trueValue = this.formater ? this.formater.format(value) : value;
			this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
			this.setShowValue(this.showValue);
			this.slice = true;
			this.dataModel.setValue(this.field, this.trueValue);
			this.slice = false;
		},
		setEnable: function setEnable(enable) {
			if (enable === true || enable === 'true') {
				this.enable = true;
				if (_env.env.isMobile) {
					this.element.removeAttribute('disabled');
				} else {
					this.comp._input.removeAttribute('readonly');
				}
				(0, _dom.removeClass)(this.element.parentNode, 'disablecover');
			} else if (enable === false || enable === 'false') {
				this.enable = false;
				if (_env.env.isMobile) {
					this.element.setAttribute('disabled', 'disabled');
				} else {
					this.comp._input.setAttribute('readonly', 'readonly');
				}
				(0, _dom.addClass)(this.element.parentNode, 'disablecover');
			}
			if (!_env.env.isMobile) this.comp.setEnable(enable);
		}

	}); /**
	     * Module : Kero datetime
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-09 14:59:37
	     */

	_compMgr.compMgr.addDataAdapter({
		adapter: DateTimeAdapter,
		name: 'u-date'
	});

	_compMgr.compMgr.addDataAdapter({
		adapter: DateTimeAdapter,
		name: 'u-datetime'
	});

	exports.DateTimeAdapter = DateTimeAdapter;

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.DateTimePicker = undefined;

	var _extend = __webpack_require__(8);

	var _BaseComponent = __webpack_require__(83);

	var _env = __webpack_require__(7);

	var _event = __webpack_require__(6);

	var _dom = __webpack_require__(5);

	var _core = __webpack_require__(71);

	var _dateUtils = __webpack_require__(70);

	var _neouiValidate = __webpack_require__(82);

	var _compMgr = __webpack_require__(4);

	var _ripple = __webpack_require__(87);

	var DateTimePicker = _BaseComponent.BaseComponent.extend({});

	DateTimePicker.fn = DateTimePicker.prototype;

	DateTimePicker.fn.init = function () {

	    var self = this,
	        _fmt,
	        _defaultFmt;
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

	    // if(env.isMobile){
	    //     // setTimeout(function(){
	    //     //     self._input.setAttribute('readonly','readonly');
	    //     // },1000);
	    // }

	    setTimeout(function () {
	        self._input.setAttribute('readonly', 'readonly');
	    }, 1000);

	    (0, _event.on)(this._input, 'focus', function (e) {
	        // 用来关闭键盘
	        /*if(env.isMobile)
	            this.blur();*/
	        self._inputFocus = true;
	        if (self.isShow !== true) {
	            self.show(e);
	        }
	        (0, _event.stopEvent)(e);
	    });

	    (0, _event.on)(this._input, 'blur', function (e) {
	        self._inputFocus = false;
	    });
	    this._span = this._element.querySelector("span");
	    if (this._span) {
	        (0, _event.on)(this._span, 'click', function (e) {
	            // if (self.isShow !== true){
	            //     self.show(e);
	            // }
	            self._input.focus();
	            (0, _event.stopEvent)(e);
	        });
	    }

	    if ((0, _dom.hasClass)(this._element, 'time')) {
	        this.type = 'datetime';
	        _defaultFmt = 'YYYY-MM-DD hh:mm:ss';
	    } else {
	        this.type = 'date';
	        _defaultFmt = 'YYYY-MM-DD';
	    }
	    _fmt = this._element.getAttribute("format");
	    this.format = _fmt || this.options['format'] || _defaultFmt;
	    this.isShow = false;
	};

	/**
	 * 轮播动画效果
	 * @private
	 */
	DateTimePicker.fn._carousel = function (newPage, direction) {
	    if (direction == 'left') {
	        (0, _dom.addClass)(newPage, 'right-page');
	    } else {
	        (0, _dom.addClass)(newPage, 'left-page');
	    }
	    this._dateContent.appendChild(newPage);
	    if (_env.env.isIE8 || _env.env.isIE9 || _env.env.isFF) {
	        // this._dateContent.removeChild(this.contentPage);
	        var pages = this._dateContent.querySelectorAll('.u-date-content-page');
	        for (i = 0; i < pages.length; i++) {
	            this._dateContent.removeChild(pages[i]);
	        }
	        this.contentPage = newPage;
	        this._dateContent.appendChild(newPage);
	        if (direction == 'left') {
	            (0, _dom.removeClass)(newPage, 'right-page');
	        } else {
	            (0, _dom.removeClass)(newPage, 'left-page');
	        }
	    } else {

	        var cleanup = function () {
	            newPage.removeEventListener('transitionend', cleanup);
	            newPage.removeEventListener('webkitTransitionEnd', cleanup);
	            // this._dateContent.removeChild(this.contentPage);
	            var pages = this._dateContent.querySelectorAll('.u-date-content-page');
	            for (i = 0; i < pages.length; i++) {
	                this._dateContent.removeChild(pages[i]);
	            }
	            this.contentPage = newPage;
	            this._dateContent.appendChild(newPage);
	        }.bind(this);

	        newPage.addEventListener('transitionend', cleanup);
	        newPage.addEventListener('webkitTransitionEnd', cleanup);
	        if (window.requestAnimationFrame) window.requestAnimationFrame(function () {
	            if (direction == 'left') {
	                (0, _dom.addClass)(this.contentPage, 'left-page');
	                (0, _dom.removeClass)(newPage, 'right-page');
	            } else {
	                (0, _dom.addClass)(this.contentPage, 'right-page');
	                (0, _dom.removeClass)(newPage, 'left-page');
	            }
	        }.bind(this));
	    }
	};

	/**
	 * 淡入动画效果
	 * @private
	 */
	DateTimePicker.fn._zoomIn = function (newPage) {
	    if (!this.contentPage) {
	        this._dateContent.appendChild(newPage);
	        this.contentPage = newPage;
	        return;
	    }
	    (0, _dom.addClass)(newPage, 'zoom-in');
	    this._dateContent.appendChild(newPage);
	    if (_env.env.isIE8 || _env.env.isIE9 || _env.env.isFF) {
	        var pages = this._dateContent.querySelectorAll('.u-date-content-page');
	        for (i = 0; i < pages.length; i++) {
	            this._dateContent.removeChild(pages[i]);
	        }
	        // this._dateContent.removeChild(this.contentPage);
	        this.contentPage = newPage;
	        this._dateContent.appendChild(newPage);
	        (0, _dom.removeClass)(newPage, 'zoom-in');
	    } else {
	        var cleanup = function () {
	            newPage.removeEventListener('transitionend', cleanup);
	            newPage.removeEventListener('webkitTransitionEnd', cleanup);
	            // this._dateContent.removeChild(this.contentPage);
	            var pages = this._dateContent.querySelectorAll('.u-date-content-page');
	            for (i = 0; i < pages.length; i++) {
	                this._dateContent.removeChild(pages[i]);
	            }
	            this.contentPage = newPage;
	            this._dateContent.appendChild(newPage);
	        }.bind(this);
	        if (this.contentPage) {
	            newPage.addEventListener('transitionend', cleanup);
	            newPage.addEventListener('webkitTransitionEnd', cleanup);
	        }
	        if (window.requestAnimationFrame) window.requestAnimationFrame(function () {
	            (0, _dom.addClass)(this.contentPage, 'is-hidden');
	            (0, _dom.removeClass)(newPage, 'zoom-in');
	        }.bind(this));
	    }
	};

	/**
	 *填充年份选择面板
	 * @private
	 */
	DateTimePicker.fn._fillYear = function (type) {
	    var year,
	        template,
	        yearPage,
	        titleDiv,
	        yearDiv,
	        _year,
	        i,
	        cell,
	        language,
	        year,
	        month,
	        date,
	        time,
	        self = this;
	    template = ['<div class="u-date-content-page">', '<div class="u-date-content-title">',
	    /*'<div class="u-date-content-title-year"></div>-',
	    '<div class="u-date-content-title-month"></div>-',
	    '<div class="u-date-content-title-date"></div>',
	    '<div class="u-date-content-title-time"></div>',*/
	    '</div>', '<div class="u-date-content-panel"></div>', '</div>'].join("");
	    type = type || 'current';
	    _year = this.pickerDate.getFullYear();
	    if ('current' === type) {
	        this.startYear = _year - _year % 10 - 1;
	    } else if (type === 'preivous') {
	        this.startYear = this.startYear - 10;
	    } else {
	        this.startYear = this.startYear + 10;
	    }
	    yearPage = (0, _dom.makeDOM)(template);
	    // titleDiv = yearPage.querySelector('.u-date-content-title');
	    // titleDiv.innerHTML = (this.startYear - 1) + '-' + (this.startYear + 11);
	    language = _core.core.getLanguages();
	    year = _dateUtils.date._formats['YYYY'](this.pickerDate);
	    month = _dateUtils.date._formats['MM'](this.pickerDate, language);
	    date = _dateUtils.date._formats['DD'](this.pickerDate, language);
	    time = _dateUtils.date._formats['HH'](this.pickerDate, language) + ':' + _dateUtils.date._formats['mm'](this.pickerDate, language) + ':' + _dateUtils.date._formats['ss'](this.pickerDate, language);

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
	    for (i = 0; i < 12; i++) {

	        cell = (0, _dom.makeDOM)('<div class="u-date-content-year-cell">' + (this.startYear + i) + '</div>');
	        new _ripple.URipple(cell);
	        if (this.startYear + i == _year) {
	            (0, _dom.addClass)(cell, 'current');
	        }
	        if (this.startYear + i < this.beginYear) {
	            (0, _dom.addClass)(cell, 'u-disabled');
	        }
	        cell._value = this.startYear + i;
	        yearDiv.appendChild(cell);
	    }
	    (0, _event.on)(yearDiv, 'click', function (e) {
	        if ((0, _dom.hasClass)(e.target, 'u-disabled')) return;
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
	DateTimePicker.fn._fillMonth = function () {
	    var template,
	        monthPage,
	        _month,
	        cells,
	        i,
	        language,
	        year,
	        month,
	        date,
	        time,
	        self = this;
	    template = ['<div class="u-date-content-page">', '<div class="u-date-content-title">',
	    /*'<div class="u-date-content-title-year"></div>-',
	    '<div class="u-date-content-title-month"></div>-',
	    '<div class="u-date-content-title-date"></div>',
	    '<div class="u-date-content-title-time"></div>',*/
	    '</div>', '<div class="u-date-content-panel">', '<div class="u-date-content-year-cell">1月</div>', '<div class="u-date-content-year-cell">2月</div>', '<div class="u-date-content-year-cell">3月</div>', '<div class="u-date-content-year-cell">4月</div>', '<div class="u-date-content-year-cell">5月</div>', '<div class="u-date-content-year-cell">6月</div>', '<div class="u-date-content-year-cell">7月</div>', '<div class="u-date-content-year-cell">8月</div>', '<div class="u-date-content-year-cell">9月</div>', '<div class="u-date-content-year-cell">10月</div>', '<div class="u-date-content-year-cell">11月</div>', '<div class="u-date-content-year-cell">12月</div>', '</div>', '</div>'].join("");

	    monthPage = (0, _dom.makeDOM)(template);
	    language = _core.core.getLanguages();
	    year = _dateUtils.date._formats['YYYY'](this.pickerDate);
	    month = _dateUtils.date._formats['MM'](this.pickerDate, language);
	    date = _dateUtils.date._formats['DD'](this.pickerDate, language);
	    time = _dateUtils.date._formats['HH'](this.pickerDate, language) + ':' + _dateUtils.date._formats['mm'](this.pickerDate, language) + ':' + _dateUtils.date._formats['ss'](this.pickerDate, language);

	    this._monthTitle = monthPage.querySelector('.u-date-content-title');
	    this._monthTitle.innerHTML = _dateUtils.date._formats['MMM'](this.pickerDate, language);
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
	    for (i = 0; i < cells.length; i++) {
	        if (_month - 1 == i) {
	            (0, _dom.addClass)(cells[i], 'current');
	        }
	        if (this.pickerDate.getFullYear() == this.beginYear && i < this.beginMonth) {
	            (0, _dom.addClass)(cells[i], 'u-disabled');
	        }
	        if (this.pickerDate.getFullYear() < this.beginYear) {
	            (0, _dom.addClass)(cells[i], 'u-disabled');
	        }
	        cells[i]._value = i;
	        new _ripple.URipple(cells[i]);
	    }
	    (0, _event.on)(monthPage, 'click', function (e) {
	        if ((0, _dom.hasClass)(e.target, 'u-disabled')) return;
	        if ((0, _dom.hasClass)(e.target, 'u-date-content-title')) return;
	        var _m = e.target._value;
	        this.pickerDate.setMonth(_m);
	        this._updateDate();
	        this._fillDate();
	    }.bind(this));
	    this._zoomIn(monthPage);
	    this.currentPanel = 'month';
	};

	DateTimePicker.fn._getPickerStartDate = function (date) {
	    var d = new Date(date);
	    d.setDate(1);
	    var day = d.getDay();
	    d = _dateUtils.date.sub(d, 'd', day);
	    return d;
	};

	DateTimePicker.fn._getPickerEndDate = function (date) {
	    var d = new Date(date);
	    d.setDate(1);
	    d.setMonth(d.getMonth() + 1);
	    d.setDate(0);
	    var day = d.getDay();
	    d = _dateUtils.date.add(d, 'd', 6 - day);
	    return d;
	};

	/**
	 * 渲染日历
	 * @param type : previous  current  next
	 * @private
	 */
	DateTimePicker.fn._fillDate = function (type) {
	    // if (env.isMobile){
	    //     this._dateMobileScroll()
	    //     return
	    // }
	    var year,
	        month,
	        day,
	        date,
	        time,
	        template,
	        datePage,
	        titleDiv,
	        dateDiv,
	        weekSpans,
	        language,
	        tempDate,
	        i,
	        cell,
	        self = this;
	    type = type || 'current';
	    if ('current' === type) {
	        tempDate = this.pickerDate;
	    } else if (type === 'preivous') {
	        tempDate = _dateUtils.date.sub(this.startDate, 'd', 1);
	    } else {
	        tempDate = _dateUtils.date.add(this.endDate, 'd', 1);
	    }
	    this.startDate = this._getPickerStartDate(tempDate);
	    this.endDate = this._getPickerEndDate(tempDate);

	    language = _core.core.getLanguages();
	    year = _dateUtils.date._formats['YYYY'](tempDate);
	    month = _dateUtils.date._formats['MM'](tempDate, language);
	    date = _dateUtils.date._formats['DD'](tempDate, language);
	    time = _dateUtils.date._formats['HH'](tempDate, language) + ':' + _dateUtils.date._formats['mm'](tempDate, language) + ':' + _dateUtils.date._formats['ss'](tempDate, language);
	    template = ['<div class="u-date-content-page">', '<div class="u-date-content-title">', '<div class="u-date-content-title-year"></div>-', '<div class="u-date-content-title-month"></div>-', '<div class="u-date-content-title-date"></div>', '<div class="u-date-content-title-time"></div>', '</div>', '<div class="u-date-week"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>', '<div class="u-date-content-panel"></div>', '</div>'].join("");
	    datePage = (0, _dom.makeDOM)(template);
	    this._headerYear = datePage.querySelector('.u-date-content-title-year');
	    this._headerYear.innerHTML = year;
	    this._headerMonth = datePage.querySelector('.u-date-content-title-month');
	    this._headerMonth.innerHTML = month;
	    this._headerDate = datePage.querySelector('.u-date-content-title-date');
	    this._headerDate.innerHTML = date;
	    this._headerTime = datePage.querySelector('.u-date-content-title-time');
	    this._headerTime.innerHTML = time;
	    if (this.type == 'date') {
	        this._headerTime.style.display = 'none';
	    }

	    (0, _event.on)(this._headerYear, 'click', function (e) {
	        self._fillYear();
	        (0, _event.stopEvent)(e);
	    });

	    (0, _event.on)(this._headerMonth, 'click', function (e) {
	        self._fillMonth();
	        (0, _event.stopEvent)(e);
	    });

	    (0, _event.on)(this._headerTime, 'click', function (e) {
	        self._fillTime();
	        (0, _event.stopEvent)(e);
	    });

	    weekSpans = datePage.querySelectorAll('.u-date-week span');

	    for (i = 0; i < 7; i++) {
	        weekSpans[i].innerHTML = _dateUtils.date._dateLocale[language].weekdaysMin[i];
	    }
	    dateDiv = datePage.querySelector('.u-date-content-panel');
	    tempDate = this.startDate;
	    while (tempDate <= this.endDate) {
	        cell = (0, _dom.makeDOM)('<div class="u-date-cell" unselectable="on" onselectstart="return false;">' + tempDate.getDate() + '</div>');
	        if (tempDate.getFullYear() == this.pickerDate.getFullYear() && tempDate.getMonth() == this.pickerDate.getMonth() && tempDate.getDate() == this.pickerDate.getDate()) {
	            (0, _dom.addClass)(cell, 'current');
	        }

	        if (tempDate.getFullYear() < this.beginYear || tempDate.getFullYear() == this.beginYear && tempDate.getMonth() < this.beginMonth) {
	            (0, _dom.addClass)(cell, 'u-disabled');
	            (0, _dom.removeClass)(cell, 'current');
	        }

	        if (tempDate.getFullYear() == this.beginYear && tempDate.getMonth() == this.beginMonth && tempDate.getDate() < this.beginDate) {
	            (0, _dom.addClass)(cell, 'u-disabled');
	            (0, _dom.removeClass)(cell, 'current');
	        }
	        cell._value = tempDate.getDate();
	        cell._month = tempDate.getMonth();
	        cell._year = tempDate.getFullYear();
	        new _ripple.URipple(cell);
	        dateDiv.appendChild(cell);
	        tempDate = _dateUtils.date.add(tempDate, 'd', 1);
	    }
	    (0, _event.on)(dateDiv, 'click', function (e) {
	        if ((0, _dom.hasClass)(e.target, 'u-disabled')) return;
	        var _d = e.target._value;
	        if (!_d) return;
	        this.pickerDate.setFullYear(e.target._year);
	        this.pickerDate.setMonth(e.target._month);
	        this.pickerDate.setDate(_d);
	        var _cell = e.target.parentNode.querySelector('.u-date-cell.current');
	        if (_cell) {
	            (0, _dom.removeClass)(_cell, 'current');
	            if (_env.env.isIE8 || _env.env.isIE9) _cell.style.backgroundColor = "#fff";
	        }
	        (0, _dom.addClass)(e.target, 'current');
	        if (_env.env.isIE8 || _env.env.isIE9) e.target.style.backgroundColor = '#3f51b5';
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
	DateTimePicker.fn._fillTime = function (type) {
	    // if (env.isMobile) {
	    //     this._timeMobileScroll()
	    //     return;
	    // }
	    var year, month, day, date, time, template, timePage, titleDiv, dateDiv, weekSpans, language, tempDate, i, cell;
	    var self = this;
	    type = type || 'current';
	    if ('current' === type) {
	        tempDate = this.pickerDate;
	    } else if (type === 'preivous') {
	        tempDate = _dateUtils.date.sub(this.startDate, 'd', 1);
	    } else {
	        tempDate = _dateUtils.date.add(this.endDate, 'd', 1);
	    }
	    this.startDate = this._getPickerStartDate(tempDate);
	    this.endDate = this._getPickerEndDate(tempDate);

	    language = _core.core.getLanguages();
	    year = _dateUtils.date._formats['YYYY'](tempDate);
	    month = _dateUtils.date._formats['MM'](tempDate, language);
	    date = _dateUtils.date._formats['DD'](tempDate, language);
	    time = _dateUtils.date._formats['HH'](tempDate, language) + ':' + _dateUtils.date._formats['mm'](tempDate, language) + ':' + _dateUtils.date._formats['ss'](tempDate, language);

	    template = ['<div class="u-date-content-page">', '<div class="u-date-content-title">', '<div class="u-date-content-title-year"></div>-', '<div class="u-date-content-title-month"></div>-', '<div class="u-date-content-title-date"></div>', '<div class="u-date-content-title-time"></div>', '</div>', '<div class="u-date-content-panel"></div>', '</div>'].join("");
	    timePage = (0, _dom.makeDOM)(template);
	    //    titleDiv = timePage.querySelector('.u-date-content-title');
	    //    titleDiv.innerHTML = year + ' ' + month + ' ' +day ;
	    this._headerYear = timePage.querySelector('.u-date-content-title-year');
	    this._headerYear.innerHTML = year;
	    this._headerMonth = timePage.querySelector('.u-date-content-title-month');
	    this._headerMonth.innerHTML = month;
	    this._headerDate = timePage.querySelector('.u-date-content-title-date');
	    this._headerDate.innerHTML = date;
	    this._headerTime = timePage.querySelector('.u-date-content-title-time');
	    this._headerTime.innerHTML = time;
	    if (this.type == 'date') {
	        this._headerTime.style.display = 'none';
	    }

	    (0, _event.on)(this._headerYear, 'click', function (e) {
	        self._fillYear();
	        (0, _event.stopEvent)(e);
	    });

	    (0, _event.on)(this._headerMonth, 'click', function (e) {
	        self._fillMonth();
	        (0, _event.stopEvent)(e);
	    });

	    (0, _event.on)(this._headerTime, 'click', function (e) {
	        self._fillTime();
	        (0, _event.stopEvent)(e);
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
	    if (_env.env.isIE8) {
	        // IE8/IE9保持原来，非IE8/IE9使用clockpicker
	        timetemplate = ['<div class="u_time_box">', '<div class="u_time_cell">',
	        //'<div class="add_hour_cell"><i class="add_hour_cell icon-angle-up"></i></div>',
	        '<div class="show_hour_cell">' + _dateUtils.date._formats['HH'](tempDate) + '</div>',
	        //'<div class="subtract_hour_cell"><i class="subtract_hour_cell icon-angle-down"></i></div>',
	        '</div>', '<div class="u_time_cell">',
	        //'<div class="add_min_cell"><i class="add_min_cell icon-angle-up"></i></div>',
	        '<div class="show_min_cell">' + _dateUtils.date._formats['mm'](tempDate) + '</div>',
	        //'<div class="subtract_min_cell"><i class="subtract_min_cell icon-angle-down"></i></div>',
	        '</div>', '<div class="u_time_cell">',
	        //'<div class="add_sec_cell"><i class="add_sec_cell icon-angle-up"></i></div>',
	        '<div class="show_sec_cell">' + _dateUtils.date._formats['ss'](tempDate) + '</div>',
	        //'<div class="subtract_sec_cell"><i class="subtract_sec_cell icon-angle-down"></i></div>',
	        '</div>', '</div>'].join("");
	        cell = (0, _dom.makeDOM)(timetemplate);
	        dateDiv.appendChild(cell);
	        (0, _event.on)(dateDiv, 'click', function (e) {
	            var _arrary = e.target.getAttribute("class").split("_");
	            if (_arrary[0] == "add") {
	                if (_arrary[1] == "hour") {
	                    var tmph = Number(_dateUtils.date._formats['HH'](this.pickerDate));
	                    if (tmph < 23) {
	                        tmph++;
	                    } else {
	                        tmph = 0;
	                    }

	                    this.pickerDate.setHours(tmph);
	                    dateDiv.querySelector(".show_hour_cell").innerHTML = tmph;
	                } else if (_arrary[1] == "min") {
	                    var tmpm = Number(_dateUtils.date._formats['mm'](this.pickerDate));
	                    if (tmpm < 59) {
	                        tmpm++;
	                    } else {
	                        tmpm = 0;
	                    }
	                    this.pickerDate.setMinutes(tmpm);
	                } else if (_arrary[1] == "sec") {
	                    var tmps = Number(_dateUtils.date._formats['ss'](this.pickerDate));
	                    if (tmps < 59) {
	                        tmps++;
	                    } else {
	                        tmps = 0;
	                    }
	                    this.pickerDate.setSeconds(tmps);
	                }
	            } else if (_arrary[0] == "subtract") {
	                if (_arrary[1] == "hour") {
	                    var tmph = Number(_dateUtils.date._formats['HH'](this.pickerDate));
	                    if (tmph > 0) {
	                        tmph--;
	                    } else {
	                        tmph = 23;
	                    }
	                    this.pickerDate.setHours(tmph);
	                } else if (_arrary[1] == "min") {
	                    var tmpm = Number(_dateUtils.date._formats['mm'](this.pickerDate));
	                    if (tmpm > 0) {
	                        tmpm--;
	                    } else {
	                        tmpm = 59;
	                    }
	                    this.pickerDate.setMinutes(tmpm);
	                } else if (_arrary[1] == "sec") {
	                    var tmps = Number(_dateUtils.date._formats['ss'](this.pickerDate));
	                    if (tmps > 0) {
	                        tmps--;
	                    } else {
	                        tmps = 59;
	                    }
	                    this.pickerDate.setSeconds(tmps);
	                }
	            } else if (_arrary[0] == "show") {
	                var tmptarget = e.target;
	                var tmpinput = (0, _dom.makeDOM)("<input type='text' class='u-input'>");
	                if (tmptarget.querySelector('.u-input')) return;
	                this._updateDate();
	                tmpinput.value = tmptarget.innerHTML;
	                tmptarget.innerHTML = "";
	                tmptarget.appendChild(tmpinput);
	                if (_arrary[1] == "hour") {
	                    var vali = new _neouiValidate.Validate(tmpinput, { validType: "integer", minLength: 0, maxLength: 2, min: 0, max: 23 });
	                    (0, _event.on)(tmpinput, 'blur', function () {
	                        if (vali.passed) {
	                            self.pickerDate.setHours(tmpinput.value);
	                            self._updateDate();
	                        }
	                    });
	                } else if (_arrary[1] == "min") {
	                    var vali = new _neouiValidate.Validate(tmpinput, { validType: "integer", minLength: 0, maxLength: 2, min: 0, max: 59 });
	                    (0, _event.on)(tmpinput, 'blur', function () {
	                        if (vali.passed) {
	                            self.pickerDate.setMinutes(tmpinput.value);
	                            self._updateDate();
	                        }
	                    });
	                } else if (_arrary[1] == "sec") {
	                    var vali = new _neouiValidate.Validate(tmpinput, { validType: "integer", minLength: 0, maxLength: 2, min: 0, max: 59 });
	                    (0, _event.on)(tmpinput, 'blur', function () {
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
	        timetemplate += '  </div><span class="clockpicker-am-pm-block"></span></div>';
	        timetemplate += '  </div>';
	        cell = (0, _dom.makeDOM)(timetemplate);
	        this.cell = cell;
	        dateDiv.appendChild(cell);

	        this.hand = cell.querySelector('line');
	        this.bg = cell.querySelector('.clockpicker-canvas-bg');
	        this.fg = cell.querySelector('.clockpicker-canvas-fg');
	        this.titleHourSpan = cell.querySelector('.clockpicker-span-hours');
	        this.titleMinSpan = cell.querySelector('.clockpicker-span-minutes');
	        this.hourDiv = cell.querySelector('.clockpicker-hours');
	        this.minDiv = cell.querySelector('.clockpicker-minutes');
	        this.currentView = 'hours';
	        this.hours = _dateUtils.date._formats['HH'](tempDate);
	        this.min = _dateUtils.date._formats['mm'](tempDate);
	        this.sec = _dateUtils.date._formats['ss'](tempDate);
	        //this.titleHourSpan.innerHTML = this.hours;
	        //this.titleMinSpan.innerHTML = this.min;


	        (0, _event.on)(this.hourDiv, 'click', function (e) {
	            var target = e.target;
	            if ((0, _dom.hasClass)(target, 'clockpicker-tick')) {
	                this.hours = target.innerHTML;
	                this.hours = this.hours > 9 || this.hours == 0 ? '' + this.hours : '0' + this.hours;
	                // this.titleHourSpan.innerHTML = this.hours;
	                self.pickerDate.setHours(this.hours);
	                var language = _core.core.getLanguages();
	                var time = _dateUtils.date._formats['HH'](this.pickerDate, language) + ':' + _dateUtils.date._formats['mm'](this.pickerDate, language) + ':' + _dateUtils.date._formats['ss'](this.pickerDate, language);
	                this._headerTime.innerHTML = time;
	                this.hourDiv.style.visibility = 'hidden';
	                this.minDiv.style.visibility = 'visible';
	                this.currentView = 'min';
	                this.setHand();
	            }
	        }.bind(this));

	        (0, _event.on)(this.minDiv, 'click', function (e) {
	            var target = e.target;
	            if ((0, _dom.hasClass)(target, 'clockpicker-tick')) {
	                this.min = target.innerHTML;
	                // this.min = this.min > 9 || this.min  == 00? '' + this.min:'0' + this.min;
	                // this.titleMinSpan.innerHTML = this.min;
	                self.pickerDate.setMinutes(this.min);
	                var language = _core.core.getLanguages();
	                var time = _dateUtils.date._formats['HH'](this.pickerDate, language) + ':' + _dateUtils.date._formats['mm'](this.pickerDate, language) + ':' + _dateUtils.date._formats['ss'](this.pickerDate, language);
	                this._headerTime.innerHTML = time;
	                this.minDiv.style.visibility = 'hidden';
	                this.hourDiv.style.visibility = 'visible';
	                this.currentView = 'hours';
	                this.setHand();
	            }
	        }.bind(this));
	    }

	    this._zoomIn(timePage);
	    if (!_env.env.isIE8) this.setHand();
	    this.currentPanel = 'time';
	    dateDiv.onselectstart = new Function("return false");
	};

	DateTimePicker.fn.setHand = function () {
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

	DateTimePicker.fn.setHandFun = function (x, y, roundBy5, dragging) {
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
	            value = inner ? value === 0 ? 12 : value : value === 0 ? 0 : value + 12;
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
	DateTimePicker.fn._updateDate = function () {
	    var year, month, week, date, time, hour, minute, seconds, language;

	    language = _core.core.getLanguages();
	    year = _dateUtils.date._formats['YYYY'](this.pickerDate);
	    // week = udate._formats['ddd'](this.pickerDate, language);
	    month = _dateUtils.date._formats['MM'](this.pickerDate, language);
	    time = _dateUtils.date._formats['HH'](this.pickerDate, language) + ':' + _dateUtils.date._formats['mm'](this.pickerDate, language) + ':' + _dateUtils.date._formats['ss'](this.pickerDate, language);

	    //TODO 多语
	    // date = udate._formats['D'](this.pickerDate) + '日';
	    date = _dateUtils.date._formats['DD'](this.pickerDate, language);
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
	        this._headerDate.innerHTML = date;
	    }
	    if (this._headerTime) {
	        this._headerTime.innerHTML = '';
	        this._headerTime.innerHTML = time;
	    }
	    if (this.currentPanel == 'time') {
	        if (_env.env.isIE8) {
	            this._panel.querySelector(".show_hour_cell").innerHTML = _dateUtils.date._formats['HH'](this.pickerDate, language);
	            this._panel.querySelector(".show_min_cell").innerHTML = _dateUtils.date._formats['mm'](this.pickerDate, language);
	            this._panel.querySelector(".show_sec_cell").innerHTML = _dateUtils.date._formats['ss'](this.pickerDate, language);
	        }
	    }
	};

	DateTimePicker.fn._response = function () {
	    return;
	    var bodyHeight = document.body.offsetHeight; //395
	    var _height = 430;
	    if (this.type === 'date' && !_env.env.isMobile) _height = 395;
	    if (bodyHeight > _height) {
	        this._panel.style.height = _height;
	    }
	    //if (bodyHeight > 500){
	    //    this._panel.style.height =  '500px';
	    //}
	    //this._dateContent.style.height =panelHeight - 158 + 'px';   // 106 52
	};

	var dateTimePickerTemplateArr = ['<div class="u-date-panel">', '<div class="u-date-body">',
	/*'<div class="u-date-header">',
	    '<span class="u-date-header-year"></span>',
	     '<div class="u-date-header-h3">',
	        '<span class="u-date-header-week"></span>',
	        '<span>,</span>',
	        '<span class="u-date-header-month"></span>',
	        '<span> </span>',
	        '<span class="u-date-header-date"></span>',
	        '<span> </span>',
	        '<span class="u-date-header-time"></span>',
	     '</div>',
	'</div>',*/
	'<div class="u-date-content"></div>', '</div>', '<div class="u-date-nav">', '<button class="u-button u-date-ok right primary">确定</button>', '<button class="u-button u-date-cancel right">取消</button>', '<button class="u-button u-date-clean">清空</button>', '</div>', '</div>'];

	/******************************
	 *  Public method
	 ******************************/

	DateTimePicker.fn.show = function (evt) {
	    if (!this.enable) {
	        return;
	    }
	    var inputValue = this._input.value;
	    this.setDate(inputValue);

	    var self = this;
	    if (!this._panel) {
	        this._panel = (0, _dom.makeDOM)(dateTimePickerTemplateArr.join(""));
	        /*if(env.isMobile){
	            removeClass(this._panel,'u-date-panel')
	            addClass(this._panel,'u-date-panel-mobile');
	        }*/
	        this._dateNav = this._panel.querySelector('.u-date-nav');
	        if (this.type === 'date' && !_env.env.isMobile) {
	            this._dateNav.style.display = 'none';
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
	        (0, _dom.addClass)(rippleContainer, 'u-ripple');
	        this.btnOk.appendChild(rippleContainer);
	        var rippleContainer = document.createElement('span');
	        (0, _dom.addClass)(rippleContainer, 'u-ripple');
	        this.btnCancel.appendChild(rippleContainer);
	        var rippleContainer = document.createElement('span');
	        (0, _dom.addClass)(rippleContainer, 'u-ripple');
	        this.btnClean.appendChild(rippleContainer);
	        new _ripple.URipple(this.btnOk);
	        new _ripple.URipple(this.btnCancel);
	        new _ripple.URipple(this.btnClean);
	        (0, _event.on)(this.btnOk, 'click', function (e) {
	            this.onOk();
	            (0, _event.stopEvent)(e);
	        }.bind(this));
	        (0, _event.on)(this.btnCancel, 'click', function (e) {
	            self.onCancel();
	            (0, _event.stopEvent)(e);
	        });
	        (0, _event.on)(this.btnClean, 'click', function (e) {
	            self.pickerDate = null;
	            self.onOk();
	            (0, _event.stopEvent)(e);
	        });

	        // this.preBtn = makeDOM('<button class="u-date-pre-button u-button flat floating mini">&lt;</button>');
	        // this.nextBtn = makeDOM('<button class="u-date-next-button u-button flat floating mini">&gt;</button>');
	        this.preBtn = (0, _dom.makeDOM)('<button class="u-date-pre-button u-button mini">&lt;</button>');
	        this.nextBtn = (0, _dom.makeDOM)('<button class="u-date-next-button u-button mini">&gt;</button>');
	        // new u.Button(this.nextBtn);

	        (0, _event.on)(this.preBtn, 'click', function (e) {
	            if (self.currentPanel == 'date') {
	                self._fillDate('preivous');
	            } else if (self.currentPanel == 'year') {
	                self._fillYear('preivous');
	            }
	            (0, _event.stopEvent)(e);
	        });
	        (0, _event.on)(this.nextBtn, 'click', function (e) {
	            if (self.currentPanel == 'date') {
	                self._fillDate('next');
	            } else if (self.currentPanel == 'year') {
	                self._fillYear('next');
	            }
	            (0, _event.stopEvent)(e);
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
	    (0, _event.on)(window, 'resize', function () {
	        self._response();
	    });
	    /*if(env.isMobile){
	        this.overlayDiv = makeModal(this._panel);
	        on(this.overlayDiv, 'click', function(){
	            self.onCancel();
	        })
	    }*/
	    (0, _dom.addClass)(this._panel, 'is-visible');
	    if (!_env.env.isMobile) {
	        if (this.options.showFix) {
	            document.body.appendChild(this._panel);
	            this._panel.style.position = 'fixed';
	            (0, _dom.showPanelByEle)({
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
	            this.left = this._input.offsetLeft;
	            var inputHeight = this._input.offsetHeight;
	            // this.top = this.element.offsetTop + inputHeight;
	            this.top = this._input.offsetTop + inputHeight;

	            if (this.left + panelWidth > bodyWidth) {
	                this.left = bodyWidth - panelWidth;
	            }

	            if (this.top + panelHeight > bodyHeight) {
	                this.top = bodyHeight - panelHeight;
	            }

	            this._panel.style.left = this.left + 'px';
	            this._panel.style.top = this.top + 'px';
	        }

	        this._panel.style.marginLeft = '0px';
	        var callback = function callback(e) {
	            if (e !== evt && e.target !== self._input && !(0, _dom.hasClass)(e.target, 'u-date-content-year-cell') && !(0, _dom.hasClass)(e.target, 'u-date-content-year-cell') && (0, _dom.closest)(e.target, 'u-date-panel') !== self._panel && self._inputFocus != true) {
	                (0, _event.off)(document, 'click', callback);
	                self.onCancel();
	            }
	        };
	        (0, _event.on)(document, 'click', callback);

	        //tab事件
	        (0, _event.on)(self._input, 'keydown', function (e) {
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
	DateTimePicker.fn.onOk = function () {
	    this.setDate(this.pickerDate);
	    this.isShow = false;
	    (0, _dom.removeClass)(this._panel, 'is-visible');
	    try {
	        document.body.removeChild(this.overlayDiv);
	    } catch (e) {}
	    this.trigger('select', { value: this.pickerDate });
	};

	/**
	 * 确定事件
	 */
	DateTimePicker.fn.onCancel = function () {
	    this.isShow = false;
	    (0, _dom.removeClass)(this._panel, 'is-visible');
	    try {
	        document.body.removeChild(this.overlayDiv);
	    } catch (e) {}
	};

	DateTimePicker.fn.setDate = function (value) {
	    if (!value) {
	        this.date = null;
	        this._input.value = '';
	        return;
	    }

	    var _date = _dateUtils.date.getDateObj(value);
	    if (_date) {
	        if (this.beginDateObj) {
	            if (_date < this.beginDateObj) return;
	        }
	        this.date = _date;
	        this._input.value = _dateUtils.date.format(this.date, this.format);
	    }
	};
	/**
	 *设置format
	 * @param format
	 */
	DateTimePicker.fn.setFormat = function (format) {
	    this.format = format;
	    this._input.value = _dateUtils.date.format(this.date, this.format);
	};

	DateTimePicker.fn.setStartDate = function (startDate) {
	    if (startDate) {
	        this.beginDateObj = _dateUtils.date.getDateObj(startDate);
	        this.beginYear = this.beginDateObj.getFullYear();
	        this.beginMonth = this.beginDateObj.getMonth();
	        this.beginDate = this.beginDateObj.getDate();
	    }
	};
	DateTimePicker.fn.setEnable = function (enable) {
	    if (enable === true || enable === 'true') {
	        this.enable = true;
	    } else {
	        this.enable = false;
	    }
	};

	_compMgr.compMgr.regComp({
	    comp: DateTimePicker,
	    compAsString: 'u.DateTimePicker',
	    css: 'u-datepicker'
	});

	if (document.readyState && document.readyState === 'complete') {
	    _compMgr.compMgr.updateComp();
	} else {
	    (0, _event.on)(window, 'load', function () {
	        //扫描并生成控件
	        _compMgr.compMgr.updateComp();
	    });
	}

	exports.DateTimePicker = DateTimePicker;

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.GridAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _valueMixin = __webpack_require__(78);

	var _enableMixin = __webpack_require__(79);

	var _requiredMixin = __webpack_require__(80);

	var _validateMixin = __webpack_require__(81);

	var _util = __webpack_require__(10);

	var _formater = __webpack_require__(93);

	var _masker = __webpack_require__(95);

	var _dataRender = __webpack_require__(99);

	var _indexDataTable = __webpack_require__(29);

	var _event = __webpack_require__(6);

	var _string = __webpack_require__(100);

	var _integer = __webpack_require__(101);

	var _checkbox = __webpack_require__(77);

	var _combobox = __webpack_require__(89);

	var _radio = __webpack_require__(102);

	var _float = __webpack_require__(94);

	var _currency = __webpack_require__(92);

	var _datetime = __webpack_require__(96);

	var _url = __webpack_require__(104);

	var _password = __webpack_require__(105);

	var _percent = __webpack_require__(106);

	var _neouiValidate = __webpack_require__(82);

	var _neouiMessage = __webpack_require__(107);

	var _compMgr = __webpack_require__(4);

	var _i18n = __webpack_require__(85);

	var _core = __webpack_require__(71);

	var _dom = __webpack_require__(5);

	/**
	 * Module : Kero Grid Adapter
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-09 16:17:17
	 */

	var GridAdapter = _baseAdapter.BaseAdapter.extend({
		initialize: function initialize(options) {
			// 初始options中包含grid的属性设置，还需要增加dataSource、columns、transMap以及事件处理
			var opt = options['options'] || {},
			    viewModel = options['model'];
			var element = typeof options['el'] === 'string' ? document.querySelector(options['el']) : options['el'];
			var app = options['app'];
			this.id = opt['id'];
			options = opt;

			var oThis = this;
			var compDiv = null;
			var comp = null;
			this.dataTable = (0, _util.getJSObject)(viewModel, options["data"]);
			this.element = element;
			this.$element = $(element);
			this.editComponentDiv = {};
			this.editComponent = {};
			this.id = options['id'];
			this.gridOptions = options;

			// 在html中将函数类参数进行处理
			this.gridOptions.onBeforeRowSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeRowSelected);
			this.gridOptions.onRowSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onRowSelected);
			this.gridOptions.onBeforeRowUnSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeRowUnSelected);
			this.gridOptions.onRowUnSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onRowUnSelected);
			this.gridOptions.onBeforeAllRowSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeAllRowSelected);
			this.gridOptions.onAllRowSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onAllRowSelected);
			this.gridOptions.onBeforeAllRowUnSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeAllRowUnSelected);
			this.gridOptions.onAllRowUnSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onAllRowUnSelected);
			this.gridOptions.onBeforeRowFocus = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeRowFocus);
			this.gridOptions.onRowFocus = (0, _util.getFunction)(viewModel, this.gridOptions.onRowFocus);
			this.gridOptions.onBeforeRowUnFocus = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeRowUnFocus);
			this.gridOptions.onRowUnFocus = (0, _util.getFunction)(viewModel, this.gridOptions.onRowUnFocus);
			this.gridOptions.onDblClickFun = (0, _util.getFunction)(viewModel, this.gridOptions.onDblClickFun);
			this.gridOptions.onValueChange = (0, _util.getFunction)(viewModel, this.gridOptions.onValueChange);
			this.gridOptions.onBeforeClickFun = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeClickFun);
			this.gridOptions.onBeforeEditFun = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeEditFun);
			this.gridOptions.onRowHover = (0, _util.getFunction)(viewModel, this.gridOptions.onRowHover);
			this.gridOptions.afterCreate = (0, _util.getFunction)(viewModel, this.gridOptions.afterCreate);

			/*扩展onBeforeEditFun，如果点击的是单选或者复选的话则不执行原有的编辑处理，直接通过此js进行处理*/
			var customOnBeforeEditFun = this.gridOptions.onBeforeEditFun;
			var newOnBeforeEditFun = function newOnBeforeEditFun(obj) {
				var colIndex = obj.colIndex;
				var $tr = obj.$tr;

				if ($($tr.find('td')[colIndex]).find('[type=radio]').length > 0 || $($tr.find('td')[colIndex]).find('[type=checkbox]').length > 0) {
					return false;
				} else {
					if (typeof customOnBeforeEditFun == 'function') {
						return customOnBeforeEditFun(obj);
					} else {
						return true;
					}
				}
			};
			this.gridOptions.onBeforeEditFun = newOnBeforeEditFun;
			/*
	   * 处理column参数  item
	   * div子项div存储column信息
	   */
			var columns = [];
			$("div", this.$element).each(function () {
				var ops = $(this).attr('options');
				if (typeof ops == "undefined") var column = eval("(" + ops + ")");else var column = JSON.parse(ops);
				// 处理精度，以dataTable的精度为准

				/*处理editType*/
				var eType = (0, _util.getFunction)(viewModel, column.editType);
				var rType = (0, _util.getFunction)(viewModel, column.renderType);
				var afterEType = (0, _util.getFunction)(viewModel, column.afterEType);
				var afterRType = (0, _util.getFunction)(viewModel, column.afterRType);
				var sumRenderType = (0, _util.getFunction)(viewModel, column.sumRenderType);
				column.sumRenderType = sumRenderType;
				var eOptions = {};
				if (column.editOptions) {
					if (typeof column.editOptions == "undefined") var eOptions = eval("(" + column.editOptions + ")");else var eOptions = column.editOptions;
				}
				eOptions.data = options['data'];
				eOptions.field = column['field'];
				// 默认按照string处理
				if (eType == '') eType = 'string';
				if (eType == 'number') // 兼容之前版本
					eType = 'integer';
				if (eType == 'string' || eType == 'integer' || eType == 'checkbox' || eType == 'combo' || eType == 'radio' || eType == 'float' || eType == 'currency' || eType == 'datetime' || eType == 'date' || eType == 'time' || eType == 'url' || eType == 'password' || eType == 'percent') {
					oThis.createDefaultEdit(eType, eOptions, options, viewModel, column);
					column.editType = function (obj) {
						if (oThis.editComponentDiv[column.field] && oThis.editComponentDiv[column.field][0].childNodes.length > 0) {} else {
							//IE8有问题，所以需要重新创建div,将上面的代码直接拷贝
							oThis.createDefaultEdit(eType, eOptions, options, viewModel, column);
						}
						var comp = oThis.editComponent[column.field];
						if (!comp) {
							$(obj.element).parent().focus();
							return;
						}
						obj.element.innerHTML = '';
						var row = oThis.getDataTableRow(obj.rowObj);
						$(obj.element).append(oThis.editComponentDiv[column.field]);
						if (comp.required) {
							$(obj.element).parent().parent().find('.u-grid-edit-mustFlag').show();
						}

						// checkbox 类型  此段逻辑不知道是什么，暂时注释掉
						// if($Div.find('.checkbox').length > 0) {
						// 	$Div.closest('.u-grid-edit-div').css({'position': 'absolute', 'left': '83px'});
						// 	$Div.closest('.u-grid-edit-whole-div').find('.u-grid-edit-label').css({'margin-left': '112px', 'text-align': 'left'})
						// }
						$(obj.element).parent().focus();
						comp.modelValueChange(obj.value);

						// 根据惊道需求增加editype之后的处理,此处只针对grid.js中的默认eType进行处理，非默认通过eType进行处理
						if (typeof afterEType == 'function') {
							afterEType.call(this, obj);
						}
					};
				} else if (typeof eType == 'function') {
					column.editType = eType;
				}

				if (rType == 'booleanRender') {
					column.renderType = function (obj) {
						var checkStr = '';
						if (obj.value == 'Y') {
							checkStr = 'checked';
						}
						var htmlStr = '<input type="checkbox"   style="cursor:default;" ' + checkStr + '>';
						obj.element.innerHTML = htmlStr;

						var grid = obj.gridObj;
						var datatable = grid.dataTable;
						var rowId = obj.row.value['$_#_@_id'];

						var row = datatable.getRowByRowId(rowId);
						$(obj.element).find('input').on('click', function () {
							var value = this.checked ? "Y" : "N";
							var column = obj.gridCompColumn;
							var field = column.options.field;
							row.setValue(field, value);
						});

						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'integerRender') {
					column.renderType = function (obj) {
						var grid = obj.gridObj;
						var column = obj.gridCompColumn;
						var field = column.options.field;
						obj.element.innerHTML = obj.value;
						/*设置header为right*/
						$('#' + grid.options.id + '_header_table').find('th[field="' + field + '"]').css('text-align', 'right');
						$(obj.element).css('text-align', 'right');
						$(obj.element).css('color', '#e33c37');
						$(obj.element).find('.u-grid-header-link').css('padding-right', '3em');
						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'currencyRender') {
					column.renderType = function (obj) {
						//需要处理精度

						var grid = obj.gridObj;
						var column = obj.gridCompColumn;
						var field = column.options.field;
						var rowIndex = obj.rowIndex;
						var datatable = grid.dataTable;
						var rowId = $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
						var row = datatable.getRowByRowId(rowId);
						if (!row) return;
						var rprec = row.getMeta(field, 'precision');
						var maskerMeta = _core.core.getMaskerMeta('float') || {};
						var precision = typeof parseFloat(rprec) == 'number' ? rprec : maskerMeta.precision;
						maskerMeta.precision = precision;

						maskerMeta.precision = precision || maskerMeta.precision;
						var formater = new _formater.NumberFormater(maskerMeta.precision);
						var masker = new _masker.NumberMasker(maskerMeta);
						var svalue = masker.format(formater.format(obj.value)).value;
						obj.element.innerHTML = svalue;
						/*设置header为right*/
						$('#' + grid.options.id + '_header_table').find('th[field="' + field + '"]').css('text-align', 'right');
						$(obj.element).css('text-align', 'right');
						$(obj.element).css('color', '#e33c37');
						$(obj.element).find('.u-grid-header-link').css('padding-right', '3em');
						$(obj.element).attr('title', svalue);

						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'floatRender') {
					column.renderType = function (obj) {
						//需要处理精度

						var grid = obj.gridObj;
						var column = obj.gridCompColumn;
						var field = column.options.field;
						var rowIndex = obj.rowIndex;
						var datatable = grid.dataTable;
						var rowId = $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
						var row = datatable.getRowByRowId(rowId);
						if (!row) return;
						var rprec = row.getMeta(field, 'precision') || column.options.precision;
						var maskerMeta = _core.core.getMaskerMeta('float') || {};
						var precision = typeof parseFloat(rprec) == 'number' ? rprec : maskerMeta.precision;
						maskerMeta.precision = precision;

						var formater = new _formater.NumberFormater(maskerMeta.precision);
						var masker = new _masker.NumberMasker(maskerMeta);
						var svalue = masker.format(formater.format(obj.value)).value;
						obj.element.innerHTML = svalue;
						/*设置header为right*/
						$('#' + grid.options.id + '_header_table').find('th[field="' + field + '"]').css('text-align', 'right');
						$(obj.element).css('text-align', 'right');
						$(obj.element).css('color', '#e33c37');
						$(obj.element).find('.u-grid-header-link').css('padding-right', '3em');
						$(obj.element).attr('title', svalue);

						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'comboRender') {
					column.renderType = function (obj) {

						//需要将key转化为name
						var ds = (0, _util.getJSObject)(viewModel, eOptions['datasource']);

						obj.element.innerHTML = '';
						if (nameArr) {
							nameArr.length = 0;
						}

						var valArr = obj.value.split(',');
						var nameArr = [];
						for (var i = 0, length = ds.length; i < length; i++) {
							for (var j = 0; j < valArr.length; j++) {
								if (ds[i].value == valArr[j]) {
									nameArr.push(ds[i].name);
								}
							}
						}
						var svalue = nameArr.toString();
						if (!svalue) svalue = obj.value;
						obj.element.innerHTML = svalue;
						$(obj.element).attr('title', svalue);

						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'dateRender') {
					//通过grid的dataType为Date format处理
					column.renderType = function (obj) {
						var svalue = (0, _dataRender.dateRender)(obj.value, obj.gridCompColumn.options['format']);
						obj.element.innerHTML = svalue;
						$(obj.element).attr('title', svalue);
						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'dateTimeRender') {
					//通过grid的dataType为DateTime format处理
					column.renderType = function (obj) {
						var svalue = (0, _dataRender.dateTimeRender)(obj.value);
						obj.element.innerHTML = svalue;
						$(obj.element).attr('title', svalue);

						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (typeof rType == 'function') {
					column.renderType = rType;
				} else if (rType == 'radioRender') {
					column.renderType = function (params) {
						//debugger
						var ds = (0, _util.getJSObject)(viewModel, eOptions['datasource']);
						var value = params.value;
						var compDiv = $('<div class="u-grid-edit-item-radio"></div>');

						params.element.innerHTML = "";
						$(params.element).append(compDiv);

						for (var i = 0; i < ds.length; i++) {
							if (ds[i].value == value) compDiv.append('<input name="' + column.field + params.row.value['$_#_@_id'] + '" type="radio" value="' + ds[i].value + '" checked="true" /><i data-role="name">' + ds[i].name + '</i>');else compDiv.append('<input name="' + column.field + params.row.value['$_#_@_id'] + '" type="radio" value="' + ds[i].value + '"/><i data-role="name">' + ds[i].name + '</i>');
						}
						compDiv.find(":radio").each(function () {

							$(this).on('click', function () {

								var val = this.value;
								compDiv.find(":radio").each(function () {
									if (this.value == val) {
										this.checked = true;
									} else {
										this.checked = false;
									}
								});
								var grid = params.gridObj;
								var column = params.gridCompColumn;
								var field = column.options.field;
								var datatable = grid.dataTable;
								//var rowIndex = params.rowIndex
								//var tmprowId =  $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
								var rowId = params.row.value['$_#_@_id'];

								var row = datatable.getRowByRowId(rowId);

								row.setValue(field, val);
							});
						});
						//					var comp = new $.compManager.plugs.radio(compDiv[0],eOptions,viewModel);					
						//					for( var i=0,length=rdo.length; i<length; i++){
						//					   if(rdo[i].pk==value){
						//					   	 obj.element.innerHTML = '<input type="radio" checked><i data-role="name">'+rdo[i].name+'</i>';
						//					   	 break;
						//					   }
						//					}				
						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'urlRender') {
					//通过grid的dataType为DateTime format处理
					column.renderType = function (obj) {
						obj.element.innerHTML = '<a href="' + obj.value + '" target="_blank">' + obj.value + '</a>';

						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'passwordRender') {
					//通过grid的dataType为DateTime format处理
					column.renderType = function (obj) {
						obj.element.innerHTML = '<input type="password" disable="true" role="grid-for-edit" readonly="readonly" style="border:0px;background:none;padding:0px;" value="' + obj.value + '" title=""><span class="uf uf-eyeopen right-span" role="grid-for-edit"></span>';
						var span = obj.element.querySelector('span');
						var input = obj.element.querySelector('input');
						input.value = obj.value;
						$(span).on('click', function () {
							if (input.type == 'password') {
								input.type = 'text';
							} else {
								input.type = 'password';
							}
						});
						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'percentRender') {
					column.renderType = function (obj) {
						//需要处理精度

						var grid = obj.gridObj;
						var column = obj.gridCompColumn;
						var field = column.options.field;
						var rowIndex = obj.rowIndex;
						var datatable = grid.dataTable;
						var rowId = $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
						var row = datatable.getRowByRowId(rowId);
						if (!row) return;
						var rprec = row.getMeta(field, 'precision') || column.options.precision;
						var maskerMeta = _core.core.getMaskerMeta('percent') || {};
						var precision = typeof parseFloat(rprec) == 'number' ? rprec : maskerMeta.precision;
						maskerMeta.precision = precision;
						if (maskerMeta.precision) {
							maskerMeta.precision = parseInt(maskerMeta.precision) + 2;
						}

						var formater = new _formater.NumberFormater(maskerMeta.precision);
						var masker = new _masker.PercentMasker(maskerMeta);
						var svalue = masker.format(formater.format(obj.value)).value;
						obj.element.innerHTML = svalue;
						$(obj.element).css('text-align', 'right');
						$(obj.element).attr('title', svalue);

						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				}

				var defineSumRenderType = column.sumRenderType;
				column.sumRenderType = function (obj) {
					obj.value = parseFloat(obj.value);
					var grid = obj.gridObj;
					var column = obj.gridCompColumn;
					var rprec = column.options.precision;
					var maskerMeta = _core.core.getMaskerMeta('float') || {};
					var precision = rprec == 0 || rprec && typeof parseFloat(rprec) == 'number' ? rprec : maskerMeta.precision;
					maskerMeta.precision = precision;

					var formater = new _formater.NumberFormater(maskerMeta.precision);
					var masker = new _masker.NumberMasker(maskerMeta);
					var svalue = masker.format(formater.format(obj.value)).value;
					obj.element.innerHTML = svalue;
					$(obj.element).parent().css('text-align', 'right');
					$(obj.element).css('text-align', 'right');
					$(obj.element).attr('title', svalue);
					if (typeof defineSumRenderType == 'function') defineSumRenderType.call(grid, obj);
				};

				columns.push(column);
			});

			if (app && app.adjustFunc) app.adjustFunc.call(app, { id: this.id, type: 'gridColumn', columns: columns });

			this.gridOptions.columns = columns;

			/*
	   * 处理viewModel与grid之间的绑定
	   * 
	   */
			var onRowSelectedFun = this.gridOptions.onRowSelected;
			// 选中
			this.gridOptions.onRowSelected = function (obj) {
				var rowId = oThis.grid.dataSourceObj.rows[obj.rowIndex].value['$_#_@_id'];
				var index = oThis.dataTable.getIndexByRowId(rowId);
				if (oThis.grid.options.multiSelect) {
					oThis.dataTable.addRowsSelect([index]);
				} else {
					oThis.dataTable.setRowSelect(index);
				}

				if (onRowSelectedFun) {
					onRowSelectedFun.call(oThis, obj);
				}
			};
			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_SELECT, function (event) {
				/*index转化为grid的index*/
				$.each(event.rowIds, function () {
					var index = oThis.grid.getRowIndexByValue('$_#_@_id', this);
					var selectFlag = true;
					if (index > -1) {
						selectFlag = oThis.grid.setRowSelect(parseInt(index));
						if (!selectFlag) {
							oThis.dataTable.setRowUnSelect(oThis.dataTable.getIndexByRowId(this));
						}
					}
				});
			});

			//全选
			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_ALLSELECT, function (event) {
				oThis.grid.setAllRowSelect();
			});

			//全返选
			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_ALLUNSELECT, function (event) {
				oThis.grid.setAllRowUnSelect();
			});

			// 反选
			var onRowUnSelectedFun = this.gridOptions.onRowUnSelected;
			this.gridOptions.onRowUnSelected = function (obj) {
				var rowId = oThis.grid.dataSourceObj.rows[obj.rowIndex].value['$_#_@_id'];
				var index = oThis.dataTable.getIndexByRowId(rowId);
				oThis.dataTable.setRowUnSelect(index);
				if (onRowUnSelectedFun) {
					onRowUnSelectedFun.call(oThis, obj);
				}
			};
			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_UNSELECT, function (event) {
				$.each(event.rowIds, function () {
					var index = oThis.grid.getRowIndexByValue('$_#_@_id', this);
					var unSelectFlag = true;
					if (index > -1) {
						unSelectFlag = oThis.grid.setRowUnselect(parseInt(index));
						if (!unSelectFlag) {
							if (oThis.grid.options.multiSelect) {
								oThis.dataTable.addRowsSelect([oThis.dataTable.getIndexByRowId(this)]);
							} else {
								oThis.dataTable.setRowSelect(oThis.dataTable.getIndexByRowId(this));
							}
						}
					}
				});
			});

			var onRowFocusFun = this.gridOptions.onRowFocus;
			// focus
			this.gridOptions.onRowFocus = function (obj) {
				var rowId = oThis.grid.dataSourceObj.rows[obj.rowIndex].value['$_#_@_id'];
				var index = oThis.dataTable.getIndexByRowId(rowId);

				if (oThis.grid.options.rowClickBan) {
					oThis.dataTable.setRowFocus(index, true);
				} else {
					oThis.dataTable.setRowFocus(index);
				}

				if (onRowFocusFun) {
					onRowFocusFun.call(oThis, obj);
				}
			};
			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_FOCUS, function (event) {
				/*index转化为grid的index*/
				var index = oThis.grid.getRowIndexByValue('$_#_@_id', event.rowId);

				var focusFlag = true;
				if (index > -1) {
					focusFlag = oThis.grid.setRowFocus(parseInt(index));

					if (!focusFlag) {
						oThis.dataTable.setRowUnFocus(oThis.dataTable.getIndexByRowId(event.rowId));
					}
				}
			});

			// 反focus
			var onRowUnFocusFun = this.gridOptions.onRowUnFocus;
			this.gridOptions.onRowUnFocus = function (obj) {
				var rowId = oThis.grid.dataSourceObj.rows[obj.rowIndex].value['$_#_@_id'];
				var index = oThis.dataTable.getIndexByRowId(rowId);
				oThis.dataTable.setRowUnFocus(index);
				if (onRowUnFocusFun) {
					onRowUnFocusFun.call(oThis, obj);
				}
			};
			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_UNFOCUS, function (event) {
				var index = oThis.grid.getRowIndexByValue('$_#_@_id', event.rowId);
				var unFocusFlag = true;
				if (index > -1) {
					unFocusFlag = oThis.grid.setRowUnFocus(parseInt(index));
					if (!unFocusFlag) {
						oThis.dataTable.setRowFocus(oThis.dataTable.getIndexByRowId(event.rowId));
					}
				}
			});

			// 增行,只考虑viewModel传入grid
			//		var onRowInsertFun = this.gridOptions.onRowInsert; 
			//		this.gridOptions.onRowInsert = function(obj){
			//			dataTable.insertRow(obj.index,obj.row);
			//			if(onRowSelectedFun){
			//				viewModel[onRowUnSelectedFun].call(grid,grid, row, rowindex);
			//			}
			//		};
			this.dataTable.on(_indexDataTable.DataTable.ON_INSERT, function (event) {
				var gridRows = new Array();
				$.each(event.rows, function () {
					var row = this.data;
					var id = this.rowId;
					var gridRow = {};
					for (var filed in row) {
						gridRow[filed] = row[filed].value;
					}
					gridRow['$_#_@_id'] = id;
					gridRows.push(gridRow);
				});
				oThis.grid.addRows(gridRows, event.index);
			});

			this.dataTable.on(_indexDataTable.DataTable.ON_UPDATE, function (event) {
				$.each(event.rows, function () {
					var row = this.data;
					var id = this.rowId;
					var gridRow = {};
					for (var filed in row) {
						gridRow[filed] = row[filed].value;
					}
					gridRow['$_#_@_id'] = id;
					var index = oThis.grid.getRowIndexByValue('$_#_@_id', id);
					oThis.grid.updateRow(index, gridRow);
				});
			});

			this.dataTable.on(_indexDataTable.DataTable.ON_VALUE_CHANGE, function (obj) {

				var id = obj.rowId;
				var index = oThis.grid.getRowIndexByValue('$_#_@_id', id);
				if (index == -1) {
					return;
				}
				var field = obj.field;
				var value = obj.newValue;
				oThis.grid.updateValueAt(index, field, value);
				//oThis.grid.editClose();
			});

			// 删除行,只考虑viewModel传入grid
			//		this.gridOptions.onRowDelete = function(obj){
			//			dataTable.removeRow(obj.index);
			//		};
			this.dataTable.on(_indexDataTable.DataTable.ON_DELETE, function (event) {
				/*index转化为grid的index*/
				var gridIndexs = new Array();
				$.each(event.rowIds, function () {
					var index = oThis.grid.getRowIndexByValue('$_#_@_id', this);
					gridIndexs.push(index);
				});
				oThis.grid.deleteRows(gridIndexs);
			});

			this.dataTable.on(_indexDataTable.DataTable.ON_DELETE_ALL, function (event) {
				oThis.grid.setDataSource({});
			});

			// 数据改变
			var onValueChangeFun = this.gridOptions.onValueChange;
			this.gridOptions.onValueChange = function (obj) {
				var row = oThis.getDataTableRow(oThis.grid.dataSourceObj.rows[obj.rowIndex].value);
				if (row) {
					if ($.type(obj.newValue) == 'object') {
						row.setValue(obj.field, obj.newValue.trueValue);
						row.setMeta(obj.field, 'display', obj.newValue.showValue);
					} else {
						row.setValue(obj.field, obj.newValue);
					}
				}
				if (onValueChangeFun) {
					onValueChangeFun.call(oThis, obj);
				}
			};
			this.dataTable.on('valueChange', function (event) {
				var field = event.field,
				    rowId = event.rowId,
				    oldValue = event.oldValue,
				    newValue = event.newValue;
				var rowIndex = oThis.grid.getRowIndexByValue('$_#_@_id', rowId);
				if (rowIndex > -1) {
					oThis.grid.updateValueAt(rowIndex, field, newValue);
				}
			});
			// 加载数据,只考虑viewModel传入grid
			this.dataTable.on(_indexDataTable.DataTable.ON_LOAD, function (data) {
				if (data.length > 0) {
					var values = new Array();

					$.each(data, function () {
						var value = {};
						var dataObj = this.data;
						var id = this.rowId;
						for (var p in dataObj) {
							var v = dataObj[p].value;
							value[p] = v;
						}
						value['$_#_@_id'] = id;
						values.push(value);
					});
					var dataSource = {};
					dataSource['values'] = values;
					oThis.grid.setDataSource(dataSource);
				}
			});
			this.dataTable.on(_indexDataTable.DataTable.ON_ENABLE_CHANGE, function (enable) {
				oThis.grid.setEditable(enable.enable);
			});

			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_META_CHANGE, function (event) {
				var field = event.field,
				    meta = event.meta,
				    row = event.row,
				    newValue = event.newValue;
				if (meta == 'required') {
					oThis.grid.setRequired(field, newValue);
				}
				if (meta == 'precision') {
					var comp = oThis.editComponent[field];
					if (comp) {
						comp.setPrecision(newValue);
					}

					var index = oThis.grid.getRowIndexByValue('$_#_@_id', row.rowId);
					if (index == -1) {
						return;
					}
					var value = row.getValue(field);

					oThis.grid.updateValueAt(index, field, value, true);
				}
			});

			this.dataTable.on(_indexDataTable.DataTable.ON_META_CHANGE, function (event) {
				var field = event.field;
				var meta = event.meta;
				if (meta == 'precision') {
					oThis.grid.renderTypeFun({ field: field });
				}
			});

			this.gridOptions.transMap = {
				ml_show_column: (0, _i18n.trans)('gridComp.show_column', '显示/隐藏列'),
				ml_clear_set: (0, _i18n.trans)('gridComp.clear_set', '清除设置'),
				ml_no_rows: (0, _i18n.trans)('gridComp.no_rows', '无数据'),
				ml_sum: (0, _i18n.trans)('gridComp.sum', '合计:'),
				ml_close: (0, _i18n.trans)('gridComp.close', '关闭')
			};
			// 创建grid
			this.grid = $(element).grid(this.gridOptions);
			this.grid.dataTable = this.dataTable;
			this.grid.viewModel = viewModel;
			this.grid.gridModel = this;

			//如果先插入数据再创建grid需要处理 load
			var data = this.dataTable.rows();
			if (data.length > 0) {
				var values = new Array();

				$.each(data, function () {
					var value = {};
					var dataObj = this.data;
					var id = this.rowId;
					for (var p in dataObj) {
						var v = dataObj[p].value;
						value[p] = v;
					}
					value['$_#_@_id'] = id;
					values.push(value);
				});
				var dataSource = {};
				dataSource['values'] = values;
				oThis.grid.setDataSource(dataSource);
			}
			// 选中行
			var selectIndexs = this.dataTable.getSelectedIndexs();
			if (selectIndexs.length > 0) {
				$.each(selectIndexs, function () {
					oThis.grid.setRowSelect(this);
				});
			}

			return this;
		},

		getName: function getName() {
			return 'grid';
		},
		createDefaultEdit: function createDefaultEdit(eType, eOptions, options, viewModel, column) {
			var oThis = this;
			eOptions.showFix = true;
			var compDiv, comp;
			if (eType == 'string') {
				compDiv = $('<div><input type="text" class="u-grid-edit-item-string"></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				eOptions.dataType = 'string';
				comp = new _string.StringAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});
			} else if (eType == 'integer') {
				compDiv = $('<div><input type="text" class="u-grid-edit-item-integer"></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				eOptions.dataType = 'integer';
				comp = new _integer.IntegerAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});

				//comp = new $.compManager.plugs.integer(compDiv.find("input")[0],eOptions,viewModel);
			} else if (eType == 'checkbox') {
				compDiv = $('<div><input id="' + oThis.id + "_edit_field_" + column['field'] + '" type="checkbox" class="u-grid-edit-item-checkbox"></div>');
				//eOptions.dataType = 'integer';

				if ($.CheckboxComp) {
					comp = new $.CheckboxComp(compDiv.find("input")[0], eOptions, viewModel);
				} else {
					comp = new _checkbox.CheckboxAdapter({
						el: compDiv[0],
						options: eOptions,
						model: viewModel
					});
				}

				//comp = new $.compManager.plugs.check(compDiv.find("input")[0],eOptions,viewModel);
			} else if (eType == 'combo') {
				// compDiv = $('<div class="input-group  form_date u-grid-edit-item-comb"><div  type="text" class="form-control grid-combox"></div><i class="input-group-addon" ><i class="uf uf-anglearrowdown"></i></i></div>');
				compDiv = $('<div class="eType-input"><input type="text" class="u-grid-edit-item-float"></div>');
				//comp = new $.compManager.plugs.combo(compDiv[0],eOptions,viewModel);
				//comp = new Combobox({
				//	el:compDiv[0],
				//	options:eOptions,
				//	model: viewModel
				//});
				if ($.Combobox) {
					//兼容旧版本
					compDiv = $('<div class="input-group  form_date u-grid-edit-item-comb"><div  type="text" class="form-control grid-combox"></div><i class="input-group-addon" ><i class="uf uf-anglearrowdown"></i></i></div>');
					comp = new $.Combobox(compDiv[0], eOptions, viewModel);
				} else {
					comp = new _combobox.ComboboxAdapter({
						el: compDiv[0],
						options: eOptions,
						model: viewModel
					});
					if (oThis.gridOptions.customEditPanelClass) {
						if (oThis.gridOptions.customEditPanelClass.indexOf('u-combo-ul') < 0) {
							oThis.gridOptions.customEditPanelClass += ',u-combo-ul';
						}
					} else {
						oThis.gridOptions.customEditPanelClass = 'u-combo-ul';
					}
				}
			} else if (eType == 'radio') {
				if (!options.editType || options.editType == "default") {
					compDiv = null;
					comp = null;
				} else {
					compDiv = $('<div class="u-grid-edit-item-radio"><input type="radio" name="identity" /><i data-role="name"></i></div>');
					//comp = new $.compManager.plugs.radio(compDiv[0],eOptions,viewModel);
					comp = new _radio.RadioAdapter({
						el: compDiv[0],
						options: eOptions,
						model: viewModel
					});
				}
			} else if (eType == 'float') {
				compDiv = $('<div><input type="text" class="u-grid-edit-item-float"></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				//comp = new $.compManager.plugs.float(compDiv.find("input")[0],eOptions,viewModel);
				eOptions.dataType = 'float';
				comp = new _float.FloatAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});
			} else if (eType == 'currency') {
				compDiv = $('<div><input type="text" class="u-grid-edit-item-currency"></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				//comp = new $.compManager.plugs.currency(compDiv.find("input")[0],eOptions,viewModel);
				eOptions.dataType = 'currency';
				comp = new _currency.CurrencyAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});
			} else if (eType == 'datetime') {
				compDiv = $('<div class="input-group u-grid-edit-item-datetime" ><input class="form-control" /><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div>');

				//comp = new $.compManager.plugs.datetime(compDiv[0],eOptions,viewModel);
				if ($.DateTime) {
					comp = new $.DateTime(compDiv[0], eOptions, viewModel);
				} else {
					comp = new _datetime.DateTimeAdapter({
						el: compDiv[0],
						options: eOptions,
						model: viewModel
					});
					if (oThis.gridOptions.customEditPanelClass) {
						if (oThis.gridOptions.customEditPanelClass.indexOf('u-date-panel') < 0) {
							oThis.gridOptions.customEditPanelClass += ',u-date-panel';
						}
					} else {
						oThis.gridOptions.customEditPanelClass = 'u-date-panel';
					}
				}
			} else if (eType == 'date') {
				compDiv = $('<div class="input-group u-grid-edit-item-date" ><input class="form-control" /><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div>');

				//comp = new $.compManager.plugs.date(compDiv[0],eOptions,viewModel);
				if ($.DateComp) {
					comp = new $.DateComp(compDiv[0], eOptions, viewModel);
				} else {
					eOptions.type = 'u-date';
					comp = new _datetime.DateTimeAdapter({
						el: compDiv[0],
						options: eOptions,
						model: viewModel
					});
					if (oThis.gridOptions.customEditPanelClass) {
						if (oThis.gridOptions.customEditPanelClass.indexOf('u-date-panel') < 0) {
							oThis.gridOptions.customEditPanelClass += ',u-date-panel';
						}
					} else {
						oThis.gridOptions.customEditPanelClass = 'u-date-panel';
					}
				}
			} else if (eType == 'url') {
				compDiv = $('<div><input type="text" class="u-grid-edit-item-string"></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				eOptions.dataType = 'url';
				comp = new _url.UrlAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});
				//$.compManager.plugs.string(compDiv.find("input")[0],eOptions,viewModel);
			} else if (eType == 'password') {
				compDiv = $('<div><input type="text" class="u-grid-edit-item-string"><span class="uf uf-eyeopen right-span"></span></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				eOptions.dataType = 'password';
				comp = new _password.PassWordAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});
				//$.compManager.plugs.string(compDiv.find("input")[0],eOptions,viewModel);
			} else if (eType == 'percent') {

				compDiv = $('<div><input type="text" class="u-grid-edit-item-float"></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				//comp = new $.compManager.plugs.float(compDiv.find("input")[0],eOptions,viewModel);
				eOptions.dataType = 'precent';
				comp = new _percent.PercentAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});
			}

			if (comp && comp.dataAdapter) {
				comp = comp.dataAdapter;
			}

			oThis.editComponentDiv[column.field] = compDiv;
			oThis.editComponent[column.field] = comp;
		},

		/**
	  * 获取grid行对应的数据模型行对象
	  * @param {Object} gridRow
	  */
		getDataTableRow: function getDataTableRow(gridRow) {
			var rowId = gridRow['$_#_@_id'];
			var row = null;
			var rowIndex = this.dataTable.getIndexByRowId(rowId);
			if (rowIndex > -1) row = this.dataTable.getRow(rowIndex);
			return row;
		},

		setEnable: function setEnable(enable) {
			this.grid.setEditable(enable);
		},

		setShowHeader: function setShowHeader(showHeader) {
			this.grid.setShowHeader(showHeader);
		},

		// 传入要编辑的tr对应的jquery对象
		editRowFun: function editRowFun(index) {
			this.dataTable.setRowSelect(index);
			this.grid.editRowIndexFun(index);
		},
		/*
	 grid校验之后不显示提示信息，只返回提示信息，由调用者主动处理
	 传入参数：	trueValue 不处理
	 			showMsg 不处理
	 返回：	passed 是否通过
	 		MsgObj 包含id以及提示信息，后续可扩展
	 		Msg 提示信息
	 */
		doValidate: function doValidate(options) {
			var rows = this.grid.dataSourceObj.rows,
			    gridColumnArr = this.grid.gridCompColumnArr,
			    passed = true,
			    MsgArr = new Array(),
			    evalStr = '',
			    rowMsg = '',
			    wholeMsg = '',
			    columnShowMsg = '',
			    hasErrow = false;

			// 遍历所有列
			for (var j = 0; j < gridColumnArr.length; j++) {
				// 遍历所有行
				var column = gridColumnArr[j],
				    columnOptions = gridColumnArr[j].options,
				    field = columnOptions.field,
				    title = columnOptions.title,
				    required = columnOptions.required,
				    validType,
				    placement,
				    tipId,
				    errorMsg,
				    nullMsg,
				    maxLength,
				    minLength,
				    max,
				    min,
				    maxNotEq,
				    minNotEq,
				    reg;
				if (columnOptions.editOptions) {
					validType = columnOptions.editOptions.validType || '';
					placement = columnOptions.editOptions.placement || '';
					tipId = columnOptions.editOptions.tipId || '';
					errorMsg = columnOptions.editOptions.errorMsg || '';
					nullMsg = columnOptions.editOptions.nullMsg || '';
					maxLength = columnOptions.editOptions.maxLength || '';
					minLength = columnOptions.editOptions.minLength || '';
					max = columnOptions.editOptions.max || '';
					min = columnOptions.editOptions.min || '';
					maxNotEq = columnOptions.editOptions.maxNotEq || '';
					minNotEq = columnOptions.editOptions.minNotEq || '';
					reg = columnOptions.editOptions.regExp || '';
				}

				var columnPassedFlag = true,
				    columnMsg = '';
				var validate = new _neouiValidate.Validate({
					el: this.element,
					single: true,
					required: required,
					validType: validType,
					placement: placement,
					tipId: tipId,
					errorMsg: errorMsg,
					nullMsg: nullMsg,
					maxLength: maxLength,
					minLength: minLength,
					max: max,
					min: min,
					maxNotEq: maxNotEq,
					minNotEq: minNotEq,
					reg: reg
				});
				for (var i = 0; i < rows.length; i++) {
					var value = rows[i].value[field];
					var result = validate.check({ pValue: value, showMsg: false });
					passed = result.passed && passed;
					if (!result.passed) {
						columnPassedFlag = false;
						if (options.showMsg && columnMsg.indexOf(result.Msg) < 0) {
							columnMsg += result.Msg + ' ';
						}
						// 设置背景色
						var index = this.grid.getIndexOfColumn(column);
						var contentDiv = document.getElementById(this.grid.options.id + '_content_tbody');
						var row = contentDiv.querySelectorAll('tr')[i];
						var td = row.querySelectorAll('td')[index];
						var div = td.querySelector('div');
						(0, _dom.addClass)(td, 'u-grid-err-td');
						(0, _dom.addClass)(div, 'u-grid-err-td');
						var msg = '(' + title + ')' + result.Msg + ';';
						evalStr = 'if(typeof obj' + i + ' == \'undefined\'){var obj' + i + '= {}; MsgArr.push(obj' + i + ');obj' + i + '.rowNum = ' + i + '; obj' + i + '.arr = new Array();}obj' + i + '.arr.push(msg)';
						eval(evalStr);
					}
				}
				// 如果存在错误信息并且提示信息
				if (!columnPassedFlag && options.showMsg) {
					columnShowMsg += title + ':' + columnMsg + '<br>';
				}
				if (!columnPassedFlag) {
					if (!hasErrow) {
						// 滚动条要滚动到第一次出现错误的数据列
						hasErrow = true;
						var ind = this.grid.getIndexOfColumn(column);
						var thDom = $('#' + this.grid.options.id + '_header_table th', this.grid.$ele)[ind];
						var left = thDom.attrLeftTotalWidth;
						var contentDom = $('#' + this.grid.options.id + '_content_div', this.grid.$ele)[0];
						contentDom.scrollLeft = left;
					}
				}
			}
			if (columnShowMsg) (0, _neouiMessage.showMessage)({ msg: columnShowMsg, showSeconds: 3 });
			if (MsgArr.length > 0) {
				MsgArr.sort(function (a1, a2) {
					if (a1.rowNum > a2.rowNum) return 1;else return -1;
				});
			}

			for (var k = 0; k < MsgArr.length; k++) {
				var rowNum = MsgArr[k].rowNum;
				rowMsg = MsgArr[k].arr.join('');
				wholeMsg += '第' + (rowNum + 1) + '行:' + rowMsg;
			}

			return {
				passed: passed,
				comp: this,
				Msg: wholeMsg
			};
		}
	});

	//if ($.compManager)
	//	$.compManager.addPlug(Grid)

	_compMgr.compMgr.addDataAdapter({
		adapter: GridAdapter,
		name: 'grid'
		//dataType: 'float'
	});

	exports.GridAdapter = GridAdapter;

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.dateToUTCString = exports.percentRender = exports.timeRender = exports.dateTimeRender = exports.dateRender = exports.integerRender = exports.floatRender = undefined;

	var _core = __webpack_require__(71);

	var _formater = __webpack_require__(93);

	var _masker = __webpack_require__(95);

	var _dateUtils = __webpack_require__(70);

	/**
	 * Module : Sparrow data display formater
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-07-28 15:39:01
	 */
	var floatRender = function floatRender(value, precision) {
		var trueValue = value;
		if (typeof value === 'undefined' || value === null) return value;
		//value 为 ko对象
		if (typeof value === 'function') trueValue = value();
		var maskerMeta = _core.core.getMaskerMeta('float') || {};
		if (typeof precision === 'number') maskerMeta.precision = precision;
		var formater = new _formater.NumberFormater(maskerMeta.precision);
		var masker = new _masker.NumberMasker(maskerMeta);
		return masker.format(formater.format(trueValue)).value;
	};

	var integerRender = function integerRender(value) {
		var trueValue = value;
		if (typeof value === 'undefined' || value === null) return value;
		//value 为 ko对象
		if (typeof value === 'function') trueValue = value();
		return trueValue;
	};

	var _dateRender = function _dateRender(value, format, type) {
		var trueValue = value;
		if (typeof value === 'undefined' || value === null) return value;
		//value 为 ko对象
		if (typeof value === 'function') trueValue = value();
		var maskerMeta = _core.core.getMaskerMeta(type) || {};
		if (typeof format != 'undefined') maskerMeta.format = format;
		var maskerValue = _dateUtils.date.format(trueValue, maskerMeta.format);
		return maskerValue;
	};

	var dateRender = function dateRender(value, format) {
		return _dateRender(value, format, 'date');
	};

	var dateTimeRender = function dateTimeRender(value, format) {
		return _dateRender(value, format, 'datetime');
	};

	var timeRender = function timeRender(value, format) {
		return _dateRender(value, format, 'time');
	};

	var percentRender = function percentRender(value) {
		var trueValue = value;
		if (typeof value === 'undefined' || value === null) return value;
		//value 为 ko对象
		if (typeof value === 'function') trueValue = value();
		var maskerMeta = _core.core.getMaskerMeta('percent') || {};
		var masker = new _masker.PercentMasker(maskerMeta);
		var maskerValue = masker.format(trueValue);
		return maskerValue && maskerValue.value ? maskerValue.value : '';
	};

	var dateToUTCString = function dateToUTCString(date) {
		if (!date) return '';
		if (date.indexOf("-") > -1) date = date.replace(/\-/g, "/");
		var utcString = Date.parse(date);
		if (isNaN(utcString)) return "";
		return utcString;
	};

	exports.floatRender = floatRender;
	exports.integerRender = integerRender;
	exports.dateRender = dateRender;
	exports.dateTimeRender = dateTimeRender;
	exports.timeRender = timeRender;
	exports.percentRender = percentRender;
	exports.dateToUTCString = dateToUTCString;

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.StringAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _extend = __webpack_require__(8);

	var _valueMixin = __webpack_require__(78);

	var _enableMixin = __webpack_require__(79);

	var _requiredMixin = __webpack_require__(80);

	var _validateMixin = __webpack_require__(81);

	var _event = __webpack_require__(6);

	var _compMgr = __webpack_require__(4);

	/**
	 * Module : Kero string adapter
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-09 20:12:42
	 */
	var StringAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _enableMixin.EnableMixin, _requiredMixin.RequiredMixin, _validateMixin.ValidateMixin],
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
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.IntegerAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _valueMixin = __webpack_require__(78);

	var _enableMixin = __webpack_require__(79);

	var _requiredMixin = __webpack_require__(80);

	var _validateMixin = __webpack_require__(81);

	var _util = __webpack_require__(10);

	var _event = __webpack_require__(6);

	var _env = __webpack_require__(7);

	var _compMgr = __webpack_require__(4);

	var IntegerAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _enableMixin.EnableMixin, _requiredMixin.RequiredMixin, _validateMixin.ValidateMixin],
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
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.RadioAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _valueMixin = __webpack_require__(78);

	var _enableMixin = __webpack_require__(79);

	var _requiredMixin = __webpack_require__(80);

	var _validateMixin = __webpack_require__(81);

	var _util = __webpack_require__(10);

	var _dom = __webpack_require__(5);

	var _event = __webpack_require__(6);

	var _neouiRadio = __webpack_require__(103);

	var _compMgr = __webpack_require__(4);

	var RadioAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _enableMixin.EnableMixin, _requiredMixin.RequiredMixin, _validateMixin.ValidateMixin],
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
	            self.otherInput = (0, _dom.makeDOM)('<input type="text" disabled style="height:28px;box-sizing:border-box;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;">');
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
	                    // 选中后可编辑
	                    comp.element.querySelectorAll('input[type="text"]').forEach(function (ele) {
	                        ele.removeAttribute('disabled');
	                    });
	                } else {
	                    comp.element.querySelectorAll('input[type="text"]').forEach(function (ele) {
	                        ele.setAttribute('disabled', true);
	                    });
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
	                // 其他元素input输入框不能进行编辑
	                var allChild = comp.element.parentNode.children;
	                var siblingAry = [];
	                for (var i = 0; i < allChild.length; i++) {
	                    if (allChild[i] == comp.element) {} else {
	                        siblingAry.push(allChild[i]);
	                    }
	                }
	                siblingAry.forEach(function (children) {
	                    var childinput = children.querySelectorAll('input[type="text"]');
	                    if (childinput) {
	                        childinput.forEach(function (inputele) {
	                            inputele.setAttribute('disabled', 'true');
	                        });
	                    }
	                });
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
	                    (0, _dom.addClass)(comp.element, 'is-checked');
	                    comp._btnElement.click();
	                }
	            });
	        } else {
	            if (this.eleValue == value) {
	                fetch = true;
	                this.slice = true;
	                (0, _dom.addClass)(this.comp.element, 'is-checked');
	                this.comp._btnElement.click();
	                this.slice = false;
	            }
	        }
	        if (this.options.hasOther && !fetch && value) {
	            if (!this.enable) {
	                this.lastRadio.removeAttribute('disabled');
	            }
	            u.addClass(this.lastLabel, 'is-checked');
	            this.lastRadio.checked = true;
	            this.otherInput.value = value;
	            if (!this.enable) {
	                this.lastRadio.setAttribute('disabled', true);
	            }
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
	}); /**
	     * Module : Kero percent
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-10 10:33:09
	     */

	_compMgr.compMgr.addDataAdapter({
	    adapter: RadioAdapter,
	    name: 'u-radio'
	});
	exports.RadioAdapter = RadioAdapter;

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Radio = undefined;

	var _BaseComponent = __webpack_require__(83);

	var _dom = __webpack_require__(5);

	var _env = __webpack_require__(7);

	var _event = __webpack_require__(6);

	var _ripple = __webpack_require__(87);

	var _compMgr = __webpack_require__(4);

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
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.UrlAdapter = undefined;

	var _string = __webpack_require__(100);

	var _dom = __webpack_require__(5);

	var _compMgr = __webpack_require__(4);

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
	}); /**
	     * Module : Kero url adapter
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-10 13:51:26
	     */

	_compMgr.compMgr.addDataAdapter({
	    adapter: UrlAdapter,
	    name: 'url'
	});
	exports.UrlAdapter = UrlAdapter;

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.PassWordAdapter = undefined;

	var _string = __webpack_require__(100);

	var _util = __webpack_require__(10);

	var _env = __webpack_require__(7);

	var _event = __webpack_require__(6);

	var _compMgr = __webpack_require__(4);

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
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.PercentAdapter = undefined;

	var _float = __webpack_require__(94);

	var _formater = __webpack_require__(93);

	var _masker = __webpack_require__(95);

	var _core = __webpack_require__(71);

	var _compMgr = __webpack_require__(4);

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
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.showMessage = exports.showMessageDialog = undefined;

	var _dom = __webpack_require__(5);

	var _event = __webpack_require__(6);

	/**
	 * Module : neoui-message
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-02 19:40:59
	 */

	var messageTemplate = '<div class="u-message"><span class="u-msg-close uf uf-removesymbol"></span>{msg}</div>';

	var showMessage = function showMessage(options) {
		var msg, position, width, height, showSeconds, msgType, template;
		if (typeof options === 'string') {
			options = {
				msg: options
			};
		}
		msg = options['msg'] || "";
		position = options['position'] || "bottom-right"; //center. top-left, top-center, top-right, bottom-left, bottom-center, bottom-right,
		//TODO 后面改规则：没设宽高时，自适应
		width = options['width'] || "";
		// height = options['height'] || "100px";
		msgType = options['msgType'] || 'info';
		//默认为当用户输入的时间，当用户输入的时间为false并且msgType=='info'时，默认显示时间为2s
		showSeconds = parseInt(options['showSeconds']) || (msgType == 'info' ? 2 : 0);

		template = options['template'] || messageTemplate;

		template = template.replace('{msg}', msg);
		var msgDom = (0, _dom.makeDOM)(template);
		(0, _dom.addClass)(msgDom, 'u-mes' + msgType);
		msgDom.style.width = width;
		// msgDom.style.height = height;
		// msgDom.style.lineHeight = height;
		if (position == 'bottom-right') {
			msgDom.style.bottom = '10px';
		}

		if (position == 'center') {
			msgDom.style.bottom = '50%';
			msgDom.style.transform = 'translateY(50%)';
		}
		var closeBtn = msgDom.querySelector('.u-msg-close');
		//new Button({el:closeBtn});
		var closeFun = function closeFun() {
			(0, _dom.removeClass)(msgDom, "active");
			setTimeout(function () {
				try {
					document.body.removeChild(msgDom);
				} catch (e) {}
			}, 500);
		};
		(0, _event.on)(closeBtn, 'click', closeFun);
		document.body.appendChild(msgDom);

		if (showSeconds > 0) {
			setTimeout(function () {
				closeFun();
			}, showSeconds * 1000);
		}

		setTimeout(function () {
			(0, _dom.addClass)(msgDom, "active");
		}, showSeconds * 1);
	};

	var showMessageDialog = showMessage;

	exports.showMessageDialog = showMessageDialog;
	exports.showMessage = showMessage;

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.MonthAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _neouiMonth = __webpack_require__(109);

	var _compMgr = __webpack_require__(4);

	var MonthAdapter = _baseAdapter.BaseAdapter.extend({
	    initialize: function initialize(comp, options) {
	        var self = this;
	        MonthAdapter.superclass.initialize.apply(this, arguments);
	        this.validType = 'month';

	        this.comp = new _neouiMonth.Month(this.element);

	        this.comp.on('valueChange', function (event) {
	            self.slice = true;
	            self.dataModel.setValue(self.field, event.value);
	            self.slice = false;
	            //self.setValue(event.value);
	        });
	        this.dataModel.ref(this.field).subscribe(function (value) {
	            self.modelValueChange(value);
	        });
	    },
	    modelValueChange: function modelValueChange(value) {
	        if (this.slice) return;
	        this.comp.setValue(value);
	    },
	    setEnable: function setEnable(enable) {}
	}); /**
	     * Module : Kero month
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-09 18:46:30
	     */

	_compMgr.compMgr.addDataAdapter({
	    adapter: MonthAdapter,
	    name: 'u-month'
	});

	exports.MonthAdapter = MonthAdapter;

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Month = undefined;

	var _BaseComponent = __webpack_require__(83);

	var _event = __webpack_require__(6);

	var _dom = __webpack_require__(5);

	var _extend = __webpack_require__(8);

	var _compMgr = __webpack_require__(4);

	var _ripple = __webpack_require__(87);

	/**
	 * Module : neoui-month
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date	  : 2016-08-11 15:17:07
	 */
	var Month = _BaseComponent.BaseComponent.extend({
		DEFAULTS: {},
		init: function init() {
			var self = this;
			var element = this.element;
			this.options = (0, _extend.extend)({}, this.DEFAULTS, this.options);
			this.panelDiv = null;
			this.input = this.element.querySelector("input");

			var d = new Date();
			this.month = d.getMonth() + 1;
			this.defaultMonth = this.month;

			(0, _event.on)(this.input, 'blur', function (e) {
				self._inputFocus = false;
				this.setValue(this.input.value);
			}.bind(this));

			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
			// 添加keydown事件
			this.keydownEvent();
		},

		createPanel: function createPanel() {
			if (this.panelDiv) {
				this._fillMonth();
				return;
			}
			var oThis = this;
			this.panelDiv = (0, _dom.makeDOM)('<div class="u-date-panel" style="margin:0px;"></div>');
			this.panelContentDiv = (0, _dom.makeDOM)('<div class="u-date-content"></div>');
			this.panelDiv.appendChild(this.panelContentDiv);

			this.preBtn = (0, _dom.makeDOM)('<button class="u-date-pre-button u-button flat floating mini" style="display:none;">&lt;</button>');
			this.nextBtn = (0, _dom.makeDOM)('<button class="u-date-next-button u-button flat floating mini" style="display:none;">&gt;</button>');

			(0, _event.on)(this.preBtn, 'click', function (e) {
				oThis.startYear -= 10;
				oThis._fillYear();
			});
			(0, _event.on)(this.nextBtn, 'click', function (e) {
				oThis.startYear += 10;
				oThis._fillYear();
			});
			this.panelContentDiv.appendChild(this.preBtn);
			this.panelContentDiv.appendChild(this.nextBtn);
			this._fillMonth();
		},

		/**
	  * 填充月份选择面板
	  * @private
	  */
		_fillMonth: function _fillMonth() {
			var oldPanel, template, monthPage, _month, cells, i;
			oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
			if (oldPanel) this.panelContentDiv.removeChild(oldPanel);
			_month = this.month;
			template = ['<div class="u-date-content-page">', '<div class="u-date-content-title">' + _month + '月</div>', '<div class="u-date-content-panel">', '<div class="u-date-content-year-cell">1月</div>', '<div class="u-date-content-year-cell">2月</div>', '<div class="u-date-content-year-cell">3月</div>', '<div class="u-date-content-year-cell">4月</div>', '<div class="u-date-content-year-cell">5月</div>', '<div class="u-date-content-year-cell">6月</div>', '<div class="u-date-content-year-cell">7月</div>', '<div class="u-date-content-year-cell">8月</div>', '<div class="u-date-content-year-cell">9月</div>', '<div class="u-date-content-year-cell">10月</div>', '<div class="u-date-content-year-cell">11月</div>', '<div class="u-date-content-year-cell">12月</div>', '</div>', '</div>'].join("");

			monthPage = (0, _dom.makeDOM)(template);
			cells = monthPage.querySelectorAll('.u-date-content-year-cell');
			for (i = 0; i < cells.length; i++) {
				if (_month == i + 1) {
					(0, _dom.addClass)(cells[i], 'current');
				}
				cells[i]._value = i + 1;
				new _ripple.URipple(cells[i]);
			}
			(0, _event.on)(monthPage, 'click', function (e) {
				var _m = e.target._value;
				this.month = _m;
				monthPage.querySelector('.u-date-content-title').innerHTML = _m + '月';
				this.setValue(_m);
				this.hide();
			}.bind(this));

			this.preBtn.style.display = 'none';
			this.nextBtn.style.display = 'none';
			this.panelContentDiv.appendChild(monthPage);
			this.currentPanel = 'month';
		},

		setValue: function setValue(value) {
			value = value ? value : '';
			this.value = value;
			if (parseInt(this.value) > 0 && parseInt(this.value) < 13) {
				this.month = value;
				this.input.value = this.month;
				this.trigger('valueChange', { value: value });
			} else {
				this.month = this.defaultMonth;
				this.input.value = '';
			}
		},

		focusEvent: function focusEvent() {
			var self = this;
			(0, _event.on)(this.input, 'focus', function (e) {
				self._inputFocus = true;
				self.show(e);

				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
			});
		},
		keydownEvent: function keydownEvent() {
			var self = this;
			(0, _event.on)(self.input, "keydown", function (e) {
				var code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
				if (!(code >= 48 && code <= 57 || code == 37 || code == 39 || code == 8 || code == 46)) {
					//阻止默认浏览器动作(W3C)
					if (e && e.preventDefault) e.preventDefault();
					//IE中阻止函数器默认动作的方式
					else window.event.returnValue = false;
					return false;
				}
			});
		},

		//下拉图标的点击事件
		clickEvent: function clickEvent() {
			var self = this;
			var caret = this.element.nextSibling;
			(0, _event.on)(caret, 'click', function (e) {
				self.input.focus();
				(0, _event.stopEvent)(e);
			});
		},

		show: function show(evt) {
			var oThis = this;
			this.createPanel();

			this.width = this.element.offsetWidth;
			if (this.width < 300) this.width = 300;
			if (this.options.showFix) {
				document.body.appendChild(this.panelDiv);
				this.panelDiv.style.position = 'fixed';
				(0, _dom.showPanelByEle)({
					ele: this.input,
					panel: this.panelDiv,
					position: "bottomLeft"
				});
			} else {
				var bodyWidth = document.body.clientWidth,
				    bodyHeight = document.body.clientHeight,
				    panelWidth = this.panelDiv.offsetWidth,
				    panelHeight = this.panelDiv.offsetHeight;

				this.element.appendChild(this.panelDiv);
				this.element.style.position = 'relative';
				this.left = this.input.offsetLeft;
				var inputHeight = this.input.offsetHeight;
				this.top = this.input.offsetTop + inputHeight;

				if (this.left + panelWidth > bodyWidth) {
					this.left = bodyWidth - panelWidth;
				}

				if (this.top + panelHeight > bodyHeight) {
					this.top = bodyHeight - panelHeight;
				}

				this.panelDiv.style.left = this.left + 'px';
				this.panelDiv.style.top = this.top + 'px';
			}

			this.panelDiv.style.width = 152 + 'px';
			this.panelDiv.style.zIndex = (0, _dom.getZIndex)();
			(0, _dom.addClass)(this.panelDiv, 'is-visible');

			var callback = function (e) {
				if (e !== evt && e.target !== this.input && !oThis.clickPanel(e.target) && self._inputFocus != true) {
					(0, _event.off)(document, 'click', callback);
					// document.removeEventListener('click', callback);
					this.hide();
				}
			}.bind(this);
			(0, _event.on)(document, 'click', callback);
		},

		clickPanel: function clickPanel(dom) {
			while (dom) {
				if (dom == this.panelDiv) {
					return true;
				} else {
					dom = dom.parentNode;
				}
			}
			return false;
		},

		hide: function hide() {
			(0, _dom.removeClass)(this.panelDiv, 'is-visible');
			this.panelDiv.style.zIndex = -1;
		}
	});

	_compMgr.compMgr.regComp({
		comp: Month,
		compAsString: 'u.Month',
		css: 'u-month'
	});
	if (document.readyState && document.readyState === 'complete') {
		_compMgr.compMgr.updateComp();
	} else {
		(0, _event.on)(window, 'load', function () {
			//扫描并生成控件
			_compMgr.compMgr.updateComp();
		});
	}
	exports.Month = Month;

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.NativeCheckAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _valueMixin = __webpack_require__(78);

	var _enableMixin = __webpack_require__(79);

	var _util = __webpack_require__(10);

	var _event = __webpack_require__(6);

	var _compMgr = __webpack_require__(4);

	/**
	 * Module : Kero native-checkbox
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-09 18:55:51
	 */

	var NativeCheckAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _enableMixin.EnableMixin],
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
	        var self = this;
	        if (this.slice) return;
	        if (this.isGroup) {
	            this.element.querySelectorAll('[type=checkbox]').forEach(function (ele) {
	                if (ele.checked != (val + ',').indexOf(ele.value) > -1) {
	                    self.slice = true;
	                    ele.checked = !ele.checked;
	                    self.slice = false;
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
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.NativeRadioAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _valueMixin = __webpack_require__(78);

	var _enableMixin = __webpack_require__(79);

	var _util = __webpack_require__(10);

	var _event = __webpack_require__(6);

	var _compMgr = __webpack_require__(4);

	/**
	 * Module : Kero native-radio
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-09 19:03:30
	 */

	var NativeRadioAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _enableMixin.EnableMixin],
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
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.PaginationAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _extend = __webpack_require__(8);

	var _neouiPagination = __webpack_require__(113);

	var _util = __webpack_require__(10);

	var _compMgr = __webpack_require__(4);

	var PaginationAdapter = _baseAdapter.BaseAdapter.extend({
	    initialize: function initialize(comp, options) {
	        var self = this;
	        PaginationAdapter.superclass.initialize.apply(this, arguments);

	        //var Pagination = function(element, options, viewModel) {

	        if (!this.dataModel.pageSize() && this.options.pageSize) this.dataModel.pageSize(this.options.pageSize);
	        this.options.pageSize = this.dataModel.pageSize() || this.options.pageSize;
	        //this.$element.pagination(options);
	        //this.comp = this.$element.data('u.pagination');
	        var options = (0, _extend.extend)({}, { el: this.element }, this.options);
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
/* 113 */
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

	var _BaseComponent = __webpack_require__(83);

	var _extend = __webpack_require__(8);

	var _dom = __webpack_require__(5);

	var _util = __webpack_require__(10);

	var _event = __webpack_require__(6);

	var _compMgr = __webpack_require__(4);

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
		showTotal: true, //初始默认显示总条数 “共xxx条”
		showColumn: true, //初始默认显示每页条数 “显示xx条”
		showJump: true, //初始默认显示跳转信息 “到xx页 确定”
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

		if (options.totalCount === undefined || options.totalCount <= 0) {
			options.totalCount = 0;
		}
		if (options.showState) {
			// 处理pageOption字符串
			var pageOption = '';
			options.pageList.forEach(function (item) {
				if (options.pageSize - 0 == item) {
					pageOption += '<option selected>' + item + '</option>';
				} else {
					pageOption += '<option>' + item + '</option>';
				}
			});
			var htmlTmp = '';
			//分别得到分页条后“共xxx条”、“显示xx条”、“到xx页 确定”三个html片段
			if (options.showTotal) {
				htmlTmp += '<div class="pagination-state">' + options.totalText + '&nbsp;' + options.totalCount + '&nbsp;条</div>';
			}
			if (options.showColumn) {
				htmlTmp += '<div class="pagination-state">显示<select  class="page_z">' + pageOption + '</select>条</div>';
			}
			if (options.showJump) {
				htmlTmp += '<div class="pagination-state">到<input class="page_j" value=' + options.currentPage + '>页<input class="pagination-jump" type="button" value="确定"/></div>';
			}

			htmlArr.push(htmlTmp);
		}

		//在将htmlArr插入到页面之前，对htmlArr进行处理
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
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ProgressAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _neouiProgress = __webpack_require__(115);

	var _compMgr = __webpack_require__(4);

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
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Progress = undefined;

	var _BaseComponent = __webpack_require__(83);

	var _dom = __webpack_require__(5);

	var _env = __webpack_require__(7);

	var _event = __webpack_require__(6);

	var _compMgr = __webpack_require__(4);

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
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SwitchAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _neouiSwitch = __webpack_require__(117);

	var _compMgr = __webpack_require__(4);

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
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Switch = undefined;

	var _BaseComponent = __webpack_require__(83);

	var _dom = __webpack_require__(5);

	var _event = __webpack_require__(6);

	var _ripple = __webpack_require__(87);

	var _compMgr = __webpack_require__(4);

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
			/*swith按钮点击时，会闪一下，注释以下代码，取消此效果*/
			/*var focusHelper = document.createElement('span');
	  addClass(focusHelper, this._CssClasses.FOCUS_HELPER);
	  		thumb.appendChild(focusHelper);*/

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
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.TextAreaAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _valueMixin = __webpack_require__(78);

	var _enableMixin = __webpack_require__(79);

	var _requiredMixin = __webpack_require__(80);

	var _validateMixin = __webpack_require__(81);

	var _event = __webpack_require__(6);

	var _compMgr = __webpack_require__(4);

	var TextAreaAdapter = _baseAdapter.BaseAdapter.extend({
	    mixins: [_valueMixin.ValueMixin, _enableMixin.EnableMixin, _requiredMixin.RequiredMixin, _validateMixin.ValidateMixin],
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
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.TextFieldAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _extend = __webpack_require__(8);

	var _neouiTextfield = __webpack_require__(91);

	var _float = __webpack_require__(94);

	var _string = __webpack_require__(100);

	var _integer = __webpack_require__(101);

	var _compMgr = __webpack_require__(4);

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
	        // 解决初始设置值后，没有走这个setShowValue方法问题
	        if (this.trueAdpt.enable) {
	            this.trueAdpt.setShowValue(this.trueAdpt.getValue());
	        }
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
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.TimeAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _valueMixin = __webpack_require__(78);

	var _enableMixin = __webpack_require__(79);

	var _requiredMixin = __webpack_require__(80);

	var _validateMixin = __webpack_require__(81);

	var _event = __webpack_require__(6);

	var _core = __webpack_require__(71);

	var _env = __webpack_require__(7);

	var _dateUtils = __webpack_require__(70);

	var _neouiClockpicker = __webpack_require__(121);

	var _neouiTime = __webpack_require__(122);

	var _compMgr = __webpack_require__(4);

	/**
	 * Module : Kero time adapter
	 * Author : Kvkens(yueming@yonyou.com)
	 * Date	  : 2016-08-10 12:40:46
	 */

	var TimeAdapter = _baseAdapter.BaseAdapter.extend({
	    initialize: function initialize(options) {
	        var self = this;
	        TimeAdapter.superclass.initialize.apply(this, arguments);
	        this.validType = 'time';

	        this.maskerMeta = _core.core.getMaskerMeta('time') || {};
	        this.maskerMeta.format = this.dataModel.getMeta(this.field, "format") || this.maskerMeta.format;

	        if (this.options.type == 'u-clockpicker' && !_env.env.isIE8) this.comp = new _neouiClockpicker.ClockPicker(this.element);else this.comp = new _neouiTime.Time(this.element);
	        var dataType = this.dataModel.getMeta(this.field, 'type');
	        this.dataType = dataType || 'string';

	        this.comp.on('valueChange', function (event) {
	            self.slice = true;
	            if (event.value == '') {
	                self.dataModel.setValue(self.field, '');
	            } else {
	                var _date = self.dataModel.getValue(self.field);
	                if (self.dataType === 'datetime') {
	                    var valueArr = event.value.split(':');
	                    _date = _dateUtils.date.getDateObj(_date);
	                    if (!_date) {
	                        self.dataModel.setValue(self.field, '');
	                    } else {
	                        if (event.value == _date.getHours() + ':' + _date.getMinutes() + ':' + _date.getSeconds()) return;
	                        _date.setHours(valueArr[0]);
	                        _date.setMinutes(valueArr[1]);
	                        _date.setSeconds(valueArr[2]);
	                        self.dataModel.setValue(self.field, u.date.format(_date, 'YYYY-MM-DD HH:mm:ss'));
	                    }
	                } else {
	                    if (event.value == _date) return;
	                    self.dataModel.setValue(self.field, event.value);
	                }
	            }

	            self.slice = false;
	            //self.setValue(event.value);
	        });
	        this.dataModel.ref(this.field).subscribe(function (value) {
	            self.modelValueChange(value);
	        });
	    },
	    modelValueChange: function modelValueChange(value) {
	        if (this.slice) return;
	        var compValue = '';
	        if (this.dataType === 'datetime') {
	            var _date = _dateUtils.date.getDateObj(value);
	            if (!_date) compValue = '';else compValue = _date.getHours() + ':' + _date.getMinutes() + ':' + _date.getSeconds();
	        } else {
	            compValue = value;
	        }
	        this.comp.setValue(compValue);
	    },
	    setEnable: function setEnable(enable) {}
	});

	_compMgr.compMgr.addDataAdapter({
	    adapter: TimeAdapter,
	    name: 'u-time'
	});

	_compMgr.compMgr.addDataAdapter({
	    adapter: TimeAdapter,
	    name: 'u-clockpicker'
	});

	exports.TimeAdapter = TimeAdapter;

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.ClockPicker = undefined;

	var _BaseComponent = __webpack_require__(83);

	var _dom = __webpack_require__(5);

	var _event = __webpack_require__(6);

	var _compMgr = __webpack_require__(4);

	var _env = __webpack_require__(7);

	var _extend = __webpack_require__(8);

	var _core = __webpack_require__(71);

	var _dateUtils = __webpack_require__(70);

	/**
	 * Module : neoui-clockpicker
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date	  : 2016-08-11 15:17:07
	 */

	var ClockPicker = _BaseComponent.BaseComponent.extend({
		DEFAULTS: {},
		init: function init() {
			var self = this;
			var element = this.element;
			this.options = (0, _extend.extend)({}, this.DEFAULTS, this.options);
			this.format = this.options['format'] || _core.core.getMaskerMeta('time').format;
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			if (_env.isMobile) {
				this.input.setAttribute('readonly', 'readonly');
			}
			(0, _dom.addClass)(this.element, 'u-text');

			this.template = '<div class="u-clock-ul popover clockpicker-popover" style="padding:0px;">';
			this.template += '<div class="popover-title"><button class="u-button u-date-clean u-clock-clean" >清空</button><span class="clockpicker-span-hours">02</span> : <span class="clockpicker-span-minutes text-primary">01</span><span class="clockpicker-span-am-pm"></span></div>';
			this.template += '<div class="popover-content">';
			this.template += '	<div class="clockpicker-plate">';
			this.template += '		<div class="clockpicker-canvas">';
			this.template += '			<svg class="clockpicker-svg">';
			this.template += '				<g transform="translate(100,100)">';
			this.template += '					<circle class="clockpicker-canvas-bg clockpicker-canvas-bg-trans" r="13" cx="8.362277061412277" cy="-79.56175162946187"></circle>';
			this.template += '					<circle class="clockpicker-canvas-fg" r="3.5" cx="8.362277061412277" cy="-79.56175162946187"></circle>';
			this.template += '					<line x1="0" y1="0" x2="8.362277061412277" y2="-79.56175162946187"></line>';
			this.template += '					<circle class="clockpicker-canvas-bearing" cx="0" cy="0" r="2"></circle>';
			this.template += '				</g>';
			this.template += '			</svg>';
			this.template += '		</div>';
			this.template += '		<div class="clockpicker-dial clockpicker-hours" style="visibility: visible;">';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-1" >00</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-2" >1</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-3" >2</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-4" >3</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-5" >4</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-6" >5</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-7" >6</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-8" >7</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-9" >8</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-10" >9</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-11" >10</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-12" >11</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-13" >12</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-14" >13</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-15" >14</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-16" >15</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-17" >16</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-18" >17</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-19" >18</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-20" >19</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-21" >20</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-22" >21</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-23" >22</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-24" >23</div>';
			this.template += '		</div>';
			this.template += '		<div class="clockpicker-dial clockpicker-minutes" style="visibility: hidden;">';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-25" >00</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-26" >05</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-27" >10</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-28" >15</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-29" >20</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-30" >25</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-31" >30</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-32" >35</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-33" >40</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-34" >45</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-35" >50</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-36" >55</div>';
			this.template += '		</div>';
			this.template += '	</div><span class="clockpicker-am-pm-block"></span></div>';
			this.template += '	</div>';
			(0, _event.on)(this.input, 'blur', function (e) {
				self._inputFocus = false;
				this.setValue(this.input.value);
			}.bind(this));

			var d = new Date();
			this.defaultHour = d.getHours() > 9 ? '' + d.getHours() : '0' + d.getHours();
			this.defaultMin = d.getMinutes() > 9 ? '' + d.getMinutes() : '0' + d.getMinutes();
			this.defaultSec = d.getSeconds() > 9 ? '' + d.getSeconds() : '0' + d.getSeconds();

			this.hours = this.defaultHour;
			this.min = this.defaultMin;
			this.sec = this.defaultSec;
			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		},

		_zoomIn: function _zoomIn(newPage) {

			(0, _dom.addClass)(newPage, 'zoom-in');

			var cleanup = function () {
				(0, _event.off)(newPage, 'transitionend', cleanup);
				(0, _event.off)(newPage, 'webkitTransitionEnd', cleanup);
				// this.panelContentDiv.removeChild(this.contentPage);
				this.contentPage = newPage;
			}.bind(this);
			if (this.contentPage) {
				(0, _event.on)(newPage, 'transitionend', cleanup);
				(0, _event.on)(newPage, 'webkitTransitionEnd', cleanup);
			}
			setTimeout(function () {
				newPage.style.visibility = 'visible';
				(0, _dom.removeClass)(newPage, 'zoom-in');
			}, 150);
		},

		createPanel: function createPanel() {
			if (this.panelDiv) return;
			var oThis = this;
			this.panelDiv = (0, _dom.makeDOM)(this.template);

			this.hand = this.panelDiv.querySelector('line');
			this.bg = this.panelDiv.querySelector('.clockpicker-canvas-bg');
			this.fg = this.panelDiv.querySelector('.clockpicker-canvas-fg');
			this.titleHourSpan = this.panelDiv.querySelector('.clockpicker-span-hours');
			this.titleMinSpan = this.panelDiv.querySelector('.clockpicker-span-minutes');
			this.hourDiv = this.panelDiv.querySelector('.clockpicker-hours');
			this.minDiv = this.panelDiv.querySelector('.clockpicker-minutes');
			this.btnClean = this.panelDiv.querySelector('.u-date-clean');
			if (!_env.isMobile) this.btnClean.style.display = 'none';
			this.currentView = 'hours';
			(0, _event.on)(this.hourDiv, 'click', function (e) {
				var target = e.target;
				if ((0, _dom.hasClass)(target, 'clockpicker-tick')) {
					this.hours = target.innerHTML;
					this.hours = this.hours > 9 || this.hours == 0 ? '' + this.hours : '0' + this.hours;
					this.titleHourSpan.innerHTML = this.hours;
					this.hourDiv.style.visibility = 'hidden';
					// this.minDiv.style.visibility = 'visible';
					this._zoomIn(this.minDiv);
					this.currentView = 'min';
					this.setHand();
				}
			}.bind(this));

			(0, _event.on)(this.minDiv, 'click', function (e) {
				var target = e.target;
				if ((0, _dom.hasClass)(target, 'clockpicker-tick')) {
					this.min = target.innerHTML;
					// this.min = this.min > 9 || this.min == 00? '' + this.min:'0' + this.min;
					this.titleMinSpan.innerHTML = this.min;
					this.minDiv.style.visibility = 'hidden';
					this.hourDiv.style.visibility = 'visible';
					this.currentView = 'hours';
					var v = this.hours + ':' + this.min + ':' + this.sec;
					this.setValue(v);
					this.hide();
				}
			}.bind(this));

			(0, _event.on)(this.btnClean, 'click', function (e) {
				this.setValue("");
				this.hide();
			}.bind(this));
		},

		setHand: function setHand() {
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
		},

		setHandFun: function setHandFun(x, y, roundBy5, dragging) {
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
					value = inner ? value === 0 ? 12 : value : value === 0 ? 0 : value + 12;
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
			var w = this.panelDiv.querySelector('.clockpicker-plate').offsetWidth;
			var u = w / 200;
			var cx = Math.sin(radian) * radius * u,
			    cy = -Math.cos(radian) * radius * u;
			var iu = 100 * u;
			this.panelDiv.querySelector('g').setAttribute('transform', 'translate(' + iu + ',' + iu + ')');

			this.hand.setAttribute('x2', cx);
			this.hand.setAttribute('y2', cy);
			this.bg.setAttribute('cx', cx);
			this.bg.setAttribute('cy', cy);
			this.fg.setAttribute('cx', cx);
			this.fg.setAttribute('cy', cy);
		},

		setValue: function setValue(value) {
			value = value ? value : '';

			if (value == '') {
				this.input.value = '';

				this.trigger('valueChange', { value: '' });
				return;
			}

			if (value && value.indexOf(':') > -1) {
				var vA = value.split(":");
				var hour = vA[0];
				hour = hour % 24;
				this.hours = hour > 9 ? '' + hour : '0' + hour;
				var min = vA[1];
				min = min % 60;
				this.min = min > 9 ? '' + min : '0' + min;
				var sec = vA[2] || 0;
				sec = sec % 60;
				this.sec = sec > 9 ? '' + sec : '0' + sec;

				value = this.hours + ':' + this.min + ':' + this.sec;
			} else {
				this.hours = this.defaultHour;
				this.min = this.defaultMin;
				this.sec = this.defaultSec;
			}
			var _date = new Date();
			_date.setHours(this.hours);
			_date.setMinutes(this.min);
			_date.setSeconds(this.sec);
			var showValue = _dateUtils.date.format(_date, this.format);
			this.input.value = showValue;

			this.trigger('valueChange', { value: value });
		},

		focusEvent: function focusEvent() {
			var self = this;
			(0, _event.on)(this.input, 'focus', function (e) {
				self._inputFocus = true;
				self.show(e);
				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
			});
		},

		//下拉图标的点击事件
		clickEvent: function clickEvent() {
			var self = this;
			var caret = this.element.nextSibling;
			(0, _event.on)(caret, 'click', function (e) {
				self._inputFocus = true;
				self.show(e);
				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
			});
		},

		show: function show(evt) {

			var inputValue = this.input.value;
			this.setValue(inputValue);

			var self = this;
			this.createPanel();
			this.minDiv.style.visibility = 'hidden';
			this.hourDiv.style.visibility = 'visible';
			this.currentView = 'hours';
			this.titleHourSpan.innerHTML = this.hours;
			this.titleMinSpan.innerHTML = this.min;

			/*因为元素可能变化位置，所以显示的时候需要重新计算*/
			if (_env.isMobile) {
				this.panelDiv.style.position = 'fixed';
				this.panelDiv.style.top = '20%';
				var screenW = document.body.clientWidth;
				var l = (screenW - 226) / 2;
				this.panelDiv.style.left = l + 'px';
				this.overlayDiv = (0, _dom.makeModal)(this.panelDiv);
				(0, _event.on)(this.overlayDiv, 'click', function () {
					self.hide();
				});
			} else {
				if (this.options.showFix) {
					document.body.appendChild(this.panelDiv);
					this.panelDiv.style.position = 'fixed';
					(0, _dom.showPanelByEle)({
						ele: this.input,
						panel: this.panelDiv,
						position: "bottomLeft"
					});
				} else {

					var bodyWidth = document.body.clientWidth,
					    bodyHeight = document.body.clientHeight,
					    panelWidth = this.panelDiv.offsetWidth,
					    panelHeight = this.panelDiv.offsetHeight;

					this.element.appendChild(this.panelDiv);
					this.element.style.position = 'relative';
					this.left = this.input.offsetLeft;
					var inputHeight = this.input.offsetHeight;
					this.top = this.input.offsetTop + inputHeight;

					if (this.left + panelWidth > bodyWidth) {
						this.left = bodyWidth - panelWidth;
					}

					if (this.top + panelHeight > bodyHeight) {
						this.top = bodyHeight - panelHeight;
					}

					this.panelDiv.style.left = this.left + 'px';
					this.panelDiv.style.top = this.top + 'px';
				}
			}

			this.panelDiv.style.zIndex = (0, _dom.getZIndex)();
			(0, _dom.addClass)(this.panelDiv, 'is-visible');

			this.setHand();

			var callback = function (e) {
				if (e !== evt && e.target !== this.input && !self.clickPanel(e.target) && self._inputFocus != true) {
					(0, _event.off)(document, 'click', callback);
					this.hide();
				}
			}.bind(this);
			(0, _event.on)(document, 'click', callback);

			//tab事件
			(0, _event.on)(self.input, 'keydown', function (e) {
				var keyCode = e.keyCode;
				if (keyCode == 9) {
					self.hide();
				}
			});
		},

		clickPanel: function clickPanel(dom) {
			while (dom) {
				if (dom == this.panelDiv) {
					return true;
				} else {
					dom = dom.parentNode;
				}
			}
			return false;
		},

		hide: function hide() {
			(0, _dom.removeClass)(this.panelDiv, 'is-visible');
			this.panelDiv.style.zIndex = -1;
			if (this.overlayDiv) {
				try {
					document.body.removeChild(this.overlayDiv);
				} catch (e) {}
			}
		}
	});

	_compMgr.compMgr.regComp({
		comp: ClockPicker,
		compAsString: 'u.ClockPicker',
		css: 'u-clockpicker'
	});
	if (document.readyState && document.readyState === 'complete') {
		_compMgr.compMgr.updateComp();
	} else {
		(0, _event.on)(window, 'load', function () {
			//扫描并生成控件
			_compMgr.compMgr.updateComp();
		});
	}
	exports.ClockPicker = ClockPicker;

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Time = undefined;

	var _extend = __webpack_require__(8);

	var _BaseComponent = __webpack_require__(83);

	var _env = __webpack_require__(7);

	var _event = __webpack_require__(6);

	var _dom = __webpack_require__(5);

	var _compMgr = __webpack_require__(4);

	var Time = _BaseComponent.BaseComponent.extend({
		DEFAULTS: {},
		init: function init() {
			var self = this;
			var element = this.element;
			this.options = (0, _extend.extend)({}, this.DEFAULTS, this.options);
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			(0, _dom.addClass)(this.element, 'u-text');

			(0, _event.on)(this.input, 'blur', function (e) {
				self._inputFocus = false;
				this.setValue(this.input.value);
			}.bind(this));

			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		}
	});

	Time.fn = Time.prototype;

	Time.fn.createPanel = function () {
		if (this.panelDiv) return;
		var oThis = this;
		this.panelDiv = (0, _dom.makeDOM)('<div class="u-date-panel" style="padding:0px;"></div>');
		this.panelContentDiv = (0, _dom.makeDOM)('<div class="u-time-content"></div>');
		this.panelDiv.appendChild(this.panelContentDiv);
		this.panelHourDiv = (0, _dom.makeDOM)('<div class="u-time-cell"></div>');
		this.panelContentDiv.appendChild(this.panelHourDiv);
		this.panelHourInput = (0, _dom.makeDOM)('<input class="u-time-input">');
		this.panelHourDiv.appendChild(this.panelHourInput);
		this.panelMinDiv = (0, _dom.makeDOM)('<div class="u-time-cell"></div>');
		this.panelContentDiv.appendChild(this.panelMinDiv);
		this.panelMinInput = (0, _dom.makeDOM)('<input class="u-time-input">');
		this.panelMinDiv.appendChild(this.panelMinInput);
		this.panelSecDiv = (0, _dom.makeDOM)('<div class="u-time-cell"></div>');
		this.panelContentDiv.appendChild(this.panelSecDiv);
		this.panelSecInput = (0, _dom.makeDOM)('<input class="u-time-input">');
		this.panelSecDiv.appendChild(this.panelSecInput);
		this.panelNavDiv = (0, _dom.makeDOM)('<div class="u-time-nav"></div>');
		this.panelDiv.appendChild(this.panelNavDiv);
		this.panelOKButton = (0, _dom.makeDOM)('<button class="u-button" style="float:right;">OK</button>');
		this.panelNavDiv.appendChild(this.panelOKButton);
		(0, _event.on)(this.panelOKButton, 'click', function () {
			var v = oThis.panelHourInput.value + ':' + oThis.panelMinInput.value + ':' + oThis.panelSecInput.value;
			oThis.setValue(v);
			oThis.hide();
		});
		this.panelCancelButton = (0, _dom.makeDOM)('<button class="u-button" style="float:right;">Cancel</button>');
		this.panelNavDiv.appendChild(this.panelCancelButton);
		(0, _event.on)(this.panelCancelButton, 'click', function () {
			oThis.hide();
		});

		var d = new Date();
		this.panelHourInput.value = d.getHours() > 9 ? '' + d.getHours() : '0' + d.getHours();
		this.panelMinInput.value = d.getMinutes() > 9 ? '' + d.getMinutes() : '0' + d.getMinutes();
		this.panelSecInput.value = d.getSeconds() > 9 ? '' + d.getSeconds() : '0' + d.getSeconds();
	};

	Time.fn.setValue = function (value) {
		var hour = '',
		    min = '',
		    sec = '';
		value = value ? value : '';
		if (value == this.input.value) return;
		if (value && value.indexOf(':') > -1) {
			var vA = value.split(":");
			var hour = vA[0];
			hour = hour % 24;
			hour = hour > 9 ? '' + hour : '0' + hour;
			var min = vA[1];
			min = min % 60;
			min = min > 9 ? '' + min : '0' + min;
			var sec = vA[2];
			sec = sec % 60;
			sec = sec > 9 ? '' + sec : '0' + sec;

			value = hour + ':' + min + ':' + sec;
		}
		this.input.value = value;
		this.createPanel();

		this.panelHourInput.value = hour;
		this.panelMinInput.value = min;
		this.panelSecInput.value = sec;
		this.trigger('valueChange', { value: value });
	};

	Time.fn.focusEvent = function () {
		var self = this;
		(0, _event.on)(this.input, 'focus', function (e) {
			self._inputFocus = true;
			self.show(e);
			(0, _event.stopEvent)(e);
		});
	};

	//下拉图标的点击事件
	Time.fn.clickEvent = function () {
		var self = this;
		var caret = this.element.nextSibling;
		(0, _event.on)(caret, 'click', function (e) {
			self.input.focus();
			(0, _event.stopEvent)(e);
		});
	};

	Time.fn.show = function (evt) {

		var inputValue = this.input.value;
		this.setValue(inputValue);

		var oThis = this;
		this.createPanel();

		/*因为元素可能变化位置，所以显示的时候需要重新计算*/
		this.width = this.element.offsetWidth;
		if (this.width < 300) this.width = 300;

		this.panelDiv.style.width = this.width + 'px';
		this.panelDiv.style.maxWidth = this.width + 'px';
		if (this.options.showFix) {
			document.body.appendChild(this.panelDiv);
			this.panelDiv.style.position = 'fixed';
			(0, _dom.showPanelByEle)({
				ele: this.input,
				panel: this.panelDiv,
				position: "bottomLeft"
			});
		} else {
			// this.element.parentNode.appendChild(this.panelDiv);
			// //调整left和top
			// this.left = this.element.offsetLeft;
			// var inputHeight = this.element.offsetHeight;
			// this.top = this.element.offsetTop + inputHeight;
			// this.panelDiv.style.left = this.left + 'px';
			// this.panelDiv.style.top = this.top + 'px';

			var bodyWidth = document.body.clientWidth,
			    bodyHeight = document.body.clientHeight,
			    panelWidth = this.panelDiv.offsetWidth,
			    panelHeight = this.panelDiv.offsetHeight;

			this.element.appendChild(this.panelDiv);
			this.element.style.position = 'relative';
			this.left = this.input.offsetLeft;
			var inputHeight = this.input.offsetHeight;
			this.top = this.input.offsetTop + inputHeight;

			if (this.left + panelWidth > bodyWidth) {
				this.left = bodyWidth - panelWidth;
			}

			if (this.top + panelHeight > bodyHeight) {
				this.top = bodyHeight - panelHeight;
			}

			this.panelDiv.style.left = this.left + 'px';
			this.panelDiv.style.top = this.top + 'px';
		}

		this.panelDiv.style.zIndex = (0, _dom.getZIndex)();
		(0, _dom.addClass)(this.panelDiv, 'is-visible');

		var callback = function (e) {
			if (e !== evt && e.target !== this.input && !oThis.clickPanel(e.target) && self._inputFocus != true) {
				(0, _event.off)(document, 'click', callback);
				// document.removeEventListener('click', callback);
				this.hide();
			}
		}.bind(this);
		(0, _event.on)(document, 'click', callback);
		// document.addEventListener('click', callback);
	};

	Time.fn.clickPanel = function (dom) {
		while (dom) {
			if (dom == this.panelDiv) {
				return true;
			} else {
				dom = dom.parentNode;
			}
		}
		return false;
	};

	Time.fn.hide = function () {
		(0, _dom.removeClass)(this.panelDiv, 'is-visible');
		this.panelDiv.style.zIndex = -1;
	};

	_compMgr.compMgr.regComp({
		comp: Time,
		compAsString: 'u.Time',
		css: 'u-time'
	});
	if (_env.env.isIE8) {
		_compMgr.compMgr.regComp({
			comp: Time,
			compAsString: 'u.ClockPicker',
			css: 'u-clockpicker'
		});
	}

	if (document.readyState && document.readyState === 'complete') {
		_compMgr.compMgr.updateComp();
	} else {
		(0, _event.on)(window, 'load', function () {
			//扫描并生成控件
			_compMgr.compMgr.updateComp();
		});
	}

	exports.Time = Time;

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.YearAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _neouiYear = __webpack_require__(124);

	var _compMgr = __webpack_require__(4);

	var YearAdapter = _baseAdapter.BaseAdapter.extend({
	    initialize: function initialize(comp, options) {
	        var self = this;
	        YearAdapter.superclass.initialize.apply(this, arguments);
	        this.validType = 'year';

	        this.comp = new _neouiYear.Year(this.element);

	        this.comp.on('valueChange', function (event) {
	            self.slice = true;
	            self.dataModel.setValue(self.field, event.value);
	            self.slice = false;
	            //self.setValue(event.value);
	        });
	        this.dataModel.ref(this.field).subscribe(function (value) {
	            self.modelValueChange(value);
	        });
	    },
	    modelValueChange: function modelValueChange(value) {
	        if (this.slice) return;
	        this.comp.setValue(value);
	    },
	    setEnable: function setEnable(enable) {}
	}); /**
	     * Module : Kero year adapter
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-10 12:40:46
	     */


	_compMgr.compMgr.addDataAdapter({
	    adapter: YearAdapter,
	    name: 'u-year'
	});

	exports.YearAdapter = YearAdapter;

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Year = undefined;

	var _BaseComponent = __webpack_require__(83);

	var _event = __webpack_require__(6);

	var _dom = __webpack_require__(5);

	var _extend = __webpack_require__(8);

	var _compMgr = __webpack_require__(4);

	var _ripple = __webpack_require__(87);

	/**
	 * Module : neoui-year
	 * Author : liuyk(liuyk@yonyou.com)
	 * Date	  : 2016-08-11 15:17:07
	 */

	var Year = _BaseComponent.BaseComponent.extend({
		DEFAULTS: {},
		init: function init() {
			var self = this;
			var element = this.element;
			this.options = (0, _extend.extend)({}, this.DEFAULTS, this.options);
			this.panelDiv = null;
			this.input = this.element.querySelector("input");

			var d = new Date();
			this.year = d.getFullYear();
			this.defaultYear = this.year;
			this.startYear = this.year - this.year % 10 - 1;

			(0, _event.on)(this.input, 'blur', function (e) {
				self._inputFocus = false;
				self.setValue(self.input.value);
			});

			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
			// 添加keydown事件
			this.keydownEvent();
		},

		createPanel: function createPanel() {
			if (this.panelDiv) {
				this._fillYear();
				return;
			}
			var oThis = this;
			this.panelDiv = (0, _dom.makeDOM)('<div class="u-date-panel" style="margin:0px;"></div>');
			this.panelContentDiv = (0, _dom.makeDOM)('<div class="u-date-content"></div>');
			this.panelDiv.appendChild(this.panelContentDiv);

			this.preBtn = (0, _dom.makeDOM)('<button class="u-date-pre-button u-button mini">&lt;</button>');
			this.nextBtn = (0, _dom.makeDOM)('<button class="u-date-next-button u-button mini">&gt;</button>');

			(0, _event.on)(this.preBtn, 'click', function (e) {
				oThis.startYear -= 10;
				oThis._fillYear();
			});
			(0, _event.on)(this.nextBtn, 'click', function (e) {
				oThis.startYear += 10;
				oThis._fillYear();
			});
			this.panelContentDiv.appendChild(this.preBtn);
			this.panelContentDiv.appendChild(this.nextBtn);
			this._fillYear();
		},

		/**
	  *填充年份选择面板
	  * @private
	  */
		_fillYear: function _fillYear(type) {
			var oldPanel, year, template, yearPage, titleDiv, yearDiv, i, cell;
			oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
			if (oldPanel) this.panelContentDiv.removeChild(oldPanel);
			template = ['<div class="u-date-content-page">', '<div class="u-date-content-title"></div>', '<div class="u-date-content-panel"></div>', '</div>'].join("");
			yearPage = (0, _dom.makeDOM)(template);
			titleDiv = yearPage.querySelector('.u-date-content-title');
			titleDiv.innerHTML = this.startYear + '-' + (this.startYear + 11);
			yearDiv = yearPage.querySelector('.u-date-content-panel');
			for (i = 0; i < 12; i++) {
				cell = (0, _dom.makeDOM)('<div class="u-date-content-year-cell">' + (this.startYear + i) + '</div>');
				new _ripple.URipple(cell);
				if (this.startYear + i == this.year) {
					(0, _dom.addClass)(cell, 'current');
				}
				cell._value = this.startYear + i;
				yearDiv.appendChild(cell);
			}
			(0, _event.on)(yearDiv, 'click', function (e) {
				var _y = e.target._value;
				this.year = _y;
				this.setValue(_y);
				this.hide();
				(0, _event.stopEvent)(e);
			}.bind(this));

			this.preBtn.style.display = 'block';
			this.nextBtn.style.display = 'block';
			this.panelContentDiv.appendChild(yearPage);

			this.currentPanel = 'year';
		},

		setValue: function setValue(value) {
			value = value ? value : '';
			this.value = value;
			if (value) {
				this.year = value;
			} else {
				this.year = this.defaultYear;
			}
			this.startYear = this.year - this.year % 10 - 1;
			this.input.value = value;
			this.trigger('valueChange', { value: value });
		},

		focusEvent: function focusEvent() {
			var self = this;
			(0, _event.on)(this.input, 'focus', function (e) {
				self._inputFocus = true;
				self.show(e);
				(0, _event.stopEvent)(e);
			});
		},
		keydownEvent: function keydownEvent() {
			var self = this;
			(0, _event.on)(self.input, "keydown", function (e) {
				var code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
				if (!(code >= 48 && code <= 57 || code == 37 || code == 39 || code == 8 || code == 46)) {
					//阻止默认浏览器动作(W3C)
					if (e && e.preventDefault) e.preventDefault();
					//IE中阻止函数器默认动作的方式
					else window.event.returnValue = false;
					return false;
				}
			});
		},
		//下拉图标的点击事件
		clickEvent: function clickEvent() {
			var self = this;
			var caret = this.element.nextSibling;
			(0, _event.on)(caret, 'click', function (e) {
				self.input.focus();
				(0, _event.stopEvent)(e);
			});
		},

		show: function show(evt) {
			var oThis = this;
			this.createPanel();

			this.width = this.element.offsetWidth;
			if (this.width < 300) this.width = 300;

			this.panelDiv.style.width = 152 + 'px';
			if (this.options.showFix) {
				document.body.appendChild(this.panelDiv);
				this.panelDiv.style.position = 'fixed';
				(0, _dom.showPanelByEle)({
					ele: this.input,
					panel: this.panelDiv,
					position: "bottomLeft"
				});
			} else {
				var bodyWidth = document.body.clientWidth,
				    bodyHeight = document.body.clientHeight,
				    panelWidth = this.panelDiv.offsetWidth,
				    panelHeight = this.panelDiv.offsetHeight;

				this.element.appendChild(this.panelDiv);
				this.element.style.position = 'relative';
				this.left = this.input.offsetLeft;
				var inputHeight = this.input.offsetHeight;
				this.top = this.input.offsetTop + inputHeight;

				if (this.left + panelWidth > bodyWidth) {
					this.left = bodyWidth - panelWidth;
				}

				if (this.top + panelHeight > bodyHeight) {
					this.top = bodyHeight - panelHeight;
				}

				this.panelDiv.style.left = this.left + 'px';
				this.panelDiv.style.top = this.top + 'px';
			}
			this.panelDiv.style.zIndex = (0, _dom.getZIndex)();
			(0, _dom.addClass)(this.panelDiv, 'is-visible');

			var callback = function (e) {
				if (e !== evt && e.target !== this.input && !oThis.clickPanel(e.target) && self._inputFocus != true) {
					(0, _event.off)(document, 'click', callback);
					// document.removeEventListener('click', callback);
					this.hide();
				}
			}.bind(this);
			(0, _event.on)(document, 'click', callback);
			// document.addEventListener('click', callback);
		},

		clickPanel: function clickPanel(dom) {
			while (dom) {
				if (dom == this.panelDiv) {
					return true;
				} else {
					dom = dom.parentNode;
				}
			}
			return false;
		},
		hide: function hide() {
			(0, _dom.removeClass)(this.panelDiv, 'is-visible');
			this.panelDiv.style.zIndex = -1;
		}
	});

	_compMgr.compMgr.regComp({
		comp: Year,
		compAsString: 'u.Year',
		css: 'u-year'
	});
	if (document.readyState && document.readyState === 'complete') {
		_compMgr.compMgr.updateComp();
	} else {
		(0, _event.on)(window, 'load', function () {
			//扫描并生成控件
			_compMgr.compMgr.updateComp();
		});
	}
	exports.Year = Year;

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.YearMonthAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _neouiYearmonth = __webpack_require__(126);

	var _compMgr = __webpack_require__(4);

	var YearMonthAdapter = _baseAdapter.BaseAdapter.extend({
	    initialize: function initialize(comp, options) {
	        var self = this;
	        YearMonthAdapter.superclass.initialize.apply(this, arguments);
	        this.validType = 'yearmonth';

	        this.comp = new _neouiYearmonth.YearMonth(this.element);

	        this.comp.on('valueChange', function (event) {
	            self.slice = true;
	            self.dataModel.setValue(self.field, event.value);
	            self.slice = false;
	            //self.setValue(event.value);
	        });
	        this.dataModel.ref(this.field).subscribe(function (value) {
	            self.modelValueChange(value);
	        });
	    },
	    modelValueChange: function modelValueChange(value) {
	        if (this.slice) return;
	        this.comp.setValue(value);
	    },
	    setEnable: function setEnable(enable) {}
	}); /**
	     * Module : Kero yearmonth adapter
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-10 14:11:50
	     */


	_compMgr.compMgr.addDataAdapter({
	    adapter: YearMonthAdapter,
	    name: 'u-yearmonth'
	});

	exports.YearMonthAdapter = YearMonthAdapter;

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.YearMonth = undefined;

	var _BaseComponent = __webpack_require__(83);

	var _event = __webpack_require__(6);

	var _dom = __webpack_require__(5);

	var _extend = __webpack_require__(8);

	var _env = __webpack_require__(7);

	var _compMgr = __webpack_require__(4);

	var _ripple = __webpack_require__(87);

	var YearMonth = _BaseComponent.BaseComponent.extend({
	    DEFAULTS: {},
	    init: function init() {
	        var self = this;
	        var element = this.element;
	        this.options = (0, _extend.extend)({}, this.DEFAULTS, this.options);
	        this.panelDiv = null;
	        this.input = this.element.querySelector("input");

	        var d = new Date();
	        this.year = d.getFullYear();
	        this.startYear = this.year - this.year % 10 - 1;
	        this.month = d.getMonth() + 1;

	        (0, _event.on)(this.input, 'blur', function (e) {
	            self._inputFocus = false;
	            self.setValue(self.input.value);
	        });

	        // 添加focus事件
	        this.focusEvent();
	        // 添加右侧图标click事件
	        this.clickEvent();
	    },

	    createPanel: function createPanel() {
	        if (this.panelDiv) {
	            this._fillYear();
	            return;
	        }
	        var oThis = this;
	        this.panelDiv = (0, _dom.makeDOM)('<div class="u-date-panel" style="margin:0px;"></div>');
	        this.panelContentDiv = (0, _dom.makeDOM)('<div class="u-date-content"></div>');
	        this.panelDiv.appendChild(this.panelContentDiv);

	        // this.preBtn = makeDOM('<button class="u-date-pre-button u-button flat floating mini" style="display:none;">&lt;</button>');
	        // this.nextBtn = makeDOM('<button class="u-date-next-button u-button flat floating mini" style="display:none;">&gt;</button>');
	        this.preBtn = (0, _dom.makeDOM)('<button class="u-date-pre-button u-button mini">&lt;</button>');
	        this.nextBtn = (0, _dom.makeDOM)('<button class="u-date-next-button u-button mini">&gt;</button>');

	        (0, _event.on)(this.preBtn, 'click', function (e) {
	            oThis.startYear -= 10;
	            oThis._fillYear();
	        });
	        (0, _event.on)(this.nextBtn, 'click', function (e) {
	            oThis.startYear += 10;
	            oThis._fillYear();
	        });
	        this.panelContentDiv.appendChild(this.preBtn);
	        this.panelContentDiv.appendChild(this.nextBtn);
	        this._fillYear();
	    },

	    /**
	     *填充年份选择面板
	     * @private
	     */
	    _fillYear: function _fillYear(type) {
	        var oldPanel, year, template, yearPage, titleDiv, yearDiv, i, cell;
	        oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
	        if (oldPanel) this.panelContentDiv.removeChild(oldPanel);
	        template = ['<div class="u-date-content-page">', '<div class="u-date-content-title"></div>', '<div class="u-date-content-panel"></div>', '</div>'].join("");
	        yearPage = (0, _dom.makeDOM)(template);
	        titleDiv = yearPage.querySelector('.u-date-content-title');
	        titleDiv.innerHTML = this.startYear + '-' + (this.startYear + 11);
	        yearDiv = yearPage.querySelector('.u-date-content-panel');
	        for (i = 0; i < 12; i++) {
	            cell = (0, _dom.makeDOM)('<div class="u-date-content-year-cell">' + (this.startYear + i) + '</div>');
	            new _ripple.URipple(cell);
	            if (this.startYear + i == this.year) {
	                (0, _dom.addClass)(cell, 'current');
	            }
	            cell._value = this.startYear + i;
	            yearDiv.appendChild(cell);
	        }
	        var oThis = this;
	        (0, _event.on)(yearDiv, 'click', function (e) {
	            var _y = e.target._value;
	            oThis.year = _y;
	            oThis._fillMonth();
	            (0, _event.stopEvent)(e);
	        });

	        this.preBtn.style.display = 'block';
	        this.nextBtn.style.display = 'block';
	        // this._zoomIn(yearPage);
	        this.panelContentDiv.appendChild(yearPage);
	        this.contentPage = yearPage;
	        this.currentPanel = 'year';
	    },

	    /**
	     * 填充月份选择面板
	     * @private
	     */
	    _fillMonth: function _fillMonth() {
	        var oldPanel, template, monthPage, _month, cells, i;
	        oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
	        if (oldPanel) this.panelContentDiv.removeChild(oldPanel);
	        _month = this.month;
	        template = ['<div class="u-date-content-page">', '<div class="u-date-content-title">' + _month + '月</div>', '<div class="u-date-content-panel">', '<div class="u-date-content-year-cell">1月</div>', '<div class="u-date-content-year-cell">2月</div>', '<div class="u-date-content-year-cell">3月</div>', '<div class="u-date-content-year-cell">4月</div>', '<div class="u-date-content-year-cell">5月</div>', '<div class="u-date-content-year-cell">6月</div>', '<div class="u-date-content-year-cell">7月</div>', '<div class="u-date-content-year-cell">8月</div>', '<div class="u-date-content-year-cell">9月</div>', '<div class="u-date-content-year-cell">10月</div>', '<div class="u-date-content-year-cell">11月</div>', '<div class="u-date-content-year-cell">12月</div>', '</div>', '</div>'].join("");

	        monthPage = (0, _dom.makeDOM)(template);
	        cells = monthPage.querySelectorAll('.u-date-content-year-cell');
	        for (i = 0; i < cells.length; i++) {
	            if (_month == i + 1) {
	                (0, _dom.addClass)(cells[i], 'current');
	            }
	            cells[i]._value = i + 1;
	            new _ripple.URipple(cells[i]);
	        }
	        var oThis = this;
	        (0, _event.on)(monthPage, 'click', function (e) {
	            var _m = e.target._value;
	            oThis.month = _m;
	            monthPage.querySelector('.u-date-content-title').innerHTML = _m + '月';
	            oThis.setValue(oThis.year + '-' + oThis.month);
	            oThis.hide();
	        });

	        this.preBtn.style.display = 'none';
	        this.nextBtn.style.display = 'none';
	        this._zoomIn(monthPage);
	        this.currentPanel = 'month';
	    },

	    /**
	     * 淡入动画效果
	     * @private
	     */
	    _zoomIn: function _zoomIn(newPage) {
	        if (!this.contentPage) {
	            this.panelContentDiv.appendChild(newPage);
	            this.contentPage = newPage;
	            return;
	        }
	        (0, _dom.addClass)(newPage, 'zoom-in');
	        this.panelContentDiv.appendChild(newPage);
	        if (_env.isIE8) {
	            this.contentPage = newPage;
	        } else {
	            var cleanup = function () {
	                newPage.removeEventListener('transitionend', cleanup);
	                newPage.removeEventListener('webkitTransitionEnd', cleanup);
	                // this.panelContentDiv.removeChild(this.contentPage);
	                this.contentPage = newPage;
	            }.bind(this);
	            if (this.contentPage) {
	                newPage.addEventListener('transitionend', cleanup);
	                newPage.addEventListener('webkitTransitionEnd', cleanup);
	            }
	            window.requestAnimationFrame(function () {
	                (0, _dom.addClass)(this.contentPage, 'is-hidden');
	                (0, _dom.removeClass)(newPage, 'zoom-in');
	            }.bind(this));
	        }
	    },

	    setValue: function setValue(value) {
	        value = value ? value : '';
	        if (value && value.indexOf('-') > -1) {
	            var vA = value.split("-");
	            this.year = vA[0];
	            var month = vA[1];
	            this.month = month % 12;
	            if (this.month == 0) this.month = 12;

	            value = this.year + '-' + this.month;
	        }
	        this.value = value;
	        this.input.value = value;
	        this.trigger('valueChange', { value: value });
	    },

	    focusEvent: function focusEvent() {
	        var self = this;
	        (0, _event.on)(this.input, 'focus', function (e) {
	            self._inputFocus = true;
	            self.show(e);
	            (0, _event.stopEvent)(e);
	        });
	    },

	    //下拉图标的点击事件
	    clickEvent: function clickEvent() {
	        var self = this;
	        var caret = this.element.nextSibling;
	        (0, _event.on)(caret, 'click', function (e) {
	            self.input.focus();
	            (0, _event.stopEvent)(e);
	        });
	    },

	    show: function show(evt) {
	        var oThis = this;
	        if (this.value && this.value.indexOf('-') > -1) {
	            var vA = this.value.split("-");
	            this.year = vA[0];
	            var month = vA[1];
	            this.month = month % 12;
	            if (this.month == 0) this.month = 12;
	        }
	        this.createPanel();
	        /*因为元素可能变化位置，所以显示的时候需要重新计算*/
	        this.width = this.element.offsetWidth;
	        if (this.width < 300) this.width = 300;

	        this.panelDiv.style.width = this.width + 'px';

	        if (this.options.showFix) {
	            document.body.appendChild(this.panelDiv);
	            this.panelDiv.style.position = 'fixed';
	            (0, _dom.showPanelByEle)({
	                ele: this.input,
	                panel: this.panelDiv,
	                position: "bottomLeft"
	            });
	        } else {
	            //    this.element.parentNode.appendChild(this.panelDiv);
	            // //调整left和top
	            //    this.left = this.element.offsetLeft;
	            //    var inputHeight = this.element.offsetHeight;
	            //    this.top = this.element.offsetTop + inputHeight;
	            //    this.panelDiv.style.left = this.left + 'px';
	            //    this.panelDiv.style.top = this.top + 'px';

	            var bodyWidth = document.body.clientWidth,
	                bodyHeight = document.body.clientHeight,
	                panelWidth = this.panelDiv.offsetWidth,
	                panelHeight = this.panelDiv.offsetHeight;

	            this.element.appendChild(this.panelDiv);
	            this.element.style.position = 'relative';
	            this.left = this.input.offsetLeft;
	            var inputHeight = this.input.offsetHeight;
	            this.top = this.input.offsetTop + inputHeight;

	            if (this.left + panelWidth > bodyWidth) {
	                this.left = bodyWidth - panelWidth;
	            }

	            if (this.top + panelHeight > bodyHeight) {
	                this.top = bodyHeight - panelHeight;
	            }

	            this.panelDiv.style.left = this.left + 'px';
	            this.panelDiv.style.top = this.top + 'px';
	        }

	        this.panelDiv.style.zIndex = (0, _dom.getZIndex)();
	        (0, _dom.addClass)(this.panelDiv, 'is-visible');
	        var oThis = this;
	        var callback = function callback(e) {
	            if (e !== evt && e.target !== oThis.input && !oThis.clickPanel(e.target) && self._inputFocus != true) {
	                // document.removeEventListener('click', callback);
	                (0, _event.off)(document, 'click', callback);
	                oThis.hide();
	            }
	        };
	        (0, _event.on)(document, 'click', callback);
	        // document.addEventListener('click', callback);
	    },

	    clickPanel: function clickPanel(dom) {
	        while (dom) {
	            if (dom == this.panelDiv) {
	                return true;
	            } else {
	                dom = dom.parentNode;
	            }
	        }
	        return false;
	    },

	    hide: function hide() {
	        (0, _dom.removeClass)(this.panelDiv, 'is-visible');
	        this.panelDiv.style.zIndex = -1;
	    }
	}); /**
	     * Module : neoui-year
	     * Author : liuyk(liuyk@yonyou.com)
	     * Date   : 2016-08-11 15:17:07
	     */

	_compMgr.compMgr.regComp({
	    comp: YearMonth,
	    compAsString: 'u.YearMonth',
	    css: 'u-yearmonth'
	});
	if (document.readyState && document.readyState === 'complete') {
	    _compMgr.compMgr.updateComp();
	} else {
	    (0, _event.on)(window, 'load', function () {
	        //扫描并生成控件
	        _compMgr.compMgr.updateComp();
	    });
	}
	exports.YearMonth = YearMonth;

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.TreeAdapter = undefined;

	var _baseAdapter = __webpack_require__(76);

	var _neouiYear = __webpack_require__(124);

	var _util = __webpack_require__(10);

	var _indexDataTable = __webpack_require__(29);

	var _compMgr = __webpack_require__(4);

	var TreeAdapter = _baseAdapter.BaseAdapter.extend({

		initialize: function initialize(options) {
			var opt = options['options'] || {},
			    viewModel = options['model'];
			var element = typeof options['el'] === 'string' ? document.querySelector(options['el']) : options['el'];
			var app = options['app'];
			this.id = opt['id'];
			options = opt;

			var oThis = this;
			this.dataTable = (0, _util.getJSObject)(viewModel, options["data"]);
			this.element = element;
			this.$element = $(element);
			this.id = options['id'];
			this.element.id = this.id;
			this.options = options;
			this.events = $.extend(true, {}, options.events);
			var treeSettingDefault = {
				//			async: {  //缓加载
				//				enable: oThis.options.asyncFlag,
				//				url: oThis.options.asyncFun
				//			},
				data: {
					simpleData: {
						enable: true
					}
				},
				check: {
					chkboxType: {
						"Y": "",
						"N": ""
					}
				},
				callback: {
					//点击前
					beforeClick: function beforeClick(e, id, node) {
						if (oThis.events.beforeClick) {
							(0, _util.getFunction)(viewModel, oThis.events.beforeClick)(e, id, node);
						}
					},
					// 选中/取消选中事件
					onCheck: function onCheck(e, id, node) {

						var nodes = oThis.tree.getChangeCheckedNodes();
						for (var i = 0; i < nodes.length; i++) {
							// 获取到节点的idValue
							var idValue = nodes[i].id;
							// 根据idValue查找到对应数据的rowId
							var rowId = oThis.getRowIdByIdValue(idValue);
							var index = oThis.dataTable.getIndexByRowId(rowId);
							if (nodes[i].checked) {
								// 选中数据行
								nodes[i].checkedOld = true;
								if (oThis.tree.setting.view.selectedMulti == true) {
									oThis.dataTable.addRowsSelect([index]);
								} else {
									oThis.dataTable.setRowSelect(index);
								}
							} else {
								nodes[i].checkedOld = false;
								oThis.dataTable.setRowUnSelect(index);
							}
						}
					},
					// 单选时点击触发选中
					onClick: function onClick(e, id, node) {
						//点击时取消所有超链接效果
						$('#' + id + ' li').removeClass('focusNode');
						$('#' + id + ' a').removeClass('focusNode');
						//添加focusNode样式
						$('#' + node.tId).addClass('focusNode');
						$('#' + node.tId + '_a').addClass('focusNode');
						// 获取到节点的idValue
						var idValue = node.id;
						// 根据idValue查找到对应数据的rowId
						var rowId = oThis.getRowIdByIdValue(idValue);
						var index = oThis.dataTable.getIndexByRowId(rowId);
						oThis.dataTable.setRowSelect(index);
						if (oThis.events.onClick) {
							(0, _util.getFunction)(viewModel, oThis.events.onClick)(e, id, node);
						}
					}
				}

			};

			var setting = {};
			if (this.options.setting) {
				//if (typeof(JSON) == "undefined")
				//	setting = eval("(" + this.options.setting + ")");
				//else
				setting = (0, _util.getJSObject)(viewModel, this.options.setting) || (0, _util.getJSObject)(window, this.options.setting);
			}

			// 遍历callback先执行默认之后再执行用户自定义的。
			var callbackObj = treeSettingDefault.callback;
			var userCallbackObj = setting.callback;
			for (var f in callbackObj) {
				var fun = callbackObj[f],
				    userFun = userCallbackObj && userCallbackObj[f];
				if (userFun) {
					var newF = function newF() {
						fun.apply(this, arguments);
						userFun.apply(this, arguments);
					};
					userCallbackObj[f] = newF;
				}
			}

			var treeSetting = $.extend(true, {}, treeSettingDefault, setting);

			var treeData = [];
			// 根据idField、pidField、nameField构建ztree所需data
			var data = this.dataTable.rows();
			if (data.length > 0) {
				if (this.options.codeTree) {
					// 首先按照string进行排序
					data.sort(function (a, b) {
						var aObj = a.data;
						var bObj = b.data;
						var v1 = aObj[oThis.options.idField].value + '';
						var v2 = bObj[oThis.options.idField].value + '';
						try {
							return v1.localeCompare(v2);
						} catch (e) {
							return 0;
						}
					});
					var idArr = new Array();
					$.each(data, function () {
						var dataObj = this.data;
						var idValue = dataObj[oThis.options.idField].value;
						idArr.push(idValue);
					});
					var preValue = '';
					$.each(data, function () {
						var value = {};
						var dataObj = this.data;
						var idValue = dataObj[oThis.options.idField].value;
						var nameValue = dataObj[oThis.options.nameField].value;
						var pidValue = '';
						var startFlag = -1;
						// 如果当前值包含上一个值则上一个值为pid
						if (preValue != '') {
							var startFlag = idValue.indexOf(preValue);
						}
						if (startFlag == 0) {
							pidValue = preValue;
						} else {
							for (var i = 1; i < preValue.length; i++) {
								var s = preValue.substr(0, i);
								var f = idValue.indexOf(s);
								if (f == 0) {
									var index = $.inArray(s, idArr);
									if (index > 0 || index == 0) {
										pidValue = s;
									}
								} else {
									break;
								}
							}
						}
						value['id'] = idValue;
						value['pId'] = pidValue;
						value['name'] = nameValue;

						treeData.push(value);
						preValue = idValue;
					});
				} else {
					var values = new Array();
					$.each(data, function () {
						var value = {};
						var dataObj = this.data;
						var idValue = dataObj[oThis.options.idField].value;
						var pidValue = dataObj[oThis.options.pidField].value;
						var nameValue = dataObj[oThis.options.nameField].value;

						value['id'] = idValue;
						value['pId'] = pidValue;
						value['name'] = nameValue;
						treeData.push(value);
					});
				}
			}

			this.tree = $.fn.zTree.init(this.$element, treeSetting, treeData);

			// dataTable事件
			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_SELECT, function (event) {
				/*index转化为grid的index*/
				$.each(event.rowIds, function () {
					var row = oThis.dataTable.getRowByRowId(this);
					var dataObj = row.data;
					var idValue = dataObj[oThis.options.idField].value;
					var node = oThis.tree.getNodeByParam('id', idValue);
					if (oThis.tree.setting.view.selectedMulti == true && !node.checked) {
						oThis.tree.checkNode(node, true, false, true);
					} else {
						oThis.tree.selectNode(node, false);
					}
				});
			});

			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_UNSELECT, function (event) {
				/*index转化为grid的index*/
				$.each(event.rowIds, function () {
					var row = oThis.dataTable.getRowByRowId(this);
					var dataObj = row.data;
					var idValue = dataObj[oThis.options.idField].value;
					var node = oThis.tree.getNodeByParam('id', idValue);
					if (oThis.tree.setting.view.selectedMulti == true && node.checked) {
						oThis.tree.checkNode(node, false, true, true);
					} else {
						oThis.tree.cancelSelectedNode(node);
					}
				});
			});

			this.dataTable.on(_indexDataTable.DataTable.ON_INSERT, function (event) {
				//var gridRows = new Array();
				var dataArray = [],
				    nodes = [];
				var hasChild = false; //是否含有子节点
				$.each(event.rows, function () {
					var value = {},
					    hasPar = false;
					var dataObj = this.data;
					var idValue = dataObj[oThis.options.idField].value;
					var pidValue = dataObj[oThis.options.pidField].value;
					var nameValue = dataObj[oThis.options.nameField].value;
					value['id'] = idValue;
					value['pId'] = pidValue;
					value['name'] = nameValue;
					var childNode = oThis.tree.getNodeByParam('pid', idValue);
					var pNode = oThis.tree.getNodeByParam('id', pidValue);
					if (childNode && childNode.length > 0) {
						hasChild = true;
					}
					if (pNode && pNode.length > 0) {
						hasPar = true;
						//oThis.tree.addNodes(pNode, value, true);
					}
					if (!hasChild && hasPar) {
						//不存在子节点,存在父节点之间插入
						oThis.tree.addNodes(pNode, value, true);
					} else {
						dataArray.push(value);
					}
				});
				if (!hasChild) {
					//如果没有子节点，将当前节点作为根节点之间插入
					nodes = oThis.tree.transformTozTreeNodes(dataArray);
					oThis.tree.addNodes(null, nodes, true);
				} else {//如果含有子节点,重新渲染

				}
			});

			this.dataTable.on(_indexDataTable.DataTable.ON_DELETE, function (event) {
				/*index转化为grid的index*/
				var gridIndexs = new Array();
				if (this.deleteRows.length > 0) {

					for (var i = 0; i < this.deleteRows.length; i++) {
						var row = this.deleteRows[i];
						var dataObj = row.data;
						var idValue = dataObj[oThis.options.idField].value;
						var node = oThis.tree.getNodeByParam('id', idValue);
						oThis.tree.removeNode(node);
					}
				}
			});

			this.dataTable.on(_indexDataTable.DataTable.ON_DELETE_ALL, function (event) {
				var nodes = oThis.tree.getNodes();
				for (var i = 0, l = nodes.length; i < l; i++) {
					var node = oThis.tree.getNodeByParam('id', nodes[i].id);
					oThis.tree.removeNode(node);
					i--;
					l = nodes.length;
				}
			});

			// 加载数据,只考虑viewModel传入grid
			this.dataTable.on(_indexDataTable.DataTable.ON_LOAD, function (data) {
				var data = oThis.dataTable.rows();
				if (data.length > 0) {
					var values = new Array();
					$.each(data, function () {
						var value = {};
						var dataObj = this.data;
						var idValue = dataObj[oThis.options.idField].value;
						var pidValue = dataObj[oThis.options.pidField].value;
						var nameValue = dataObj[oThis.options.nameField].value;

						value['id'] = idValue;
						value['pId'] = pidValue;
						value['name'] = nameValue;
						treeData.push(value);
					});
				}

				this.tree = $.fn.zTree.init(this.$element, treeSetting, treeData);
			});

			this.dataTable.on(_indexDataTable.DataTable.ON_VALUE_CHANGE, function (event) {
				var row = oThis.dataTable.getRowByRowId(event.rowId);
				if (!row) return;
				var treeArray = oThis.tree.getNodes();
				var id = row.getValue(oThis.options.idField);
				var node = oThis.tree.getNodeByParam('id', id);
				if (!node && treeArray) {
					//如果node为null则取树数组的最后一个节点

					node = treeArray[treeArray.length - 1];
				}
				var field = event.field;
				var value = event.newValue;
				if (oThis.options.idField == field && node) {
					node.id = value;
					oThis.tree.updateNode(node);
				}
				if (oThis.options.nameField == field && node) {
					node.name = value;
					oThis.tree.updateNode(node);
				} else if (oThis.options.pidField == field) {
					var targetNode = oThis.tree.getNodeByParam('id', value);
					oThis.tree.moveNode(targetNode, node, "inner");
				}
			});

			// 通过树id获取dataTable的rowId
			this.getRowIdByIdValue = function (idValue) {
				var oThis = this;
				var rowId = null;
				$.each(this.dataTable.rows(), function () {
					var dataObj = this.data;
					var id = this.rowId;
					if (dataObj[oThis.options.idField].value == idValue) {
						rowId = id;
					}
				});
				return rowId;
			};

			return this;
		},

		getName: function getName() {
			return 'tree';
		}

	}); /**
	     * Module : Kero tree adapter
	     * Author : Kvkens(yueming@yonyou.com)
	     * Date	  : 2016-08-16 10:44:14
	     */


	_compMgr.compMgr.addDataAdapter({
		adapter: TreeAdapter,
		name: 'tree'
		//dataType: 'float'
	});

	exports.TreeAdapter = TreeAdapter;

/***/ }
/******/ ]);