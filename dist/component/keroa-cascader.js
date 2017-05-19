(function (exports,tinperNeoui_src_neouiCascader) {
'use strict';

/**
 * Module : Sparrow util tools
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

/**
 * 创建一个带壳的对象,防止外部修改
 * @param {Object} proto
 */
var getJSObject = function(target, names) {
	if(!names) {
		return;
	}
	if(typeof names == 'object')
		return names
	var nameArr = names.split('.');
	var obj = target;
	for(var i = 0; i < nameArr.length; i++) {
		obj = obj[nameArr[i]];
		if(!obj) return null
	}
	return obj
};
try{
	NodeList.prototype.forEach = Array.prototype.forEach;
}catch(e){
	
}


/**
 * 获得字符串的字节长度
 */
String.prototype.lengthb = function() {
	//	var str = this.replace(/[^\x800-\x10000]/g, "***");
	var str = this.replace(/[^\x00-\xff]/g, "**");
	return str.length;
};

/**
 * 将AFindText全部替换为ARepText
 */
String.prototype.replaceAll = function(AFindText, ARepText) {
	//自定义String对象的方法
	var raRegExp = new RegExp(AFindText, "g");
	return this.replace(raRegExp, ARepText);
};

/**
 * Module : Sparrow touch event
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-28 14:41:17
 */

/**
 * Module : Cascader的Kero组件
 * Author : huyue(huyueb@yonyou.com)
 * Date	  : 2017-05-19 09:52:13
 */

var CascaderAdapter = u.BaseAdapter.extend({

    init: function() {
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
        this.comp.on('change', function(event) {
            self.setValue(event.value);
        });
    },

    /**
     * 模型数据 datatable 改变调用的方法
     * @param {Object} value
     */
    modelValueChange: function(value) {
        this.comp.setValue(value);
    }

});

if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: CascaderAdapter,
        name: 'u-cascader'
    });

exports.CascaderAdapter = CascaderAdapter;

}((this.bar = this.bar || {}),tinperNeoui_src_neouiCascader));
