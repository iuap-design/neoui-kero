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
            if (__WEBPACK_IMPORTED_MODULE_0__enumerables__.b) for (j = __WEBPACK_IMPORTED_MODULE_0__enumerables__.b.length; j--; ) k = __WEBPACK_IMPORTED_MODULE_0__enumerables__.b[j], 
            options.hasOwnProperty && options.hasOwnProperty(k) && (object[k] = options[k]);
        }
        return object;
    };
    Object.assign || (Object.assign = extend);
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return getFunction;
    }), __webpack_require__.d(__webpack_exports__, "b", function() {
        return each;
    });
    var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, getFunction = function(target, val) {
        if (!val || "function" == typeof val) return val;
        if ("function" == typeof target[val]) return target[val];
        if ("function" == typeof window[val]) return window[val];
        if (-1 != val.indexOf(".")) {
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
    }, each = (Array.isArray, function(obj, callback) {
        if (obj.forEach) obj.forEach(function(v, k) {
            callback(k, v);
        }); else {
            if (!(obj instanceof Object)) return;
            for (var k in obj) callback(k, obj[k]);
        }
    });
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
    __webpack_require__.d(__webpack_exports__, "b", function() {
        return enumerables;
    }), __webpack_require__.d(__webpack_exports__, "a", function() {
        return U_LOCALE;
    });
    var U_LOCALE = "u_locale", enumerables = !0, enumerablesTest = {
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
    var __WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_extend__ = __webpack_require__(0), __WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__ = __webpack_require__(6), __WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_util__ = __webpack_require__(1), __WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__ = __webpack_require__(3), __WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_util_i18n__ = __webpack_require__(7);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return pagination;
    });
    var pagination = ("function" == typeof Symbol && Symbol.iterator, u.BaseComponent.extend({})), PageProxy = function(options, page) {
        this.isCurrent = function() {
            return page == options.currentPage;
        }, this.isFirst = function() {
            return 1 == page;
        }, this.isLast = function() {
            return page == options.totalPages;
        }, this.isPrev = function() {
            return page == options.currentPage - 1;
        }, this.isNext = function() {
            return page == options.currentPage + 1;
        }, this.isLeftOuter = function() {
            return page <= options.outerWindow;
        }, this.isRightOuter = function() {
            return options.totalPages - page < options.outerWindow;
        }, this.isInsideWindow = function() {
            return options.currentPage < options.innerWindow + 1 ? page <= 2 * options.innerWindow + 1 : options.currentPage > options.totalPages - options.innerWindow ? options.totalPages - page <= 2 * options.innerWindow : Math.abs(options.currentPage - page) <= options.innerWindow;
        }, this.number = function() {
            return page;
        }, this.pageSize = function() {
            return options.pageSize;
        };
    }, View = {
        firstPage: function(pagin, options, currentPageProxy) {
            return '<li role="first"' + (currentPageProxy.isFirst() ? 'class="disabled"' : "") + "><a >" + options.first + "</a></li>";
        },
        prevPage: function(pagin, options, currentPageProxy) {
            return '<li role="prev"' + (currentPageProxy.isFirst() ? 'class="disabled"' : "") + '><a  rel="prev">' + options.prev + "</a></li>";
        },
        nextPage: function(pagin, options, currentPageProxy) {
            return '<li role="next"' + (currentPageProxy.isLast() ? 'class="disabled"' : "") + '><a  rel="next">' + options.next + "</a></li>";
        },
        lastPage: function(pagin, options, currentPageProxy) {
            return '<li role="last"' + (currentPageProxy.isLast() ? 'class="disabled"' : "") + "><a >" + options.last + "</a></li>";
        },
        gap: function(pagin, options) {
            return '<li role="gap" class="disabled"><a >' + options.gap + "</a></li>";
        },
        page: function(pagin, options, pageProxy) {
            return '<li role="page"' + (pageProxy.isCurrent() ? 'class="active"' : "") + "><a " + (pageProxy.isNext() ? ' rel="next"' : "") + (pageProxy.isPrev() ? 'rel="prev"' : "") + ">" + pageProxy.number() + "</a></li>";
        }
    };
    pagination.prototype.init = function(element, options) {
        var element = this.element;
        this.$element = element, this.options = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_extend__.a)({}, this.DEFAULTS, this.options), 
        this.$ul = this.$element, this.render();
    }, pagination.prototype.DEFAULTS = {
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        pageList: [ 5, 10, 20, 50, 100 ],
        innerWindow: 2,
        outerWindow: 0,
        first: "&laquo;",
        prev: '<i class="uf uf-anglepointingtoleft"></i>',
        next: '<i class="uf uf-anglearrowpointingtoright"></i>',
        last: "&raquo;",
        gap: "···",
        totalText: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_util_i18n__.a)("pagination.totalText", "共"),
        listText: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_util_i18n__.a)("pagination.listText", "条"),
        showText: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_util_i18n__.a)("pagination.showText", "显示"),
        pageText: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_util_i18n__.a)("pagination.pageText", "页"),
        toText: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_util_i18n__.a)("pagination.toText", "到"),
        okText: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_tinper_sparrow_src_util_i18n__.a)("public.ok", "确定"),
        truncate: !1,
        showState: !0,
        showTotal: !0,
        showColumn: !0,
        showJump: !0,
        page: function(_page) {
            return !0;
        }
    }, pagination.prototype.update = function(options) {
        this.$ul.innerHTML = "", this.options = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_extend__.a)({}, this.options, options), 
        this.render();
    }, pagination.prototype.render = function() {
        var options = (new Date().valueOf(), this.options);
        if (!options.totalPages) return void (this.$element.style.display = "none");
        this.$element.style.display = "block";
        var pageProxy, htmlArr = [], currentPageProxy = new PageProxy(options, options.currentPage), total = options.totalPages - 0, current = options.currentPage - 0, fix = 0;
        if (current - 2 <= 3) {
            for (var i = 1; i <= current; i++) pageProxy = new PageProxy(options, i), htmlArr.push(View.page(this, options, pageProxy));
            if (fix = 2 - (current - 1) < 0 ? 0 : 2 - (current - 1), total - current - fix <= 3) for (var i = current + 1; i <= total; i++) pageProxy = new PageProxy(options, i), 
            htmlArr.push(View.page(this, options, pageProxy)); else {
                for (var i = current + 1; i <= current + 2 + fix; i++) pageProxy = new PageProxy(options, i), 
                htmlArr.push(View.page(this, options, pageProxy));
                htmlArr.push(View.gap(this, options)), pageProxy = new PageProxy(options, total), 
                htmlArr.push(View.page(this, options, pageProxy));
            }
        } else if (total - current <= 3) {
            fix = 2 - (total - current) < 0 ? 0 : 2 - (total - current);
            for (var i = current - 2 - fix; i <= total; i++) pageProxy = new PageProxy(options, i), 
            htmlArr.push(View.page(this, options, pageProxy));
            i >= 2 && (htmlArr.unshift(View.gap(this, options)), pageProxy = new PageProxy(options, 1), 
            htmlArr.unshift(View.page(this, options, pageProxy)));
        } else {
            for (var i = current - 2; i <= current + 2; i++) pageProxy = new PageProxy(options, i), 
            htmlArr.push(View.page(this, options, pageProxy));
            htmlArr.push(View.gap(this, options)), pageProxy = new PageProxy(options, total), 
            htmlArr.push(View.page(this, options, pageProxy)), htmlArr.unshift(View.gap(this, options)), 
            pageProxy = new PageProxy(options, 1), htmlArr.unshift(View.page(this, options, pageProxy));
        }
        if (htmlArr.unshift(View.prevPage(this, options, currentPageProxy)), htmlArr.push(View.nextPage(this, options, currentPageProxy)), 
        (void 0 === options.totalCount || options.totalCount <= 0) && (options.totalCount = 0), 
        options.showState) {
            var pageOption = "";
            options.pageList.forEach(function(item) {
                options.pageSize - 0 == item ? pageOption += "<option selected>" + item + "</option>" : pageOption += "<option>" + item + "</option>";
            });
            var htmlTmp = "";
            options.showTotal && (htmlTmp += '<div class="pagination-state">' + options.totalText + "&nbsp;" + options.totalCount + "&nbsp;" + options.listText + "</div>"), 
            options.showColumn && (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.a)(this.$ul, "pagination-sm") ? htmlTmp += '<div class="pagination-state">' + options.showText + '<select  class="page_z page_z_sm">' + pageOption + "</select>" + options.listText + "</div>" : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.a)(this.$ul, "pagination-lg") ? htmlTmp += '<div class="pagination-state">' + options.showText + '<select  class="page_z page_z_lg">' + pageOption + "</select>" + options.listText + "</div>" : htmlTmp += '<div class="pagination-state">' + options.showText + '<select  class="page_z">' + pageOption + "</select>" + options.listText + "</div>"), 
            options.showJump && (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.a)(this.$ul, "pagination-sm") ? htmlTmp += '<div class="pagination-state">' + options.toText + '<input class="page_j text-center page_j_sm padding-left-0" value=' + options.currentPage + ">" + options.pageText + '<input class="pagination-jump pagination-jump-sm" type="button" value="' + options.okText + '"/></div>' : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_tinper_sparrow_src_dom__.a)(this.$ul, "pagination-lg") ? htmlTmp += '<div class="pagination-state">' + options.toText + '<input class="page_j text-center page_j_lg padding-left-0" value=' + options.currentPage + ">" + options.pageText + '<input class="pagination-jump pagination-jump-lg" type="button" value="' + options.okText + '"/></div>' : htmlTmp += '<div class="pagination-state">' + options.toText + '<input class="page_j text-center padding-left-0" value=' + options.currentPage + ">" + options.pageText + '<input class="pagination-jump" type="button" value="' + options.okText + '"/></div>'), 
            htmlArr.push(htmlTmp);
        }
        this.$ul.innerHTML = "", this.$ul.insertAdjacentHTML("beforeEnd", htmlArr.join(""));
        var me = this;
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(this.$ul.querySelector(".pagination-jump"), "click", function() {
            var jp, pz;
            if (jp = me.$ul.querySelector(".page_j").value || options.currentPage, pz = me.$ul.querySelector(".page_z").value || options.pageSize, 
            !isNaN(jp)) return me.page(jp, options.totalPages, pz), !1;
        }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(this.$ul.querySelector('[role="first"] a'), "click", function() {
            if (!(options.currentPage <= 1)) return me.firstPage(), !1;
        }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(this.$ul.querySelector('[role="prev"] a'), "click", function() {
            if (!(options.currentPage <= 1)) return me.prevPage(), !1;
        }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(this.$ul.querySelector('[role="next"] a'), "click", function() {
            if (!(parseInt(options.currentPage) + 1 > options.totalPages)) return me.nextPage(), 
            !1;
        }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(this.$ul.querySelector('[role="last"] a'), "click", function() {
            if (options.currentPage != options.totalPages) return me.lastPage(), !1;
        }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_util__.b)(this.$ul.querySelectorAll('[role="page"] a'), function(i, node) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(node, "click", function() {
                var pz = me.$element.querySelector(".page_z") && $(this).val() || options.pageSize;
                return me.page(parseInt(this.innerHTML), options.totalPages, pz), !1;
            });
        }), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_tinper_sparrow_src_event__.a)(this.$ul.querySelector(".page_z"), "change", function() {
            var pz = me.$element.querySelector(".page_z") && $(this).val() || options.pageSize;
            me.trigger("sizeChange", pz);
        });
    }, pagination.prototype.page = function(pageIndex, totalPages, pageSize) {
        var options = this.options;
        void 0 === totalPages && (totalPages = options.totalPages), void 0 === pageSize && (pageSize = options.pageSize);
        var oldPageSize = options.pageSize;
        options.page(pageIndex) && (pageIndex <= 0 && (pageIndex = 1), pageIndex > totalPages && (pageIndex = totalPages), 
        this.$ul.innerHTML = "", options.pageSize = pageSize, options.currentPage = pageIndex, 
        options.totalPages = totalPages, this.render());
        var temppageIndex = pageIndex - 1 < 0 ? 0 : pageIndex - 1;
        return pageSize != oldPageSize ? this.trigger("sizeChange", [ pageSize, temppageIndex ]) : this.trigger("pageChange", temppageIndex), 
        !1;
    }, pagination.prototype.firstPage = function() {
        return this.page(1);
    }, pagination.prototype.lastPage = function() {
        return this.page(this.options.totalPages);
    }, pagination.prototype.nextPage = function() {
        return this.page(parseInt(this.options.currentPage) + 1);
    }, pagination.prototype.prevPage = function() {
        return this.page(this.options.currentPage - 1);
    }, pagination.prototype.disableChangeSize = function() {
        this.$element.querySelector(".page_z").setAttribute("readonly", !0);
    }, pagination.prototype.enableChangeSize = function() {
        this.$element.querySelector(".page_z").removeAttribute("readonly");
    }, u.compMgr && u.compMgr.regComp({
        comp: pagination,
        compAsString: "u.pagination",
        css: "u-pagination"
    });
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return getCookie;
    });
    var getCookie = function(sName) {
        var sRE = "(?:; )?" + sName + "=([^;]*);?";
        return new RegExp(sRE).test(document.cookie) ? decodeURIComponent(RegExp.$1) : null;
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__(3);
    __webpack_require__.d(__webpack_exports__, "a", function() {
        return hasClass;
    });
    var hasClass = function(element, value) {
        return !!element && ((!element.nodeName || "#text" !== element.nodeName && "#comment" !== element.nodeName) && (void 0 === element.classList ? u._hasClass ? u._hasClass(element, value) : $(element).hasClass(value) : element.classList.contains(value)));
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    var __WEBPACK_IMPORTED_MODULE_0__cookies__ = __webpack_require__(5), __WEBPACK_IMPORTED_MODULE_1__enumerables__ = __webpack_require__(2);
    if (__webpack_require__.d(__webpack_exports__, "a", function() {
        return trans;
    }), window.getCurrentJsPath = function() {
        var doc = document, a = {}, expose = +new Date(), rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/, isLtIE8 = -1 === ("" + doc.querySelector).indexOf("[native code]");
        if (doc.currentScript) return doc.currentScript.src;
        var stack;
        try {
            a.b();
        } catch (e) {
            stack = e.stack || e.fileName || e.sourceURL || e.stacktrace;
        }
        if (stack) {
            var absPath = rExtractUri.exec(stack)[1];
            if (absPath) return absPath;
        }
        for (var script, scripts = doc.scripts, i = scripts.length - 1; script = scripts[i--]; ) if (script.className !== expose && "interactive" === script.readyState) return script.className = expose, 
        isLtIE8 ? script.getAttribute("src", 4) : script.src;
    }, window.i18n) {
        window.u = window.u || {};
        var scriptPath = getCurrentJsPath(), _temp = scriptPath.substr(0, scriptPath.lastIndexOf("/")), __FOLDER__ = _temp.substr(0, _temp.lastIndexOf("/")), resGetPath = u.i18nPath || __FOLDER__ + "/locales/__lng__/__ns__.json";
        i18n.init({
            postAsync: !1,
            getAsync: !1,
            fallbackLng: !1,
            ns: {
                namespaces: [ "uui-trans" ]
            },
            lng: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__cookies__.a)(__WEBPACK_IMPORTED_MODULE_1__enumerables__.a) || "zh",
            resGetPath: resGetPath
        });
    }
    var trans = function(key, dftValue) {
        return window.i18n ? i18n.t("uui-trans:" + key) : dftValue;
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", {
        value: !0
    });
    var __WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_extend__ = __webpack_require__(0), __WEBPACK_IMPORTED_MODULE_1_tinper_neoui_src_neoui_pagination__ = __webpack_require__(4), __WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_util__ = __webpack_require__(1);
    __webpack_require__.d(__webpack_exports__, "PaginationAdapter", function() {
        return PaginationAdapter;
    });
    var PaginationAdapter = u.BaseAdapter.extend({
        mixins: [],
        init: function() {
            var self = this;
            !this.dataModel.pageSize() && this.options.pageSize && this.dataModel.pageSize(this.options.pageSize), 
            this.options.pageSize = this.dataModel.pageSize() || this.options.pageSize;
            var options = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_tinper_sparrow_src_extend__.a)({}, {
                el: this.element
            }, this.options);
            if (this.comp = new __WEBPACK_IMPORTED_MODULE_1_tinper_neoui_src_neoui_pagination__.a(options), 
            this.element["u.pagination"] = this.comp, this.comp.dataModel = this.dataModel, 
            this.pageChange = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_util__.a)(this.viewModel, this.options.pageChange), 
            this.sizeChange = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_tinper_sparrow_src_util__.a)(this.viewModel, this.options.sizeChange), 
            this.comp.on("pageChange", function(pageIndex) {
                "function" == typeof self.pageChange ? self.pageChange(pageIndex) : self.defaultPageChange(pageIndex);
            }), this.comp.on("sizeChange", function(size, pageIndex) {
                "function" == typeof self.sizeChange ? self.sizeChange(size, pageIndex) : self.defaultSizeChange(size, pageIndex);
            }), this.dataModel.totalPages.subscribe(function(value) {
                self.comp.update({
                    totalPages: value
                });
            }), this.dataModel.pageSize.subscribe(function(value) {
                self.comp.update({
                    pageSize: value
                });
            }), this.dataModel.pageIndex.subscribe(function(value) {
                self.comp.update({
                    currentPage: value + 1
                });
            }), this.dataModel.totalRow.subscribe(function(value) {
                self.comp.update({
                    totalCount: value
                });
            }), this.comp.options.pageList.length > 0) {
                this.comp.options.pageSize = this.comp.options.pageList[0];
                var checkIndex = 0, defalutPageSize = this.comp.dataModel.pageSize();
                defalutPageSize > 0 && (checkIndex = this.comp.options.pageList.indexOf(defalutPageSize)), 
                checkIndex = checkIndex < 0 ? 0 : checkIndex, this.dataModel.pageSize(this.comp.options.pageList[checkIndex]);
            }
            self.comp.update({
                totalPages: this.dataModel.totalPages(),
                pageSize: this.dataModel.pageSize(),
                currentPage: this.dataModel.pageIndex() + 1,
                totalCount: this.dataModel.totalRow()
            });
        },
        defaultPageChange: function(pageIndex) {
            this.dataModel.hasPage(pageIndex) && this.dataModel.setCurrentPage(pageIndex);
        },
        defaultSizeChange: function(size, pageIndex) {
            this.dataModel.pageSize(size);
        },
        disableChangeSize: function() {
            this.comp.disableChangeSize();
        },
        enableChangeSize: function() {
            this.comp.enableChangeSize();
        }
    });
    u.compMgr && u.compMgr.addDataAdapter({
        adapter: PaginationAdapter,
        name: "pagination"
    });
} ]);