/**
 * Module : Kero adapter 基类
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 10:00:00
 */
import {Class} from 'tinper-sparrow/src/class';
import {getJSObject} from 'tinper-sparrow/src/util';
import {ValueMixin} from 'neoui-kero-mixin/src/valueMixin';
import {EnableMixin} from 'neoui-kero-mixin/src/enableMixin';
import {RequiredMixin} from 'neoui-kero-mixin/src/requiredMixin';
import {ValidateMixin} from 'neoui-kero-mixin/src/validateMixin';


/**
 * adapter基类
 */

var BaseAdapter = Class.create({
    mixins:[ValueMixin,EnableMixin, RequiredMixin, ValidateMixin],
    /**
     *
     * @param comp
     * @param options ：
     *      el: '#content',  对应的dom元素
     *      options: {},     配置
     *      model:{}        模型，包括数据和事件
     */
    initialize: function (options) {
        this.initBefore();
        //组合mixin中的方法
        for (var i = 0; i < this.mixins.length; i++) {
            var mixin = this.mixins[i];
            for (var key in mixin['methods']){
                if (!this[key]){
                    this[key] = mixin['methods'][key];
                }
            }
        }

        //this.comp = comp;
        this.element = options['el'];
        this.options = options['options'];
        this.viewModel = options['model'];
        this.app = options['app'];
        this.dataModel = null;
        this.mixins = this.mixins || [];
        this.parseDataModel();
        this.init();
        //执行mixin中的初始化方法
        for(var i in this.mixins){
            var mixin = this.mixins[i];
            if (mixin['init'])
                mixin.init.call(this);
        }

    },
    initBefore: function () {

    },
    parseDataModel: function () {
        if (!this.options || !this.options["data"]) return;
        this.field = this.options["field"];
        var dtId = this.options["data"];
        this.dataModel = getJSObject(this.viewModel, this.options["data"]);
        if (this.dataModel){
            var opt = {};
            if (this.options.type === 'u-date' && !this.options.rangeFlag){
                opt.type = 'date'
            }
            if (this.options.type === 'u-datetime' && !this.options.rangeFlag){
                opt.type = 'datetime'
            }
            if (this.field)
                this.dataModel.createField(this.field, opt);
        }
    },
    getOption: function(key){
        var rs = this.dataModel.getRowMeta(this.field, key);
        if (rs===0){
            return 0;
        }else {
            return rs || this.options[key];
        }

    },
    init: function(){

    }
});
window.u = window.u || {};
u.BaseAdapter = BaseAdapter;
export {BaseAdapter};
