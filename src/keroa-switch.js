/**
 * Module : Kero switch adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 10:42:15
 */


import {
    Switch
} from 'tinper-neoui/src/neoui-switch';



var SwitchAdapter = u.BaseAdapter.extend({
    init: function() {
        var self = this;
        this.options = this.options;
        this.comp = new Switch(this.element);
        this.element['u.Switch'] = this.comp;
        this.checkedValue = this.options['checkedValue'] || this.comp._inputElement.value;
        this.unCheckedValue = this.options["unCheckedValue"];
        this.comp.on('change', function(event) {
            if (self.slice) return;
            if (self.comp._inputElement.checked) {
                self.dataModel.setValue(self.field, self.checkedValue);
            } else {
                self.dataModel.setValue(self.field, self.unCheckedValue)
            }
        });

        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })

        var self = this;
        //处理只读
        if (this.options['enable'] && (this.options['enable'] == 'false' || this.options['enable'] == false)) {
            this.setEnable(false);
        } else {
            this.dataModel.refEnable(this.field).subscribe(function(value) {
                self.setEnable(value);
            });
            this.setEnable(this.dataModel.isEnable(this.field));
        }


    },

    modelValueChange: function(val) {
        if (this.slice) return;
        if (this.comp._inputElement.checked != (val === this.checkedValue)) {
            this.slice = true;
            this.comp.toggle();
            this.slice = false;
        }

    },
    setEnable: function(enable) {
        if (enable === true || enable === 'true') {
            this.enable = true;
            this.comp.enable();
        } else if (enable === false || enable === 'false') {
            this.enable = false;
            this.comp.disable();
        }
    }
})


if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: SwitchAdapter,
        name: 'u-switch'
    });


export {
    SwitchAdapter
};
