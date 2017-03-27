/*!
 * neoui-kero v3.2.0
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
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 0);
}([ function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", {
        value: !0
    }), __webpack_require__.d(__webpack_exports__, "CkEditorAdapter", function() {
        return CkEditorAdapter;
    });
    var CkEditorAdapter = u.BaseAdapter.extend({
        init: function() {
            this.e_editor = this.id + "-ckeditor", this.render(this.options);
        },
        render: function(data) {
            var cols = data.cols || 80, rows = data.rows || 10, self = this, tpls = '<textarea cols="' + cols + '" id="' + this.e_editor + '" name="' + this.e_editor + '_name" rows="' + rows + '"></textarea>';
            $(this.element).append(tpls), CKEDITOR.replace(this.e_editor + "_name");
            var tmpeditor = CKEDITOR.instances[this.e_editor];
            this.tmpeditor = tmpeditor, this.tmpeditor.on("blur", function() {
                self.setValue(tmpeditor.getData());
            }), this.tmpeditor.on("focus", function() {
                self.setShowValue(self.getValue());
            });
        },
        modelValueChange: function(value) {
            this.slice || (value = value || "", this.trueValue = value, this.showValue = value, 
            this.setShowValue(this.showValue));
        },
        getValue: function() {
            return this.trueValue;
        },
        setShowValue: function(showValue) {
            var self = this;
            this.showValue = showValue, this.element.value = showValue, this.tmpeditor.setData(showValue), 
            self.setShowValueInter && clearInterval(self.setShowValueInter), self.setShowValueInter = setInterval(function() {
                self.tmpeditor.document && self.tmpeditor.document.$ && self.tmpeditor.document.$.body && (self.tmpeditor.document.$.body.innerHTML = showValue, 
                clearInterval(self.setShowValueInter));
            }, 100);
        },
        getShowValue: function() {
            return this.showValue;
        },
        getContent: function() {
            return $("#" + this.e_editor).html();
        },
        setContent: function(txt) {
            $("#" + this.e_editor).html(txt);
        }
    });
    u.compMgr && u.compMgr.addDataAdapter({
        adapter: CkEditorAdapter,
        name: "u-ckeditor"
    });
} ]);