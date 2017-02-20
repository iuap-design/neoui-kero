'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MonthDateAdapter = undefined;

var _keroaBaseAdapter = require('./keroa-baseAdapter');

var _neouiMonthdate = require('tinper-neoui/src/neoui-monthdate');

var _compMgr = require('compox/src/compMgr');

var MonthDateAdapter = _keroaBaseAdapter.BaseAdapter.extend({
    init: function init() {
        var self = this;
        this.validType = 'monthdate';

        this.comp = new _neouiMonthdate.MonthDate({ el: this.element, showFix: this.options.showFix });

        this.comp.on('valueChange', function (event) {
            self.slice = true;
            if (self.dataModel.getValue(self.field) !== event.value) {
                self.dataModel.setValue(self.field, event.value);
            }
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
     * Module : Kero yearmonth adapter
     * Author : Kvkens(yueming@yonyou.com)
     * Date	  : 2016-08-10 14:11:50
     */


_compMgr.compMgr.addDataAdapter({
    adapter: MonthDateAdapter,
    name: 'u-monthdate'
});

exports.MonthDateAdapter = MonthDateAdapter;