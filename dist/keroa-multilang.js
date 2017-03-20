/*!
 * neoui-kero v3.1.27
 * neoui kero
 * author : yonyou FED
 * homepage : https://github.com/iuap-design/neoui-kero#readme
 * bugs : https://github.com/iuap-design/neoui-kero/issues
 */
!function(modules) {
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: !1,
            exports: {}
        };
        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
        module.l = !0, module.exports;
    }
    var installedModules = {};
    __webpack_require__.m = modules, __webpack_require__.c = installedModules, __webpack_require__.i = function(value) {
        return value;
    }, __webpack_require__.d = function(exports, name, getter) {
        __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
            configurable: !1,
            enumerable: !0,
            get: getter
        });
    }, __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function() {
            return module.default;
        } : function() {
            return module;
        };
        return __webpack_require__.d(getter, "a", getter), getter;
    }, __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 12);
}([ function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.d(__webpack_exports__, "e", function() {
        return createShellObject;
    }), __webpack_require__.d(__webpack_exports__, "b", function() {
        return isArray;
    }), __webpack_require__.d(__webpack_exports__, "c", function() {
        return inArray;
    }), __webpack_require__.d(__webpack_exports__, "d", function() {
        return isDomElement;
    }), __webpack_require__.d(__webpack_exports__, "a", function() {
        return each;
    });
    var createShellObject = ("function" == typeof Symbol && Symbol.iterator, function(proto) {
        var exf = function() {};
        return exf.prototype = proto, new exf();
    }), isArray = Array.isArray || function(val) {
        return "[object Array]" === Object.prototype.toString.call(val);
    }, inArray = function(node, arr) {
        if (!arr instanceof Array) throw "arguments is not Array";
        for (var i = 0, k = arr.length; i < k; i++) if (node == arr[i]) return !0;
        return !1;
    }, isDomElement = function(obj) {
        return window.HTMLElement ? obj instanceof HTMLElement : obj && obj.tagName && 1 === obj.nodeType;
    }, each = function(obj, callback) {
        if (obj.forEach) obj.forEach(function(v, k) {
            callback(k, v);
        }); else {
            if (!(obj instanceof Object)) return;
            for (var k in obj) callback(k, obj[k]);
        }
    };
    try {
        NodeList.prototype.forEach = Array.prototype.forEach;
    } catch (e) {}
    String.prototype.lengthb = function() {
        return this.replace(/[^\x00-\xff]/g, "**").length;
    }, String.prototype.replaceAll = function(AFindText, ARepText) {
        var raRegExp = new RegExp(AFindText, "g");
        return this.replace(raRegExp, ARepText);
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__env__ = __webpack_require__(11);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return on;
    }), __webpack_require__.d(__webpack_exports__, "c", function() {
        return off;
    }), __webpack_require__.d(__webpack_exports__, "b", function() {
        return stopEvent;
    });
    var u = {};
    u.event = {};
    var touchStartEvent = __WEBPACK_IMPORTED_MODULE_0__env__.a.hasTouch ? "touchstart" : "mousedown", touchStopEvent = __WEBPACK_IMPORTED_MODULE_0__env__.a.hasTouch ? "touchend" : "mouseup", touchMoveEvent = __WEBPACK_IMPORTED_MODULE_0__env__.a.hasTouch ? "touchmove" : "mousemove";
    u.event.tap = {
        tapholdThreshold: 750,
        emitTapOnTaphold: !0,
        touchstartFun: function() {
            trigger(this, "vmousedown");
        },
        touchendFun: function() {
            trigger(this, "vmouseup"), trigger(this, "vclick");
        },
        setup: function() {
            var thisObject = this, isTaphold = !1;
            on(thisObject, "vmousedown", function(event) {
                function clearTapTimer() {
                    clearTimeout(timer);
                }
                function clearTapHandlers() {
                    clearTapTimer(), off(thisObject, "vclick"), off(thisObject, "vmouseup"), off(document, "vmousecancel");
                }
                function clickHandler(event) {
                    clearTapHandlers(), isTaphold || origTarget !== event.target ? isTaphold && event.preventDefault() : trigger(thisObject, "tap");
                }
                if (isTaphold = !1, event.which && 1 !== event.which) return !1;
                var timer, origTarget = event.target;
                on(thisObject, "vmouseup", clearTapTimer), on(thisObject, "vclick", clickHandler), 
                on(document, "vmousecancel", clearTapHandlers), timer = setTimeout(function() {
                    u.event.tap.emitTapOnTaphold || (isTaphold = !0), trigger(thisObject, "taphold"), 
                    clearTapHandlers();
                }, u.event.tap.tapholdThreshold);
            }), on(thisObject, "touchstart", u.event.tap.touchstartFun), on(thisObject, "touchend", u.event.tap.touchendFun);
        },
        teardown: function() {
            off(thisObject, "vmousedown"), off(thisObject, "vclick"), off(thisObject, "vmouseup"), 
            off(document, "vmousecancel");
        }
    }, u.event.taphold = u.event.tap, u.event.swipe = {
        scrollSupressionThreshold: 30,
        durationThreshold: 1e3,
        horizontalDistanceThreshold: 30,
        verticalDistanceThreshold: 30,
        getLocation: function(event) {
            var winPageX = window.pageXOffset, winPageY = window.pageYOffset, x = event.clientX, y = event.clientY;
            return 0 === event.pageY && Math.floor(y) > Math.floor(event.pageY) || 0 === event.pageX && Math.floor(x) > Math.floor(event.pageX) ? (x -= winPageX, 
            y -= winPageY) : (y < event.pageY - winPageY || x < event.pageX - winPageX) && (x = event.pageX - winPageX, 
            y = event.pageY - winPageY), {
                x: x,
                y: y
            };
        },
        start: function(event) {
            var data = event.touches ? event.touches[0] : event, location = u.event.swipe.getLocation(data);
            return {
                time: new Date().getTime(),
                coords: [ location.x, location.y ],
                origin: event.target
            };
        },
        stop: function(event) {
            var data = event.touches ? event.touches[0] : event, location = u.event.swipe.getLocation(data);
            return {
                time: new Date().getTime(),
                coords: [ location.x, location.y ]
            };
        },
        handleSwipe: function(start, stop, thisObject, origTarget) {
            if (stop.time - start.time < u.event.swipe.durationThreshold && Math.abs(start.coords[0] - stop.coords[0]) > u.event.swipe.horizontalDistanceThreshold && Math.abs(start.coords[1] - stop.coords[1]) < u.event.swipe.verticalDistanceThreshold) {
                var direction = start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight";
                return trigger(thisObject, "swipe"), trigger(thisObject, direction), !0;
            }
            return !1;
        },
        eventInProgress: !1,
        setup: function() {
            var events, thisObject = this, context = {};
            events = thisObject["mobile-events"], events || (events = {
                length: 0
            }, thisObject["mobile-events"] = events), events.length++, events.swipe = context, 
            context.start = function(event) {
                if (!u.event.swipe.eventInProgress) {
                    u.event.swipe.eventInProgress = !0;
                    var stop, start = u.event.swipe.start(event), origTarget = event.target, emitted = !1;
                    context.move = function(event) {
                        start && (stop = u.event.swipe.stop(event), emitted || (emitted = u.event.swipe.handleSwipe(start, stop, thisObject, origTarget)) && (u.event.swipe.eventInProgress = !1), 
                        Math.abs(start.coords[0] - stop.coords[0]) > u.event.swipe.scrollSupressionThreshold && event.preventDefault());
                    }, context.stop = function() {
                        emitted = !0, u.event.swipe.eventInProgress = !1, off(document, touchMoveEvent, context.move), 
                        context.move = null;
                    }, on(document, touchMoveEvent, context.move), on(document, touchStopEvent, context.stop);
                }
            }, on(thisObject, touchStartEvent, context.start);
        },
        teardown: function() {
            var events, context;
            events = thisObject["mobile-events"], events && (context = events.swipe, delete events.swipe, 
            0 === --events.length && (thisObject["mobile-events"] = null)), context && (context.start && off(thisObject, touchStartEvent, context.start), 
            context.move && off(document, touchMoveEvent, context.move), context.stop && off(document, touchStopEvent, context.stop));
        }
    }, u.event.swipeleft = u.event.swipe, u.event.swiperight = u.event.swipe;
    var event = u.event, on = function(element, eventName, child, listener) {
        if (element) {
            if (arguments.length < 4) listener = child, child = void 0; else var childlistener = function(e) {
                if (e) {
                    element.querySelectorAll(child).forEach(function(node) {
                        node == e.target && listener.call(e.target, e);
                    });
                }
            };
            if (element.uEvent || (element.uEvent = {}), element.uEvent[eventName]) {
                var lis = child ? childlistener : listener, hasLis = !1;
                element.uEvent[eventName].forEach(function(fn) {
                    fn == lis && (hasLis = !0);
                }), hasLis || element.uEvent[eventName].push(child ? childlistener : listener);
            } else element.uEvent[eventName] = [ child ? childlistener : listener ], u.event && u.event[eventName] && u.event[eventName].setup && u.event[eventName].setup.call(element), 
            element.uEvent[eventName + "fn"] = function(e) {
                e || (e = void 0 !== event && event ? event : window.event), element.uEvent[eventName].forEach(function(fn) {
                    try {
                        e.target = e.target || e.srcElement;
                    } catch (ee) {}
                    fn && fn.call(element, e);
                });
            }, element.addEventListener ? element.addEventListener(eventName, element.uEvent[eventName + "fn"]) : element.attachEvent ? element.attachEvent("on" + eventName, element.uEvent[eventName + "fn"]) : element["on" + eventName] = element.uEvent[eventName + "fn"];
        }
    }, off = function(element, eventName, listener) {
        if (listener) return void (element && element.uEvent && element.uEvent[eventName] && element.uEvent[eventName].forEach(function(fn, i) {
            fn == listener && element.uEvent[eventName].splice(i, 1);
        }));
        var eventfn;
        element && element.uEvent && element.uEvent[eventName + "fn"] && (eventfn = element.uEvent[eventName + "fn"]), 
        element.removeEventListener ? element.removeEventListener(eventName, eventfn) : element.removeEvent ? element.removeEvent("on" + eventName, eventfn) : delete element["on" + eventName], 
        u.event && u.event[eventName] && u.event[eventName].teardown && u.event[eventName].teardown.call(element), 
        element && element.uEvent && element.uEvent[eventName] && (element.uEvent[eventName] = void 0), 
        element && element.uEvent && element.uEvent[eventName + "fn"] && (element.uEvent[eventName + "fn"] = void 0);
    }, trigger = function(element, eventName) {
        element.uEvent && element.uEvent[eventName] && element.uEvent[eventName + "fn"]();
    }, stopEvent = function(e) {
        void 0 !== e && (e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0, 
        e && e.preventDefault ? e.preventDefault() : window.event.returnValue = !1);
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__enumerables__ = __webpack_require__(5);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return extend;
    });
    var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, extend = function(object, config) {
        var options, args = arguments;
        if (args.length > 1) for (var len = 1; len < args.length; len++) if (options = args[len], 
        object && options && "object" === (void 0 === options ? "undefined" : _typeof(options))) {
            var i, j, k;
            for (i in options) object[i] = options[i];
            if (__WEBPACK_IMPORTED_MODULE_0__enumerables__.a) for (j = __WEBPACK_IMPORTED_MODULE_0__enumerables__.a.length; j--; ) k = __WEBPACK_IMPORTED_MODULE_0__enumerables__.a[j], 
            options.hasOwnProperty && options.hasOwnProperty(k) && (object[k] = options[k]);
        }
        return object;
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    function _findRegisteredClass(name, optReplace) {
        for (var i = 0; i < CompMgr.registeredControls.length; i++) if (CompMgr.registeredControls[i].className === name) return void 0 !== optReplace && (CompMgr.registeredControls[i] = optReplace), 
        CompMgr.registeredControls[i];
        return !1;
    }
    function _getUpgradedListOfElement(element) {
        var dataUpgraded = element.getAttribute("data-upgraded");
        return null === dataUpgraded ? [ "" ] : dataUpgraded.split(",");
    }
    function _isElementUpgraded(element, jsClass) {
        return _getUpgradedListOfElement(element).indexOf(jsClass) != -1;
    }
    function _upgradeElement(element, optJsClass) {
        if (!("object" === (void 0 === element ? "undefined" : _typeof(element)) && element instanceof Element)) throw new Error("Invalid argument provided to upgrade MDL element.");
        var upgradedList = _getUpgradedListOfElement(element), classesToUpgrade = [];
        if (optJsClass) _isElementUpgraded(element, optJsClass) || classesToUpgrade.push(_findRegisteredClass(optJsClass)); else for (var className = element.className, i = 0; i < CompMgr.registeredControls.length; i++) {
            var component = CompMgr.registeredControls[i];
            className.indexOf(component.cssClass) > -1 && classesToUpgrade.indexOf(component) === -1 && !_isElementUpgraded(element, component.className) && classesToUpgrade.push(component);
        }
        for (var registeredClass, i = 0, n = classesToUpgrade.length; i < n; i++) {
            if (!(registeredClass = classesToUpgrade[i])) throw new Error("Unable to find a registered component for the given class.");
            if (!element[registeredClass.className]) {
                upgradedList.push(registeredClass.className), element.setAttribute("data-upgraded", upgradedList.join(","));
                var instance = new registeredClass.classConstructor(element);
                CompMgr.createdControls.push(instance);
                for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) registeredClass.callbacks[j](element);
                element[registeredClass.className] = instance;
            }
        }
    }
    function _upgradeDomInternal(optJsClass, optCssClass, ele) {
        if (void 0 === optJsClass && void 0 === optCssClass) for (var i = 0; i < CompMgr.registeredControls.length; i++) _upgradeDomInternal(CompMgr.registeredControls[i].className, registeredControls[i].cssClass, ele); else {
            var jsClass = optJsClass;
            if (!optCssClass) {
                var registeredClass = _findRegisteredClass(jsClass);
                registeredClass && (optCssClass = registeredClass.cssClass);
            }
            var elements;
            elements = ele ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.c)(ele, optCssClass) ? [ ele ] : ele.querySelectorAll("." + optCssClass) : document.querySelectorAll("." + optCssClass);
            for (var n = 0; n < elements.length; n++) _upgradeElement(elements[n], jsClass);
        }
    }
    var __WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__ = __webpack_require__(4), __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_util__ = __webpack_require__(0);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return compMgr;
    });
    var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, CompMgr = {
        plugs: {},
        dataAdapters: {},
        registeredControls: [],
        createdControls: [],
        apply: function(options) {
            if (options) var _el = options.el || document.body, model = options.model;
            "string" == typeof _el && (_el = document.body.querySelector(_el)), null != _el && "object" == (void 0 === _el ? "undefined" : _typeof(_el)) || (_el = document.body), 
            _el.querySelectorAll("[u-meta]").forEach(function(element) {
                if (!element.comp) {
                    var options = JSON.parse(element.getAttribute("u-meta"));
                    if (options && options.type) {
                        var comp = CompMgr.createDataAdapter({
                            el: element,
                            options: options,
                            model: model
                        });
                        comp && (element.adpt = comp, element["u-meta"] = comp);
                    }
                }
            });
        },
        addPlug: function(config) {
            var plug = config.plug, name = config.name;
            if (this.plugs || (this.plugs = {}), this.plugs[name]) throw new Error("plug has exist:" + name);
            plug.compType = name, this.plugs[name] = plug;
        },
        addDataAdapter: function(config) {
            var adapter = config.adapter, name = config.name;
            if (this.dataAdapters || (dataAdapters = {}), this.dataAdapters[name]) throw new Error("dataAdapter has exist:" + name);
            this.dataAdapters[name] = adapter;
        },
        getDataAdapter: function(name) {
            if (name) return this.dataAdapters || (dataAdapters = {}), this.dataAdapters[name];
        },
        createDataAdapter: function(options) {
            var opt = options.options, type = opt.type, id = opt.id, adpt = this.dataAdapters[type];
            if (!adpt) return null;
            var comp = new adpt(options);
            return comp.type = type, comp.id = id, comp;
        },
        _createComp: function(options) {
            var opt = options.options, type = opt.type, plug = this.plugs[type];
            if (!plug) return null;
            var comp = new plug(options);
            return comp.type = type, comp;
        },
        regComp: function(config) {
            var newConfig = {
                classConstructor: config.comp,
                className: config.compAsString || config.compAsString,
                cssClass: config.css || config.css,
                callbacks: [],
                dependencies: config.dependencies || []
            };
            config.comp.prototype.compType = config.compAsString;
            for (var i = 0; i < this.registeredControls.length; i++) {
                var item = this.registeredControls[i];
                if (item.cssClass === newConfig.cssClass) throw new Error("The provided cssClass has already been registered: " + item.cssClass);
                if (item.className === newConfig.className) throw new Error("The provided className has already been registered");
            }
            this.registeredControls.push(newConfig);
        },
        updateComp: function(ele) {
            this._reorderComps();
            for (var n = 0; n < this.registeredControls.length; n++) _upgradeDomInternal(this.registeredControls[n].className, null, ele);
        },
        _reorderComps: function() {
            function traverse(control) {
                if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_util__.c)(control, tmpArray)) {
                    if (control.dependencies.length > 0) for (var i = 0, len = control.dependencies.length; i < len; i++) {
                        var childControl = dictory[control.dependencies[i]];
                        traverse(childControl);
                    }
                    tmpArray.push(control);
                }
            }
            for (var tmpArray = [], dictory = {}, n = 0; n < this.registeredControls.length; n++) dictory[this.registeredControls[n].className] = this.registeredControls[n];
            for (var n = 0; n < this.registeredControls.length; n++) traverse(this.registeredControls[n]);
            this.registeredControls = tmpArray;
        }
    }, compMgr = CompMgr;
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__(1);
    __webpack_require__.d(__webpack_exports__, "d", function() {
        return removeClass;
    }), __webpack_require__.d(__webpack_exports__, "c", function() {
        return hasClass;
    }), __webpack_require__.d(__webpack_exports__, "b", function() {
        return css;
    }), __webpack_require__.d(__webpack_exports__, "a", function() {
        return wrap;
    });
    var removeClass = function(element, value) {
        return element && (void 0 === element.classList ? u._removeClass ? u._removeClass(element, value) : $(element).removeClass(value) : element.classList.remove(value)), 
        this;
    }, hasClass = function(element, value) {
        return !!element && ((!element.nodeName || "#text" !== element.nodeName && "#comment" !== element.nodeName) && (void 0 === element.classList ? u._hasClass ? u._hasClass(element, value) : $(element).hasClass(value) : element.classList.contains(value)));
    }, css = function(element, csstext, val) {
        if (csstext instanceof Object) for (var k in csstext) {
            var tmpcss = csstext[k];
            [ "width", "height", "top", "bottom", "left", "right" ].indexOf(k) > -1 && isNumber(tmpcss) && (tmpcss += "px"), 
            element.style[k] = tmpcss;
        } else {
            if (!(arguments.length > 2)) return getStyle(element, csstext);
            element.style[csstext] = val;
        }
    }, wrap = function(element, parent) {
        var p = makeDOM(parent);
        element.parentNode.insertBefore(p, element), p.appendChild(element);
    }, getStyle = function(element, key) {
        var allCSS;
        return allCSS = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle, 
        void 0 !== allCSS[key] ? allCSS[key] : "";
    }, makeDOM = function(htmlString) {
        var tempDiv = document.createElement("div");
        return tempDiv.innerHTML = htmlString, tempDiv.children[0];
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return enumerables;
    }), __webpack_require__.d(__webpack_exports__, "b", function() {
        return U_LANGUAGES;
    }), __webpack_require__.d(__webpack_exports__, "c", function() {
        return U_THEME;
    }), __webpack_require__.d(__webpack_exports__, "d", function() {
        return U_LOCALE;
    }), __webpack_require__.d(__webpack_exports__, "e", function() {
        return U_USERCODE;
    });
    var U_LANGUAGES = "i_languages", U_THEME = "u_theme", U_LOCALE = "u_locale", U_USERCODE = "usercode", enumerables = !0, enumerablesTest = {
        toString: 1
    };
    Object.prototype.toString;
    for (var i in enumerablesTest) enumerables = null;
    enumerables && (enumerables = [ "hasOwnProperty", "valueOf", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "constructor" ]);
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__neoui_BaseComponent__ = __webpack_require__(8), __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_extend__ = __webpack_require__(2), __WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_util__ = __webpack_require__(0), __WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_dom__ = __webpack_require__(4), __WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_event__ = __webpack_require__(1), __WEBPACK_IMPORTED_MODULE_5_compox_src_compMgr__ = __webpack_require__(3);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return Multilang;
    });
    var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, Multilang = __WEBPACK_IMPORTED_MODULE_0__neoui_BaseComponent__.a.extend({
        init: function() {
            this.element;
            this.options = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_extend__.a)({}, this.DEFAULTS, this.options), 
            this.field = this.options.field || "name", this.multinfo(this.options.multinfo), 
            this.addData(this.options.multidata);
        }
    });
    Multilang.fn = Multilang.prototype, Multilang.fn.addData = function(val) {
        var tmparray, target = this.element, target_div = target.parentNode;
        tmparray = null === val || void 0 === val ? [] : "object" == (void 0 === val ? "undefined" : _typeof(val)) ? val : val.split(","), 
        target_div.value = tmparray, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_util__.a)(tmparray, function(i, node) {
            target_div.querySelectorAll(".m_context")[i].innerHTML = node;
        });
    }, Multilang.fn.multinfo = function(sort) {
        var target = this.element, self = this, tmplabel = "", close_menu = !1;
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_util__.b)(sort)) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_dom__.a)(target, "<div class='multilang_body'><input class='lang_value' contenteditable='true'><span class='uf uf-caretdown lang_icon'><span class='m_icon'></span></span>"), 
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_dom__.b)(target, "display", "none"), 
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_util__.a)(sort, function(i, node) {
                tmplabel += i ? "<label attr='" + self.field + (i + 1) + "'><span class='m_context'></span><span class='m_icon'>" + node + "</span></label>" : "<label attr='" + self.field + "'><span class='m_context'></span><span class='m_icon'>" + node + "</span></label>";
            });
            var target_div = target.parentNode;
            target_div.insertAdjacentHTML("beforeEnd", "<div class='multilang_menu '>" + tmplabel + "</div>");
            var tmpIconv = target_div.querySelector(".lang_icon"), target_menu = target_div.querySelector(".multilang_menu"), target_labels = target_menu.querySelectorAll("label"), tmpvaluebox = target_div.querySelector(".lang_value");
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_event__.a)(tmpIconv, "click", function() {
                target_div.querySelector(".lang_value").focus(), "block" == __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_dom__.b)(target_menu, "display") ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_dom__.b)(target_menu, "display", "none") : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_dom__.b)(target_menu, "display", "block");
            }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_event__.a)(target_menu, "mouseenter", function() {
                close_menu = !1;
            }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_event__.a)(target_menu, "mouseleave", function() {
                close_menu = !0;
            }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_event__.a)(tmpvaluebox, "blur", function(e) {
                var target_input = $(this), target_div = target_input.parents(".multilang_body"), target = e.target, tmpkey = target.className.split(" ")[2], tmptext = target.value;
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_dom__.c)(target, "ready_change") && self.changeData(target_div[0], tmpkey, tmptext);
            }), target_labels.forEach(function(ele) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_event__.a)(ele, "click", function() {
                    var target_label = this, tempField = target_label.getAttribute("attr"), tmptext = target_label.querySelector(".m_context").innerHTML, tmpicon = target_label.querySelector(".m_icon").cloneNode(!0);
                    tmpvaluebox.setAttribute("class", "ready_change lang_value " + tempField), tmpvaluebox.value = tmptext, 
                    tmpvaluebox.focus();
                    var tmpicom = target_div.querySelector(".lang_icon"), oldicon = target_div.querySelector(".m_icon");
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_dom__.d)(tmpicom, "uf-caretdown"), 
                    tmpicom.replaceChild(tmpicon, oldicon);
                });
            });
        } else console.error("Not object");
    }, Multilang.fn.changeData = function(target_div, field, text) {
        var tmpdata = target_div.value, tmplabel = target_div.querySelector("label[attr='" + field + "']"), tmpcontext = tmplabel.querySelector(".m_context");
        tmpcontext.innerHTML = text, tmpcontext.value = text, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_util__.a)(target_div.querySelectorAll(".m_context"), function(i, node) {
            tmpdata[i] = node.innerHTML;
        }), this.trigger("change.u.multilang", {
            newValue: text,
            field: field
        });
    }, Multilang.fn.getData = function() {
        return $(multilang.target).next(".multilang_body")[0].value;
    }, Multilang.fn.setDataValue = function(field, value) {
        var target_div = this.element.closest(".multilang_body"), tmplabel = target_div.querySelector("label[attr='" + field + "']"), tmpcontext = tmplabel.querySelector(".m_context");
        tmpcontext.innerHTML = value, tmpcontext.value = value;
        var tmpdata = [];
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_util__.a)(this.element.closest(".multilang_body").querySelectorAll(".m_context"), function(i, node) {
            tmpdata[i] = node.innerHTML;
        }), this.element.closest(".multilang_body").value = tmpdata;
    }, __WEBPACK_IMPORTED_MODULE_5_compox_src_compMgr__.a.regComp({
        comp: Multilang,
        compAsString: "u.Multilang",
        css: "u-multilang"
    }), document.readyState && "complete" === document.readyState ? __WEBPACK_IMPORTED_MODULE_5_compox_src_compMgr__.a.updateComp() : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_event__.a)(window, "load", function() {
        __WEBPACK_IMPORTED_MODULE_5_compox_src_compMgr__.a.updateComp();
    });
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__extend__ = __webpack_require__(2), __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(0), __WEBPACK_IMPORTED_MODULE_2__cookies__ = __webpack_require__(10), __WEBPACK_IMPORTED_MODULE_3__enumerables__ = __webpack_require__(5);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return core;
    });
    var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, environment = {}, clientAttributes = {}, sessionAttributes = {}, fn = {}, maskerMeta = {
        float: {
            precision: 2
        },
        datetime: {
            format: "YYYY-MM-DD HH:mm:ss",
            metaType: "DateTimeFormatMeta",
            speratorSymbol: "-"
        },
        time: {
            format: "HH:mm"
        },
        date: {
            format: "YYYY-MM-DD"
        },
        currency: {
            precision: 2,
            curSymbol: "￥"
        },
        percent: {},
        phoneNumber: {}
    };
    fn.getEnvironment = function() {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__.e)(environment);
    }, fn.getClientAttributes = function() {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__.e)(clientAttributes);
    }, fn.setContextPath = function(contextPath) {
        return environment[IWEB_CONTEXT_PATH] = contextPath;
    }, fn.getContextPath = function(contextPath) {
        return environment[IWEB_CONTEXT_PATH];
    }, fn.setClientAttribute = function(k, v) {
        clientAttributes[k] = v;
    }, fn.getSessionAttributes = function() {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__.e)(sessionAttributes);
    }, fn.setSessionAttribute = function(k, v) {
        sessionAttributes[k] = v, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__cookies__.a)("ISES_" + k, v);
    }, fn.removeClientAttribute = function(k) {
        clientAttributes[k] = null, execIgnoreError(function() {
            delete clientAttributes[k];
        });
    }, fn.getLocale = function() {
        return this.getEnvironment().locale;
    }, fn.getLanguages = function() {
        return this.getEnvironment().languages;
    }, fn.collectEnvironment = function() {
        var _env = this.getEnvironment(), _ses = this.getSessionAttributes();
        for (var i in clientAttributes) _ses[i] = clientAttributes[i];
        return _env.clientAttributes = _ses, _env;
    }, fn.setMaskerMeta = function(type, meta) {
        if ("function" == typeof type) getMetaFunc = type; else if (maskerMeta[type]) if ("object" != (void 0 === meta ? "undefined" : _typeof(meta))) maskerMeta[type] = meta; else for (var key in meta) maskerMeta[type][key] = meta[key]; else maskerMeta[type] = meta;
    }, fn.getMaskerMeta = function(type) {
        if ("function" == typeof getMetaFunc) {
            return getMetaFunc.call(this)[type];
        }
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__extend__.a)({}, maskerMeta[type]);
    }, environment.languages = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__cookies__.b)(__WEBPACK_IMPORTED_MODULE_3__enumerables__.b) ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__cookies__.b)(__WEBPACK_IMPORTED_MODULE_3__enumerables__.b).split(",") : navigator.language ? navigator.language : "zh-CN", 
    "zh-cn" == environment.languages && (environment.languages = "zh-CN"), "en-us" == environment.languages && (environment.languages = "en-US"), 
    environment.theme = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__cookies__.b)(__WEBPACK_IMPORTED_MODULE_3__enumerables__.c), 
    environment.locale = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__cookies__.b)(__WEBPACK_IMPORTED_MODULE_3__enumerables__.d), 
    environment.usercode = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__cookies__.b)(__WEBPACK_IMPORTED_MODULE_3__enumerables__.e), 
    document.cookie.replace(/ISES_(\w*)=([^;]*);?/gi, function(a, b, c) {
        sessionAttributes[b] = c;
    });
    var Core = function() {};
    Core.prototype = fn;
    var core = new Core();
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_class__ = __webpack_require__(9), __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_util__ = __webpack_require__(0), __WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__ = __webpack_require__(1), __WEBPACK_IMPORTED_MODULE_3_compox_src_compMgr__ = __webpack_require__(3);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return BaseComponent;
    });
    var BaseComponent = __WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_class__.a.create({
        initialize: function(element) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_util__.d)(element) ? (this.element = element, 
            this.options = {}) : (this.element = element.el, this.options = element), this.element = "string" == typeof this.element ? document.querySelector(this.element) : this.element, 
            this.compType = this.compType || this.constructor.compType, this.element[this.compType] = this, 
            this.element.init = !0, this.init();
        },
        on: function(name, callback) {
            return name = name.toLowerCase(), this._events || (this._events = {}), (this._events[name] || (this._events[name] = [])).push({
                callback: callback
            }), this;
        },
        trigger: function(name) {
            if (name = name.toLowerCase(), !this._events || !this._events[name]) return this;
            for (var args = Array.prototype.slice.call(arguments, 1), events = this._events[name], i = 0, count = events.length; i < count; i++) events[i].callback.apply(this, args);
            return this;
        },
        init: function() {},
        render: function() {},
        destroy: function() {
            delete this.element.comp, this.element.innerHTML = "";
        },
        addDomEvent: function(name, callback) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__.a)(this.element, name, callback), 
            this;
        },
        removeDomEvent: function(name, callback) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__.c)(this.element, name, callback), 
            this;
        },
        setEnable: function(enable) {
            return this;
        },
        isDomEvent: function(eventName) {
            return void 0 !== this.element["on" + eventName];
        },
        createDateAdapter: function(options) {
            var opt = options.options, Adapter = (options.model, __WEBPACK_IMPORTED_MODULE_3_compox_src_compMgr__.a.getDataAdapter(this.compType, opt.dataType));
            Adapter && (this.dataAdapter = new Adapter(this, options));
        },
        Statics: {
            compName: "",
            EVENT_VALUE_CHANGE: "valueChange",
            getName: function() {
                return this.compName;
            }
        }
    }), BaseComponent = BaseComponent;
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    function implement(properties) {
        var key, value;
        for (key in properties) value = properties[key], Class.Mutators.hasOwnProperty(key) ? Class.Mutators[key].call(this, value) : this.prototype[key] = value;
    }
    function classify(cls) {
        return cls.extend = Class.extend, cls.implement = implement, cls;
    }
    function Ctor() {}
    function mix(r, s, wl) {
        for (var p in s) if (s.hasOwnProperty(p)) {
            if (wl && indexOf(wl, p) === -1) continue;
            "prototype" !== p && (r[p] = s[p]);
        }
    }
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return Class;
    });
    var Class = function Class(o) {
        if (!(this instanceof Class) && isFunction(o)) return classify(o);
    };
    Class.create = function(parent, properties) {
        function SubClass() {
            var ret;
            return parent.apply(this, arguments), this.constructor === SubClass && this.initialize && (ret = this.initialize.apply(this, arguments)), 
            ret ? ret : this;
        }
        return isFunction(parent) || (properties = parent, parent = null), properties || (properties = {}), 
        parent || (parent = properties.Extends || Class), properties.Extends = parent, parent !== Class && mix(SubClass, parent, parent.StaticsWhiteList), 
        implement.call(SubClass, properties), classify(SubClass);
    }, Class.extend = function(properties) {
        return properties || (properties = {}), properties.Extends = this, Class.create(properties);
    }, Class.Mutators = {
        Extends: function(parent) {
            var existed = this.prototype, proto = createProto(parent.prototype);
            mix(proto, existed), proto.constructor = this, this.prototype = proto, this.superclass = parent.prototype;
        },
        Implements: function(items) {
            isArray(items) || (items = [ items ]);
            for (var item, proto = this.prototype; item = items.shift(); ) mix(proto, item.prototype || item);
        },
        Statics: function(staticProperties) {
            mix(this, staticProperties);
        }
    };
    var createProto = Object.__proto__ ? function(proto) {
        return {
            __proto__: proto
        };
    } : function(proto) {
        return Ctor.prototype = proto, new Ctor();
    }, toString = Object.prototype.toString, isArray = Array.isArray || function(val) {
        return "[object Array]" === toString.call(val);
    }, isFunction = function(val) {
        return "[object Function]" === toString.call(val);
    }, indexOf = function(arr, item) {
        if (Array.prototype.indexOf && arr.indexOf) return arr.indexOf(item);
        for (var i = 0, len = arr.length; i < len; i++) if (arr[i] === item) return i;
        return -1;
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return setCookie;
    }), __webpack_require__.d(__webpack_exports__, "b", function() {
        return getCookie;
    });
    var setCookie = function(sName, sValue, oExpires, sPath, sDomain, bSecure) {
        var sCookie = sName + "=" + encodeURIComponent(sValue);
        oExpires && (sCookie += "; expires=" + oExpires.toGMTString()), sPath && (sCookie += "; path=" + sPath), 
        sDomain && (sCookie += "; domain=" + sDomain), bSecure && (sCookie += "; secure=" + bSecure), 
        document.cookie = sCookie;
    }, getCookie = function(sName) {
        var sRE = "(?:; )?" + sName + "=([^;]*);?";
        return new RegExp(sRE).test(document.cookie) ? decodeURIComponent(RegExp.$1) : null;
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__extend__ = __webpack_require__(2);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return env;
    });
    var u = {};
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__extend__.a)(u, {
        isIE: !1,
        isFF: !1,
        isOpera: !1,
        isChrome: !1,
        isSafari: !1,
        isWebkit: !1,
        isIE8_BEFORE: !1,
        isIE8: !1,
        isIE8_CORE: !1,
        isIE9: !1,
        isIE9_CORE: !1,
        isIE10: !1,
        isIE10_ABOVE: !1,
        isIE11: !1,
        isEdge: !1,
        isIOS: !1,
        isIphone: !1,
        isIPAD: !1,
        isStandard: !1,
        version: 0,
        isWin: !1,
        isUnix: !1,
        isLinux: !1,
        isAndroid: !1,
        isAndroidPAD: !1,
        isAndroidPhone: !1,
        isMac: !1,
        hasTouch: !1,
        isMobile: !1
    }), function() {
        var version, userAgent = navigator.userAgent, rMsie = /(msie\s|trident.*rv:)([\w.]+)/, rFirefox = /(firefox)\/([\w.]+)/, rOpera = /(opera).+version\/([\w.]+)/, rChrome = /(chrome)\/([\w.]+)/, rSafari = /version\/([\w.]+).*(safari)/, ua = userAgent.toLowerCase(), browserMatch = {
            browser: "",
            version: ""
        }, match = rMsie.exec(ua);
        if (null != match && (browserMatch = {
            browser: "IE",
            version: match[2] || "0"
        }), match = rFirefox.exec(ua), null != match && (browserMatch = {
            browser: match[1] || "",
            version: match[2] || "0"
        }), match = rOpera.exec(ua), null != match && (browserMatch = {
            browser: match[1] || "",
            version: match[2] || "0"
        }), match = rChrome.exec(ua), null != match && (browserMatch = {
            browser: match[1] || "",
            version: match[2] || "0"
        }), match = rSafari.exec(ua), null != match && (browserMatch = {
            browser: match[2] || "",
            version: match[1] || "0"
        }), userAgent.indexOf("Edge") > -1 && (u.isEdge = !0), ua.match(/opera.([\d.]+)/) ? u.isOpera = !0 : "IE" == browserMatch.browser && 11 == browserMatch.version ? (u.isIE11 = !0, 
        u.isIE = !0) : ua.match(/chrome\/([\d.]+)/) ? (u.isChrome = !0, u.isStandard = !0) : ua.match(/version\/([\d.]+).*safari/) ? (u.isSafari = !0, 
        u.isStandard = !0) : ua.match(/gecko/) ? (u.isFF = !0, u.isStandard = !0) : ua.match(/msie ([\d.]+)/) ? u.isIE = !0 : ua.match(/firefox\/([\d.]+)/) && (u.isFF = !0, 
        u.isStandard = !0), ua.match(/webkit\/([\d.]+)/) && (u.isWebkit = !0), ua.match(/ipad/i) && (u.isIOS = !0, 
        u.isIPAD = !0, u.isStandard = !0), ua.match(/iphone/i) && (u.isIOS = !0, u.isIphone = !0), 
        "Mac68K" != navigator.platform && "MacPPC" != navigator.platform && "Macintosh" != navigator.platform && "MacIntel" != navigator.platform || (u.isMac = !0), 
        "Win32" != navigator.platform && "Windows" != navigator.platform && "Win64" != navigator.platform || (u.isWin = !0), 
        "X11" != navigator.platform || u.isWin || u.isMac || (u.isUnix = !0), String(navigator.platform).indexOf("Linux") > -1 && (u.isLinux = !0), 
        (ua.indexOf("Android") > -1 || ua.indexOf("android") > -1 || ua.indexOf("Adr") > -1 || ua.indexOf("adr") > -1) && (u.isAndroid = !0), 
        u.version = version && browserMatch.version ? browserMatch.version : 0, u.isAndroid && (window.screen.width >= 768 && window.screen.width < 1024 && (u.isAndroidPAD = !0), 
        window.screen.width <= 768 && (u.isAndroidPhone = !0)), u.isIE) {
            var intVersion = parseInt(u.version), mode = document.documentMode;
            null == mode ? 6 != intVersion && 7 != intVersion || (u.isIE8_BEFORE = !0) : (7 == mode ? u.isIE8_BEFORE = !0 : 8 == mode ? u.isIE8 = !0 : 9 == mode ? (u.isIE9 = !0, 
            u.isSTANDARD = !0) : 10 == mode ? (u.isIE10 = !0, u.isSTANDARD = !0, u.isIE10_ABOVE = !0) : u.isSTANDARD = !0, 
            8 == intVersion ? u.isIE8_CORE = !0 : 9 == intVersion ? u.isIE9_CORE = !0 : 11 == browserMatch.version && (u.isIE11 = !0));
        }
        "ontouchend" in document && (u.hasTouch = !0), (u.isIphone || u.isAndroidPhone) && (u.isMobile = !0);
    }();
    var env = u;
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", {
        value: !0
    });
    var __WEBPACK_IMPORTED_MODULE_0_tinper_neoui_src_neoui_multilang__ = __webpack_require__(6), __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_core__ = __webpack_require__(7);
    __webpack_require__.d(__webpack_exports__, "MultilangAdapter", function() {
        return MultilangAdapter;
    });
    var MultilangAdapter = u.BaseAdapter.extend({
        init: function() {
            var multinfo, self = this;
            multinfo = this.options ? this.options.multinfo : __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_core__.a.getLanguages(), 
            multinfo = multinfo.split(","), self.multiLen = multinfo.length;
            if (this.field = this.options.field, parseInt(this.options.rowIndex) > -1 && (this.options.rowIndex + "").indexOf(".") > 0) {
                var childObj = ValueMixin.methods.getChildVariable.call(this), lastRow = childObj.lastRow, lastField = childObj.lastField;
                this.field = lastField;
            }
            if (this.comp = new __WEBPACK_IMPORTED_MODULE_0_tinper_neoui_src_neoui_multilang__.a({
                el: this.element,
                multinfo: multinfo,
                field: this.field
            }), parseInt(this.options.rowIndex) > -1) if ((this.options.rowIndex + "").indexOf(".") > 0) {
                var childObj = ValueMixin.methods.getChildVariable.call(this), lastRow = childObj.lastRow, lastField = childObj.lastField;
                if (this.dataModel.on(DataTable.ON_VALUE_CHANGE, function(opt) {
                    var field = (opt.rowId, opt.field), value = opt.newValue, obj = {
                        fullField: self.options.field,
                        index: self.options.rowIndex
                    };
                    self.dataModel.getChildRow(obj) == opt.rowObj && 0 == field.indexOf(lastField) && self.modelValueChange(field, value);
                }), this.dataModel.on(DataTable.ON_INSERT, function(opt) {
                    var field, value, obj = {
                        fullField: self.options.field,
                        index: self.options.rowIndex
                    }, row = self.dataModel.getChildRow(obj);
                    if (row) for (var i = 0; i < self.multiLen; i++) field = 0 == i ? lastField : lastField + (i + 1), 
                    value = row.getValue(field), self.modelValueChange(field, value);
                }), lastRow) for (var field, value, i = 0; i < self.multiLen; i++) field = 0 == i ? lastField : lastField + (i + 1), 
                value = lastRow.getValue(field), self.modelValueChange(field, value);
            } else {
                this.dataModel.on(DataTable.ON_VALUE_CHANGE, function(opt) {
                    var field = (opt.rowId, opt.field), value = opt.newValue, row = opt.rowObj;
                    self.dataModel.getRowIndex(row) == self.options.rowIndex && 0 == field.indexOf(self.field) && self.modelValueChange(field, value);
                }), this.dataModel.on(DataTable.ON_INSERT, function(opt) {
                    var field, value, row = self.dataModel.getRow(self.options.rowIndex);
                    if (row) for (var i = 0; i < self.multiLen; i++) field = 0 == i ? self.field : self.field + (i + 1), 
                    value = row.getValue(field), self.modelValueChange(field, value);
                });
                var field, value, rowObj = this.dataModel.getRow(this.options.rowIndex);
                if (rowObj) for (var i = 0; i < self.multiLen; i++) field = 0 == i ? self.field : self.field + (i + 1), 
                value = rowObj.getValue(field), self.modelValueChange(field, value);
            } else {
                this.dataModel.on(DataTable.ON_VALUE_CHANGE, function(opt) {
                    var field = (opt.rowId, opt.field), value = opt.newValue;
                    opt.rowObj;
                    0 == field.indexOf(self.field) && self.modelValueChange(field, value);
                }), this.dataModel.on(DataTable.ON_INSERT, function(opt) {
                    for (var field, value, row = opt.rows[0], i = 0; i < self.multiLen; i++) field = 0 == i ? self.field : self.field + (i + 1), 
                    value = row.getValue(field), self.modelValueChange(field, value);
                });
                for (var field, value, i = 0; i < self.multiLen; i++) field = 0 == i ? self.field : self.field + (i + 1), 
                value = self.dataModel.getValue(field), self.modelValueChange(field, value);
            }
            this.comp.on("change.u.multilang", function(object) {
                self.slice = !0, self.setValue(object.field, object.newValue), self.slide = !1;
            });
        },
        modelValueChange: function(field, value) {
            this.comp.setDataValue(field, value);
        },
        setValue: function(field, value) {
            if (this.slice = !0, parseInt(this.options.rowIndex) > -1) if ((this.options.rowIndex + "").indexOf(".") > 0) {
                var childObj = ValueMixin.methods.getChildVariable.call(this), lastRow = childObj.lastRow;
                lastRow && lastRow.setValue(field, value);
            } else {
                var rowObj = this.dataModel.getRow(this.options.rowIndex);
                rowObj && rowObj.setValue(field, value);
            } else this.dataModel.setValue(field, value);
            this.slice = !1;
        }
    });
    u.compMgr && u.compMgr.addDataAdapter({
        adapter: MultilangAdapter,
        name: "u-multilang"
    });
} ]);