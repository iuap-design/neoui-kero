(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './keroa-baseAdapter', 'tinper-neoui/src/neoui-month', 'compox/src/compMgr'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./keroa-baseAdapter'), require('tinper-neoui/src/neoui-month'), require('compox/src/compMgr'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.keroaBaseAdapter, global.neouiMonth, global.compMgr);
        global.keroaMonth = mod.exports;
    }
})(this, function (exports, _keroaBaseAdapter, _neouiMonth, _compMgr) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.MonthAdapter = undefined;


    var MonthAdapter = _keroaBaseAdapter.BaseAdapter.extend({
        init: function init() {
            var self = this;
            this.validType = 'month';

            this.comp = new _neouiMonth.Month({ el: this.element, showFix: this.options.showFix });

            // ui影响datatable
            this.comp.on('valueChange', function (event) {
                // 防止循环
                self.slice = true;
                self.dataModel.setValue(self.field, event.value);
                self.slice = false;
                //self.setValue(event.value);
            });
            // datatable反影响ui
            this.dataModel.ref(this.field).subscribe(function (value) {
                self.modelValueChange(value);
            });
        },
        // 触发空间
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
});