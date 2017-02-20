'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.YearMonthAdapter = undefined;

var _keroaBaseAdapter = require('./keroa-baseAdapter');

var _neouiYearmonth = require('tinper-neoui/src/neoui-yearmonth');

var _compMgr = require('compox/src/compMgr');

var YearMonthAdapter = _keroaBaseAdapter.BaseAdapter.extend({
    init: function init() {
        var self = this;
        this.validType = 'yearmonth';

        this.comp = new _neouiYearmonth.YearMonth({ el: this.element, showFix: this.options.showFix });

        this.comp.on('valueChange', function (event) {
            self.slice = true;
            self.dataModel.setValue(self.field, event.value);
            self.slice = false;
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
     * Module : Kero yearmonth adapter
     * Author : Kvkens(yueming@yonyou.com)
     * Date	  : 2016-08-10 14:11:50
     */


_compMgr.compMgr.addDataAdapter({
    adapter: YearMonthAdapter,
    name: 'u-yearmonth'
});

exports.YearMonthAdapter = YearMonthAdapter;