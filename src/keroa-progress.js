/**
 * Module : Kero percent
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 20:02:50
 */


import {
    Progress
} from 'tinper-neoui/src/neoui-progress';


var ProgressAdapter = u.BaseAdapter.extend({
    init: function() {
        var self = this;

        this.comp = new Progress(this.element);
        this.element['u.Progress'] = this.comp;

        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })
    },

    modelValueChange: function(val) {
        this.comp.setProgress(val)
    }
})


if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: ProgressAdapter,
        name: 'u-progress'
    });

export {
    ProgressAdapter
};
