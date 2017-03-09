(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './keroa-baseAdapter', 'tinper-neoui/src/neoui-year', 'compox/src/compMgr'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./keroa-baseAdapter'), require('tinper-neoui/src/neoui-year'), require('compox/src/compMgr'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.keroaBaseAdapter, global.neouiYear, global.compMgr);
        global.keroaYear = mod.exports;
    }
})(this, function (exports, _keroaBaseAdapter, _neouiYear, _compMgr) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.YearAdapter = undefined;


    var YearAdapter = _keroaBaseAdapter.BaseAdapter.extend({
        init: function init() {
            var self = this;
            this.validType = 'year';

            this.comp = new _neouiYear.Year({ el: this.element, showFix: this.options.showFix });

            this.comp.on('valueChange', function (event) {
                self.slice = true;
                self.setValue(event.value);
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
});