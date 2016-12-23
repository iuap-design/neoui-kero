/**
 * Module : Kero multilang adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 14:11:50
 */
import {BaseAdapter} from '../core/baseAdapter';
// import {MonthDate} from 'tinper-neoui/js/neoui-monthdate';
import {Multilang} from 'tinper-neoui/js/neoui-multilang';
import {compMgr} from 'tinper-sparrow/js/compMgr';
import {core} from 'tinper-sparrow/js/core'
import {ValueMixin} from '../core/valueMixin';
import {EnableMixin} from '../core/enableMixin';
import {RequiredMixin} from '../core/requiredMixin';
import {ValidateMixin} from '../core/validateMixin';

var MultilangAdapter = BaseAdapter.extend({
    // mixins: [ValueMixin],
    init: function () {

        // 1.创建控件
        // 2.控件valueChange监听（ui ---》datatable）

        // datatable--》ui
        // 1、dattatable。on valuechange 添加监听（需要对多个字段进行监听），在监听中调用modelValueChange

        // 初始化调用modelValueChange赋值给ui

        var self = this;
        var multinfo;
        if(this.options){
            multinfo = this.options.multinfo
        }else{
            multinfo = core.getLanguages()
        };
        multinfo = multinfo.split('');

        var multidata = [];
        // this.field = options.field;

        // 创建组件 - 此处不加el?
        this.comp = new Multilang({el:this.element,"multinfo":multinfo});

        // datatable传值到UI - 初始化 & 监听
        this.dataModel.ref(this.field).subscribe(function(value){
            self.modelValueChange(value);
        });

        // UI传值到datatable
        this.comp.on('change.u.multilang', function(object){
            self.slice = true;
            self.dataMode.setValue(object.field, object.value);
            self.slide = false;
        });
    },
    modelValueChange: function(value) {

        var self = this
        if(this.multidata){
            for(i = 0; i < self.multinfo.length; i++){
                if(i){
                    self.multidata[i] = self.dataModel.getValue(self.field + (i+1),self.dataTableRow)
                }else{
                    self.multidata[i] = self.dataModel.getValue(self.field,self.dataTableRow)
                }
            }
            this.comp.addData(self.multidata);
        }
    }
});

compMgr.addDataAdapter({
    adapter: MultilangAdapter,
    name: 'u-multilang'
});


export {MultilangAdapter};
