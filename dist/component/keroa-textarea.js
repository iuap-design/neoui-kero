(function (exports) {
'use strict';

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

/**
 * Module : Kero textarea adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 12:40:46
 */

var TextAreaAdapter = u.BaseAdapter.extend({
    init: function() {
        var self = this;
        this.element = this.element.nodeName === 'TEXTAREA' ? this.element : this.element.querySelector('textarea');
        if (!this.element) {
            throw new Error('not found TEXTAREA element, u-meta:' + JSON.stringify(this.options));
        }
        var placeholder = this.options['placeholder'];
        if (placeholder)
            this.element.placeholder = placeholder;

        on(this.element, 'focus', function() {
            self.setShowValue(self.getValue());
        });
        on(this.element, 'blur', function() {
            if (self.enable) {
                if (!self.doValidate().passed) {
                    if (self._needClean()) {
                        if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                            // 因必输项清空导致检验没通过的情况
                            self.setValue('');
                        } else {
                            self.element.value = self.getShowValue();
                        }
                    }
                } else
                    self.setValue(self.element.value);
            }
        });
    }
});
if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: TextAreaAdapter,
        name: 'textarea'
    });

if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: TextAreaAdapter,
        name: 'u-textarea'
    });

exports.TextAreaAdapter = TextAreaAdapter;

}((this.bar = this.bar || {})));
