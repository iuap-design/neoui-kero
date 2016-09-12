/**
 * Module : Kero month
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 18:46:30
 */

import {BaseAdapter} from './baseAdapter';
import {Month} from 'neoui/js/neoui-month';
import {compMgr} from 'neoui-sparrow/js/compMgr';
import {ValueMixin} from './valueMixin';
import {EnableMixin} from './enableMixin';
import {RequiredMixin} from './requiredMixin';
import {ValidateMixin} from './validateMixin';

var MonthAdapter = BaseAdapter.extend({
    mixins: [ValueMixin,EnableMixin,RequiredMixin, ValidateMixin],
    init: function (options) {
        var self = this;
        this.validType = 'month';

        this.comp = new Month({el:this.element,showFix:this.options.showFix});


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
