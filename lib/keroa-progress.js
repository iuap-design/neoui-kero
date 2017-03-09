(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './keroa-baseAdapter', 'tinper-neoui/src/neoui-progress', 'compox/src/compMgr'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./keroa-baseAdapter'), require('tinper-neoui/src/neoui-progress'), require('compox/src/compMgr'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.keroaBaseAdapter, global.neouiProgress, global.compMgr);
        global.keroaProgress = mod.exports;
    }
})(this, function (exports, _keroaBaseAdapter, _neouiProgress, _compMgr) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ProgressAdapter = undefined;


    var ProgressAdapter = _keroaBaseAdapter.BaseAdapter.extend({
        init: function init() {
            var self = this;

            this.comp = new _neouiProgress.Progress(this.element);
            this.element['u.Progress'] = this.comp;

            this.dataModel.ref(this.field).subscribe(function (value) {
                self.modelValueChange(value);
            });
        },

        modelValueChange: function modelValueChange(val) {
            this.comp.setProgress(val);
        }
    }); /**
         * Module : Kero percent
         * Author : Kvkens(yueming@yonyou.com)
         * Date	  : 2016-08-09 20:02:50
         */

    _compMgr.compMgr.addDataAdapter({
        adapter: ProgressAdapter,
        name: 'u-progress'
    });

    exports.ProgressAdapter = ProgressAdapter;
});