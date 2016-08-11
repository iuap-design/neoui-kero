/**
 * Module : Kero yearmonth adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 14:11:50
 */
import {BaseAdapter} from './baseAdapter';
import {YearMonth} from './';
import {compMgr} from 'neoui-sparrow/js/compMgr';

var YearMonthAdapter = BaseAdapter.extend({
    initialize: function (comp, options) {
        var self = this;
        YearMonthAdapter.superclass.initialize.apply(this, arguments);
        this.validType = 'yearmonth';

        this.comp = new YearMonth(this.element);


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
	adapter: YearMonthAdapter,
	name: 'u-yearmonth'
});


export {YearMonthAdapter};

