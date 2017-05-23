(function (exports) {
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

var on = function(element, eventName, child, listener) {
	if(!element)
		return;
	if(arguments.length < 4) {
		listener = child;
		child = undefined;
	} else {
		var childlistener = function(e) {
			if(!e) {
				return;
			}
			var tmpchildren = element.querySelectorAll(child);
			tmpchildren.forEach(function(node) {
				if(node == e.target) {
					listener.call(e.target, e);
				}
			});
		};
	}
	//capture = capture || false;

	if(!element["uEvent"]) {
		//在dom上添加记录区
		element["uEvent"] = {};
	}
	//判断是否元素上是否用通过on方法填加进去的事件
	if(!element["uEvent"][eventName]) {
		element["uEvent"][eventName] = [child ? childlistener : listener];
		if(u.event && u.event[eventName] && u.event[eventName].setup) {
			u.event[eventName].setup.call(element);
		}
		element["uEvent"][eventName + 'fn'] = function(e) {
			//火狐下有问题修改判断
			if(!e)
				e = typeof event != 'undefined' && event ? event : window.event;
			element["uEvent"][eventName].forEach(function(fn) {
				try {
					e.target = e.target || e.srcElement; //兼容IE8
				} catch(ee) {}
				if(fn)
					fn.call(element, e);
			});
		};
		if(element.addEventListener) { // 用于支持DOM的浏览器
			element.addEventListener(eventName, element["uEvent"][eventName + 'fn']);
		} else if(element.attachEvent) { // 用于IE浏览器
			element.attachEvent("on" + eventName, element["uEvent"][eventName + 'fn']);
		} else { // 用于其它浏览器
			element["on" + eventName] = element["uEvent"][eventName + 'fn'];
		}
	} else {
		//如果有就直接往元素的记录区添加事件
		var lis = child ? childlistener : listener;
		var hasLis = false;
		element["uEvent"][eventName].forEach(function(fn) {
			if(fn == lis) {
				hasLis = true;
			}
		});
		if(!hasLis) {
			element["uEvent"][eventName].push(child ? childlistener : listener);
		}
	}

};

var off = function(element, eventName, listener) {
	//删除事件数组
	if(listener) {
		if(element && element["uEvent"] && element["uEvent"][eventName]) {
			element["uEvent"][eventName].forEach(function(fn, i) {
				if(fn == listener) {
					element["uEvent"][eventName].splice(i, 1);
				}
			});
		}
		return;
	}
	var eventfn;
	if(element && element["uEvent"] && element["uEvent"][eventName + 'fn'])
		eventfn = element["uEvent"][eventName + 'fn'];
	if(element.removeEventListener) { // 用于支持DOM的浏览器
		element.removeEventListener(eventName, eventfn);
	} else if(element.removeEvent) { // 用于IE浏览器
		element.removeEvent("on" + eventName, eventfn);
	} else { // 用于其它浏览器
		delete element["on" + eventName];
	}
	if(u.event && u.event[eventName] && u.event[eventName].teardown) {
		u.event[eventName].teardown.call(element);
	}

	if(element && element["uEvent"] && element["uEvent"][eventName])
		element["uEvent"][eventName] = undefined;
	if(element && element["uEvent"] && element["uEvent"][eventName + 'fn'])
		element["uEvent"][eventName + 'fn'] = undefined;

};

/**
 * Module : Sparrow dom
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-16 13:59:17
 */
/**
 * 元素上是否存在该类
 * @param {Object} element
 * @param {Object} value
 */
var hasClass = function(element, value) {
	if(!element) return false;
	if(element.nodeName && (element.nodeName === '#text' || element.nodeName === '#comment')) return false;
	if(typeof element.classList === 'undefined') {
		if(u._hasClass){
			return u._hasClass(element, value);
		}else{
			return $(element).hasClass(value);
		}

		return false;
	} else {
		return element.classList.contains(value);
	}
};
/**
 * 向上查找指定类元素
 * @param {Object} element
 * @param {Object} selector
 */
var closest = function(element, selector) {
	var tmp = element;
	while(tmp != null && !hasClass(tmp, selector) && tmp != document.body) {
		tmp = tmp.parentNode;
	}
	if(tmp == document.body) return null;
	return tmp;
};

/**
 * Module : neoui-cascader
 * Author : huyueb(huyueb@yonyou.com)
 * Date	  : 2017-05-19 13:19:10
 */
 var Cascader = u.BaseComponent.extend({
    // 入口方法
    init: function() {
        var self = this,
            data = self.options['data'],
            id = '';
        this._data = data;
        this.order = [];
        if (hasClass(this.element, 'trigger-hover')) {
            this.options['trigger_type'] = 'mouseenter';
        }
        if (!this.options['id']) {
            this.options['id'] = new Date().getTime() + '' + parseInt(Math.random() * 10 + 1, 10);
        }
        id = this.options['id'];

        $(this.element).append('<div id="' + id + '-input" class="cascader-input" style="width:100%;height:100%;"><input/></div><div id="' + id + '" class="cascader-show"></div>');
        this.focusFunc();
        $(this.element).children('.cascader-input').children('input').attr('readonly', 'readonly')
                        .end().off('mouseenter').on('mouseenter', function() {
            var $this = $(this);
            if ($this.children('input').val()) {
                $this.append('<i class="icon uf uf-close-bold"></i>');
            }
            $this.off('mouseleave').on('mouseleave', function() {
                $this.children('i').remove();
            }).children('i').on('click', function() {
                var $this_ = $(this);
                $this_.siblings('input').val('').attr('tovalue', '').end().parent().next().html('').end().end().remove();
            });
        });
    },
    triggerChange: function(value) {
        this.trigger('change', {
            value: value
        });
    },
    setData: function(data) {
        var self = this;
        self._data = data;
    },

    setValue: function(value) {
        var self = this,
            arr = [],
            names = '';
        //如果value存在的话，就通过split分割
        if(value){
            arr = value.split(',');
        }

        if (arr && arr.length > 0) {
            names = self.transName(arr, self._data);
            if (names.length > 1) {
                names = names.substring(0, names.length - 1);
                $(this.element).children('.cascader-input').children('input').val(names).attr('tovalue', value);
            }
        }else{
            $(this.element).children('.cascader-input').children('input').val('').attr('tovalue', '');
        }


    },
    //通过设置的value值能去data中查找到对应的name值
    transName: function(arr, data) {
        var names = '',
            self = this,
            flag = -1;
        for (var j = 0; j < data.length; j++) {
            if (data[j].value == arr[0]) {
                flag = j;
                names += data[j].name + '/';
            }
        }
        if (arr.length > 1) {
            data = data[flag].children;
            arr.shift();

            names += self.transName(arr, data);
        }
        return names;
    },

    //还原之前节点的位置
    transHtml: function(arr, data, index) {
        var html = "",
            self = this,
            index = index || 0,
            flag = -1;

        html += "<ul col = " + index + " >";

        for (var j = 0; j < data.length; j++) {
            if (data[j].value == arr[0]) {
                flag = j;
            }

            if (data[j].children) {
                html += "<li class='" + (flag === j ? 'active' : '') + "' row = " + j + "  value=" + data[j].value + ">" + data[j].name + "<i class='icon uf uf-arrow-right'></i></li>";
            } else {
                html += "<li class='" + (flag === j ? 'active' : '') + "' row = " + j + " value=" + data[j].value + ">" + data[j].name + "</li>";
            }
        }
        html += "</ul>";
        if (arr.length > 1) {
            data = data[flag].children;
            arr.shift();

            html += self.transHtml(arr, data, ++index);
        }

        return html;
    },
    //根据传入的data来动态的生成级联组件的列表
    formData: function(data, index, arg) {
        var self = this,
            data = data || self._data,
            html = "",
            index = index || 0, //来记录是第几个ul，方便进行查找和删除
            arr = [],
            trigger_type = self.options['trigger_type'] || 'click';
        //判断输入框中是否有数据
        if (!arg) {
            //当输入框中没有数据，就认为是第一次
            if ($('#' + self.options['id'] + '>ul').length) {
                $('#' + self.options['id'] + '>ul[col="' + (index) + '"]~').remove();
                index = $('#' + self.options['id'] + '>ul').length;
            }

            html += "<ul col = " + index + " >";

            for (var i = 0; i < data.length; i++) {
                if (data[i].children) {
                    html += "<li row = " + i + "  value=" + data[i].value + ">" + data[i].name + "<i class='icon uf uf-arrow-right'></i></li>";

                } else {
                    html += "<li row = " + i + " value=" + data[i].value + ">" + data[i].name + "</li>";

                }
            }
            html += "</ul>";
            if ($('#' + self.options['id'] + '>ul').length) {

                $('#' + self.options['id']).append(html);
            } else {
                $('#' + self.options['id']).append(html);
            }
            index++;

        } else {
            //当输入框中有数据的时候，就根据输入框的数据，来显示出相应的列表
            arr = arg.split(',');
            html = self.transHtml(arr, data);
            if ($('#' + self.options['id'] + '>ul').length) {

                $('#' + self.options['id']).append(html);
            } else {
                $('#' + self.options['id']).append(html);
            }
            index++;

        }

        if (trigger_type == "mouseenter") {
            //当触发方式是mouseenter的时候，需要额外定义点击事件。点击则将选中的数据写入input输入框
            $('#' + self.options['id'] + '>ul>li').off('click').on('click', function(e) {
                var $this = $(this),
                    $content = $('#' + self.options['id']),
                    col = $this.parent().attr('col'),
                    text = "", //最后选中之后的input输入框中的文字,如："浙江,杭州"
                    value = ""; //最后选中之后的原始序列,如："01,11"
                $.each($content.find('li.active'), function(key, val) {
                    var $val = $(val);
                    if (key < (col - (-1))) {
                        text += val.innerText + '/';
                        value += $val.attr('value') + ',';
                    }

                });
                text = text.substring(0, text.length - 1);
                value = value.substring(0, value.length - 1);

                $content.prev().children('input').val(text).attr('tovalue', value).end().end().html('');

                //触发adapter层的change事件
                self.triggerChange(value);
            });
        }

        //为级联组件的列表的每个li绑定事件
        $('#' + self.options['id'] + '>ul>li').off(trigger_type).on(trigger_type, function(e) {
            var $this = $(this),
                col = $this.parent().attr('col'),
                row = $this.attr('row'),
                data = self._data,
                $content = $('#' + self.options['id']),
                text = "", //最后选中之后的input输入框中的文字,如："浙江,杭州"
                value = ""; //最后选中之后的原始序列,如："01,11"

            $this.siblings().removeClass('active');
            $this.addClass('active');

            //把超过col+1的ul砍掉，之后的就不显示了
            self.order.length = col - (-1);
            self.order[col] = row;

            for (var i = 0; i < self.order.length; i++) {
                //判断此条数据是否还有子数据
                if (data[self.order[i]].children) {
                    data = data[self.order[i]].children;
                } else {

                    if (trigger_type != 'mouseenter') {
                        //当此条数据没有子数据时，并且是click方式触发，就将之前选择的数据展示到input框中
                        $.each($content.find('li.active'), function(key, val) {
                            var $val = $(val);
                            if (key < (col - (-1))) {
                                text += val.innerText + '/';
                                value += $val.attr('value') + ',';
                            }
                        });
                        text = text.substring(0, text.length - 1);
                        value = value.substring(0, value.length - 1);

                        $content.prev().children('input').val(text).attr('tovalue', value).end().end().html('');
                        //触发adapter层的change事件
                        self.triggerChange(value);
                    } else {
                        //当此条数据没有子数据时，如果是mouseenter触发，就只是将该条列表后面的内容删掉
                        $this.parent().nextAll().remove();
                    }
                    return;
                }
            }
            if (data) {
                self.formData(data, col);
            }
        });
        //当点击级联组件的之外的区域时，删除级联组件的显示
        var callback = function(e) {
            if (e.target === this._input || self._inputFocus == true) return;
            if (closest(e.target, 'cascader-show') === self._ul || closest(e.target, 'u-cascader')) return;
            off(document, 'click', callback);
            $('#' + self.options['id']).html('');
        }.bind(this);
        this.callback = callback;
        on(document, 'click', callback);

    },
    //当input输入框有点击事件的时候就生成级联组件的列表
    focusFunc: function() {
        var self = this;
        var caret = $(this.element).find('input')[0];
        on(caret, 'click', function(e) {
            var $this = $(this);
            if (!$('#' + self.options['id']).html()) {
                self.formData('', '', $this.attr('tovalue'));
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        });
    }
});

if (u.compMgr)
    u.compMgr.regComp({
        comp: Cascader,
        compAsString: 'u.Cascader',
        css: 'u-cascader'
    });

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

}((this.bar = this.bar || {})));
