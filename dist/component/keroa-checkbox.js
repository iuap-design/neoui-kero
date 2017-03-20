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
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 8);
}([ function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return on;
    }), __webpack_require__.d(__webpack_exports__, "b", function() {
        return stopEvent;
    });
    var on = function(element, eventName, child, listener) {
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
                e || (e = "undefined" != typeof event && event ? event : window.event), element.uEvent[eventName].forEach(function(fn) {
                    try {
                        e.target = e.target || e.srcElement;
                    } catch (ee) {}
                    fn && fn.call(element, e);
                });
            }, element.addEventListener ? element.addEventListener(eventName, element.uEvent[eventName + "fn"]) : element.attachEvent ? element.attachEvent("on" + eventName, element.uEvent[eventName + "fn"]) : element["on" + eventName] = element.uEvent[eventName + "fn"];
        }
    }, stopEvent = function(e) {
        void 0 !== e && (e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0, 
        e && e.preventDefault ? e.preventDefault() : window.event.returnValue = !1);
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__(0);
    __webpack_require__.d(__webpack_exports__, "b", function() {
        return addClass;
    }), __webpack_require__.d(__webpack_exports__, "d", function() {
        return removeClass;
    }), __webpack_require__.d(__webpack_exports__, "c", function() {
        return hasClass;
    }), __webpack_require__.d(__webpack_exports__, "a", function() {
        return makeDOM;
    });
    var addClass = function(element, value) {
        return element && (void 0 === element.classList ? u._addClass ? u._addClass(element, value) : $(element).addClass(value) : element.classList.add(value)), 
        this;
    }, removeClass = function(element, value) {
        return element && (void 0 === element.classList ? u._removeClass ? u._removeClass(element, value) : $(element).removeClass(value) : element.classList.remove(value)), 
        this;
    }, hasClass = function(element, value) {
        return !!element && ((!element.nodeName || "#text" !== element.nodeName && "#comment" !== element.nodeName) && (void 0 === element.classList ? u._hasClass ? u._hasClass(element, value) : $(element).hasClass(value) : element.classList.contains(value)));
    }, makeDOM = function(htmlString) {
        var tempDiv = document.createElement("div");
        return tempDiv.innerHTML = htmlString, tempDiv.children[0];
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__extend__ = __webpack_require__(6);
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
    var __WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__ = __webpack_require__(1), __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_event__ = __webpack_require__(0), __WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_util_ripple__ = __webpack_require__(7);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return Checkbox;
    });
    var Checkbox = u.BaseComponent.extend({
        _Constant: {
            TINY_TIMEOUT: .001
        },
        _CssClasses: {
            INPUT: "u-checkbox-input",
            BOX_OUTLINE: "u-checkbox-outline",
            FOCUS_HELPER: "u-checkbox-focus-helper",
            TICK_OUTLINE: "u-checkbox-tick-outline",
            IS_FOCUSED: "is-focused",
            IS_DISABLED: "is-disabled",
            IS_CHECKED: "is-checked",
            IS_UPGRADED: "is-upgraded"
        },
        init: function() {
            this._inputElement = this.element.querySelector("input");
            var boxOutline = document.createElement("span");
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(boxOutline, this._CssClasses.BOX_OUTLINE);
            var tickContainer = document.createElement("span");
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(tickContainer, this._CssClasses.FOCUS_HELPER);
            var tickOutline = document.createElement("span");
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(tickOutline, this._CssClasses.TICK_OUTLINE), 
            boxOutline.appendChild(tickOutline), this.element.appendChild(tickContainer), this.element.appendChild(boxOutline), 
            this.rippleContainerElement_ = document.createElement("span"), this.boundRippleMouseUp = this._onMouseUp.bind(this), 
            this.rippleContainerElement_.addEventListener("mouseup", this.boundRippleMouseUp), 
            this.element.appendChild(this.rippleContainerElement_), new __WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_util_ripple__.a(this.rippleContainerElement_), 
            this.boundInputOnChange = this._onChange.bind(this), this.boundInputOnFocus = this._onFocus.bind(this), 
            this.boundInputOnBlur = this._onBlur.bind(this), this.boundElementMouseUp = this._onMouseUp.bind(this), 
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.c)(this.element, "only-style") || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_event__.a)(this.element, "click", function(e) {
                "INPUT" != e.target.nodeName && (this._inputElement.disabled || (this.toggle(), 
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_event__.b)(e)));
            }.bind(this)), this._updateClasses(), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_UPGRADED);
        },
        _onChange: function(event) {
            this._updateClasses(), this.trigger("change", {
                isChecked: this._inputElement.checked
            });
        },
        _onFocus: function() {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_FOCUSED);
        },
        _onBlur: function() {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.d)(this.element, this._CssClasses.IS_FOCUSED);
        },
        _onMouseUp: function(event) {
            this._blur();
        },
        _updateClasses: function() {
            this.checkDisabled(), this.checkToggleState();
        },
        _blur: function() {
            window.setTimeout(function() {
                this._inputElement.blur();
            }.bind(this), this._Constant.TINY_TIMEOUT);
        },
        checkToggleState: function() {
            this._inputElement.checked ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_CHECKED) : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.d)(this.element, this._CssClasses.IS_CHECKED);
        },
        checkDisabled: function() {
            this._inputElement.disabled ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_DISABLED) : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.d)(this.element, this._CssClasses.IS_DISABLED);
        },
        isChecked: function() {
            return this._inputElement.checked;
        },
        toggle: function() {
            this.isChecked() ? this.uncheck() : this.check();
        },
        disable: function() {
            this._inputElement.disabled = !0, this._updateClasses();
        },
        enable: function() {
            this._inputElement.disabled = !1, this._updateClasses();
        },
        beforeToggle: function() {
            return "function" != typeof this.beforeEdit || this.beforeEdit();
        },
        check: function() {
            this.beforeToggle() && (this._inputElement.checked = !0, this._updateClasses(), 
            this.boundInputOnChange());
        },
        uncheck: function() {
            this.beforeToggle() && (this._inputElement.checked = !1, this._updateClasses(), 
            this.boundInputOnChange());
        }
    });
    u.compMgr && u.compMgr.regComp({
        comp: Checkbox,
        compAsString: "u.Checkbox",
        css: "u-checkbox"
    });
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return getFunction;
    }), __webpack_require__.d(__webpack_exports__, "b", function() {
        return getJSObject;
    });
    var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, getFunction = function(target, val) {
        if (!val || "function" == typeof val) return val;
        if ("function" == typeof target[val]) return target[val];
        if ("function" == typeof window[val]) return window[val];
        if (val.indexOf(".") != -1) {
            var func = getJSObject(target, val);
            if ("function" == typeof func) return func;
            if ("function" == typeof (func = getJSObject(window, val))) return func;
        }
        return val;
    }, getJSObject = function(target, names) {
        if (names) {
            if ("object" == (void 0 === names ? "undefined" : _typeof(names))) return names;
            for (var nameArr = names.split("."), obj = target, i = 0; i < nameArr.length; i++) if (!(obj = obj[nameArr[i]])) return null;
            return obj;
        }
    };
    Array.isArray;
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
            event && 2 !== event.detail && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__dom__.d)(this._rippleElement, "is-visible"), 
            window.setTimeout(function() {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__dom__.d)(self._rippleElement, "is-visible");
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
            start ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__dom__.d)(this._rippleElement, "is-animating") : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__dom__.b)(this._rippleElement, "is-animating");
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
    var __WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_util__ = __webpack_require__(4), __WEBPACK_IMPORTED_MODULE_1_tinper_neoui_src_neoui_checkbox__ = __webpack_require__(3), __WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_dom__ = __webpack_require__(1), __WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__ = __webpack_require__(0), __WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_env__ = __webpack_require__(2);
    __webpack_require__.d(__webpack_exports__, "CheckboxAdapter", function() {
        return CheckboxAdapter;
    });
    var CheckboxAdapter = u.BaseAdapter.extend({
        init: function() {
            var self = this;
            if (this.isGroup = this.options.isGroup === !0 || "true" === this.options.isGroup, 
            this.otherValue = this.options.otherValue || "其他", this.beforeEdit = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_util__.a)(this.viewModel, this.options.beforeEdit), 
            this.options.datasource || this.options.hasOther) if (__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_env__.a.isIE) this.checkboxTemplateHTML = this.element.innerHTML; else {
                this.checkboxTemplateArray = [];
                for (var i = 0, count = this.element.childNodes.length; i < count; i++) this.checkboxTemplateArray.push(this.element.childNodes[i]);
            }
            if (this.options.datasource ? (this.isGroup = !0, this.datasource = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_util__.b)(this.viewModel, this.options.datasource), 
            this.datasource && this.setComboData(this.datasource)) : (this.element["u.Checkbox"] ? this.comp = this.element["u.Checkbox"] : (this.comp = new __WEBPACK_IMPORTED_MODULE_1_tinper_neoui_src_neoui_checkbox__.a(this.element), 
            this.comp.beforeEdit = this.beforeEdit, this.element["u.Checkbox"] = this.comp), 
            this.checkedValue = this.options.checkedValue || !0, this.unCheckedValue = this.options.unCheckedValue, 
            this.comp.on("change", function() {
                if (!self.slice && self.dataModel) {
                    var modelValue = self.dataModel.getValue(self.field);
                    if (modelValue = modelValue ? modelValue : "", self.isGroup) {
                        var valueArr = "" == modelValue ? [] : modelValue.split(",");
                        if (self.comp._inputElement.checked) valueArr.push(self.checkedValue); else {
                            var index = valueArr.indexOf(self.checkedValue);
                            valueArr.splice(index, 1);
                        }
                        self.dataModel.setValue(self.field, valueArr.join(","));
                    } else self.comp._inputElement.checked ? self.dataModel.setValue(self.field, self.checkedValue) : self.dataModel.setValue(self.field, self.unCheckedValue);
                }
            })), this.options.hasOther) {
                if (__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_env__.a.isIE) {
                    var nowHtml = this.element.innerHTML;
                    this.element.innerHTML = nowHtml + this.checkboxTemplateHTML;
                } else for (var j = 0; j < this.checkboxTemplateArray.length; j++) this.element.appendChild(this.checkboxTemplateArray[j].cloneNode(!0));
                var LabelS = this.element.querySelectorAll(".u-checkbox");
                self.lastLabel = LabelS[LabelS.length - 1];
                var allCheckS = this.element.querySelectorAll("[type=checkbox]");
                self.lastCheck = allCheckS[allCheckS.length - 1];
                var nameDivs = this.element.querySelectorAll("[data-role=name]");
                self.lastNameDiv = nameDivs[nameDivs.length - 1], self.lastNameDiv.innerHTML = "其他", 
                self.otherInput = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_dom__.a)('<input disabled type="text" style="width: 80%">'), 
                self.lastNameDiv.parentNode.appendChild(self.otherInput), self.lastCheck.value = "";
                var comp;
                comp = self.lastLabel["u.Checkbox"] ? self.lastLabel["u.Checkbox"] : new __WEBPACK_IMPORTED_MODULE_1_tinper_neoui_src_neoui_checkbox__.a(self.lastLabel), 
                self.lastLabel["u.Checkbox"] = comp, self.otherComp = comp, comp.on("change", function() {
                    if (!self.slice) {
                        var modelValue = self.dataModel.getValue(self.field);
                        modelValue = modelValue ? modelValue : "";
                        var valueArr = "" == modelValue ? [] : modelValue.split(",");
                        if (comp._inputElement.checked) {
                            var oldIndex = valueArr.indexOf(self.otherInput.oldValue);
                            oldIndex > -1 && valueArr.splice(oldIndex, 1), self.otherInput.value && valueArr.push(self.otherInput.value);
                            var otherValueIndex = valueArr.indexOf(self.otherValue);
                            otherValueIndex < 0 && valueArr.push(self.otherValue), comp.element.querySelectorAll('input[type="text"]').forEach(function(ele) {
                                ele.removeAttribute("disabled");
                            });
                        } else {
                            var index = valueArr.indexOf(self.otherInput.value);
                            index > -1 && valueArr.splice(index, 1);
                            var otherValueIndex = valueArr.indexOf(self.otherValue);
                            otherValueIndex > -1 && valueArr.splice(otherValueIndex, 1), comp.element.querySelectorAll('input[type="text"]').forEach(function(ele) {
                                ele.setAttribute("disabled", "true");
                            });
                        }
                        self.dataModel.setValue(self.field, valueArr.join(","));
                    }
                }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(self.otherInput, "blur", function(e) {
                    self.lastCheck.value = this.value, self.otherComp.trigger("change"), this.oldValue = this.value;
                }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(self.otherInput, "click", function(e) {
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.b)(e);
                });
            }
            this.dataModel && this.dataModel.ref(this.field).subscribe(function(value) {
                value || (value = ""), self.modelValueChange(value);
            });
        },
        setComboData: function(comboData) {
            var self = this;
            if (this.datasource = comboData, this.element.innerHTML = "", __WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_env__.a.isIE) {
                for (var htmlStr = "", i = 0, len = comboData.length; i < len; i++) htmlStr += this.checkboxTemplateHTML;
                this.element.innerHTML = htmlStr;
            } else for (var i = 0, len = comboData.length; i < len; i++) for (var j = 0; j < this.checkboxTemplateArray.length; j++) this.element.appendChild(this.checkboxTemplateArray[j].cloneNode(!0));
            for (var allCheck = this.element.querySelectorAll("[type=checkbox]"), allName = this.element.querySelectorAll("[data-role=name]"), k = 0; k < allCheck.length; k++) allCheck[k].value = comboData[k].pk || comboData[k].value, 
            allName[k].innerHTML = comboData[k].name;
            this.element.querySelectorAll(".u-checkbox").forEach(function(ele) {
                var comp;
                ele["u.Checkbox"] ? comp = ele["u.Checkbox"] : (comp = new __WEBPACK_IMPORTED_MODULE_1_tinper_neoui_src_neoui_checkbox__.a(ele), 
                comp.beforeEdit = self.beforeEdit), ele["u.Checkbox"] = comp, comp.on("change", function() {
                    if (!self.slice) {
                        var modelValue = self.dataModel.getValue(self.field);
                        modelValue = modelValue ? modelValue : "";
                        var valueArr = "" == modelValue ? [] : modelValue.split(",");
                        if (comp._inputElement.checked) valueArr.push(comp._inputElement.value); else {
                            var index = valueArr.indexOf(comp._inputElement.value);
                            valueArr.splice(index, 1);
                        }
                        self.dataModel.setValue(self.field, valueArr.join(","));
                    }
                });
            });
        },
        modelValueChange: function(val) {
            var self = this;
            if (!this.slice) if (this.isGroup) {
                if (this.datasource) {
                    if (this.trueValue = val, this.options.hasOther) {
                        var otherVal = "";
                        val && (otherVal = val + ",");
                    }
                    this.element.querySelectorAll(".u-checkbox").forEach(function(ele) {
                        var comp = ele["u.Checkbox"];
                        if (comp) {
                            var inputValue = comp._inputElement.value;
                            inputValue && comp._inputElement.checked != (val + ",").indexOf(inputValue + ",") > -1 && (self.slice = !0, 
                            comp.toggle(), self.slice = !1), inputValue && (val + ",").indexOf(inputValue + ",") > -1 && self.options.hasOther && (otherVal = otherVal.replace(inputValue + ",", ""));
                        }
                    }), this.options.hasOther && (otherVal.indexOf(this.otherValue + ",") > -1 && (self.lastCheck.value = this.otherValue, 
                    otherVal = otherVal.replace(this.otherValue + ",", "")), (otherVal = otherVal.replace(/\,/g, "")) && (self.otherInput.oldValue = otherVal, 
                    self.otherInput.value = otherVal, self.otherInput.removeAttribute("disabled")));
                }
            } else {
                var flag;
                flag = this.checkedValue === !0 ? val === this.checkedValue || "true" === val : val === this.checkedValue, 
                this.comp._inputElement.checked != flag && (this.slice = !0, this.comp.toggle(), 
                this.slice = !1);
            }
        },
        setEnable: function(enable) {
            this.enable = enable === !0 || "true" === enable, this.isGroup ? this.datasource && (this.otherInput && !this.enable && this.otherInput.setAttribute("disabled", !0), 
            this.element.querySelectorAll(".u-checkbox").forEach(function(ele) {
                var comp = ele["u.Checkbox"];
                comp && (enable === !0 || "true" === enable ? comp.enable() : comp.disable());
            })) : this.enable ? this.comp.enable() : this.comp.disable();
        }
    });
    u.compMgr && u.compMgr.addDataAdapter({
        adapter: CheckboxAdapter,
        name: "u-checkbox"
    });
} ]);