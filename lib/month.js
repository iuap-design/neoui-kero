'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MonthAdapter = undefined;

var _baseAdapter = require('./baseAdapter');

var _compMgr = require('neoui-sparrow/lib/compMgr');

/**
 * Module : Kero month
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 18:46:30
 */

var MonthAdapter = _baseAdapter.BaseAdapter.extend({
    initialize: function initialize(comp, options) {
        var self = this;
        MonthAdapter.superclass.initialize.apply(this, arguments);
        this.validType = 'month';

        this.comp = new Month(this.element);

        this.comp.on('valueChange', function (event) {
            self.slice = true;
            self.dataModel.setValue(self.field, event.value);
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
});
//miss Month


_compMgr.compMgr.addDataAdapter({
    adapter: MonthAdapter,
    name: 'u-month'
});

exports.MonthAdapter = MonthAdapter;