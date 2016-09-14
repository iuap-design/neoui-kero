/**
 * Module : Kero switch adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 10:42:15
 */

import {BaseAdapter} from '../core/baseAdapter';
import {Switch} from 'neoui/js/neoui-switch';
import {compMgr} from 'neoui-sparrow/js/compMgr';


var SwitchAdapter = BaseAdapter.extend({
    initialize: function (options) {
        var self = this;
        SwitchAdapter.superclass.initialize.apply(this, arguments);

        this.comp = new Switch(this.element);
        this.element['u.Switch'] = this.comp;
        this.checkedValue =  this.options['checkedValue'] || this.comp._inputElement.value;
        this.unCheckedValue =  this.options["unCheckedValue"];
        this.comp.on('change', function(event){
            if (self.slice) return;
            if (self.comp._inputElement.checked) {
                self.dataModel.setValue(self.field, self.checkedValue);
            }else{
                self.dataModel.setValue(self.field, self.unCheckedValue)
            }
        });

        this.dataModel.ref(this.field).subscribe(function(value) {
        	self.modelValueChange(value)
        })


    },

    modelValueChange: function (val) {
        if (this.slice) return;
        if (this.comp._inputElement.checked != (val === this.checkedValue)){
            this.slice = true;
            this.comp.toggle();
            this.slice = false;
        }

    },
    setEnable: function (enable) {
        if (enable === true || enable === 'true') {
            this.enable = true
        } else if (enable === false || enable === 'false') {
            this.enable = false
        }
    }
})


compMgr.addDataAdapter({
	adapter: SwitchAdapter,
	name: 'u-switch'
});


export {SwitchAdapter};
