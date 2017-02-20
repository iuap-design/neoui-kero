'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ProgressAdapter = undefined;

var _keroaBaseAdapter = require('./keroa-baseAdapter');

var _neouiProgress = require('tinper-neoui/src/neoui-progress');

var _compMgr = require('compox/src/compMgr');

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