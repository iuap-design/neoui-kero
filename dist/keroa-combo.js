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
    var __WEBPACK_IMPORTED_MODULE_0__env__ = __webpack_require__(2);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return on;
    }), __webpack_require__.d(__webpack_exports__, "c", function() {
        return off;
    }), __webpack_require__.d(__webpack_exports__, "d", function() {
        return trigger;
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
    __webpack_require__(0);
    __webpack_require__.d(__webpack_exports__, "b", function() {
        return addClass;
    }), __webpack_require__.d(__webpack_exports__, "a", function() {
        return removeClass;
    }), __webpack_require__.d(__webpack_exports__, "c", function() {
        return hasClass;
    }), __webpack_require__.d(__webpack_exports__, "f", function() {
        return closest;
    }), __webpack_require__.d(__webpack_exports__, "e", function() {
        return getZIndex;
    }), __webpack_require__.d(__webpack_exports__, "g", function() {
        return makeDOM;
    }), __webpack_require__.d(__webpack_exports__, "d", function() {
        return showPanelByEle;
    });
    var globalZIndex, addClass = function(element, value) {
        return element && (void 0 === element.classList ? u._addClass ? u._addClass(element, value) : $(element).addClass(value) : element.classList.add(value)), 
        this;
    }, removeClass = function(element, value) {
        return element && (void 0 === element.classList ? u._removeClass ? u._removeClass(element, value) : $(element).removeClass(value) : element.classList.remove(value)), 
        this;
    }, hasClass = function(element, value) {
        return !!element && ((!element.nodeName || "#text" !== element.nodeName && "#comment" !== element.nodeName) && (void 0 === element.classList ? u._hasClass ? u._hasClass(element, value) : $(element).hasClass(value) : element.classList.contains(value)));
    }, closest = function(element, selector) {
        for (var tmp = element; null != tmp && !hasClass(tmp, selector) && tmp != document.body; ) tmp = tmp.parentNode;
        return tmp == document.body ? null : tmp;
    }, getZIndex = function() {
        return globalZIndex || (globalZIndex = 2e3), globalZIndex++;
    }, makeDOM = function(htmlString) {
        var tempDiv = document.createElement("div");
        return tempDiv.innerHTML = htmlString, tempDiv.children[0];
    }, showPanelByEle = function(obj) {
        var panel = (obj.ele, obj.panel), position = obj.position, position = (document.body.clientWidth, 
        document.body.clientHeight, position || "top"), eleRect = obj.ele.getBoundingClientRect(), panelRect = obj.panel.getBoundingClientRect(), eleWidth = eleRect.width || 0, eleHeight = eleRect.height || 0, left = eleRect.left || 0, top = eleRect.top || 0, panelWidth = panelRect.width || 0, panelHeight = panelRect.height || 0, docWidth = document.documentElement.clientWidth, docHeight = document.documentElement.clientHeight;
        "left" == position ? (left -= panelWidth, top += (eleHeight - panelHeight) / 2) : "right" == position ? (left += eleWidth, 
        top += (eleHeight - panelHeight) / 2) : "top" == position || "topCenter" == position ? (left += (eleWidth - panelWidth) / 2, 
        top -= panelHeight) : "bottom" == position || "bottomCenter" == position ? (left += (eleWidth - panelWidth) / 2, 
        top += eleHeight) : "bottomLeft" == position && (left = left, top += eleHeight), 
        left + panelWidth > docWidth && (left = docWidth - panelWidth - 10), left < 0 && (left = 0), 
        top + panelHeight > docHeight && (top = docHeight - panelHeight - 10), top < 0 && (top = 0), 
        panel.style.left = left + "px", panel.style.top = top + "px";
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__extend__ = __webpack_require__(10);
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
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return getJSObject;
    }), __webpack_require__.d(__webpack_exports__, "b", function() {
        return inArray;
    }), __webpack_require__.d(__webpack_exports__, "c", function() {
        return isDomElement;
    });
    var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, getJSObject = function(target, names) {
        if (names) {
            if ("object" == (void 0 === names ? "undefined" : _typeof(names))) return names;
            for (var nameArr = names.split("."), obj = target, i = 0; i < nameArr.length; i++) if (!(obj = obj[nameArr[i]])) return null;
            return obj;
        }
    }, inArray = (Array.isArray, function(node, arr) {
        if (!arr instanceof Array) throw "arguments is not Array";
        for (var i = 0, k = arr.length; i < k; i++) if (node == arr[i]) return !0;
        return !1;
    }), isDomElement = function(obj) {
        return window.HTMLElement ? obj instanceof HTMLElement : obj && obj.tagName && 1 === obj.nodeType;
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
    var __WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__ = __webpack_require__(1), __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_util__ = __webpack_require__(3);
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
                if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_util__.b)(control, tmpArray)) {
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
    var __WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_class__ = __webpack_require__(8), __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_util__ = __webpack_require__(3), __WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__ = __webpack_require__(0), __WEBPACK_IMPORTED_MODULE_3_compox_src_compMgr__ = __webpack_require__(4);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return BaseComponent;
    });
    var BaseComponent = __WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_class__.a.create({
        initialize: function(element) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_util__.c)(element) ? (this.element = element, 
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
    var __WEBPACK_IMPORTED_MODULE_0__neoui_BaseComponent__ = __webpack_require__(5), __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__ = __webpack_require__(1), __WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_env__ = __webpack_require__(2), __WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__ = __webpack_require__(0), __WEBPACK_IMPORTED_MODULE_4__neoui_textfield__ = __webpack_require__(7), __WEBPACK_IMPORTED_MODULE_5_tinper_sparrow_src_util_ripple__ = __webpack_require__(11), __WEBPACK_IMPORTED_MODULE_6_compox_src_compMgr__ = __webpack_require__(4), Combo = __WEBPACK_IMPORTED_MODULE_0__neoui_BaseComponent__.a.extend({
        init: function() {
            this.name = "", this.mutilSelect = this.options.mutilSelect || !1, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.c)(this.element, "mutil-select") && (this.mutilSelect = !0), 
            this.onlySelect = this.options.onlySelect || !1, this.mutilSelect && (this.onlySelect = !0), 
            this.comboDatas = [];
            var i, option, datas = [], self = this;
            new __WEBPACK_IMPORTED_MODULE_4__neoui_textfield__.a(this.element);
            var options = this.element.getElementsByTagName("option");
            for (i = 0; i < options.length; i++) option = options[i], datas.push({
                value: option.value,
                name: option.text
            });
            this._input = this.element.querySelector("input"), this.setComboData(datas), this.mutilSelect && (this.nowWidth = 0, 
            this.showNowWidth = 0, this.multiNoneArr = [], this.fullWidth = this._input.offsetWidth), 
            this.onlySelect || __WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_env__.a.isMobile ? setTimeout(function() {
                self._input.setAttribute("readonly", "readonly");
            }, 1e3) : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(this._input, "blur", function(e) {
                var v = this.value;
                if (v) {
                    for (var i = 0; i < self.comboDatas.length; i++) if (v == self.comboDatas[i].name) {
                        v = self.comboDatas[i].value;
                        break;
                    }
                    self.setValue(v);
                }
            }), this._combo_name_par = this.element.querySelector(".u-combo-name-par"), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(this._input, "focus", function(e) {
                self._inputFocus = !0, self.show(e), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.b)(e);
            }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(this._input, "blur", function(e) {
                self._inputFocus = !1;
            }), this.isAutoTip = this.options.isAutoTip || !1, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(this._input, "keydown", function(e) {
                var keyCode = e.keyCode;
                if (self.isAutoTip) switch (keyCode) {
                  case 38:
                    u.stopEvent(e);
                    break;

                  case 40:
                    u.stopEvent(e);
                    break;

                  case 9:
                  case 13:
                    u.stopEvent(e);
                    break;

                  default:
                    self.timeout && clearTimeout(self.timeout), self.timeout = setTimeout(function() {
                        self.onChange();
                    }, 400);
                } else 13 == keyCode && this.blur();
            }), this.iconBtn = this.element.querySelector("[data-role='combo-button']");
            var comonTarge = !0;
            this.iconBtn && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(this.iconBtn, "click", function(e) {
                self._input.focus(), comonTarge ? ($(self._input).parent().parent().find(".u-combo-ul").addClass("is-visible"), 
                comonTarge = !1) : ($(self._input).parent().parent().find(".u-combo-ul").removeClass("is-visible"), 
                comonTarge = !0);
            });
        },
        onChange: function() {
            var v = this._input.value;
            v || (v = "");
            for (var filterData = [], i = 0, len = this.initialComboData.length; i < len; i++) (this.initialComboData[i].name.indexOf(v) >= 0 || this.initialComboData[i].value.indexOf(v) >= 0) && filterData.push(this.initialComboData[i]);
            this.setComboData(filterData), this.show();
        },
        show: function(evt) {
            var self = this, width = this._input.offsetWidth;
            if (this.options.showFix) document.body.appendChild(this._ul), this._ul.style.position = "fixed", 
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.d)({
                ele: this._input,
                panel: this._ul,
                position: "bottomLeft"
            }); else {
                var bodyWidth = document.body.clientWidth, bodyHeight = document.body.clientHeight, panelWidth = this._ul.offsetWidth, panelHeight = this._ul.offsetHeight;
                this.element.appendChild(this._ul), this.element.style.position = "relative", this.left = this._input.offsetLeft;
                var inputHeight = this._input.offsetHeight;
                this.top = this._input.offsetTop + inputHeight, this.left + panelWidth > bodyWidth && (this.left = bodyWidth - panelWidth), 
                this.top + panelHeight > bodyHeight && (this.top = bodyHeight - panelHeight), this._ul.style.left = this.left + "px", 
                this._ul.style.top = this.top + "px";
            }
            this._ul.style.width = width + "px", $(this._ul).addClass("is-animating"), this._ul.style.zIndex = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.e)(), 
            $(this._ul).addClass("is-visible");
            var callback = function(e) {
                e !== evt && e.target !== this._input && 1 != self._inputFocus && (this.mutilSelect && (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.f)(e.target, "u-combo-ul") === self._ul || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.f)(e.target, "u-combo-name-par") || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.f)(e.target, "u-combo-name")) || (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.c)(document, "click", callback), 
                this.hide()));
            }.bind(this);
            this.callback = callback, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(document, "click", callback), 
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(document.body, "touchend", callback);
        },
        hide: function() {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.c)(document, "click", this.callback), 
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.a)(this._ul, "is-visible"), 
            this._ul.style.zIndex = -1, this.trigger("select", {
                value: this.value,
                name: this._input.value
            });
        },
        setComboData: function(datas, options) {
            var i, li, self = this;
            if (options) {
                this.comboDatas = [];
                for (var i = 0; i < datas.length; i++) this.comboDatas.push({
                    name: datas[i][options.name],
                    value: datas[i][options.value]
                });
            } else this.comboDatas = datas;
            for (this.initialComboData && this.initialComboData.length || (this.initialComboData = this.comboDatas), 
            this._ul || (this._ul = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.g)('<ul class="u-combo-ul"></ul>')), 
            this._ul.innerHTML = "", i = 0; i < this.comboDatas.length; i++) {
                li = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.g)('<li class="u-combo-li">' + this.comboDatas[i].name + "</li>"), 
                li._index = i, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(li, "click", function() {
                    self.selectItem(this._index);
                });
                var rippleContainer = document.createElement("span");
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.b)(rippleContainer, "u-ripple-container");
                var _rippleElement = document.createElement("span");
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.b)(_rippleElement, "u-ripple"), 
                rippleContainer.appendChild(_rippleElement), li.appendChild(rippleContainer), new __WEBPACK_IMPORTED_MODULE_5_tinper_sparrow_src_util_ripple__.a(li), 
                this._ul.appendChild(li);
            }
        },
        selectItem: function(index) {
            var self = this;
            if (this.mutilSelect) {
                var flag, val = this.comboDatas[index].value, name = this.comboDatas[index].name, index = (this.value + ",").indexOf(val + ","), l = val.length + 1;
                if (0 == this.fullWidth && (this.fullWidth = this._input.offsetWidth, this.fullWidth > 0 && this._combo_name_par && (this._combo_name_par.style.maxWidth = this.fullWidth + "px")), 
                index != -1 ? (this.value = this.value.substring(0, index) + this.value.substring(index + l), 
                flag = "-") : (this.value = this.value ? this.value + val + "," : val + ",", flag = "+"), 
                "+" == flag) {
                    this.name += name + ",";
                    var nameDiv = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.g)('<div class="u-combo-name" key="' + val + '">' + name + "</div>"), parNameDiv = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.g)('<div class="u-combo-name-par" style="position:absolute;max-width:' + this.fullWidth + 'px;"></div>');
                    this._combo_name_par || (this._input.parentNode.insertBefore(parNameDiv, this._input), 
                    this._combo_name_par = parNameDiv, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(this._combo_name_par, "click", function(e) {
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.d)(self._input, "focus");
                    })), this._combo_name_par.appendChild(nameDiv), this._combo_name_par.title = this.name;
                    var nWidth = nameDiv.offsetWidth + 20;
                    this.nowWidth += nWidth, this.showNowWidth += nWidth, this.nowWidth > this.fullWidth && this.fullWidth > 0 && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.b)(this._combo_name_par, "u-combo-overwidth"), 
                    this.showNowWidth > this.fullWidth && this.fullWidth > 0 && (this.showNowWidth -= nWidth, 
                    nameDiv.style.display = "none", this.multiNoneArr.push(nameDiv));
                } else if (this.name = this.name.replace(name + ",", ""), this._combo_name_par) {
                    var comboDiv = this._combo_name_par.querySelector('[key="' + val + '"]');
                    if (comboDiv) {
                        var fflag = !0;
                        "none" == comboDiv.style.display && (fflag = !1, comboDiv.style.display = "");
                        var nWidth = comboDiv.offsetWidth + 20;
                        if (this._combo_name_par.removeChild(comboDiv), this.nowWidth -= nWidth, fflag) this.showNowWidth -= nWidth; else for (var k = 0; k < this.multiNoneArr.length; k++) if (this.multiNoneArr[k] == comboDiv) {
                            this.multiNoneArr.splice(k, 1);
                            break;
                        }
                        if (this.nowWidth > this.fullWidth && this.fullWidth > 0 || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.a)(this._combo_name_par, "u-combo-overwidth"), 
                        this.showNowWidth < this.fullWidth && this.fullWidth > 0) {
                            for (var nowShowNowWidth = this.showNowWidth, j = -1, i = 0; i < this.multiNoneArr.length; i++) {
                                var nowDiv = this.multiNoneArr[i];
                                nowDiv.style.display = "";
                                var nowForWidth = nowDiv.offsetWidth + 20;
                                if ((nowShowNowWidth += nowForWidth) > this.fullWidth) {
                                    nowDiv.style.display = "none";
                                    break;
                                }
                                j++, this.showNowWidth += nowForWidth;
                            }
                            this.multiNoneArr.splice(0, j + 1);
                        }
                    }
                }
                this._updateItemSelect();
            } else this.value = this.comboDatas[index].value, this._input.value = this.comboDatas[index].name, 
            this._updateItemSelect();
        },
        _updateItemSelect: function() {
            var lis = this._ul.querySelectorAll(".u-combo-li");
            if (this.mutilSelect) for (var values = this.value.split(","), i = 0; i < lis.length; i++) values.indexOf(this.comboDatas[i].value) > -1 ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.b)(lis[i], "is-selected") : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.a)(lis[i], "is-selected"); else for (var i = 0; i < lis.length; i++) this.value == this.comboDatas[i].value ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.b)(lis[i], "is-selected") : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.a)(lis[i], "is-selected");
        },
        setValue: function(value) {
            var self = this;
            value += "", value = value || "";
            var values = value.split(",");
            this.mutilSelect === !0 && (self._combo_name_par && (self._combo_name_par.innerHTML = "", 
            $(self._combo_name_par).removeClass("u-combo-overwidth")), this.value = ""), value || (this._input.value = "", 
            this.value = "", this._updateItemSelect());
            var matched = !1;
            this.nowWidth = 0, this.showNowWidth = 0, this.multiNoneArr = [], this.comboDatas.forEach(function(item, index) {
                if (this.mutilSelect === !0) values.indexOf(item.value) != -1 && this.selectItem(index); else if (item.value + "" === value) return this.selectItem(index), 
                void (matched = !0);
            }.bind(this)), this.onlySelect || matched || (this.value = value, this._input.value = value, 
            this.trigger("select", {
                value: this.value,
                name: this._input.value
            }));
        },
        emptyValue: function() {
            this.value = "", this._input.value = "";
        },
        setName: function(name) {
            this.comboDatas.forEach(function(item, index) {
                if (item.name === name) return void this.selectItem(index);
            }.bind(this));
        }
    });
    __WEBPACK_IMPORTED_MODULE_6_compox_src_compMgr__.a.regComp({
        comp: Combo,
        compAsString: "u.Combo",
        css: "u-combo"
    }), document.readyState && "complete" === document.readyState ? __WEBPACK_IMPORTED_MODULE_6_compox_src_compMgr__.a.updateComp() : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(window, "load", function() {
        __WEBPACK_IMPORTED_MODULE_6_compox_src_compMgr__.a.updateComp();
    });
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__neoui_BaseComponent__ = __webpack_require__(5), __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__ = __webpack_require__(1), __WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_env__ = __webpack_require__(2), __WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__ = __webpack_require__(0), __WEBPACK_IMPORTED_MODULE_4_compox_src_compMgr__ = __webpack_require__(4);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return Text;
    });
    var Text = __WEBPACK_IMPORTED_MODULE_0__neoui_BaseComponent__.a.extend({
        _Constant: {
            NO_MAX_ROWS: -1,
            MAX_ROWS_ATTRIBUTE: "maxrows"
        },
        _CssClasses: {
            LABEL: "u-label",
            INPUT: "u-input",
            IS_DIRTY: "is-dirty",
            IS_FOCUSED: "is-focused",
            IS_DISABLED: "is-disabled",
            IS_INVALID: "is-invalid",
            IS_UPGRADED: "is-upgraded"
        },
        init: function() {
            var oThis = this;
            if (this.maxRows = this._Constant.NO_MAX_ROWS, this.label_ = this.element.querySelector("." + this._CssClasses.LABEL), 
            this._input = this.element.querySelector("input"), this._input) {
                this._input.hasAttribute(this._Constant.MAX_ROWS_ATTRIBUTE) && (this.maxRows = parseInt(this._input.getAttribute(this._Constant.MAX_ROWS_ATTRIBUTE), 10), 
                isNaN(this.maxRows) && (this.maxRows = this._Constant.NO_MAX_ROWS)), this.boundUpdateClassesHandler = this._updateClasses.bind(this), 
                this.boundFocusHandler = this._focus.bind(this), this.boundBlurHandler = this._blur.bind(this), 
                this.boundResetHandler = this._reset.bind(this), this._input.addEventListener("input", this.boundUpdateClassesHandler), 
                __WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_env__.a.isIE8 && this._input.addEventListener("propertychange", function() {
                    oThis._updateClasses();
                }), this._input.addEventListener("focus", this.boundFocusHandler), (__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_env__.a.isIE8 || __WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_env__.a.isIE9) && this.label_ && this.label_.addEventListener("click", function() {
                    this._input.focus();
                }.bind(this)), this._input.addEventListener("blur", this.boundBlurHandler), this._input.addEventListener("reset", this.boundResetHandler), 
                this.maxRows !== this._Constant.NO_MAX_ROWS && (this.boundKeyDownHandler = this._down.bind(this), 
                this._input.addEventListener("keydown", this.boundKeyDownHandler));
                var invalid = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.c)(this.element, this._CssClasses.IS_INVALID);
                this._updateClasses(), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_UPGRADED), 
                invalid && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_INVALID);
            }
        },
        _down: function(event) {
            var currentRowCount = event.target.value.split("\n").length;
            13 === event.keyCode && currentRowCount >= this.maxRows && event.preventDefault();
        },
        _focus: function(event) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_FOCUSED);
        },
        _blur: function(event) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.a)(this.element, this._CssClasses.IS_FOCUSED), 
            this.trigger("u.text.blur");
        },
        _reset: function(event) {
            this._updateClasses();
        },
        _updateClasses: function() {
            this.checkDisabled(), this.checkValidity(), this.checkDirty();
        },
        checkDisabled: function() {
            this._input.disabled ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_DISABLED) : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.a)(this.element, this._CssClasses.IS_DISABLED);
        },
        checkValidity: function() {
            this._input.validity && (this._input.validity.valid ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.a)(this.element, this._CssClasses.IS_INVALID) : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_INVALID));
        },
        checkDirty: function() {
            this._input.value && this._input.value.length > 0 ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_DIRTY) : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.a)(this.element, this._CssClasses.IS_DIRTY);
        },
        disable: function() {
            this._input.disabled = !0, this._updateClasses();
        },
        enable: function() {
            this._input.disabled = !1, this._updateClasses();
        },
        change: function(value) {
            this._input.value = 0 === value ? value : value || "", this._updateClasses();
        }
    });
    __WEBPACK_IMPORTED_MODULE_4_compox_src_compMgr__.a.regComp({
        comp: Text,
        compAsString: "u.Text",
        css: "u-text"
    }), document.readyState && "complete" === document.readyState ? __WEBPACK_IMPORTED_MODULE_4_compox_src_compMgr__.a.updateComp() : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(window, "load", function() {
        __WEBPACK_IMPORTED_MODULE_4_compox_src_compMgr__.a.updateComp();
    });
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
    var __WEBPACK_IMPORTED_MODULE_0__enumerables__ = __webpack_require__(9);
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
    var __WEBPACK_IMPORTED_MODULE_0__env__ = __webpack_require__(2), __WEBPACK_IMPORTED_MODULE_1__dom__ = __webpack_require__(1), __WEBPACK_IMPORTED_MODULE_2__event__ = __webpack_require__(0);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return URipple;
    });
    var URipple = function(element) {
        __WEBPACK_IMPORTED_MODULE_0__env__.a.isIE8 || __WEBPACK_IMPORTED_MODULE_0__env__.a.isMobile || __WEBPACK_IMPORTED_MODULE_0__env__.a.isAndroidPAD || __WEBPACK_IMPORTED_MODULE_0__env__.a.isIPAD || (this._element = element, 
        this.init());
    };
    URipple.prototype._down = function(event) {
        if (!(__WEBPACK_IMPORTED_MODULE_0__env__.a.isIE8 || __WEBPACK_IMPORTED_MODULE_0__env__.a.isMobile || __WEBPACK_IMPORTED_MODULE_0__env__.a.isAndroidPAD || __WEBPACK_IMPORTED_MODULE_0__env__.a.isIPAD)) {
            if (!this._rippleElement.style.width && !this._rippleElement.style.height) {
                var rect = this._element.getBoundingClientRect();
                this.rippleSize_ = 2 * Math.sqrt(rect.width * rect.width + rect.height * rect.height) + 2, 
                this.rippleSize_ > 0 && (this._rippleElement.style.width = this.rippleSize_ + "px", 
                this._rippleElement.style.height = this.rippleSize_ + "px");
            }
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__dom__.b)(this._rippleElement, "is-visible"), 
            "mousedown" === event.type && this._ignoringMouseDown) this._ignoringMouseDown = !1; else {
                "touchstart" === event.type && (this._ignoringMouseDown = !0);
                if (this.getFrameCount() > 0) return;
                this.setFrameCount(1);
                var x, y, t = event.currentTarget || event.target || event.srcElement, bound = t.getBoundingClientRect();
                if (0 === event.clientX && 0 === event.clientY) x = Math.round(bound.width / 2), 
                y = Math.round(bound.height / 2); else {
                    var clientX = event.clientX ? event.clientX : event.touches[0].clientX, clientY = event.clientY ? event.clientY : event.touches[0].clientY;
                    x = Math.round(clientX - bound.left), y = Math.round(clientY - bound.top);
                }
                this.setRippleXY(x, y), this.setRippleStyles(!0), window.requestAnimationFrame && window.requestAnimationFrame(this.animFrameHandler.bind(this));
            }
        }
    }, URipple.prototype._up = function(event) {
        if (!(__WEBPACK_IMPORTED_MODULE_0__env__.a.isIE8 || __WEBPACK_IMPORTED_MODULE_0__env__.a.isMobile || __WEBPACK_IMPORTED_MODULE_0__env__.a.isAndroidPAD || __WEBPACK_IMPORTED_MODULE_0__env__.a.isIPAD)) {
            var self = this;
            event && 2 !== event.detail && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__dom__.a)(this._rippleElement, "is-visible"), 
            window.setTimeout(function() {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__dom__.a)(self._rippleElement, "is-visible");
            }, 0);
        }
    }, URipple.prototype.getFrameCount = function() {
        if (!(__WEBPACK_IMPORTED_MODULE_0__env__.a.isIE8 || __WEBPACK_IMPORTED_MODULE_0__env__.a.isMobile || __WEBPACK_IMPORTED_MODULE_0__env__.a.isAndroidPAD || __WEBPACK_IMPORTED_MODULE_0__env__.a.isIPAD)) return this.frameCount_;
    }, URipple.prototype.setFrameCount = function(fC) {
        __WEBPACK_IMPORTED_MODULE_0__env__.a.isIE8 || __WEBPACK_IMPORTED_MODULE_0__env__.a.isMobile || __WEBPACK_IMPORTED_MODULE_0__env__.a.isAndroidPAD || __WEBPACK_IMPORTED_MODULE_0__env__.a.isIPAD || (this.frameCount_ = fC);
    }, URipple.prototype.getRippleElement = function() {
        if (!(__WEBPACK_IMPORTED_MODULE_0__env__.a.isIE8 || __WEBPACK_IMPORTED_MODULE_0__env__.a.isMobile || __WEBPACK_IMPORTED_MODULE_0__env__.a.isAndroidPAD || __WEBPACK_IMPORTED_MODULE_0__env__.a.isIPAD)) return this._rippleElement;
    }, URipple.prototype.setRippleXY = function(newX, newY) {
        __WEBPACK_IMPORTED_MODULE_0__env__.a.isIE8 || __WEBPACK_IMPORTED_MODULE_0__env__.a.isMobile || __WEBPACK_IMPORTED_MODULE_0__env__.a.isAndroidPAD || __WEBPACK_IMPORTED_MODULE_0__env__.a.isIPAD || (this.x_ = newX, 
        this.y_ = newY);
    }, URipple.prototype.setRippleStyles = function(start) {
        if (!(__WEBPACK_IMPORTED_MODULE_0__env__.a.isIE8 || __WEBPACK_IMPORTED_MODULE_0__env__.a.isMobile || __WEBPACK_IMPORTED_MODULE_0__env__.a.isAndroidPAD || __WEBPACK_IMPORTED_MODULE_0__env__.a.isIPAD) && null !== this._rippleElement) {
            var transformString, scale, offset = "translate(" + this.x_ + "px, " + this.y_ + "px)";
            start ? (scale = "scale(0.0001, 0.0001)", "1px") : (scale = "", this.rippleSize_ + "px"), 
            transformString = "translate(-50%, -50%) " + offset + scale, this._rippleElement.style.webkitTransform = transformString, 
            this._rippleElement.style.msTransform = transformString, this._rippleElement.style.transform = transformString, 
            start ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__dom__.a)(this._rippleElement, "is-animating") : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__dom__.b)(this._rippleElement, "is-animating");
        }
    }, URipple.prototype.animFrameHandler = function() {
        __WEBPACK_IMPORTED_MODULE_0__env__.a.isIE8 || __WEBPACK_IMPORTED_MODULE_0__env__.a.isMobile || __WEBPACK_IMPORTED_MODULE_0__env__.a.isAndroidPAD || __WEBPACK_IMPORTED_MODULE_0__env__.a.isIPAD || (this.frameCount_-- > 0 ? window.requestAnimationFrame(this.animFrameHandler.bind(this)) : this.setRippleStyles(!1));
    }, URipple.prototype.init = function() {
        if (!(__WEBPACK_IMPORTED_MODULE_0__env__.a.isIE8 || __WEBPACK_IMPORTED_MODULE_0__env__.a.isMobile || __WEBPACK_IMPORTED_MODULE_0__env__.a.isAndroidPAD || __WEBPACK_IMPORTED_MODULE_0__env__.a.isIPAD)) {
            var self = this;
            this._element && (this._rippleElement = this._element.querySelector(".u-ripple"), 
            this._rippleElement || (this._rippleElement = document.createElement("span"), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__dom__.b)(this._rippleElement, "u-ripple"), 
            this._element.appendChild(this._rippleElement), this._element.style.overflow = "hidden", 
            this._element.style.position = "relative"), this.frameCount_ = 0, this.rippleSize_ = 0, 
            this.x_ = 0, this.y_ = 0, this._ignoringMouseDown = !1, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__event__.a)(this._element, "mousedown", function(e) {
                self._down(e);
            }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__event__.a)(this._element, "touchstart", function(e) {
                self._down(e);
            }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__event__.a)(this._element, "mouseup", function(e) {
                self._up(e);
            }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__event__.a)(this._element, "mouseleave", function(e) {
                self._up(e);
            }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__event__.a)(this._element, "touchend", function(e) {
                self._up(e);
            }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__event__.a)(this._element, "blur", function(e) {
                self._up(e);
            }));
        }
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", {
        value: !0
    });
    var __WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_util__ = __webpack_require__(3), __WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__ = (__webpack_require__(6), 
    __webpack_require__(2), __webpack_require__(0)), __WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_dom__ = __webpack_require__(1);
    __webpack_require__.d(__webpack_exports__, "ComboboxAdapter", function() {
        return ComboboxAdapter;
    });
    var ComboboxAdapter = u.BaseAdapter.extend({
        init: function() {
            var self = this;
            this.datasource = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_util__.a)(this.viewModel, this.options.datasource), 
            this.mutil = this.options.mutil || !1, this.onlySelect = this.options.onlySelect || !1, 
            this.showFix = this.options.showFix || !1, this.validType = "combobox", this.isAutoTip = this.options.isAutoTip || !1, 
            this.element["u.Combo"] ? this.comp = this.element["u.Combo"] : (this.comp = new u.Combo({
                el: this.element,
                mutilSelect: this.mutil,
                onlySelect: this.onlySelect,
                showFix: this.showFix,
                isAutoTip: this.isAutoTip
            }), this.element["u.Combo"] = this.comp);
            var isDsObservable = ko.isObservable(this.datasource);
            this.datasource ? this.comp.setComboData(isDsObservable ? ko.toJS(this.datasource) : this.datasource) : (u.isIE8 || u.isIE9) && alert("IE8/IE9必须设置datasource"), 
            isDsObservable && this.datasource.subscribe(function(value) {
                self.comp.setComboData(value);
            }), this.comp.on("select", function(event) {
                self.setValue(event.value), self.setShowValue(event.name);
            });
        },
        modelValueChange: function(value) {
            this.slice || (null !== value && void 0 !== value || (value = ""), this.comp.setValue(value), 
            this.trueValue = this.formater ? this.formater.format(value) : value, this.element.trueValue = this.trueValue);
        },
        setEnable: function(enable) {
            var self = this;
            enable === !0 || "true" === enable ? (this.enable = !0, this.element.removeAttribute("readonly"), 
            this.comp._input.removeAttribute("readonly"), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_dom__.a)(this.element.parentNode, "disablecover"), 
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(this.comp._input, "focus", function(e) {
                self.comp.show(e), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.b)(e);
            }), this.comp.iconBtn && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(this.comp.iconBtn, "click", function(e) {
                self.comp.show(e), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.b)(e);
            })) : enable !== !1 && "false" !== enable || (this.enable = !1, this.element.setAttribute("readonly", "readonly"), 
            this.comp._input.setAttribute("readonly", "readonly"), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_dom__.b)(this.element.parentNode, "disablecover"), 
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.c)(this.comp._input, "focus"), 
            this.comp.iconBtn && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.c)(this.comp.iconBtn, "click"));
        }
    });
    u.compMgr && u.compMgr.addDataAdapter({
        adapter: ComboboxAdapter,
        name: "u-combobox"
    });
} ]);