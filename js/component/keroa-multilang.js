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
            multinfo = this.options.multinfo;
        }else{
            multinfo = core.getLanguages(); //暂时不支持
        };
        multinfo = multinfo.split(',');

        self.multiLen = multinfo.length;
        var multidata = [];
        this.field = this.options.field;

        // 创建组件 - 此处不加el?
        this.comp = new Multilang({el:this.element,"multinfo":multinfo,"field":this.field});

        // datatable传值到UI - 初始化 & 监听
        this.dataModel.on(DataTable.ON_VALUE_CHANGE,function(opt){
            var id = opt.rowId;
            var field = opt.field;
            var value = opt.newValue;
            var row = opt.rowObj;
            if(field.indexOf(self.field) == 0){
                self.modelValueChange(field,value);
            }
        });

        this.dataModel.on(DataTable.ON_INSERT,function(opt){
            var field,value,row = opt.rows[0];
            for(var i = 0; i < self.multiLen; i++){
                if(i == 0){
                    field = self.field;
                }else{
                    field = self.field + (i + 1)
                }
                value = row.getValue(field);
                self.modelValueChange(field,value);
            }   
        });

        // meta标签写入方式
        // var rowObj = this.dataModel.getRow(this.options.rowIndex);
        // if (rowObj) {
        //     this.modelValueChange(rowObj.getValue(this.field));
        // }

        // UI传值到datatable
        this.comp.on('change.u.multilang', function(object){
            self.slice = true;
            self.dataModel.setValue(object.field, object.newValue);
            self.slide = false;
        });

        var field,value;
        for(var i = 0; i < self.multiLen; i++){
            if(i == 0){
                field = self.field;
            }else{
                field = self.field + (i + 1)
            }
            value = self.dataModel.getValue(field);
            self.modelValueChange(field,value);
        }   
    },
    modelValueChange: function(field,value) {
        this.comp.setDataValue(field,value);
    }
});

compMgr.addDataAdapter({
    adapter: MultilangAdapter,
    name: 'u-multilang'
});


export {MultilangAdapter};
