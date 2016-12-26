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
            multinfo = core.getLanguages();
        };
        multinfo = multinfo.split('');

        var multidata = [];
        // this.field = options.field;

        // 创建组件 - 此处不加el?
        this.comp = new Multilang({el:this.element,"multinfo":multinfo});

        // datatable传值到UI - 初始化 & 监听
        this.dataModel.on(DataTable.ON_VALUE_CHANGE,function(opt){
            console.log("opt:",opt);
            var id = opt.rowId;
            var field = opt.field;
            var value = opt.newValue;
            var row = opt.rowObj;
            // var rowIndex = self.dataModel.getRowIndex(row);
            // if (rowIndex == self.options.rowIndex && field == self.field) {
            //     self.modelValueChange(value);
            // }
            self.modelValueChange(value);
        });

        this.dataModel.on(DataTable.ON_INSERT,function(opt){
            // var rowObj = self.dataModel.getRow(self.options.rowIndex);
            // if (rowObj) {
            //     self.modelValueChange(rowObj.getValue(self.field));
            // }
            var value = opt.newValue;
            self.modelValueChange(value);
        });

        // meta标签写入方式
        // var rowObj = this.dataModel.getRow(this.options.rowIndex);
        // if (rowObj) {
        //     this.modelValueChange(rowObj.getValue(this.field));
        // }

        // UI传值到datatable
        this.comp.on('change.u.multilang', function(object){
            console.log("object:",object);
            self.slice = true;
            self.dataMode.setValue(object.field, object.value);
            self.slide = false;
        });
    },
    modelValueChange: function(value) {
        this.comp.setDataValue(value);
    }
});

compMgr.addDataAdapter({
    adapter: MultilangAdapter,
    name: 'u-multilang'
});


export {MultilangAdapter};
