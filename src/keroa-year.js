/**
 * Module : Kero year adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 12:40:46
 */

import {
    Year
} from 'tinper-neoui/src/neoui-year';


var YearAdapter = u.BaseAdapter.extend({
    init: function() {
        var self = this;
        this.validType = 'year';

        this.comp = new Year({
            el: this.element,
            showFix: this.options.showFix
        });


        this.comp.on('valueChange', function(event) {
            self.slice = true;
            self.setValue(event.value);
            self.slice = false;
            //self.setValue(event.value);
        });
        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },
    modelValueChange: function(value) {
        if (this.slice) return;
        this.comp.setValue(value);
    },
    setEnable: function(enable) {}
});

if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: YearAdapter,
        name: 'u-year'
    });

export {
    YearAdapter
};
