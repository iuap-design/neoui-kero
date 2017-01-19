/**
 * Module : Kero month
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 18:46:30
 */

import {BaseAdapter} from '../core/baseAdapter';
import {Month} from 'tinper-neoui/js/neoui-month';
import {compMgr} from 'compox/js/compMgr';

import {ValueMixin} from 'neoui-kero-mixin/js/valueMixin';
import {EnableMixin} from 'neoui-kero-mixin/js/enableMixin';
import {RequiredMixin} from 'neoui-kero-mixin/js/requiredMixin';
import {ValidateMixin} from 'neoui-kero-mixin/js/validateMixin';

var MonthAdapter = BaseAdapter.extend({
    mixins: [ValueMixin,EnableMixin,RequiredMixin, ValidateMixin],
    init: function (options) {
        var self = this;
        this.validType = 'month';

        this.comp = new Month({el:this.element,showFix:this.options.showFix});

        // ui影响datatable
        this.comp.on('valueChange', function(event){
            // 防止循环
            self.slice = true;
            self.dataModel.setValue(self.field, event.value);
            self.slice = false;
            //self.setValue(event.value);
        });
        // datatable反影响ui
        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },
    // 触发空间
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
