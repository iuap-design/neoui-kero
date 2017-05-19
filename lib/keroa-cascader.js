/**
 * Module : Cascader的Kero组件
 * Author : huyue(huyueb@yonyou.com)
 * Date	  : 2017-05-19 09:52:13
 */

import { getJSObject } from 'tinper-sparrow/src/util';
import { Cascader } from 'tinper-neoui/src/neoui-cascader';
import { on } from 'tinper-sparrow/src/event';

var CascaderAdapter = u.BaseAdapter.extend({

    init: function init() {
        var self = this;
        // 获取参数
        var id = this.options.id,
            data = this.options.data,
            is_hover = this.options.is_hover,
            obj = {
            el: this.element,
            id: id,
            data: getJSObject(this.viewModel, this.options['datasource'])
        };
        //判断如果传入了is_hover参数，并且为true，就将触发事件的状态由click改为mouseenter
        if (is_hover) {
            obj['trigger_type'] = 'mouseenter';
        }
        this.comp = new u.Cascader(obj);
        this.comp.on('change', function (event) {
            self.setValue(event.value);
        });
    },

    /**
     * 模型数据 datatable 改变调用的方法
     * @param {Object} value
     */
    modelValueChange: function modelValueChange(value) {
        this.comp.setValue(value);
    }

});

if (u.compMgr) u.compMgr.addDataAdapter({
    adapter: CascaderAdapter,
    name: 'u-cascader'
});

export { CascaderAdapter };