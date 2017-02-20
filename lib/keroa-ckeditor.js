'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CkEditorAdapter = undefined;

var _keroaBaseAdapter = require('./keroa-baseAdapter');

var _compMgr = require('compox/src/compMgr');

/**
 * Module : Kero webpack entry index
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 09:52:13
 */
var CkEditorAdapter = _keroaBaseAdapter.BaseAdapter.extend({
    init: function init() {
        var self = this;
        this.e_editor = this.id + "-ckeditor";
        this.render(this.options);
    },

    render: function render(data) {
        var cols = data.cols || 80;
        var rows = data.rows || 10;
        var self = this;
        var tpls = '<textarea cols="' + cols + '" id="' + this.e_editor + '" name="' + this.e_editor + '_name' + '" rows="' + rows + '"></textarea>';
        $(this.element).append(tpls);
        CKEDITOR.replace(this.e_editor + '_name');
        var tmpeditor = CKEDITOR.instances[this.e_editor];
        this.tmpeditor = tmpeditor;
        this.tmpeditor.on('blur', function () {
            self.setValue(tmpeditor.getData());
        });

        this.tmpeditor.on('focus', function () {
            self.setShowValue(self.getValue());
        });
    },

    modelValueChange: function modelValueChange(value) {
        if (this.slice) return;
        value = value || "";
        this.trueValue = value;
        this.showValue = value;
        this.setShowValue(this.showValue);
    },

    getValue: function getValue() {
        return this.trueValue;
    },

    setShowValue: function setShowValue(showValue) {
        var self = this;
        this.showValue = showValue;
        this.element.value = showValue;
        this.tmpeditor.setData(showValue);

        //同一页面多次复制有些时候会不生效，setData为异步方法导致。
        if (self.setShowValueInter) clearInterval(self.setShowValueInter);
        self.setShowValueInter = setInterval(function () {
            if (self.tmpeditor.document && self.tmpeditor.document.$ && self.tmpeditor.document.$.body) {
                self.tmpeditor.document.$.body.innerHTML = showValue;
                clearInterval(self.setShowValueInter);
            }
        }, 100);
    },

    getShowValue: function getShowValue() {
        return this.showValue;
    },

    getContent: function getContent() {
        return $('#' + this.e_editor).html();
    },

    setContent: function setContent(txt) {
        $('#' + this.e_editor).html(txt);
    }

});

_compMgr.compMgr.addDataAdapter({
    adapter: CkEditorAdapter,
    name: 'u-ckeditor'
});

exports.CkEditorAdapter = CkEditorAdapter;