/**
 * Module : Kero webpack entry index
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 09:52:13
 */
import {BaseAdapter} from '../core/baseAdapter';
import {ValueMixin} from '../core/valueMixin';
import {EnableMixin} from '../core/enableMixin';
import {RequiredMixin} from '../core/requiredMixin';
import {ValidateMixin} from '../core/validateMixin';
import {getJSObject} from 'neoui-sparrow/js/util';
import {Combo} from 'neoui/js/neoui-combo';
import {env} from 'neoui-sparrow/js/env';
import {on,off,stopEvent} from 'neoui-sparrow/js/event';
import {addClass,removeClass} from 'neoui-sparrow/js/dom';
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
        this.isAutoTip = this.options.isAutoTip || false;

        if(!this.element['u.Combo']) {
            this.comp = new u.Combo({el:this.element,mutilSelect:this.mutil,onlySelect:this.onlySelect,showFix:this.showFix,isAutoTip:this.isAutoTip});
            this.element['u.Combo'] = this.comp;

        } else {
            this.comp = this.element['u.Combo']
        }

        var isDsObservable = ko.isObservable(this.datasource);
        if (this.datasource){
            this.comp.setComboData(isDsObservable ? ko.toJS(this.datasource) : this.datasource);
        }else{
            if(u.isIE8 || u.isIE9)
                alert("IE8/IE9必须设置datasource");
        }
        if(isDsObservable) {
            // datasource 发生变化时改变控件
            this.datasource.subscribe(function(value) {
                self.comp.setComboData(value);
            });
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
        //下面两句会在校验中用到
        this.trueValue = this.formater ? this.formater.format(value) : value;
        this.element.trueValue = this.trueValue;
        // this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
        // this.setShowValue(this.showValue);
    },
    setShowValue: function (value) {
        console.log( this.comp._input.value);
       this.trueValue = this.comp._input.value;

       this.setModelValue(this.trueValue);

    },
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
