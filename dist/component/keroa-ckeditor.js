(function (exports) {
'use strict';

/**
 * Module : Kero webpack entry index
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 09:52:13
 */



var CkEditorAdapter = u.BaseAdapter.extend({
    init: function() {
        var self = this;
        this.e_editor = this.id + "-ckeditor";
        this.render(this.options);
    },

    render: function(data) {
        var cols = data.cols || 80;
        var rows = data.rows || 10;
        var self = this;
        var tpls = '<textarea cols="' + cols + '" id="' + this.e_editor + '" name="' + this.e_editor + '_name' + '" rows="' + rows + '"></textarea>';
        $(this.element).append(tpls);
        CKEDITOR.replace(this.e_editor + '_name');
        var tmpeditor = CKEDITOR.instances[this.e_editor];
        this.tmpeditor = tmpeditor;
        this.tmpeditor.on('blur', function() {
            self.setValue(tmpeditor.getData());
        });

        this.tmpeditor.on('focus', function() {
            self.setShowValue(self.getValue());
        });
    },

    modelValueChange: function(value) {
        if (this.slice) return
        value = value || "";
        this.trueValue = value;
        this.showValue = value;
        this.setShowValue(this.showValue);
    },

    getValue: function() {
        return this.trueValue
    },

    setShowValue: function(showValue) {
        var self = this;
        this.showValue = showValue;
        this.element.value = showValue;
        this.tmpeditor.setData(showValue);

        //同一页面多次复制有些时候会不生效，setData为异步方法导致。
        if (self.setShowValueInter)
            clearInterval(self.setShowValueInter);
        self.setShowValueInter = setInterval(function() {
            if (self.tmpeditor.document && self.tmpeditor.document.$ && self.tmpeditor.document.$.body) {
                self.tmpeditor.document.$.body.innerHTML = showValue;
                clearInterval(self.setShowValueInter);
            }
        }, 100);
    },

    getShowValue: function() {
        return this.showValue
    },

    getContent: function() {
        return $('#' + this.e_editor).html();
    },

    setContent: function(txt) {
        $('#' + this.e_editor).html(txt);
    },

});

if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: CkEditorAdapter,
        name: 'u-ckeditor'
    });

exports.CkEditorAdapter = CkEditorAdapter;

}((this.bar = this.bar || {})));
