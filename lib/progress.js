'use strict';

u.ProgressAdapter = u.BaseAdapter.extend({
    initialize: function initialize(options) {
        var self = this;
        u.ProgressAdapter.superclass.initialize.apply(this, arguments);

        this.comp = new u.Progress(this.element);
        this.element['u.Progress'] = this.comp;

        this.dataModel.ref(this.field).subscribe(function (value) {
            self.modelValueChange(value);
        });
    },

    modelValueChange: function modelValueChange(val) {
        this.comp.setProgress(val);
    }
});

u.compMgr.addDataAdapter({
    adapter: u.ProgressAdapter,
    name: 'u-progress'
});