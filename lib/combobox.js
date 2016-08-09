'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ComboboxAdapter = undefined;

var _baseAdapter = require('./baseAdapter');

var _valueMixin = require('./valueMixin');

var _util = require('neoui-sparrow/lib/util');

var _neouiCombo = require('neoui/lib/neoui-combo');

var _env = require('neoui-sparrow/lib/env');

var _event = require('neoui-sparrow/lib/event');

var _dom = require('neoui-sparrow/lib/dom');

var _compMgr = require('neoui-sparrow/lib/compMgr');

var ComboboxAdapter = _baseAdapter.BaseAdapter.extend({
    mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin, _valueMixin.RequiredMixin, _valueMixin.ValidateMixin],
    init: function init() {
        var self = this;
        //ComboboxAdapter.superclass.initialize.apply(this, arguments);
        this.datasource = (0, _util.getJSObject)(this.viewModel, this.options['datasource']);
        this.mutil = this.options.mutil || false;
        this.onlySelect = this.options.onlySelect || false;
        this.showFix = this.options.showFix || false;
        this.validType = 'combobox';
        this.comp = new _neouiCombo.Combo({ el: this.element, mutilSelect: this.mutil, onlySelect: this.onlySelect, showFix: this.showFix });
        this.element['u.Combo'] = this.comp;
        if (this.datasource) {
            this.comp.setComboData(this.datasource);
        } else {
            if (_env.env.isIE8 || _env.env.isIE9) alert("IE8/IE9必须设置datasource");
        }
        ////TODO 后续支持多选
        //if (this.mutil) {
        //    //$(this.comboEle).on("mutilSelect", function (event, value) {
        //    //    self.setValue(value)
        //    //})
        //}
        this.comp.on('select', function (event) {
            // self.slice = true;
            // if(self.dataModel)
            //     self.dataModel.setValue(self.field, event.value);
            // self.slice = false;
            self.setValue(event.value);
        });
        //if(this.dataModel){
        //    this.dataModel.ref(this.field).subscribe(function(value) {
        //        self.modelValueChange(value)
        //    })
        //}
    },
    modelValueChange: function modelValueChange(value) {
        if (this.slice) return;
        //this.trueValue = value;
        if (value === null || typeof value == "undefined") value = "";
        this.comp.setValue(value);
        // this.trueValue = this.formater ? this.formater.format(value) : value;
        // this.element.trueValue = this.trueValue;
        // this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
        // this.setShowValue(this.showValue);
    },
    //setValue: function (value) {
    //    this.trueValue = value;
    //    this.slice = true;
    //    this.setModelValue(this.trueValue);
    //    this.slice = false;
    //},
    //getValue: function () {
    //    return this.trueValue
    //},
    setEnable: function setEnable(enable) {
        var self = this;
        if (enable === true || enable === 'true') {
            this.enable = true;
            this.element.removeAttribute('readonly');
            this.comp._input.removeAttribute('readonly');
            (0, _dom.removeClass)(this.element.parentNode, 'disablecover');
            (0, _event.on)(this.comp._input, 'focus', function (e) {
                self.comp.show(e);
                (0, _event.stopEvent)(e);
            });
            if (this.comp.iconBtn) {
                (0, _event.on)(this.comp.iconBtn, 'click', function (e) {
                    self.comp.show(e);
                    (0, _event.stopEvent)(e);
                });
            }
        } else if (enable === false || enable === 'false') {
            this.enable = false;
            this.element.setAttribute('readonly', 'readonly');
            this.comp._input.setAttribute('readonly', 'readonly');
            addClass(this.element.parentNode, 'disablecover');
            (0, _event.off)(this.comp._input, 'focus');
            if (this.comp.iconBtn) {
                (0, _event.off)(this.comp.iconBtn, 'click');
            }
        }
    }
}); /**
     * Module : Kero webpack entry index
     * Author : Kvkens(yueming@yonyou.com)
     * Date	  : 2016-08-09 09:52:13
     */


_compMgr.compMgr.addDataAdapter({
    adapter: ComboboxAdapter,
    name: 'u-combobox'
});

exports.ComboboxAdapter = ComboboxAdapter;