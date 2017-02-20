'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.YearAdapter = undefined;

var _keroaBaseAdapter = require('./keroa-baseAdapter');

var _neouiYear = require('tinper-neoui/src/neoui-year');

var _compMgr = require('compox/src/compMgr');

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