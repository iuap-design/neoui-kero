/**
 * Module : Kero month
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 18:46:30
 */

import {BaseAdapter} from './baseAdapter';
//miss Month
import {compMgr} from 'neoui-sparrow/js/compMgr';

var MonthAdapter = BaseAdapter.extend({
    initialize: function (comp, options) {
        var self = this;
        MonthAdapter.superclass.initialize.apply(this, arguments);
        this.validType = 'month';

        this.comp = new Month(this.element);


        this.comp.on('valueChange', function(event){
            self.slice = true;
            self.dataModel.setValue(self.field, event.value);
            self.slice = false;
            //self.setValue(event.value);
        });
        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },
    modelValueChange: function (value) {
        if (this.slice) return;
        this.comp.setValue(value);
    },
    setEnable: function (enable) {
    }
});

compMgr.addDataAdapter({
	adapter: MonthAdapter,
	name: 'u-month'
});

export {MonthAdapter};


