/**
 * Module : Kero textfield adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 13:00:27
 */

import {BaseAdapter} from './baseAdapter';
import {extend} from 'neoui-sparrow/js/extend';
import {Text} from 'neoui/js/neoui-textfield';
import {FloatAdapter} from './float';
import {StringAdapter} from './string';
import {IntegerAdapter} from './integer';
import {compMgr} from 'neoui-sparrow/js/compMgr';


var TextFieldAdapter = BaseAdapter.extend({
    /**
     *
     * @param comp
     * @param options ：
     *      el: '#content',  对应的dom元素
     *      options: {},     配置
     *      model:{}        模型，包括数据和事件
     */
    initialize: function (options) {
        TextFieldAdapter.superclass.initialize.apply(this, arguments);
        //this.comp = comp;
        //this.element = options['el'];
        //this.options = options['options'];
        //this.viewModel = options['model'];
        var dataType = this.dataModel.getMeta(this.field,'type') || 'string';
        //var dataType = this.options['dataType'] || 'string';

        this.comp = new Text(this.element);
        this.element['u.Text'] = this.comp;


        if (dataType === 'float'){
            this.trueAdpt = new FloatAdapter(options);
        }
        else if (dataType === 'string'){
            this.trueAdpt = new StringAdapter(options);
        }
        else if (dataType === 'integer'){
            this.trueAdpt = new IntegerAdapter(options);
        }else{
            throw new Error("'u-text' only support 'float' or 'string' or 'integer' field type, not support type: '" + dataType + "', field: '" +this.field+ "'");
        }
        extend(this, this.trueAdpt);


        this.trueAdpt.comp = this.comp;
        this.trueAdpt.setShowValue = function (showValue) {
            this.showValue = showValue;
            //if (this.comp.compType === 'text')
            this.comp.change(showValue);
            this.element.title = showValue;
        }
        return this.trueAdpt;
    }
});

compMgr.addDataAdapter({
	adapter: TextFieldAdapter,
	name: 'u-text'
		//dataType: 'float'
});

export {TextFieldAdapter};
