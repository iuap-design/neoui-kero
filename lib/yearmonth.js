'use strict';

u.YearMonthAdapter = u.BaseAdapter.extend({
    initialize: function initialize(comp, options) {
        var self = this;
        u.YearMonthAdapter.superclass.initialize.apply(this, arguments);
        this.validType = 'yearmonth';

        this.comp = new u.YearMonth(this.element);

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

u.compMgr.addDataAdapter({
    adapter: u.YearMonthAdapter,
    name: 'u-yearmonth'
});