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
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 4);
}([ function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__enumerables__ = __webpack_require__(2);
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
    var __WEBPACK_IMPORTED_MODULE_0__env__ = __webpack_require__(3);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return on;
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
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return enumerables;
    });
    var enumerables = !0, enumerablesTest = {
        toString: 1
    };
    Object.prototype.toString;
    for (var i in enumerablesTest) enumerables = null;
    enumerables && (enumerables = [ "hasOwnProperty", "valueOf", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "constructor" ]);
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__extend__ = __webpack_require__(0);
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
    var __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_event__ = (__webpack_require__(0), 
    __webpack_require__(1));
    __webpack_require__.d(__webpack_exports__, "StringAdapter", function() {
        return StringAdapter;
    });
    var StringAdapter = u.BaseAdapter.extend({
        init: function() {
            var self = this;
            if (this.element = "INPUT" === this.element.nodeName ? this.element : this.element.querySelector("input"), 
            !this.element) throw new Error("not found INPUT element, u-meta:" + JSON.stringify(this.options));
            this.validType = this.options.validType || "string", this.minLength = this.getOption("minLength"), 
            this.maxLength = this.getOption("maxLength");
            var placeholder = this.options.placeholder;
            placeholder && (this.element.placeholder = placeholder), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_event__.a)(this.element, "focus", function() {
                if (self.enable) {
                    self.setShowValue(self.getValue());
                    try {
                        var e = event.srcElement, r = e.createTextRange();
                        r.moveStart("character", e.value.length), r.collapse(!0), r.select();
                    } catch (e) {}
                }
            }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_event__.a)(this.element, "blur", function(e) {
                self.enable && (!self.doValidate() && self._needClean() ? !self.required || null !== self.element.value && void 0 !== self.element.value && "" !== self.element.value ? self.element.value = self.getShowValue() : self.setValue("") : self.setValue(self.element.value));
            });
        },
        hide: function() {
            var self = this;
            self.enable && (!self.doValidate() && self._needClean() ? !self.required || null !== self.element.value && void 0 !== self.element.value && "" !== self.element.value ? self.element.value = self.getShowValue() : self.setValue("") : self.setValue(self.element.value));
        }
    });
    u.compMgr && u.compMgr.addDataAdapter({
        adapter: StringAdapter,
        name: "string"
    });
} ]);