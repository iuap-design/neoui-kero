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
var trigger = function(element, eventName) {
	if(element["uEvent"] && element["uEvent"][eventName]) {
		element["uEvent"][eventName + 'fn']();
	}
};

/**
 * 阻止冒泡
 */
var stopEvent = function(e) {
	if(typeof(e) != "undefined") {
		if(e.stopPropagation)
			e.stopPropagation();
		else {
			e.cancelBubble = true;
		}
		//阻止默认浏览器动作(W3C)
		if(e && e.preventDefault)
			e.preventDefault();
		//IE中阻止函数器默认动作的方式
		else
			window.event.returnValue = false;
	}
};

/**
 * Module : Sparrow dom
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-16 13:59:17
 */
/**
 * 元素增加指定样式
 * @param value
 * @returns {*}
 */
var addClass = function(element, value) {
	if(element){
		if(typeof element.classList === 'undefined') {
			if(u._addClass){
				u._addClass(element, value);
			}else{
				$(element).addClass(value);
			}

		} else {
			element.classList.add(value);
		}
	}

	return this;
};
/**
 * 删除元素上指定样式
 * @param {Object} element
 * @param {Object} value
 */
var removeClass = function(element, value) {
	if(element){
		if(typeof element.classList === 'undefined') {
			if(u._removeClass){
				u._removeClass(element, value);
			}else{
				$(element).removeClass(value);
			}

		} else {
			element.classList.remove(value);
		}
	}
	return this;
};
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

var globalZIndex;
/**
 * 统一zindex值, 不同控件每次显示时都取最大的zindex，防止显示错乱
 */
var getZIndex = function() {
	if(!globalZIndex) {
		globalZIndex = 2000;
	}
	return globalZIndex++;
};
var makeDOM = function(htmlString) {
	var tempDiv = document.createElement("div");
	tempDiv.innerHTML = htmlString;
	var _dom = tempDiv.children[0];
	return _dom;
};
var showPanelByEle = function(obj) {
		var ele = obj.ele,panel = obj.panel,position = obj.position,
			// off = u.getOffset(ele),scroll = u.getScroll(ele),
			// offLeft = off.left,offTop = off.top,
			// scrollLeft = scroll.left,scrollTop = scroll.top,
			// eleWidth = ele.offsetWidth,eleHeight = ele.offsetHeight,
			// panelWidth = panel.offsetWidth,panelHeight = panel.offsetHeight,
			bodyWidth = document.body.clientWidth,bodyHeight = document.body.clientHeight,
			position = position || 'top',
			// left = offLeft - scrollLeft,top = offTop - scrollTop,
			eleRect = obj.ele.getBoundingClientRect(),
			panelRect = obj.panel.getBoundingClientRect(),
			eleWidth = eleRect.width || 0,eleHeight = eleRect.height || 0,
			left = eleRect.left || 0,top = eleRect.top || 0,
			panelWidth = panelRect.width || 0,panelHeight = panelRect.height || 0,
			docWidth =  document.documentElement.clientWidth, docHeight =  document.documentElement.clientHeight;

			// 基准点为Ele的左上角
			// 后续根据需要完善
		if(position == 'left'){
			left=left-panelWidth;
			top=top+(eleHeight - panelHeight)/2;
		}else if(position == 'right'){
			left=left+eleWidth;
			top=top+(eleHeight - panelHeight)/2;
		}else if(position == 'top'||position == 'topCenter'){
			left = left + (eleWidth - panelWidth)/2;
			top = top - panelHeight;
		}else if(position == 'bottom'||position == 'bottomCenter'){
			left = left+ (eleWidth - panelWidth)/2;
			top = top + eleHeight;
		}else if(position == 'bottomLeft'){
			left = left;
			top = top + eleHeight;
		}

	        if((left + panelWidth) > docWidth)
	            left = docWidth - panelWidth - 10;
	        if(left < 0)
	            left = 0;

	         if((top + panelHeight) > docHeight) {
		 top = docHeight - panelHeight - 10;
		 }

	         if(top < 0)
	             top = 0;
	        panel.style.left = left + 'px';
	        panel.style.top = top + 'px';
	};

/**
 * Module : Sparrow extend enum
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

var enumerables = true;
var enumerablesTest = {
		toString: 1
	};
for(var i in enumerablesTest) {
	enumerables = null;
}
if(enumerables) {
	enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
		'toLocaleString', 'toString', 'constructor'
	];
}

/**
 * Module : Sparrow extend
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

/**
 * 复制对象属性
 *
 * @param {Object}  目标对象
 * @param {config} 源对象
 */
var extend = function(object, config) {
	var args = arguments,
		options;
	if(args.length > 1) {
		for(var len = 1; len < args.length; len++) {
			options = args[len];
			if(object && options && typeof options === 'object') {
				var i, j, k;
				for(i in options) {
					object[i] = options[i];
				}
				if(enumerables) {
					for(j = enumerables.length; j--;) {
						k = enumerables[j];
						if(options.hasOwnProperty && options.hasOwnProperty(k)) {
							object[k] = options[k];
						}
					}
				}
			}
		}
	}
	return object;
};

if(!Object.assign){
	Object.assign = extend;
}

/**
 * Module : Sparrow browser environment
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

var u$1 = {};


extend(u$1, {
	isIE:  false,
	isFF: false,
	isOpera: false,
	isChrome: false,
	isSafari: false,
	isWebkit: false,
	isIE8_BEFORE: false,
	isIE8: false,
	isIE8_CORE: false,
	isIE9: false,
	isIE9_CORE: false,
	isIE10: false,
	isIE10_ABOVE: false,
	isIE11: false,
	isEdge: false,
	isIOS: false,
	isIphone: false,
	isIPAD: false,
	isStandard: false,
	version: 0,
	isWin: false,
	isUnix: false,
	isLinux: false,
	isAndroid: false,
	isAndroidPAD:false,
	isAndroidPhone:false,
	isMac: false,
	hasTouch: false,
	isMobile: false
});

(function() {
	var userAgent = navigator.userAgent,
		rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
		rFirefox = /(firefox)\/([\w.]+)/,
		rOpera = /(opera).+version\/([\w.]+)/,
		rChrome = /(chrome)\/([\w.]+)/,
		rSafari = /version\/([\w.]+).*(safari)/,
		version,
		ua = userAgent.toLowerCase(),
		s,
		browserMatch = {
			browser: "",
			version: ''
		},
		match = rMsie.exec(ua);

	if(match != null) {
		browserMatch = {
			browser: "IE",
			version: match[2] || "0"
		};
	}
	match = rFirefox.exec(ua);
	if(match != null) {
		browserMatch = {
			browser: match[1] || "",
			version: match[2] || "0"
		};
	}
	match = rOpera.exec(ua);
	if(match != null) {
		browserMatch = {
			browser: match[1] || "",
			version: match[2] || "0"
		};
	}
	match = rChrome.exec(ua);
	if(match != null) {
		browserMatch = {
			browser: match[1] || "",
			version: match[2] || "0"
		};
	}
	match = rSafari.exec(ua);
	if(match != null) {
		browserMatch = {
			browser: match[2] || "",
			version: match[1] || "0"
		};
	}

	if(userAgent.indexOf("Edge") > -1){
		u$1.isEdge = true;
	}
	if(s = ua.match(/opera.([\d.]+)/)) {
		u$1.isOpera = true;
	} else if(browserMatch.browser == "IE" && browserMatch.version == 11) {
		u$1.isIE11 = true;
		u$1.isIE = true;
	} else if(s = ua.match(/chrome\/([\d.]+)/)) {
		u$1.isChrome = true;
		u$1.isStandard = true;
	} else if(s = ua.match(/version\/([\d.]+).*safari/)) {
		u$1.isSafari = true;
		u$1.isStandard = true;
	} else if(s = ua.match(/gecko/)) {
		//add by licza : support XULRunner
		u$1.isFF = true;
		u$1.isStandard = true;
	} else if(s = ua.match(/msie ([\d.]+)/)) {
		u$1.isIE = true;
	} else if(s = ua.match(/firefox\/([\d.]+)/)) {
		u$1.isFF = true;
		u$1.isStandard = true;
	}
	if(ua.match(/webkit\/([\d.]+)/)) {
		u$1.isWebkit = true;
	}
	if(ua.match(/ipad/i)) {
		u$1.isIOS = true;
		u$1.isIPAD = true;
		u$1.isStandard = true;
	}

	if(ua.match(/iphone/i)) {
		u$1.isIOS = true;
		u$1.isIphone = true;
	}

	if((navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel")) {
		//u.isIOS = true;
		u$1.isMac = true;
	}

	if((navigator.platform == "Win32") || (navigator.platform == "Windows") || (navigator.platform == "Win64")) {
		u$1.isWin = true;
	}

	if((navigator.platform == "X11") && !u$1.isWin && !u$1.isMac) {
		u$1.isUnix = true;
	}
	if((String(navigator.platform).indexOf("Linux") > -1)) {
		u$1.isLinux = true;
	}

	if(ua.indexOf('Android') > -1 || ua.indexOf('android') > -1 || ua.indexOf('Adr') > -1 || ua.indexOf('adr') > -1) {
		u$1.isAndroid = true;
	}

	u$1.version = version ? (browserMatch.version ? browserMatch.version : 0) : 0;
	if(u$1.isAndroid){
		if(window.screen.width>=768&&window.screen.width<1024){
			u$1.isAndroidPAD=true;
		}
		if(window.screen.width<=768) {
			u$1.isAndroidPhone = true;
		}
	}
	if(u$1.isIE) {
		var intVersion = parseInt(u$1.version);
		var mode = document.documentMode;
		if(mode == null) {
			if(intVersion == 6 || intVersion == 7) {
				u$1.isIE8_BEFORE = true;
			}
		} else {
			if(mode == 7) {
				u$1.isIE8_BEFORE = true;
			} else if(mode == 8) {
				u$1.isIE8 = true;
			} else if(mode == 9) {
				u$1.isIE9 = true;
				u$1.isSTANDARD = true;
			} else if(mode == 10) {
				u$1.isIE10 = true;
				u$1.isSTANDARD = true;
				u$1.isIE10_ABOVE = true;
			} else {
				u$1.isSTANDARD = true;
			}
			if(intVersion == 8) {
				u$1.isIE8_CORE = true;
			} else if(intVersion == 9) {
				u$1.isIE9_CORE = true;
			} else if(browserMatch.version == 11) {
				u$1.isIE11 = true;
			}
		}
	}
	if("ontouchend" in document) {
		u$1.hasTouch = true;
	}
	if(u$1.isIphone || u$1.isAndroidPhone)
		u$1.isMobile = true;

})();

var env = u$1;

/**
 * Module : neoui-combo
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-02 14:22:46
 */

var Text = u.BaseComponent.extend({
    _Constant: {
        NO_MAX_ROWS: -1,
        MAX_ROWS_ATTRIBUTE: 'maxrows'
    },

    _CssClasses: {
        LABEL: 'u-label',
        INPUT: 'u-input',
        IS_DIRTY: 'is-dirty',
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_INVALID: 'is-invalid',
        IS_UPGRADED: 'is-upgraded'
    },

    init: function() {
        var oThis = this;
        this.maxRows = this._Constant.NO_MAX_ROWS;
        this.label_ = this.element.querySelector('.' + this._CssClasses.LABEL);
        this._input = this.element.querySelector('input');

        if (this._input) {
            if (this._input.hasAttribute(
                    /** @type {string} */
                    (this._Constant.MAX_ROWS_ATTRIBUTE))) {
                this.maxRows = parseInt(this._input.getAttribute(
                    /** @type {string} */
                    (this._Constant.MAX_ROWS_ATTRIBUTE)), 10);
                if (isNaN(this.maxRows)) {
                    this.maxRows = this._Constant.NO_MAX_ROWS;
                }
            }

            this.boundUpdateClassesHandler = this._updateClasses.bind(this);
            this.boundFocusHandler = this._focus.bind(this);
            this.boundBlurHandler = this._blur.bind(this);
            this.boundResetHandler = this._reset.bind(this);
            this._input.addEventListener('input', this.boundUpdateClassesHandler);
            if (env.isIE8) {
                this._input.addEventListener('propertychange', function() {
                    oThis._updateClasses();
                });
            }
            this._input.addEventListener('focus', this.boundFocusHandler);
            if (env.isIE8 || env.isIE9) {
                if (this.label_) {
                    this.label_.addEventListener('click', function() {
                        this._input.focus();
                    }.bind(this));
                }
            }

            this._input.addEventListener('blur', this.boundBlurHandler);
            this._input.addEventListener('reset', this.boundResetHandler);

            if (this.maxRows !== this._Constant.NO_MAX_ROWS) {
                // TODO: This should handle pasting multi line text.
                // Currently doesn't.
                this.boundKeyDownHandler = this._down.bind(this);
                this._input.addEventListener('keydown', this.boundKeyDownHandler);
            }
            var invalid = hasClass(this.element, this._CssClasses.IS_INVALID);
            this._updateClasses();
            addClass(this.element, this._CssClasses.IS_UPGRADED);
            if (invalid) {
                addClass(this.element, this._CssClasses.IS_INVALID);
            }
        }
    },

    /**
     * Handle input being entered.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _down: function(event) {
        var currentRowCount = event.target.value.split('\n').length;
        if (event.keyCode === 13) {
            if (currentRowCount >= this.maxRows) {
                event.preventDefault();
            }
        }
    },
    /**
     * Handle focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _focus: function(event) {
        addClass(this.element, this._CssClasses.IS_FOCUSED);
    },
    /**
     * Handle lost focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _blur: function(event) {
        removeClass(this.element, this._CssClasses.IS_FOCUSED);
        this.trigger('u.text.blur');
    },
    /**
     * Handle reset event from out side.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _reset: function(event) {
        this._updateClasses();
    },
    /**
     * Handle class updates.
     *
     * @private
     */
    _updateClasses: function() {
        this.checkDisabled();
        this.checkValidity();
        this.checkDirty();
    },

    // Public methods.

    /**
     * Check the disabled state and update field accordingly.
     *
     * @public
     */
    checkDisabled: function() {
        if (this._input.disabled) {
            addClass(this.element, this._CssClasses.IS_DISABLED);
        } else {
            removeClass(this.element, this._CssClasses.IS_DISABLED);
        }
    },
    /**
     * Check the validity state and update field accordingly.
     *
     * @public
     */
    checkValidity: function() {
        if (this._input.validity) {
            if (this._input.validity.valid) {
                removeClass(this.element, this._CssClasses.IS_INVALID);
            } else {
                addClass(this.element, this._CssClasses.IS_INVALID);
            }
        }
    },
    /**
     * Check the dirty state and update field accordingly.
     *
     * @public
     */
    checkDirty: function() {
        if (this._input.value && this._input.value.length > 0) {
            addClass(this.element, this._CssClasses.IS_DIRTY);
        } else {
            removeClass(this.element, this._CssClasses.IS_DIRTY);
        }
    },
    /**
     * Disable text field.
     *
     * @public
     */
    disable: function() {
        this._input.disabled = true;
        this._updateClasses();
    },
    /**
     * Enable text field.
     *
     * @public
     */
    enable: function() {
        this._input.disabled = false;
        this._updateClasses();
    },
    /**
     * Update text field value.
     *
     * @param {string} value The value to which to set the control (optional).
     * @public
     */
    change: function(value) {
        this._input.value = value === 0 ? value : (value || '');
        this._updateClasses();
    }


});



//if (compMgr)
//    compMgr.addPlug({
//        name:'text',
//        plug: Text
//    })

if (u.compMgr)
    u.compMgr.regComp({
        comp: Text,
        compAsString: 'u.Text',
        css: 'u-text'
    });

/**
 * Module : Sparrow ripple
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-29 08:42:13
 */

var URipple = function URipple(element) {
    if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
    this._element = element;

    // Initialize instance.
    this.init();
  };
  //window['URipple'] = URipple;

  URipple.prototype._down = function(event) {
    if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
    if (!this._rippleElement.style.width && !this._rippleElement.style.height) {
      var rect = this._element.getBoundingClientRect();
      this.rippleSize_ = Math.sqrt(rect.width * rect.width + rect.height * rect.height) * 2 + 2;
      if(this.rippleSize_ > 0){
            this._rippleElement.style.width = this.rippleSize_ + 'px';
            this._rippleElement.style.height = this.rippleSize_ + 'px';
        }

    }

    addClass(this._rippleElement, 'is-visible');

    if (event.type === 'mousedown' && this._ignoringMouseDown) {
      this._ignoringMouseDown = false;
    } else {
      if (event.type === 'touchstart') {
        this._ignoringMouseDown = true;
      }
      var frameCount = this.getFrameCount();
      if (frameCount > 0) {
        return;
      }
      this.setFrameCount(1);
      var t = event.currentTarget || event.target || event.srcElement;
      var bound = t.getBoundingClientRect();
      var x;
      var y;
      // Check if we are handling a keyboard click.
      if (event.clientX === 0 && event.clientY === 0) {
        x = Math.round(bound.width / 2);
        y = Math.round(bound.height / 2);
      } else {
        var clientX = event.clientX ? event.clientX : event.touches[0].clientX;
        var clientY = event.clientY ? event.clientY : event.touches[0].clientY;
        x = Math.round(clientX - bound.left);
        y = Math.round(clientY - bound.top);
      }
      this.setRippleXY(x, y);
      this.setRippleStyles(true);
      if(window.requestAnimationFrame)
        window.requestAnimationFrame(this.animFrameHandler.bind(this));
    }
  };

  /**
   * Handle mouse / finger up on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  URipple.prototype._up = function(event) {
    if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
    var self = this;
    // Don't fire for the artificial "mouseup" generated by a double-click.
    if (event && event.detail !== 2) {
      removeClass(this._rippleElement,'is-visible');
    }
    // Allow a repaint to occur before removing this class, so the animation
    // shows for tap events, which seem to trigger a mouseup too soon after
    // mousedown.
    window.setTimeout(function() {
      removeClass(self._rippleElement,'is-visible');
    }, 0);
  };

  /**
       * Getter for frameCount_.
       * @return {number} the frame count.
       */
  URipple.prototype.getFrameCount = function() {
    if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
    return this.frameCount_;
  };
  /**
       * Setter for frameCount_.
       * @param {number} fC the frame count.
       */
  URipple.prototype.setFrameCount = function(fC) {
    if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
    this.frameCount_ = fC;
  };


  /**
       * Getter for _rippleElement.
       * @return {Element} the ripple element.
       */
      URipple.prototype.getRippleElement = function() {
        if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
        return this._rippleElement;
      };

      /**
       * Sets the ripple X and Y coordinates.
       * @param  {number} newX the new X coordinate
       * @param  {number} newY the new Y coordinate
       */
      URipple.prototype.setRippleXY = function(newX, newY) {
        if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
        this.x_ = newX;
        this.y_ = newY;
      };

      /**
       * Sets the ripple styles.
       * @param  {boolean} start whether or not this is the start frame.
       */
      URipple.prototype.setRippleStyles = function(start) {
        if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
        if (this._rippleElement !== null) {
          var transformString;
          var scale;
          var size;
          var offset = 'translate(' + this.x_ + 'px, ' + this.y_ + 'px)';

          if (start) {
            scale = 'scale(0.0001, 0.0001)';
            size = '1px';
          } else {
            scale = '';
            size = this.rippleSize_ + 'px';
          }

          transformString = 'translate(-50%, -50%) ' + offset + scale;

          this._rippleElement.style.webkitTransform = transformString;
          this._rippleElement.style.msTransform = transformString;
          this._rippleElement.style.transform = transformString;

          if (start) {
            removeClass(this._rippleElement,'is-animating');
          } else {
            addClass(this._rippleElement,'is-animating');
          }
        }
      };

    /**
       * Handles an animation frame.
       */
      URipple.prototype.animFrameHandler = function() {
        if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
        if (this.frameCount_-- > 0) {
          window.requestAnimationFrame(this.animFrameHandler.bind(this));
        } else {
          this.setRippleStyles(false);
        }
      };

  /**
   * Initialize element.
   */
  URipple.prototype.init = function() {
    if (env.isIE8 || env.isMobile || env.isAndroidPAD || env.isIPAD) return;
    var self = this;
    if (this._element) {
      this._rippleElement = this._element.querySelector('.u-ripple');
      if (!this._rippleElement){
        this._rippleElement = document.createElement('span');
        addClass(this._rippleElement,'u-ripple');
        this._element.appendChild(this._rippleElement);
        this._element.style.overflow = 'hidden';
        this._element.style.position = 'relative';
      }
      this.frameCount_ = 0;
      this.rippleSize_ = 0;
      this.x_ = 0;
      this.y_ = 0;

      // Touch start produces a compat mouse down event, which would cause a
      // second ripples. To avoid that, we use this property to ignore the first
      // mouse down after a touch start.
      this._ignoringMouseDown = false;
      on(this._element, 'mousedown',function(e){self._down(e);});
      on(this._element, 'touchstart',function(e){self._down(e);});

      on(this._element, 'mouseup',function(e){self._up(e);});
      on(this._element, 'mouseleave',function(e){self._up(e);});
      on(this._element, 'touchend',function(e){self._up(e);});
      on(this._element, 'blur',function(e){self._up(e);});
    }
  };

/**
 * Module : neoui-combo
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-06 13:19:10
 */

var Combo = u.BaseComponent.extend({
    init: function() {
        this.name = '';
        this.mutilSelect = this.options['mutilSelect'] || false;
        if (hasClass(this.element, 'mutil-select')) {
            this.mutilSelect = true;
        }
        //onlySelect=true，可以设置单选下拉框为readonly
        this.onlySelect = this.options['onlySelect'] || false;
        //当在多选的时候，设置selectChangeDatatable为true时，选中一个数据就会动态的去改变datatable
        this.selectChangeDatatable = this.options['selectChangeDatatable'] || false;
        if (this.mutilSelect)
            this.onlySelect = true;

        this.comboDatas = [];
        var i, option, datas = [],
            self = this;
        //addClass(this.element, 'u-text')
        new Text(this.element);
        var options = this.element.getElementsByTagName('option');
        for (i = 0; i < options.length; i++) {
            option = options[i];
            datas.push({
                value: option.value,
                name: option.text
            });
        }

        this._input = this.element.querySelector("input");
        this.setComboData(datas);



        if (this.mutilSelect) {
            this.nowWidth = 0;
            this.showNowWidth = 0;
            this.multiNoneArr = [];
            this.fullWidth = this._input.offsetWidth;
        }


        if (this.onlySelect || env.isMobile) {
            setTimeout(function() {
                self._input.setAttribute('readonly', 'readonly');
            }, 1000);

        } else {
            on(this._input, 'blur', function(e) {
                var v = this.value;
                if (!v)
                    return;
                /*校验数值是否存在于datasource的name中*/
                for (var i = 0; i < self.comboDatas.length; i++) {
                    if (v == self.comboDatas[i].name) {
                        v = self.comboDatas[i].value;
                        break;
                    }

                }
                self.setValue(v);
            });
        }
        this._combo_name_par = this.element.querySelector(".u-combo-name-par");
        on(this._input, 'focus', function(e) {
            self._inputFocus = true;
            self.show(e);
            stopEvent(e);
        });
        on(this._input, 'blur', function(e) {
            self._inputFocus = false;
        });

        this.isAutoTip = this.options['isAutoTip'] || false; //是否支持自动提示
        //if (hasClass(this.element, 'is-auto-tip')){
        //    this.isAutoTip = true;
        //}
        on(this._input, 'keydown', function(e) {
            var keyCode = e.keyCode;

            if (self.isAutoTip) {
                switch (keyCode) {
                    case 38: // up
                        u.stopEvent(e);
                        break;
                    case 40: // down
                        u.stopEvent(e);
                        break;
                    case 9: // tab
                    case 13: // return
                        // make sure to blur off the current field
                        // self.element.blur();
                        u.stopEvent(e);
                        break;
                    default:
                        if (self.timeout) clearTimeout(self.timeout);
                        self.timeout = setTimeout(function() {
                            self.onChange();
                        }, 400);
                        break;
                }
            } else {
                // 回车
                if (keyCode == 13) this.blur();
            }
        });
        /*  this.iconBtn = this.element.querySelector("[data-role='combo-button']");
          if (this.iconBtn){
              on(this.iconBtn, 'click', function(e){
                  self._input.focus();
                  stopEvent(e);
              })
          }
         */
        //下拉框图表点击收起打开
        this.iconBtn = this.element.querySelector("[data-role='combo-button']");
        var comonTarge = true;
        if (this.iconBtn) {
            on(this.iconBtn, 'click', function(e) {
                self._input.focus();
                if (comonTarge) {
                    $(self._input).parent().parent().find(".u-combo-ul").addClass("is-visible");
                    comonTarge = false;
                } else {
                    $(self._input).parent().parent().find(".u-combo-ul").removeClass("is-visible");
                    comonTarge = true;
                }
            });
        }

    },

    //输入框内容发生变化时修改提示词.
    onChange: function() {
        var v = this._input.value;
        if (!v) v = '';
        var filterData = [];
        for (var i = 0, len = this.initialComboData.length; i < len; i++) {
            if (this.initialComboData[i].name.indexOf(v) >= 0 ||
                this.initialComboData[i].value.indexOf(v) >= 0) {
                filterData.push(this.initialComboData[i]);
            }
        }
        this.setComboData(filterData);
        this.show();
    },

    show: function(evt) {

        var self = this,
            width = this._input.offsetWidth;
        if (this.options.showFix) {
            document.body.appendChild(this._ul);
            this._ul.style.position = 'fixed';
            showPanelByEle({
                ele: this._input,
                panel: this._ul,
                position: "bottomLeft"
            });
        } else {
            // this.element.parentNode.appendChild(this._ul);
            // var left = this.element.offsetLeft,
            // inputHeight = this.element.offsetHeight,
            // top = this.element.offsetTop + inputHeight;
            // this._ul.style.left = left + 'px';
            // this._ul.style.top = top + 'px';
            var bodyWidth = document.body.clientWidth,
                bodyHeight = document.body.clientHeight,
                panelWidth = this._ul.offsetWidth,
                panelHeight = this._ul.offsetHeight;
            this.element.appendChild(this._ul);
            this.element.style.position = 'relative';
            this.left = this._input.offsetLeft;
            var inputHeight = this._input.offsetHeight;
            this.top = this._input.offsetTop + inputHeight;
            if (this.left + panelWidth > bodyWidth) {
                this.left = bodyWidth - panelWidth;
            }

            if ((this.top + panelHeight) > bodyHeight) {
                this.top = bodyHeight - panelHeight;
            }

            this._ul.style.left = this.left + 'px';
            this._ul.style.top = this.top + 'px';
        }
        this._ul.style.width = width + 'px';
        $(this._ul).addClass('is-animating');
        this._ul.style.zIndex = getZIndex();
        $(this._ul).addClass('is-visible');

        var callback = function(e) {
            if (e === evt || e.target === this._input || self._inputFocus == true) return;
            if (this.mutilSelect && (closest(e.target, 'u-combo-ul') === self._ul || closest(e.target, 'u-combo-name-par') || closest(e.target, 'u-combo-name'))) return;
            off(document, 'click', callback);
            // document.removeEventListener('click', callback);
            this.hide();
        }.bind(this);
        this.callback = callback;
        on(document, 'click', callback);
        on(document.body, 'touchend', callback);
        // document.addEventListener('click', callback);

    },

    hide: function() {
        off(document, 'click', this.callback);
        removeClass(this._ul, 'is-visible');
        this._ul.style.zIndex = -1;
        var name = this._input.value;
        if (this.mutilSelect)
            name = this.name;
        this.trigger('select', {
            value: this.value,
            name: name
        });
    },

    /**
     * 设置下拉数据
     * @param datas  数据项
     * @param options  指定name value对应字段 可以为空
     */
    setComboData: function(datas, options) {
        var i, li, self = this;

        //统一指定datas格式为[{name:"",value:""}].
        if (!options)
            this.comboDatas = datas;
        else {
            this.comboDatas = [];
            for (var i = 0; i < datas.length; i++) {
                this.comboDatas.push({
                    name: datas[i][options.name],
                    value: datas[i][options.value]
                });
            }
        }

        //将初始数据保留一份,以便input输入内容改变时自动提示的数据从全部数据里头筛选.
        if (!(this.initialComboData && this.initialComboData.length)) {
            this.initialComboData = this.comboDatas;
        }
        // isAutoTip 可以输入的情况下不清空内容，后续要清空内容需要重点考虑。
        // this.value = '';
        // this._input.value = '';

        //若没有下拉的ul,新生成一个ul结构.
        if (!this._ul) {
            this._ul = makeDOM('<ul class="u-combo-ul"></ul>');
        }
        this._ul.innerHTML = '';
        //TODO 增加filter
        for (i = 0; i < this.comboDatas.length; i++) {
            li = makeDOM('<li class="u-combo-li">' + this.comboDatas[i].name + '</li>'); //document.createElement('li');
            li._index = i;
            on(li, 'click', function() {
                self.selectItem(this._index);
            });
            var rippleContainer = document.createElement('span');
            addClass(rippleContainer, 'u-ripple-container');
            var _rippleElement = document.createElement('span');
            addClass(_rippleElement, 'u-ripple');

            rippleContainer.appendChild(_rippleElement);
            li.appendChild(rippleContainer);
            new URipple(li);
            this._ul.appendChild(li);
        }
    },

    selectItem: function(index) {
        var self = this;
        self._inputFocus = false;
        if (this.mutilSelect) {
            var val = this.comboDatas[index].value;
            var name = this.comboDatas[index].name;
            var index = (',' + this.value + ',').indexOf(',' + val + ',');
            var l = val.length + 1;
            var flag;
            if (this.fullWidth == 0) {
                this.fullWidth = this._input.offsetWidth;
                if (this.fullWidth < 0 || this.fullWidth == 0) {
                    this.fullWidth = parseInt($(this._input).width()) + parseInt($(this._input).css('border-left-width')) * 2 +
                        parseInt($(this._input).css('padding-left')) * 2 + 'px';
                }
                if (this.fullWidth > 0) {
                    if (this._combo_name_par) {
                        this._combo_name_par.style.maxWidth = this.fullWidth + 'px';

                    }
                }

            }

            if (index != -1) { // 已经选中
                this.value = this.value.substring(0, index) + this.value.substring(index + l);
                flag = '-';
            } else {
                this.value = (!this.value) ? val + ',' : this.value + val + ',';
                flag = '+';
            }

            if (flag == '+') {
                this.name += name + ',';
                var nameDiv = makeDOM('<div class="u-combo-name" key="' + val + '">' + name + /*<a href="javascript:void(0)" class="remove">x</a>*/ '</div>');
                var parNameDiv = makeDOM('<div class="u-combo-name-par" style="position:absolute;max-width:' + this.fullWidth + 'px;"></div>');

                /*var _a = nameDiv.querySelector('a');
                on(_a, 'click', function(){
                    var values = self.value.split(',');
                    values.splice(values.indexOf(val),1);
                    self.value = values.join(',');
                    self._combo_name_par.removeChild(nameDiv);
                    self._updateItemSelect();
                    self.trigger('select', {value: self.value, name: name});
                });*/
                if (!this._combo_name_par) {
                    this._input.parentNode.insertBefore(parNameDiv, this._input);
                    this._combo_name_par = parNameDiv;
                    on(this._combo_name_par, 'click', function(e) {
                        trigger(self._input, 'focus');
                    });
                }
                this._combo_name_par.appendChild(nameDiv);
                this._combo_name_par.title = this.name;
                var nWidth = nameDiv.offsetWidth + 20;
                this.nowWidth += nWidth;
                this.showNowWidth += nWidth;
                if (this.nowWidth > this.fullWidth && this.fullWidth > 0) {
                    addClass(this._combo_name_par, 'u-combo-overwidth');
                }
                if (this.showNowWidth > this.fullWidth && this.fullWidth > 0) {
                    this.showNowWidth -= nWidth;
                    nameDiv.style.display = 'none';
                    this.multiNoneArr.push(nameDiv);
                }
            } else {
                this.name = this.name.replace(name + ',', '');
                if (this._combo_name_par) {
                    var comboDiv = this._combo_name_par.querySelector('[key="' + val + '"]');
                    if (comboDiv) {
                        var fflag = true;
                        if (comboDiv.style.display == 'none') {
                            fflag = false;
                            comboDiv.style.display = '';
                        }
                        var nWidth = comboDiv.offsetWidth + 20;
                        this._combo_name_par.removeChild(comboDiv);
                        //当多选下拉框在取消选中的时候也更新title
                        this._combo_name_par.title = this.name;
                        this.nowWidth -= nWidth;
                        if (fflag) {
                            this.showNowWidth -= nWidth;
                        } else {
                            // 从数组中删除
                            for (var k = 0; k < this.multiNoneArr.length; k++) {
                                if (this.multiNoneArr[k] == comboDiv) {
                                    this.multiNoneArr.splice(k, 1);
                                    break;
                                }
                            }
                        }
                        if (!(this.nowWidth > this.fullWidth && this.fullWidth > 0)) {
                            removeClass(this._combo_name_par, 'u-combo-overwidth');
                        }
                        if (this.showNowWidth < this.fullWidth && this.fullWidth > 0) {
                            var nowShowNowWidth = this.showNowWidth;
                            var j = -1;
                            for (var i = 0; i < this.multiNoneArr.length; i++) {
                                var nowDiv = this.multiNoneArr[i];
                                nowDiv.style.display = '';
                                var nowForWidth = nowDiv.offsetWidth + 20;
                                nowShowNowWidth += nowForWidth;
                                if (nowShowNowWidth > this.fullWidth) {
                                    nowDiv.style.display = 'none';
                                    break;
                                } else {
                                    j++;
                                    this.showNowWidth += nowForWidth;
                                }
                            }

                            this.multiNoneArr.splice(0, j + 1);
                        }
                    }
                }
            }


            this._updateItemSelect();

        } else {
            this.value = this.comboDatas[index].value;
            this._input.value = this.comboDatas[index].name;
            this._updateItemSelect();
        }


    },

    _updateItemSelect: function() {
        var lis = this._ul.querySelectorAll('.u-combo-li'),
            val = this.value;
        if (this.mutilSelect) {
            var values = this.value.split(',');
            for (var i = 0; i < lis.length; i++) {
                if (values.indexOf(this.comboDatas[i].value) > -1) {
                    addClass(lis[i], 'is-selected');
                } else {
                    removeClass(lis[i], 'is-selected');
                }
            }
            //选中一个数据就会动态的去改变datatable
            if(this.selectChangeDatatable){
                 this.trigger('select', {
                    value: this.value,
                    name: this.name
                });
            }
            /*根据多选区域div的高度调整input的高度*/
            /*实际上input的高度并不需要调整*/
            /*var h = this._combo_name_par.offsetHeight;
            if(h < 25){
                h = 25;
                this._input.style.height = h + 'px';
            }*/
        } else {
            for (var i = 0; i < lis.length; i++) {
                if (val != '' && val != null && typeof val != 'undefined' && val == this.comboDatas[i].value) {
                    addClass(lis[i], 'is-selected');
                } else {
                    removeClass(lis[i], 'is-selected');
                }
            }

        }
    },

    /**
     *设置值
     * @param value
     */
    setValue: function(value) {
        var self = this;
        this.name = '';
        value = value + '';
        value = value || '';

        var values = value.split(',');
        if (this.mutilSelect === true) {
            if (self._combo_name_par) {
                self._combo_name_par.innerHTML = '';
                $(self._combo_name_par).removeClass('u-combo-overwidth');
            }
            this.value = '';
        }
        if (!value) {
            this._input.value = '';
            this.value = '';
            this._updateItemSelect();
        }
        var matched = false;
        this.nowWidth = 0;
        this.showNowWidth = 0;
        this.multiNoneArr = [];
        this.comboDatas.forEach(function(item, index) {
            if (this.mutilSelect === true) {
                if (values.indexOf(item.value) != -1) {
                    this.selectItem(index);
                }
            } else {
                if (item.value + '' === value) {
                    this.selectItem(index);
                    matched = true;
                    return;
                }
            }
        }.bind(this));
        if (!this.onlySelect && !matched) {
            this.value = value;
            this._input.value = value;
            var name = this._input.value;
            if (this.mutilSelect)
                name = this.name;
            this.trigger('select', {
                value: this.value,
                name: name
            });
        }
    },

    emptyValue: function() {
        this.value = '';
        this._input.value = '';
    },
    /**
     * 设置显示名
     * @param name
     */
    setName: function(name) {
        this.comboDatas.forEach(function(item, index) {
            if (item.name === name) {
                this.selectItem(index);
                return;
            }
        }.bind(this));
    }
});

if (u.compMgr)
    u.compMgr.regComp({
        comp: Combo,
        compAsString: 'u.Combo',
        css: 'u-combo'
    });

/**
 * Module : Kero webpack entry index
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 09:52:13
 */

var ComboboxAdapter = u.BaseAdapter.extend({
    init: function() {
        var self = this;
        this.datasource = getJSObject(this.viewModel, this.options['datasource']);
        this.mutil = this.options.mutil || false;
        this.onlySelect = this.options.onlySelect || false;
        this.showFix = this.options.showFix || false;
        this.validType = 'combobox';
        this.isAutoTip = this.options.isAutoTip || false;
        //当在多选的时候，设置selectChangeDatatable为true时，选中一个数据就会动态的去改变datatable
        this.selectChangeDatatable = this.options.selectChangeDatatable || false;
        if (!this.element['u.Combo']) {
            this.comp = new u.Combo({
                el: this.element,
                mutilSelect: this.mutil,
                onlySelect: this.onlySelect,
                showFix: this.showFix,
                isAutoTip: this.isAutoTip,
                selectChangeDatatable: this.selectChangeDatatable
            });
            this.element['u.Combo'] = this.comp;

        } else {
            this.comp = this.element['u.Combo'];
        }

        var isDsObservable = ko.isObservable(this.datasource);
        if (this.datasource) {
            this.comp.setComboData(isDsObservable ? ko.toJS(this.datasource) : this.datasource);
        } else {
            if (u.isIE8 || u.isIE9)
                alert("IE8/IE9必须设置datasource");
        }
        if (isDsObservable) {
            // datasource 发生变化时改变控件
            this.datasource.subscribe(function(value) {
                self.comp.setComboData(value);
            });
        }



        this.comp.on('select', function(event) {
            self.setValue(event.value);
            self.setShowValue(event.name);
        });

    },
    setComboData: function(datas, options) {
		this.comp.setComboData(datas, options);
	},
    modelValueChange: function(value) {
        if (this.slice) return;
        //this.trueValue = value;
        if (value === null || typeof value == "undefined")
            value = "";
        this.comp.setValue(value);
        if (this.mutil)
            this.showValue = this.comp.name;
        //下面两句会在校验中用到
        this.trueValue = this.formater ? this.formater.format(value) : value;
        this.element.trueValue = this.trueValue;
    },

    //getValue: function () {
    //    return this.trueValue
    //},
    setEnable: function(enable) {
        var self = this;
        if (enable === true || enable === 'true') {
            this.enable = true;
            this.element.removeAttribute('readonly');
            this.comp._input.removeAttribute('readonly');
            removeClass(this.element.parentNode, 'disablecover');
            on(this.comp._input, 'focus', function(e) {
                self.comp.show(e);
                stopEvent(e);
            });
            if (this.comp.iconBtn) {
                on(this.comp.iconBtn, 'click', function(e) {
                    self.comp.show(e);
                    stopEvent(e);
                });
            }
        } else if (enable === false || enable === 'false') {
            this.enable = false;
            this.element.setAttribute('readonly', 'readonly');
            this.comp._input.setAttribute('readonly', 'readonly');
            addClass(this.element.parentNode, 'disablecover');
            off(this.comp._input, 'focus');
            if (this.comp.iconBtn) {
                off(this.comp.iconBtn, 'click');
            }
        }
    }
});

if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: ComboboxAdapter,
        name: 'u-combobox'
    });

exports.ComboboxAdapter = ComboboxAdapter;

}((this.bar = this.bar || {})));
