/*!
 * neoui-kero v3.2.1
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
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 9);
}([ function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return on;
    }), __webpack_require__.d(__webpack_exports__, "c", function() {
        return off;
    }), __webpack_require__.d(__webpack_exports__, "d", function() {
        return trigger;
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
    var __WEBPACK_IMPORTED_MODULE_0__extend__ = __webpack_require__(7);
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
        var userAgent = navigator.userAgent, rMsie = /(msie\s|trident.*rv:)([\w.]+)/, rFirefox = /(firefox)\/([\w.]+)/, rOpera = /(opera).+version\/([\w.]+)/, rChrome = /(chrome)\/([\w.]+)/, rSafari = /version\/([\w.]+).*(safari)/, ua = userAgent.toLowerCase(), browserMatch = {
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
        u.version = 0, u.isAndroid && (window.screen.width >= 768 && window.screen.width < 1024 && (u.isAndroidPAD = !0), 
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
    var __WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__ = __webpack_require__(1), __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_env__ = __webpack_require__(2), __WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__ = __webpack_require__(0), __WEBPACK_IMPORTED_MODULE_3__neoui_textfield__ = __webpack_require__(5), __WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_util_ripple__ = __webpack_require__(8), Combo = u.BaseComponent.extend({
        init: function() {
            this.name = "", this.mutilSelect = this.options.mutilSelect || !1, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.c)(this.element, "mutil-select") && (this.mutilSelect = !0), 
            this.onlySelect = this.options.onlySelect || !1, this.mutilSelect && (this.onlySelect = !0), 
            this.comboDatas = [];
            var i, option, datas = [], self = this;
            new __WEBPACK_IMPORTED_MODULE_3__neoui_textfield__.a(this.element);
            var options = this.element.getElementsByTagName("option");
            for (i = 0; i < options.length; i++) option = options[i], datas.push({
                value: option.value,
                name: option.text
            });
            this._input = this.element.querySelector("input"), this.setComboData(datas), this.mutilSelect && (this.nowWidth = 0, 
            this.showNowWidth = 0, this.multiNoneArr = [], this.fullWidth = this._input.offsetWidth), 
            this.onlySelect || __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_env__.a.isMobile ? setTimeout(function() {
                self._input.setAttribute("readonly", "readonly");
            }, 1e3) : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__.a)(this._input, "blur", function(e) {
                var v = this.value;
                if (v) {
                    for (var i = 0; i < self.comboDatas.length; i++) if (v == self.comboDatas[i].name) {
                        v = self.comboDatas[i].value;
                        break;
                    }
                    self.setValue(v);
                }
            }), this._combo_name_par = this.element.querySelector(".u-combo-name-par"), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__.a)(this._input, "focus", function(e) {
                self._inputFocus = !0, self.show(e), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__.b)(e);
            }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__.a)(this._input, "blur", function(e) {
                self._inputFocus = !1;
            }), this.isAutoTip = this.options.isAutoTip || !1, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__.a)(this._input, "keydown", function(e) {
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
            this.iconBtn && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__.a)(this.iconBtn, "click", function(e) {
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
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.d)({
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
            this._ul.style.width = width + "px", $(this._ul).addClass("is-animating"), this._ul.style.zIndex = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.e)(), 
            $(this._ul).addClass("is-visible");
            var callback = function(e) {
                e !== evt && e.target !== this._input && 1 != self._inputFocus && (this.mutilSelect && (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.f)(e.target, "u-combo-ul") === self._ul || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.f)(e.target, "u-combo-name-par") || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.f)(e.target, "u-combo-name")) || (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__.c)(document, "click", callback), 
                this.hide()));
            }.bind(this);
            this.callback = callback, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__.a)(document, "click", callback), 
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__.a)(document.body, "touchend", callback);
        },
        hide: function() {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__.c)(document, "click", this.callback), 
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.a)(this._ul, "is-visible"), 
            this._ul.style.zIndex = -1;
            var name = this._input.value;
            this.mutilSelect && (name = this.name), this.trigger("select", {
                value: this.value,
                name: name
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
            this._ul || (this._ul = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.g)('<ul class="u-combo-ul"></ul>')), 
            this._ul.innerHTML = "", i = 0; i < this.comboDatas.length; i++) {
                li = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.g)('<li class="u-combo-li">' + this.comboDatas[i].name + "</li>"), 
                li._index = i, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__.a)(li, "click", function() {
                    self.selectItem(this._index);
                });
                var rippleContainer = document.createElement("span");
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(rippleContainer, "u-ripple-container");
                var _rippleElement = document.createElement("span");
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(_rippleElement, "u-ripple"), 
                rippleContainer.appendChild(_rippleElement), li.appendChild(rippleContainer), new __WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_util_ripple__.a(li), 
                this._ul.appendChild(li);
            }
        },
        selectItem: function(index) {
            var self = this;
            if (self._inputFocus = !1, this.mutilSelect) {
                var flag, val = this.comboDatas[index].value, name = this.comboDatas[index].name, index = (this.value + ",").indexOf(val + ","), l = val.length + 1;
                if (0 == this.fullWidth && (this.fullWidth = this._input.offsetWidth, (this.fullWidth < 0 || 0 == this.fullWidth) && (this.fullWidth = parseInt($(this._input).width()) + 2 * parseInt($(this._input).css("border-left-width")) + 2 * parseInt($(this._input).css("padding-left")) + "px"), 
                this.fullWidth > 0 && this._combo_name_par && (this._combo_name_par.style.maxWidth = this.fullWidth + "px")), 
                index != -1 ? (this.value = this.value.substring(0, index) + this.value.substring(index + l), 
                flag = "-") : (this.value = this.value ? this.value + val + "," : val + ",", flag = "+"), 
                "+" == flag) {
                    this.name += name + ",";
                    var nameDiv = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.g)('<div class="u-combo-name" key="' + val + '">' + name + "</div>"), parNameDiv = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.g)('<div class="u-combo-name-par" style="position:absolute;max-width:' + this.fullWidth + 'px;"></div>');
                    this._combo_name_par || (this._input.parentNode.insertBefore(parNameDiv, this._input), 
                    this._combo_name_par = parNameDiv, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__.a)(this._combo_name_par, "click", function(e) {
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_event__.d)(self._input, "focus");
                    })), this._combo_name_par.appendChild(nameDiv), this._combo_name_par.title = this.name;
                    var nWidth = nameDiv.offsetWidth + 20;
                    this.nowWidth += nWidth, this.showNowWidth += nWidth, this.nowWidth > this.fullWidth && this.fullWidth > 0 && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(this._combo_name_par, "u-combo-overwidth"), 
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
                        if (this.nowWidth > this.fullWidth && this.fullWidth > 0 || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.a)(this._combo_name_par, "u-combo-overwidth"), 
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
            if (this.mutilSelect) for (var values = this.value.split(","), i = 0; i < lis.length; i++) values.indexOf(this.comboDatas[i].value) > -1 ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(lis[i], "is-selected") : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.a)(lis[i], "is-selected"); else for (var i = 0; i < lis.length; i++) this.value == this.comboDatas[i].value ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(lis[i], "is-selected") : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.a)(lis[i], "is-selected");
        },
        setValue: function(value) {
            var self = this;
            this.name = "", value += "", value = value || "";
            var values = value.split(",");
            this.mutilSelect === !0 && (self._combo_name_par && (self._combo_name_par.innerHTML = "", 
            $(self._combo_name_par).removeClass("u-combo-overwidth")), this.value = ""), value || (this._input.value = "", 
            this.value = "", this._updateItemSelect());
            var matched = !1;
            if (this.nowWidth = 0, this.showNowWidth = 0, this.multiNoneArr = [], this.comboDatas.forEach(function(item, index) {
                if (this.mutilSelect === !0) values.indexOf(item.value) != -1 && this.selectItem(index); else if (item.value + "" === value) return this.selectItem(index), 
                void (matched = !0);
            }.bind(this)), !this.onlySelect && !matched) {
                this.value = value, this._input.value = value;
                var name = this._input.value;
                this.mutilSelect && (name = this.name), this.trigger("select", {
                    value: this.value,
                    name: name
                });
            }
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
    u.compMgr && u.compMgr.regComp({
        comp: Combo,
        compAsString: "u.Combo",
        css: "u-combo"
    });
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return getJSObject;
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
    var __WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__ = __webpack_require__(1), __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_env__ = __webpack_require__(2);
    __webpack_require__(0);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return Text;
    });
    var Text = u.BaseComponent.extend({
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
                __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_env__.a.isIE8 && this._input.addEventListener("propertychange", function() {
                    oThis._updateClasses();
                }), this._input.addEventListener("focus", this.boundFocusHandler), (__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_env__.a.isIE8 || __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_env__.a.isIE9) && this.label_ && this.label_.addEventListener("click", function() {
                    this._input.focus();
                }.bind(this)), this._input.addEventListener("blur", this.boundBlurHandler), this._input.addEventListener("reset", this.boundResetHandler), 
                this.maxRows !== this._Constant.NO_MAX_ROWS && (this.boundKeyDownHandler = this._down.bind(this), 
                this._input.addEventListener("keydown", this.boundKeyDownHandler));
                var invalid = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.c)(this.element, this._CssClasses.IS_INVALID);
                this._updateClasses(), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_UPGRADED), 
                invalid && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_INVALID);
            }
        },
        _down: function(event) {
            var currentRowCount = event.target.value.split("\n").length;
            13 === event.keyCode && currentRowCount >= this.maxRows && event.preventDefault();
        },
        _focus: function(event) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_FOCUSED);
        },
        _blur: function(event) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.a)(this.element, this._CssClasses.IS_FOCUSED), 
            this.trigger("u.text.blur");
        },
        _reset: function(event) {
            this._updateClasses();
        },
        _updateClasses: function() {
            this.checkDisabled(), this.checkValidity(), this.checkDirty();
        },
        checkDisabled: function() {
            this._input.disabled ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_DISABLED) : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.a)(this.element, this._CssClasses.IS_DISABLED);
        },
        checkValidity: function() {
            this._input.validity && (this._input.validity.valid ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.a)(this.element, this._CssClasses.IS_INVALID) : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_INVALID));
        },
        checkDirty: function() {
            this._input.value && this._input.value.length > 0 ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.b)(this.element, this._CssClasses.IS_DIRTY) : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_dom__.a)(this.element, this._CssClasses.IS_DIRTY);
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
    u.compMgr && u.compMgr.regComp({
        comp: Text,
        compAsString: "u.Text",
        css: "u-text"
    });
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
    var __WEBPACK_IMPORTED_MODULE_0__enumerables__ = __webpack_require__(6);
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
    Object.assign || (Object.assign = extend);
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
    var __WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_util__ = __webpack_require__(4), __WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__ = (__webpack_require__(3), 
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
            this.mutil && (this.showValue = this.comp.name), this.trueValue = this.formater ? this.formater.format(value) : value, 
            this.element.trueValue = this.trueValue);
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