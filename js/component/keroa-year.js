/**
 * Module : Kero year adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 12:40:46
 */
import {BaseAdapter} from '../core/baseAdapter';
import {Year} from 'neoui/js/neoui-year';
import {compMgr} from 'neoui-sparrow/js/compMgr';

var YearAdapter = BaseAdapter.extend({
    initialize: function (comp, options) {
        var self = this;
        YearAdapter.superclass.initialize.apply(this, arguments);
        this.validType = 'year';

        this.comp = new Year(this.element);


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
	adapter: YearAdapter,
	name: 'u-year'
});

export {YearAdapter};


