/**
 * Module : Kero percent
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 20:02:50
 */

import {BaseAdapter} from './baseAdapter';
import {Progress} from 'neoui/lib/neoui-progress';
import {compMgr} from 'neoui-sparrow/lib/compMgr';

var ProgressAdapter = BaseAdapter.extend({
    initialize: function (options) {
        var self = this;
        ProgressAdapter.superclass.initialize.apply(this, arguments);

        this.comp = new Progress(this.element);
        this.element['u.Progress'] = this.comp;

        this.dataModel.ref(this.field).subscribe(function(value) {
        	self.modelValueChange(value)
        })
    },

    modelValueChange: function (val) {
        this.comp.setProgress(val)
    }
})


compMgr.addDataAdapter({
	adapter: ProgressAdapter,
	name: 'u-progress'
});

export {ProgressAdapter};
