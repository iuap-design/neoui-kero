/**
 * Module : Kero yearmonth adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 14:11:50
 */
import {BaseAdapter} from '../core/baseAdapter';
import {MonthDate} from 'tinper-neoui/js/neoui-monthdate';
import {compMgr} from 'tinper-sparrow/js/compMgr';
import {ValueMixin} from '../core/valueMixin';
import {EnableMixin} from '../core/enableMixin';
import {RequiredMixin} from '../core/requiredMixin';
import {ValidateMixin} from '../core/validateMixin';

var MonthDateAdapter = BaseAdapter.extend({
    mixins: [ValueMixin,EnableMixin,RequiredMixin, ValidateMixin],
    init: function (options) {
        var self = this;
        this.validType = 'monthdate';

        this.comp = new MonthDate({el:this.element,showFix:this.options.showFix});


        this.comp.on('valueChange', function(event){
            self.slice = true;
            if (self.dataModel.getValue(self.field) !== event.value) {
                self.dataModel.setValue(self.field, event.value);
            }
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
	adapter: MonthDateAdapter,
	name: 'u-monthdate'
});


export {MonthDateAdapter};
