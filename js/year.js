/**
 * Module : Kero year adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 12:40:46
 */
import {BaseAdapter} from './baseAdapter';
import {Year} from 'neoui/js/neoui-year';
import {compMgr} from 'neoui-sparrow/js/compMgr';
import {ValueMixin} from './valueMixin';
import {EnableMixin} from './enableMixin';
import {RequiredMixin} from './requiredMixin';
import {ValidateMixin} from './validateMixin';

var YearAdapter = BaseAdapter.extend({
    mixins: [ValueMixin,EnableMixin,RequiredMixin, ValidateMixin],
    init: function (options) {
        var self = this;
        this.validType = 'year';

        this.comp = new Year({el:this.element,showFix:this.options.showFix});


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
