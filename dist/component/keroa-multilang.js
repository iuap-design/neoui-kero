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
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 8);
}([ function(module, __webpack_exports__, __webpack_require__) {
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
    var __WEBPACK_IMPORTED_MODULE_0__enumerables__ = __webpack_require__(0);
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
    __webpack_require__.d(__webpack_exports__, "c", function() {
        return createShellObject;
    }), __webpack_require__.d(__webpack_exports__, "b", function() {
        return isArray;
    }), __webpack_require__.d(__webpack_exports__, "a", function() {
        return each;
    });
    var createShellObject = ("function" == typeof Symbol && Symbol.iterator, function(proto) {
        var exf = function() {};
        return exf.prototype = proto, new exf();
    }), isArray = Array.isArray || function(val) {
        return "[object Array]" === Object.prototype.toString.call(val);
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
    var __WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_extend__ = __webpack_require__(2), __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_util__ = __webpack_require__(3), __WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_dom__ = __webpack_require__(7), __WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__ = __webpack_require__(1);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return Multilang;
    });
    var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, Multilang = u.BaseComponent.extend({
        init: function() {
            this.element;
            this.options = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_extend__.a)({}, this.DEFAULTS, this.options), 
            this.field = this.options.field || "name", this.multinfo(this.options.multinfo), 
            this.addData(this.options.multidata);
        }
    });
    Multilang.fn = Multilang.prototype, Multilang.fn.addData = function(val) {
        var tmparray, target = this.element, target_div = target.parentNode;
        tmparray = null === val || void 0 === val ? [] : "object" == (void 0 === val ? "undefined" : _typeof(val)) ? val : val.split(","), 
        target_div.value = tmparray, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_util__.a)(tmparray, function(i, node) {
            target_div.querySelectorAll(".m_context")[i].innerHTML = node;
        });
    }, Multilang.fn.multinfo = function(sort) {
        var target = this.element, self = this, tmplabel = "", close_menu = !1;
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_util__.b)(sort)) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_dom__.a)(target, "<div class='multilang_body'><input class='lang_value' contenteditable='true'><span class='uf uf-caretdown lang_icon'><span class='m_icon'></span></span>"), 
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_dom__.b)(target, "display", "none"), 
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_util__.a)(sort, function(i, node) {
                tmplabel += i ? "<label attr='" + self.field + (i + 1) + "'><span class='m_context'></span><span class='m_icon'>" + node + "</span></label>" : "<label attr='" + self.field + "'><span class='m_context'></span><span class='m_icon'>" + node + "</span></label>";
            });
            var target_div = target.parentNode;
            target_div.insertAdjacentHTML("beforeEnd", "<div class='multilang_menu '>" + tmplabel + "</div>");
            var tmpIconv = target_div.querySelector(".lang_icon"), target_menu = target_div.querySelector(".multilang_menu"), target_labels = target_menu.querySelectorAll("label"), tmpvaluebox = target_div.querySelector(".lang_value");
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(tmpIconv, "click", function() {
                target_div.querySelector(".lang_value").focus(), "block" == __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_dom__.b)(target_menu, "display") ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_dom__.b)(target_menu, "display", "none") : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_dom__.b)(target_menu, "display", "block");
            }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(target_menu, "mouseenter", function() {
                close_menu = !1;
            }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(target_menu, "mouseleave", function() {
                close_menu = !0;
            }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(tmpvaluebox, "blur", function(e) {
                var target_input = $(this), target_div = target_input.parents(".multilang_body"), target = e.target, tmpkey = target.className.split(" ")[2], tmptext = target.value;
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_dom__.c)(target, "ready_change") && self.changeData(target_div[0], tmpkey, tmptext);
            }), target_labels.forEach(function(ele) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(ele, "click", function() {
                    var target_label = this, tempField = target_label.getAttribute("attr"), tmptext = target_label.querySelector(".m_context").innerHTML, tmpicon = target_label.querySelector(".m_icon").cloneNode(!0);
                    tmpvaluebox.setAttribute("class", "ready_change lang_value " + tempField), tmpvaluebox.value = tmptext, 
                    tmpvaluebox.focus();
                    var tmpicom = target_div.querySelector(".lang_icon"), oldicon = target_div.querySelector(".m_icon");
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_dom__.d)(tmpicom, "uf-caretdown"), 
                    tmpicom.replaceChild(tmpicon, oldicon);
                });
            });
        } else console.error("Not object");
    }, Multilang.fn.changeData = function(target_div, field, text) {
        var tmpdata = target_div.value, tmplabel = target_div.querySelector("label[attr='" + field + "']"), tmpcontext = tmplabel.querySelector(".m_context");
        tmpcontext.innerHTML = text, tmpcontext.value = text, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_util__.a)(target_div.querySelectorAll(".m_context"), function(i, node) {
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_util__.a)(this.element.closest(".multilang_body").querySelectorAll(".m_context"), function(i, node) {
            tmpdata[i] = node.innerHTML;
        }), this.element.closest(".multilang_body").value = tmpdata;
    }, u.compMgr && u.compMgr.regComp({
        comp: Multilang,
        compAsString: "u.Multilang",
        css: "u-multilang"
    });
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__extend__ = __webpack_require__(2), __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(3), __WEBPACK_IMPORTED_MODULE_2__cookies__ = __webpack_require__(6), __WEBPACK_IMPORTED_MODULE_3__enumerables__ = __webpack_require__(0);
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
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__.c)(environment);
    }, fn.getClientAttributes = function() {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__.c)(clientAttributes);
    }, fn.setContextPath = function(contextPath) {
        return environment[IWEB_CONTEXT_PATH] = contextPath;
    }, fn.getContextPath = function(contextPath) {
        return environment[IWEB_CONTEXT_PATH];
    }, fn.setClientAttribute = function(k, v) {
        clientAttributes[k] = v;
    }, fn.getSessionAttributes = function() {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__.c)(sessionAttributes);
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
    Object.defineProperty(__webpack_exports__, "__esModule", {
        value: !0
    });
    var __WEBPACK_IMPORTED_MODULE_0_tinper_neoui_src_neoui_multilang__ = __webpack_require__(4), __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_core__ = __webpack_require__(5);
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