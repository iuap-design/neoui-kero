/**
 * Module : Kero webpack entry index
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 09:52:13
 */
import {BaseAdapter} from './baseAdapter';
import {ValueMixin} from './valueMixin';
import {EnableMixin} from './enableMixin';
import {RequiredMixin} from './requiredMixin';
import {ValidateMixin} from './validateMixin';
import {getJSObject} from 'neoui-sparrow/js/util';
import {Combo} from 'neoui/js/neoui-combo';
import {env} from 'neoui-sparrow/js/env';
import {on,off,stopEvent} from 'neoui-sparrow/js/event';
import {removeClass} from 'neoui-sparrow/js/dom';
import {compMgr} from 'neoui-sparrow/js/compMgr';

var ComboboxAdapter = BaseAdapter.extend({
    mixins:[ValueMixin,EnableMixin, RequiredMixin, ValidateMixin],
    init: function () {
        var self = this;
        //ComboboxAdapter.superclass.initialize.apply(this, arguments);
        this.datasource = getJSObject(this.viewModel, this.options['datasource']);
        this.mutil = this.options.mutil || false;
        this.onlySelect = this.options.onlySelect || false;
        this.showFix = this.options.showFix || false;
        this.validType = 'combobox';
        this.comp = new Combo({el:this.element,mutilSelect:this.mutil,onlySelect:this.onlySelect,showFix:this.showFix});
        this.element['u.Combo'] = this.comp;
        if (this.datasource){
            this.comp.setComboData(this.datasource);
        }else{
            if(env.isIE8 || env.isIE9)
                alert("IE8/IE9必须设置datasource");
        }
        ////TODO 后续支持多选
        //if (this.mutil) {
        //    //$(this.comboEle).on("mutilSelect", function (event, value) {
        //    //    self.setValue(value)
        //    //})
        //}
        this.comp.on('select', function(event){
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
    modelValueChange: function (value) {
        if (this.slice) return;
        //this.trueValue = value;
        if (value === null || typeof value == "undefined")
            value = "";
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
    setEnable: function (enable) {
        var self = this;
        if (enable === true || enable === 'true') {
            this.enable = true;
            this.element.removeAttribute('readonly');
            this.comp._input.removeAttribute('readonly');
            removeClass(this.element.parentNode,'disablecover');
            on(this.comp._input, 'focus', function (e) {
                self.comp.show(e);
                stopEvent(e);
            })
            if (this.comp.iconBtn){
                on(this.comp.iconBtn, 'click', function(e){
                    self.comp.show(e);
                    stopEvent(e);
                })
            }
        } else if (enable === false || enable === 'false') {
            this.enable = false;
            this.element.setAttribute('readonly', 'readonly');
            this.comp._input.setAttribute('readonly', 'readonly');
            addClass(this.element.parentNode,'disablecover');
            off(this.comp._input, 'focus')
            if (this.comp.iconBtn){
                off(this.comp.iconBtn, 'click')
            }
        }
    }
});

compMgr.addDataAdapter(
    {
        adapter: ComboboxAdapter,
        name: 'u-combobox'
    });

export {ComboboxAdapter};


