/**
 * Module : Kero month
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 18:46:30
 */

import { Month } from 'tinper-neoui/src/neoui-month';

var MonthAdapter = u.BaseAdapter.extend({
    init: function init() {
        var self = this;
        this.validType = 'month';

        this.comp = new Month({
            el: this.element,
            showFix: this.options.showFix
        });

        // ui影响datatable
        this.comp.on('valueChange', function (event) {
            // 防止循环
            self.slice = true;
            self.dataModel.setValue(self.field, event.value);
            self.slice = false;
            //self.setValue(event.value);
        });
        // datatable反影响ui

    },
    // 触发空间
    modelValueChange: function modelValueChange(value) {
        if (this.slice) return;
        this.comp.setValue(value);
    },
    setEnable: function setEnable(enable) {}
});

if (u.compMgr) u.compMgr.addDataAdapter({
    adapter: MonthAdapter,
    name: 'u-month'
});

export { MonthAdapter };