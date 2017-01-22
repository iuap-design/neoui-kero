/**
 * Module : Kero textfield adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 13:00:27
 */

import {BaseAdapter} from '../core/baseAdapter';
import {extend} from 'tinper-sparrow/js/extend';
import {Text} from 'tinper-neoui/js/neoui-textfield';
import {FloatAdapter} from './keroa-float';
import {StringAdapter} from './keroa-string';
import {IntegerAdapter} from './keroa-integer';
import {compMgr} from 'compox/js/compMgr';


var TextFieldAdapter = BaseAdapter.extend({
    init: function () {
        var options = {};
        var dataType = this.dataModel.getMeta(this.field,'type') || 'string';
        this.comp = new Text(this.element);
        this.element['u.Text'] = this.comp;

        options["options"] = this.options;
        options["el"] = this.element;
        options["model"] = this.viewModel;
        options["app"] = this.app;


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
            this.comp.change(showValue);
            this.element.title = showValue;
        }
        // 解决初始设置值后，没有走这个setShowValue方法问题
        if(this.trueAdpt.enable){
            this.trueAdpt.setShowValue(this.trueAdpt.getValue())
        }
        return this.trueAdpt;
    }
});

compMgr.addDataAdapter({
	adapter: TextFieldAdapter,
	name: 'u-text'
});

export {TextFieldAdapter};
