/**
 * Module : Kero yearmonth adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 14:11:50
 */

import { MonthDate } from 'tinper-neoui/src/neoui-monthdate';

var MonthDateAdapter = u.BaseAdapter.extend({
    init: function init() {
        var self = this;
        this.validType = 'monthdate';
        this.format = this.getOption('format');
        this.comp = new MonthDate({
            el: this.element,
            showFix: this.options.showFix,
            format: this.format
        });

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
});

if (u.compMgr) u.compMgr.addDataAdapter({
    adapter: MonthDateAdapter,
    name: 'u-monthdate'
});

export { MonthDateAdapter };