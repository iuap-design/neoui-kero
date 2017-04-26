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
var getFunction = function(target, val) {
	if(!val || typeof val == 'function') return val
	if(typeof target[val] == 'function')
		return target[val]
	else if(typeof window[val] == 'function')
		return window[val]
	else if(val.indexOf('.') != -1) {
		var func = getJSObject(target, val);
		if(typeof func == 'function') return func
		func = getJSObject(window, val);
		if(typeof func == 'function') return func
	}
	return val
};
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
var makeDOM = function(htmlString) {
	var tempDiv = document.createElement("div");
	tempDiv.innerHTML = htmlString;
	var _dom = tempDiv.children[0];
	return _dom;
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
 * Module : neoui-checkbox
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-02 13:55:07
 */
var Checkbox = u.BaseComponent.extend({
    _Constant: {
        TINY_TIMEOUT: 0.001
    },

    _CssClasses: {
        INPUT: 'u-checkbox-input',
        BOX_OUTLINE: 'u-checkbox-outline',
        FOCUS_HELPER: 'u-checkbox-focus-helper',
        TICK_OUTLINE: 'u-checkbox-tick-outline',
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_CHECKED: 'is-checked',
        IS_UPGRADED: 'is-upgraded'
    },
    init: function() {
        this._inputElement = this.element.querySelector('input');


        var boxOutline = document.createElement('span');
        addClass(boxOutline, this._CssClasses.BOX_OUTLINE);

        var tickContainer = document.createElement('span');
        addClass(tickContainer, this._CssClasses.FOCUS_HELPER);

        var tickOutline = document.createElement('span');
        addClass(tickOutline, this._CssClasses.TICK_OUTLINE);

        boxOutline.appendChild(tickOutline);
        this.element.appendChild(tickContainer);
        this.element.appendChild(boxOutline);


        //if (this.element.classList.contains(this._CssClasses.RIPPLE_EFFECT)) {
        //  addClass(this.element,this._CssClasses.RIPPLE_IGNORE_EVENTS);
        this.rippleContainerElement_ = document.createElement('span');
        //this.rippleContainerElement_.classList.add(this._CssClasses.RIPPLE_CONTAINER);
        //this.rippleContainerElement_.classList.add(this._CssClasses.RIPPLE_EFFECT);
        //this.rippleContainerElement_.classList.add(this._CssClasses.RIPPLE_CENTER);
        this.boundRippleMouseUp = this._onMouseUp.bind(this);
        this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);

        //var ripple = document.createElement('span');
        //ripple.classList.add(this._CssClasses.RIPPLE);

        //this.rippleContainerElement_.appendChild(ripple);
        this.element.appendChild(this.rippleContainerElement_);
        new URipple(this.rippleContainerElement_);

        //}
        this.boundInputOnChange = this._onChange.bind(this);
        this.boundInputOnFocus = this._onFocus.bind(this);
        this.boundInputOnBlur = this._onBlur.bind(this);
        this.boundElementMouseUp = this._onMouseUp.bind(this);
        //this._inputElement.addEventListener('change', this.boundInputOnChange);
        //this._inputElement.addEventListener('focus', this.boundInputOnFocus);
        //this._inputElement.addEventListener('blur', this.boundInputOnBlur);
        //this.element.addEventListener('mouseup', this.boundElementMouseUp);
        if (!hasClass(this.element, 'only-style')) {
            on(this.element, 'click', function(e) {
                if (e.target.nodeName != 'INPUT') {
                    if (!this._inputElement.disabled) {
                        this.toggle();
                        stopEvent(e);
                    }
                }
            }.bind(this));
        }


        this._updateClasses();
        addClass(this.element, this._CssClasses.IS_UPGRADED);

    },

    _onChange: function(event) {
        this._updateClasses();
        this.trigger('change', {
            isChecked: this._inputElement.checked
        });
    },

    _onFocus: function() {
        addClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    _onBlur: function() {
        removeClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    _onMouseUp: function(event) {
        this._blur();
    },

    /**
     * Handle class updates.
     *
     * @private
     */
    _updateClasses: function() {
        this.checkDisabled();
        this.checkToggleState();
    },

    /**
     * Add blur.
     *
     * @private
     */
    _blur: function() {
        // TODO: figure out why there's a focus event being fired after our blur,
        // so that we can avoid this hack.
        window.setTimeout(function() {
            this._inputElement.blur();
        }.bind(this), /** @type {number} */ (this._Constant.TINY_TIMEOUT));
    },

    // Public methods.

    /**
     * Check the inputs toggle state and update display.
     *
     * @public
     */
    checkToggleState: function() {
        if (this._inputElement.checked) {
            addClass(this.element, this._CssClasses.IS_CHECKED);
        } else {
            removeClass(this.element, this._CssClasses.IS_CHECKED);
        }
    },


    /**
     * Check the inputs disabled state and update display.
     *
     * @public
     */
    checkDisabled: function() {
        if (this._inputElement.disabled) {
            addClass(this.element, this._CssClasses.IS_DISABLED);
        } else {
            removeClass(this.element, this._CssClasses.IS_DISABLED);
        }
    },


    isChecked: function() {
        //return hasClass(this.element,this._CssClasses.IS_CHECKED);
        return this._inputElement.checked
    },

    toggle: function() {
        //return;
        if (this.isChecked()) {
            this.uncheck();
        } else {
            this.check();
        }
    },

    /**
     * Disable checkbox.
     *
     * @public
     */
    disable: function() {
        this._inputElement.disabled = true;
        this._updateClasses();
    },


    /**
     * Enable checkbox.
     *
     * @public
     */
    enable: function() {
        this._inputElement.disabled = false;
        this._updateClasses();
    },

    // 点击时查看是否有beforeEdit（从checkboxAdapter那里传来）方法，根据beforeEdit方法判断是否触发check或者uncheck
    beforeToggle: function() {
        if (typeof this.beforeEdit === 'function') {
            return this.beforeEdit();
        } else {
            return true;
        }
    },
    /**
     * Check checkbox.
     *
     * @public
     */
    check: function() {
        if (this.beforeToggle()) {
            this._inputElement.checked = true;
            this._updateClasses();
            this.boundInputOnChange();
        }
    },


    /**
     * Uncheck checkbox.
     *
     * @public
     */
    uncheck: function() {
        if (this.beforeToggle()) {
            this._inputElement.checked = false;
            this._updateClasses();
            this.boundInputOnChange();
        }
    }


});

if (u.compMgr)
    u.compMgr.regComp({
        comp: Checkbox,
        compAsString: 'u.Checkbox',
        css: 'u-checkbox'
    });

/**
 * Module : Kero Check Adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-08 15:50:03
 */

var CheckboxAdapter = u.BaseAdapter.extend({
    init: function() {
        var self = this;
        this.isGroup = this.options['isGroup'] === true || this.options['isGroup'] === 'true';
        this.otherValue = this.options['otherValue'] || '其他';
        this.beforeEdit = getFunction(this.viewModel, this.options['beforeEdit']);
        if (this.options['datasource'] || this.options['hasOther']) {
            // 存在datasource或者有其他选项，将当前dom元素保存，以后用于复制新的dom元素
            if (env.isIE) {
                this.checkboxTemplateHTML = this.element.innerHTML;
            } else {
                this.checkboxTemplateArray = [];
                for (var i = 0, count = this.element.childNodes.length; i < count; i++) {
                    this.checkboxTemplateArray.push(this.element.childNodes[i]);
                }
            }

        }
        if (this.options['datasource']) {
            this.isGroup = true;
            this.datasource = getJSObject(this.viewModel, this.options['datasource']);
            if (this.datasource)
                this.setComboData(this.datasource);
        } else {
            if (this.element['u.Checkbox']) {
                this.comp = this.element['u.Checkbox'];
            } else {
                this.comp = new Checkbox(this.element);
                this.comp.beforeEdit = this.beforeEdit;
                this.element['u.Checkbox'] = this.comp;
            }

            // 由于不同浏览器input的value不一样，所以默认checkedValue修改为true

            this.checkedValue = this.options['checkedValue'] || true;
            this.unCheckedValue = this.options["unCheckedValue"];

            this.comp.on('change', function() {
                if (self.slice) return;
                if (!self.dataModel) return;
                var modelValue = self.dataModel.getValue(self.field);
                modelValue = modelValue ? modelValue : '';
                if (self.isGroup) {
                    var valueArr = modelValue == '' ? [] : modelValue.split(',');

                    if (self.comp._inputElement.checked) {
                        valueArr.push(self.checkedValue);
                    } else {
                        var index = valueArr.indexOf(self.checkedValue);
                        valueArr.splice(index, 1);
                    }
                    self.dataModel.setValue(self.field, valueArr.join(','));
                } else {
                    if (self.comp._inputElement.checked) {
                        self.dataModel.setValue(self.field, self.checkedValue);
                    } else {
                        self.dataModel.setValue(self.field, self.unCheckedValue);
                    }
                }
            });
        }
        // 如果存在其他
        if (this.options['hasOther']) {
            var node = null;
            if (env.isIE) {
                var nowHtml = this.element.innerHTML;
                this.element.innerHTML = nowHtml + this.checkboxTemplateHTML;
            } else {
                for (var j = 0; j < this.checkboxTemplateArray.length; j++) {
                    this.element.appendChild(this.checkboxTemplateArray[j].cloneNode(true));
                }
            }

            var LabelS = this.element.querySelectorAll('.u-checkbox');
            self.lastLabel = LabelS[LabelS.length - 1];
            var allCheckS = this.element.querySelectorAll('[type=checkbox]');
            self.lastCheck = allCheckS[allCheckS.length - 1];
            var nameDivs = this.element.querySelectorAll('[data-role=name]');
            self.lastNameDiv = nameDivs[nameDivs.length - 1];
            self.lastNameDiv.innerHTML = '其他';
            self.otherInput = makeDOM('<input disabled type="text" style="width: 80%">');
            self.lastNameDiv.parentNode.appendChild(self.otherInput);
            self.lastCheck.value = '';


            var comp;
            if (self.lastLabel['u.Checkbox']) {
                comp = self.lastLabel['u.Checkbox'];
            } else {
                comp = new Checkbox(self.lastLabel);
            }
            self.lastLabel['u.Checkbox'] = comp;
            self.otherComp = comp;
            comp.on('change', function() {
                if (self.slice) return;
                var modelValue = self.dataModel.getValue(self.field);
                modelValue = modelValue ? modelValue : '';
                var valueArr = modelValue == '' ? [] : modelValue.split(',');
                if (comp._inputElement.checked) {
                    var oldIndex = valueArr.indexOf(self.otherInput.oldValue);
                    if (oldIndex > -1) {
                        valueArr.splice(oldIndex, 1);
                    }
                    if (self.otherInput.value) {
                        valueArr.push(self.otherInput.value);
                    }
                    var otherValueIndex = valueArr.indexOf(self.otherValue);
                    if (otherValueIndex < 0) {
                        valueArr.push(self.otherValue);
                    }

                    // 选中后可编辑
                    comp.element.querySelectorAll('input[type="text"]').forEach(function(ele) {
                        ele.removeAttribute('disabled');
                    });
                } else {
                    var index = valueArr.indexOf(self.otherInput.value);
                    if (index > -1) {
                        valueArr.splice(index, 1);
                    }

                    var otherValueIndex = valueArr.indexOf(self.otherValue);
                    if (otherValueIndex > -1) {
                        valueArr.splice(otherValueIndex, 1);
                    }

                    // 未选中则不可编辑
                    comp.element.querySelectorAll('input[type="text"]').forEach(function(ele) {
                        ele.setAttribute('disabled', 'true');
                    });
                }
                //self.slice = true;
                self.dataModel.setValue(self.field, valueArr.join(','));
                //self.slice = false;
            });

            on(self.otherInput, 'blur', function(e) {
                self.lastCheck.value = this.value;
                self.otherComp.trigger('change');
                this.oldValue = this.value;
            });
            on(self.otherInput, 'click', function(e) {
                stopEvent(e);
            });
        }

        if (this.dataModel) {
            this.dataModel.ref(this.field).subscribe(function(value) {
                if (!value)
                    value = "";
                self.modelValueChange(value);
            });
        }
    },
    setComboData: function(comboData) {
        var self = this;
        this.datasource = comboData;
        this.element.innerHTML = '';
        if (env.isIE) {
            var htmlStr = '';
            for (var i = 0, len = comboData.length; i < len; i++) {
                htmlStr　 += this.checkboxTemplateHTML;
            }
            this.element.innerHTML = htmlStr;
        } else {
            for (var i = 0, len = comboData.length; i < len; i++) {
                for (var j = 0; j < this.checkboxTemplateArray.length; j++) {
                    this.element.appendChild(this.checkboxTemplateArray[j].cloneNode(true));
                }
            }
        }

        var allCheck = this.element.querySelectorAll('[type=checkbox]');
        var allName = this.element.querySelectorAll('[data-role=name]');
        for (var k = 0; k < allCheck.length; k++) {
            allCheck[k].value = comboData[k].pk || comboData[k].value;
            allName[k].innerHTML = comboData[k].name;
        }
        this.element.querySelectorAll('.u-checkbox').forEach(function(ele) {
            var comp;
            if (ele['u.Checkbox']) {
                comp = ele['u.Checkbox'];
            } else {
                comp = new Checkbox(ele);
                comp.beforeEdit = self.beforeEdit;
            }
            ele['u.Checkbox'] = comp;
            comp.on('change', function() {
                if (self.slice) return;
                var modelValue = self.dataModel.getValue(self.field);
                modelValue = modelValue ? modelValue : '';
                var valueArr = modelValue == '' ? [] : modelValue.split(',');
                if (comp._inputElement.checked) {
                    valueArr.push(comp._inputElement.value);
                } else {
                    var index = valueArr.indexOf(comp._inputElement.value);
                    valueArr.splice(index, 1);
                }
                //self.slice = true;
                self.dataModel.setValue(self.field, valueArr.join(','));
                //self.slice = false;
            });
        });

    },
    modelValueChange: function(val) {
        var self = this;
        if (this.slice) return;

        if (this.isGroup) {
            if (this.datasource) {
                this.showValue = '';
                this.trueValue = val;
                if (this.options.hasOther) {
                    var otherVal = '';
                    if (val)
                        otherVal = val + ',';
                }
                this.element.querySelectorAll('.u-checkbox').forEach(function(ele) {
                    var comp = ele['u.Checkbox'];
                    if (comp) {
                        var inputValue = comp._inputElement.value;
                        if (inputValue && comp._inputElement.checked != (val + ',').indexOf(inputValue + ',') > -1) {
                            self.slice = true;
                            comp.toggle();
                            self.slice = false;
                        }
                        if (inputValue && (val + ',').indexOf(inputValue + ',') > -1) {
                            if (self.options.hasOther) {
                                otherVal = otherVal.replace(inputValue + ',', '');
                            }
                            var nameSpan = ele.querySelector('[data-role=name]');
                            var showValue = $(nameSpan).text();
                            if (showValue) {
                                self.showValue += showValue + ',';
                            }
                        }
                    }
                });
                if (this.options.hasOther) {
                    if (otherVal.indexOf(this.otherValue + ',') > -1) {
                        self.lastCheck.value = this.otherValue;
                        otherVal = otherVal.replace(this.otherValue + ',', '');
                    }
                    otherVal = otherVal.replace(/\,/g, '');
                    if (otherVal) {
                        self.otherInput.oldValue = otherVal;
                        self.otherInput.value = otherVal;
                        self.showValue += otherVal + ',';
                        self.otherInput.removeAttribute('disabled');
                        self.otherComp._inputElement.checked = true;
                        self.otherComp._updateClasses();

                    }
                }
            }
        } else {
            var flag;
            if (this.checkedValue === true)
                flag = (val === this.checkedValue) || (val === "true");
            else
                flag = (val === this.checkedValue);
            if (this.comp._inputElement.checked != flag) {
                this.slice = true;
                this.comp.toggle();
                this.slice = false;
            }
        }
    },

    setEnable: function(enable) {
        this.enable = (enable === true || enable === 'true');
        if (this.isGroup) {
            if (this.datasource) {
                if (this.otherInput && !this.enable) {
                    this.otherInput.setAttribute('disabled', true);
                }
                this.element.querySelectorAll('.u-checkbox').forEach(function(ele) {
                    var comp = ele['u.Checkbox'];
                    if (comp) {
                        if (enable === true || enable === 'true') {
                            comp.enable();
                        } else {
                            comp.disable();
                        }
                    }
                });
            }
        } else {
            if (this.enable) {
                this.comp.enable();
            } else {
                this.comp.disable();
            }
        }
    }
});


if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: CheckboxAdapter,
        name: 'u-checkbox'
    });

exports.CheckboxAdapter = CheckboxAdapter;

}((this.bar = this.bar || {})));
