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
 * Module : neoui-year
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-08-11 15:17:07
 */

var Year = u.BaseComponent.extend({
    DEFAULTS: {},
    init: function() {
        var self = this;
        var element = this.element;
        this.options = extend({}, this.DEFAULTS, this.options);
        this.panelDiv = null;
        this.input = this.element.querySelector("input");

        var d = new Date();
        this.year = d.getFullYear();
        this.defaultYear = this.year;
        this.startYear = this.year - this.year % 10 - 1;

        on(this.input, 'blur', function(e) {
            self._inputFocus = false;
            self.setValue(self.input.value);
        });

        // 添加focus事件
        this.focusEvent();
        // 添加右侧图标click事件
        this.clickEvent();
        // 添加keydown事件
        this.keydownEvent();
    },

    createPanel: function() {
        if (this.panelDiv) {
            this._fillYear();
            return;
        }
        var oThis = this;
        this.panelDiv = makeDOM('<div class="u-date-panel" style="margin:0px;"></div>');
        this.panelContentDiv = makeDOM('<div class="u-date-content"></div>');
        this.panelDiv.appendChild(this.panelContentDiv);

        this.preBtn = makeDOM('<button class="u-date-pre-button u-button mini">&lt;</button>');
        this.nextBtn = makeDOM('<button class="u-date-next-button u-button mini">&gt;</button>');

        on(this.preBtn, 'click', function(e) {
            oThis.startYear -= 10;
            oThis._fillYear();
        });
        on(this.nextBtn, 'click', function(e) {
            oThis.startYear += 10;
            oThis._fillYear();
        });
        this.panelContentDiv.appendChild(this.preBtn);
        this.panelContentDiv.appendChild(this.nextBtn);
        this._fillYear();

    },

    /**
     *填充年份选择面板
     * @private
     */
    _fillYear: function(type) {
        var oldPanel, year, template, yearPage, titleDiv, yearDiv, i, cell;
        oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
        if (oldPanel)
            this.panelContentDiv.removeChild(oldPanel);
        template = ['<div class="u-date-content-page">',
            '<div class="u-date-content-title"></div>',
            '<div class="u-date-content-panel"></div>',
            '</div>'
        ].join("");
        yearPage = makeDOM(template);
        titleDiv = yearPage.querySelector('.u-date-content-title');
        titleDiv.innerHTML = (this.startYear) + '-' + (this.startYear + 11);
        yearDiv = yearPage.querySelector('.u-date-content-panel');
        for (i = 0; i < 12; i++) {
            cell = makeDOM('<div class="u-date-content-year-cell">' + (this.startYear + i) + '</div>');
            new URipple(cell);
            if (this.startYear + i == this.year) {
                addClass(cell, 'current');
            }
            cell._value = this.startYear + i;
            yearDiv.appendChild(cell);
        }
        on(yearDiv, 'click', function(e) {
            var _y = e.target._value;
            this.year = _y;
            this.setValue(_y);
            this.hide();
            stopEvent(e);
        }.bind(this));

        this.preBtn.style.display = 'block';
        this.nextBtn.style.display = 'block';
        this.panelContentDiv.appendChild(yearPage);

        this.currentPanel = 'year';
    },

    setValue: function(value) {
        value = value ? value : '';
        this.value = value;
        if (value) {
            this.year = value;
        } else {
            this.year = this.defaultYear;
        }
        this.startYear = this.year - this.year % 10 - 1;
        this.input.value = value;
        this.trigger('valueChange', {
            value: value
        });
    },

    focusEvent: function() {
        var self = this;
        on(this.input, 'focus', function(e) {
            self._inputFocus = true;
            self.show(e);
            stopEvent(e);
        });
    },
    keydownEvent: function() {
        var self = this;
        on(self.input, "keydown", function(e) {
            var code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
            if (!(code >= 48 && code <= 57 || code == 37 || code == 39 || code == 8 || code == 46)) {
                //阻止默认浏览器动作(W3C)
                if (e && e.preventDefault)
                    e.preventDefault();
                //IE中阻止函数器默认动作的方式
                else
                    window.event.returnValue = false;
                return false;
            }
        });
    },
    //下拉图标的点击事件
    clickEvent: function() {
        var self = this;
        var caret = this.element.nextSibling;
        on(caret, 'click', function(e) {
            self.input.focus();
            stopEvent(e);
        });
    },


    show: function(evt) {
        var oThis = this;
        this.createPanel();

        this.width = this.element.offsetWidth;
        if (this.width < 300)
            this.width = 300;

        this.panelDiv.style.width = 152 + 'px';
        if (this.options.showFix) {
            document.body.appendChild(this.panelDiv);
            this.panelDiv.style.position = 'fixed';
            showPanelByEle({
                ele: this.input,
                panel: this.panelDiv,
                position: "bottomLeft"
            });
        } else {
            var bodyWidth = document.body.clientWidth,
                bodyHeight = document.body.clientHeight,
                panelWidth = this.panelDiv.offsetWidth,
                panelHeight = this.panelDiv.offsetHeight;

            this.element.appendChild(this.panelDiv);
            this.element.style.position = 'relative';
            this.left = this.input.offsetLeft;
            var inputHeight = this.input.offsetHeight;
            this.top = this.input.offsetTop + inputHeight;

            if (this.left + panelWidth > bodyWidth) {
                this.left = bodyWidth - panelWidth;
            }

            if ((this.top + panelHeight) > bodyHeight) {
                this.top = bodyHeight - panelHeight;
            }


            this.panelDiv.style.left = this.left + 'px';
            this.panelDiv.style.top = this.top + 'px';
        }
        this.panelDiv.style.zIndex = getZIndex();
        addClass(this.panelDiv, 'is-visible');

        var callback = function(e) {
            if (e !== evt && e.target !== this.input && !oThis.clickPanel(e.target) && oThis._inputFocus != true) {
                off(document, 'click', callback);
                // document.removeEventListener('click', callback);
                this.hide();
            }
        }.bind(this);
        on(document, 'click', callback);
        // document.addEventListener('click', callback);
    },

    clickPanel: function(dom) {
        while (dom) {
            if (dom == this.panelDiv) {
                return true
            } else {
                dom = dom.parentNode;
            }
        }
        return false;
    },
    hide: function() {
        removeClass(this.panelDiv, 'is-visible');
        this.panelDiv.style.zIndex = -1;
    }
});



if (u.compMgr)
    u.compMgr.regComp({
        comp: Year,
        compAsString: 'u.Year',
        css: 'u-year'
    });

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
var isNumber$1 = function(obj) {
	//return obj === +obj
	//加了个typeof 判断，因为'431027199110.078573'会解析成number
	return obj - parseFloat(obj) + 1 >= 0;
};
var isArray = Array.isArray || function(val) {
	return Object.prototype.toString.call(val) === '[object Array]';
};
var isEmptyObject = function(obj) {
	var name;
	for(name in obj) {
		return false;
	}
	return true;
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
 * Module : kero DataTable copyRow
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-08-01 14:34:01
 */


/**
 * 在指定index位置插入单条数据行
 * @memberof DataTable
 * @param  {number} index 数据行插入之后的位置
 * @param  {object} row   数据行信息
 * @example
 * var row = {
 *    field1:'value1'
 * }
 * datatable.copyRow(1,row)
 */
const copyRow = function(index, row) {
    this.copyRows(index, [row]);
};

/**
 * 在指定index位置插入多条数据行
 * @memberof DataTable
 * @param  {number} index 数据行插入之后的位置
 * @param  {array} rows   存储数据行信息的数组
 * @example
 * var row1 = {
 *    field1:'value1'
 * }
 * var row2 = {
 *    field1:'value1'
 * }
 * datatable.copyRow(1,[row1,row2])
 */
const copyRows = function(index, rows) {
    for (var i = 0; i < rows.length; i++) {
        var newRow = new Row({
            parent: this
        });
        if (rows[i]) {
            newRow.setData(rows[i].getData());
        }
        this.insertRows(index === undefined ? this.rows().length : index, [newRow]);
    }
};

const copyRowFunObj = {
    copyRow: copyRow,
    copyRows: copyRows
};

/**
 * Module : kero DataTable data
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-07-30 14:34:01
 */

/**
 * 设置数据信息
 * @memberof DataTable
 * @param {object} data    需要设置的数据信息，必须包含rows或者pages属性
 * @param {array} [data.rows]    数据信息中的行信息数组
 * @param {array} [data.pages]    数据信息中的page对象数组
 * @param {number} [data.pageIndex=DataTable对象当前的页码]    数据信息中的当前页码
 * @param {number} [data.pageSize=DataTable对象当前的每页显示条数]    数据信息中的每页显示条数
 * @param {number} [data.totalPages=DataTable对象当前的总页数]    数据信息中的总页数
 * @param {number} [data.totalRow=如果存在rows则为rows的长度，否则为DataTable对象当前的总条数]    数据信息中的总条数
 * @param {number} [data.select]    数据信息中的选中行行号
 * @param {number} [data.focus]    数据信息中的focus行行号
 * @param {object} options 设置数据时的配置参数
 * @param {boolean} options.unSelect=false 是否默认选中第一行，如果为true则不选中第一行，否则选中第一行
 * @example
 * // 不包含分页的情况
 * var data = {
 *    pageIndex:0,
 *    pageSize:5,
 *    totalPages:5,
 *    totalRow:22,
 *    rows:[{
 *      id:'r41201', // 如果需要添加
 *      status:'nrm', // 如果需要添加
 *      data:{
 *          field1:'value1',
 *          field2:'value2'
 *        }
 *    },{
 *      id:'r41202',
 *      status:'nrm',
 *      data:{
 *          field1:'value11',
 *          field2:'value21'
 *        }
 *    },...],
 *    select:[0]
 * }
 * // 包含分页的情况
 * var data = {
 *    pageIndex:0,
 *    pageSize:5,
 *    totalPages:5,
 *    totalRow:22,
 *    pages:[{
 *      index: 0,
 *      select: [],
 *      current: -1,
 *      rows:[{
 *        id:'r41201', // 如果需要添加
 *        status:'nrm', // 如果需要添加
 *        data:{
 *          field1:'value1',
 *          field2:'value2'
 *        }
 *      },{
 *        id:'r41202',
 *        status:'nrm',
 *        data:{
 *          field1:'value11',
 *          field2:'value21'
 *        }
 *      },...]
 *    },...],
 * }
 * var op = {
 *     unSelect:true
 * }
 * datatable.setData(data,op)
 */
const setData = function(data, options) {
    if (data.pageIndex || data.pageIndex === 0) {
        var newIndex = data.pageIndex;
    } else {
        var newIndex = this.pageIndex();
    }
    if (data.pageSize || data.pageSize === 0) {
        var newSize = data.pageSize;
    } else {
        var newSize = this.pageSize();
    }
    if (data.totalPages || data.totalPages === 0) {
        var newTotalPages = data.totalPages;
    } else {
        var newTotalPages = this.totalPages();
    }
    if (data.totalRow || data.totalRow === 0) {
        var newTotalRow = data.totalRow;
    } else {
        if (data.rows)
            var newTotalRow = data.rows.length;
        else
            var newTotalRow = this.totalRow();
    }
    var select, focus, unSelect = options ? options.unSelect : false;

    this.pageIndex(newIndex);
    this.pageSize(newSize);

    this.pageCache = data.pageCache || this.pageCache;
    if (this.pageCache === true) {
        this.updatePages(data.pages);
        if (newIndex != this.pageIndex()) {
            this.setCurrentPage(newIndex, true);
            this.totalPages(newTotalPages);
            this.totalRow(newTotalRow + this.newCount);
            return;
        } else {
            // 首先删除数据，然后将当前页数据插入
            this.removeAllRows();
            select = this.getPage(newIndex).selectedIndices;
            focus = this.getPage(newIndex).focus;
            var rows = this.setRows(this.getPage(newIndex).rows, options);
            this.getPage(newIndex).rows = rows;
        }
        // 后台传入totalPages及totalRow才进行更新
        if (data.totalPages) {
            this.totalPages(data.totalPages);
        }
        if (data.totalRow || data.totalRow === 0) {
            this.totalRow(data.totalRow + this.newCount);
        }
    } else {
        select = data.select || (!unSelect ? [0] : []);
        focus = data.focus !== undefined ? data.focus : data.current;
        this.setRows(data.rows, options);
        this.totalPages(newTotalPages);
        this.totalRow(newTotalRow);
    }



    this.updateSelectedIndices();

    if (select && select.length > 0 && this.rows().length > 0)
        this.setRowsSelect(select);
    if (focus !== undefined && this.getRow(focus))
        this.setRowFocus(focus);
};


/**
 * 设置对应行对应字段的值
 * @memberof DataTable
 * @param {string} fieldName 需要设置的字段
 * @param {string} value     需要设置的值
 * @param {u.row} [row=当前行] 需要设置的u.row对象，
 * @param {*} [ctx]        自定义属性，在valuechange监听传入对象中可通过ctx获取此处设置
 * @example
 * datatable.setValue('filed1','value1') //设置当前行字段值
 * var row = datatable.getRow(1)
 * datatable.setValue('filed1','value1',row) //设置在指定行字段值
 * datatable.setValue('filed1','value1',row,'ctx') //设置在指定行字段值，同时传入自定义数据
 */
const setValue = function(fieldName, value, row, ctx) {
    if (arguments.length === 1) {
        value = fieldName;
        fieldName = '$data';
    }

    row = row ? row : this.getCurrentRow();
    if (row)
        row.setValue(fieldName, value, ctx);
};

/**
 * 重置所有行的数据至nrm状态时的数据
 */
const resetAllValue = function() {
    var rows = new Array();
    rows = rows.concat(this.rows());
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        this.resetValueByRow(row);
    }
};

/**
 * 根据row对象重置数据至nrm状态时的数据
 * @param {u.row} row 需要重置数据的row对象
 */
const resetValueByRow = function(row) {
    if (row.status == Row.STATUS.NEW) {
        this.setRowsDelete(row);
    } else if (row.status == Row.STATUS.FALSE_DELETE) {
        row.status = Row.STATUS.NORMAL;
        var rows = [row];
        this.trigger(DataTable.ON_INSERT, {
            index: 0,
            rows: rows
        });
    } else if (row.status == Row.STATUS.UPDATE) {
        row.status = Row.STATUS.NORMAL;
        row.resetValue();
    }

};
const dataFunObj = {
    setData: setData,
    setValue: setValue,
    resetAllValue: resetAllValue,
    resetValueByRow: resetValueByRow
};

/**
 * Module : kero DataTable enable
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-08 09:59:01
 */

/**
 * 判断DataTable或指定字段是否可修改
 * @memberof DataTable
 * @param  {string}  [fieldName] 需要进行判断的字段值
 * @return {boolean}  DataTable/指定字段是否可修改
 * @example
 * datatable.isEnable() //获取datatable是否可修改
 * datatable.isEnable('field1') //获取字段field1是否可修改
 */
const isEnable = function(fieldName) {
    var fieldEnable = this.getMeta(fieldName, 'enable');
    if (typeof fieldEnable == 'undefined' || fieldEnable == null)
        fieldEnable = true;
    return fieldEnable && this.enable
};

/**
 * 设置DataTable是否可修改
 * @memberof DataTable
 * @param {boolean} enable true表示可修改，否则表示不可修改
 * @example
 * datatable.setEnable(true)
 */
const setEnable = function(enable) {
    if (this.enable == enable) return
    //当传入的参数不为false时，默认enable为true
    if (enable === false) {
        enable = false;
    } else {
        enable = true;
    }
    this.enable = enable;
    this.enableChange(-this.enableChange());
    this.trigger(DataTable.ON_ENABLE_CHANGE, {
        enable: this.enable
    });
};

const enableFunObj = {
    isEnable: isEnable,
    setEnable: setEnable
};

/**
 * Module : kero DataTable getCurrent
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-08 09:59:01
 */


/**
 * 获取DataTable对象的当前行
 * @memberof DataTable
 * @return {null|u.Row} DataTable对象的当前行
 * @example
 * datatable.getCurrentRow()
 */
const getCurrentRow = function() {
    if (this.focusIndex() != -1)
        return this.getFocusRow()
    var index = this.getSelectedIndex();
    if (index == -1)
        return null
    else
        return this.getRow(index)
};
/**
 * 获取DataTable对象的当前行对应的index
 * @memberof DataTable
 * @return {number} DataTable对象的当前行对应的index
 * @example
 * datatable.getCurrentIndex()
 */
const getCurrentIndex = function() {
    if (this.focusIndex() != -1)
        return this.focusIndex()
    var index = this.getSelectedIndex();
    if (index == -1)
        return -1
    else
        return index
};

const getCurrentFunObj = {
    getCurrentRow: getCurrentRow,
    getCurrentIndex: getCurrentIndex
};

/**
 * Module : kero DataTable getData
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-07-30 14:34:01
 */

/**
 * 获取DataTable的数据信息
 * @memberof DataTable
 * @return {array} 数据信息对应的数组，每项对应一条数据
 * @example
 * datatable.getData()
 */
const getData = function() {
    var datas = [],
        rows = this.rows();
    for (var i = 0; i < rows.length; i++) {
        datas.push(rows[i].getData());
    }
    return datas
};


// 将page转为row对象格式
const page2data = function(page, pageIndex) {
    var data = {};
    data.focus = page.focus;
    data.index = pageIndex;
    data.select = page.selectedIndices;
    return data;
};

/**
 * 按照特定规则获取数据
 * @memberof DataTable
 * @param  {string} rule
 * DataTable.SUBMIT.current('current') ：当前选中行
 * DataTable.SUBMIT.focus('focus') ：当前focus行
 * DataTable.SUBMIT.all('all') ：所有行
 * DataTable.SUBMIT.select('select') ：当前页选中行
 * DataTable.SUBMIT.change('change') ：发生改变的行
 * DataTable.SUBMIT.empty('empty') ：不获取数据，返回空数组
 * DataTable.SUBMIT.allSelect('allSelect') ：所有页选中行
 * DataTable.SUBMIT.allPages('allPages') ：所有页的数据
 * @return {array}      按照规则获取到的数据信息
 * @example
 * datatable.getDataByRule(‘all’)
 */

const getDataByRule = function(rule) {
    var returnData = {},
        datas = null,
        rows;
    returnData.meta = this.meta;
    returnData.params = this.params;
    rule = rule || DataTable.SUBMIT.current;
    // 存在多页及不存在多页分开处理
    if (this.pageCache) {
        var pages = this.getPages();
        if (rule == DataTable.SUBMIT.current || rule == DataTable.SUBMIT.focus) {
            datas = [];
            var pageIndex = this.pageIndex();
            var currPage = pages[pageIndex];
            if (currPage) {
                var currIndex = this.focusIndex();
                if (rule == DataTable.SUBMIT.current) {
                    if (currIndex == -1)
                        currIndex = this.getSelectedIndex();
                }
                var data = page2data(currPage, pageIndex);
                data.rows = [];
                for (var i = 0, count = currPage.rows.length; i < count; i++) {
                    var row = currPage.rows[i].getData();
                    if (i != currIndex)
                        row.data = {};
                    data.rows.push(row);
                }
                datas.push(data);
            }
        } else if (rule == DataTable.SUBMIT.all || rule == DataTable.SUBMIT.allPages) {
            datas = [];
            for (var i = 0; i < pages.length; i++) {
                var currPage = pages[i];
                var data = page2data(currPage, i);
                data.rows = [];
                for (var i = 0; i < currPage.rows.length; i++) {
                    data.rows.push(currPage.rows[i].getData());
                }
                datas.push(data);
            }
        } else if (rule == DataTable.SUBMIT.select) {
            datas = [];
            var pageIndex = this.pageIndex();
            var currPage = pages[pageIndex];
            if (currPage) {
                var data = page2data(currPage, pageIndex);
                data.rows = [];
                for (var i = 0, count = currPage.rows.length; i < count; i++) {
                    var row = currPage.rows[i].getData();
                    if (data.select.indexOf(i) < 0)
                        row.data = {};
                    data.rows.push(row);
                }
                datas.push(data);
            }
        } else if (rule == DataTable.SUBMIT.allSelect) {
            datas = [];
            for (var i = 0; i < pages.length; i++) {
                var currPage = pages[i];
                var data = page2data(currPage, i);
                data.rows = [];
                for (var j = 0, count = currPage.rows.length; j < count; j++) {
                    var row = currPage.rows[j].getData();
                    if (data.select.indexOf(j) < 0)
                        row.data = {};
                    data.rows.push(row);
                }
                datas.push(data);
            }
        } else if (rule == DataTable.SUBMIT.change) {
            datas = [];
            for (var i = 0; i < pages.length; i++) {
                var currPage = pages[i];
                var data = page2data(currPage, i);
                data.rows = [];
                for (var j = 0, count = currPage.rows.length; j < count; j++) {
                    var row = currPage.rows[j].getData();
                    if (row.status == Row.STATUS.NORMAL) {
                        row.data = {};
                    }
                    data.rows.push(row);
                }
                datas.push(data);
            }
        } else if (rule === DataTable.SUBMIT.empty) {
            datas = [];
        }
        if (pages.length < 1 || !pages[this.pageIndex()]) {
            datas = [{
                index: this.pageIndex(),
                select: [],
                focus: -1,
                rows: []
            }];
        }
        returnData.pages = datas;
    } else {
        if (rule == DataTable.SUBMIT.current) {
            datas = [];
            var currIndex = this.focusIndex();
            if (currIndex == -1)
                currIndex = this.getSelectedIndex();
            rows = this.rows();
            for (var i = 0, count = rows.length; i < count; i++) {
                if (i == currIndex)
                    datas.push(rows[i].getData());
                else
                    datas.push(rows[i].getEmptyData());
            }

        } else if (rule == DataTable.SUBMIT.focus) {
            datas = [];
            rows = this.rows();
            for (var i = 0, count = rows.length; i < count; i++) {
                if (i == this.focusIndex())
                    datas.push(rows[i].getData());
                else
                    datas.push(rows[i].getEmptyData());
            }
        } else if (rule == DataTable.SUBMIT.all) {
            datas = this.getData();
        } else if (rule == DataTable.SUBMIT.select) {
            datas = this.getSelectedDatas(true);
        } else if (rule == DataTable.SUBMIT.change) {
            datas = this.getChangedDatas();
        } else if (rule === DataTable.SUBMIT.empty) {
            datas = [];
        }

        returnData.rows = datas;
        returnData.select = this.getSelectedIndexs();
        returnData.focus = this.getFocusIndex();
    }




    returnData.pageSize = this.pageSize();
    returnData.pageIndex = this.pageIndex();
    returnData.isChanged = this.isChanged();
    returnData.master = this.master;
    returnData.pageCache = this.pageCache;
    return returnData
};


/**
 * 根据索引获取指定行数据信息
 * @memberof DataTable
 * @param  {number} index 需要获取的数据信息的索引
 * @return {object}      获取到的指定行数据信息
 * @example
 * datatable.getRow(1)
 */
const getRow = function(index) {
    //return this.rows()[index]   //modify by licza.   improve performance
    return this.rows.peek()[index]
};

// 获取子表的数据行
const getChildRow = function(obj) {
    var fullField = obj.fullField,
        index = obj.index,
        row = null;
    if (parseInt(index) > -1) {
        if ((index + '').indexOf('.') > 0) {
            var fieldArr = fullField.split('.');
            var indexArr = index.split('.');
            var nowDataTable = this;
            var nowRow = null;
            for (var i = 0; i < indexArr.length; i++) {
                nowRow = nowDataTable.getRow(indexArr[i]);
                if (i < indexArr.length - 1) {
                    if (nowRow) {
                        nowDataTable = nowRow.getValue(fieldArr[i]);
                    } else {
                        nowRow = null;
                        break;
                    }
                }
            }
            row = nowRow;
        } else {
            row = this.getRow(index);
        }
    }
    return row;
};

/**
 * 根据rowid获取Row对象
 * @memberof DataTable
 * @param {string} rowid 需要获取的Row对应的rowid
 * @returns {Row}
 * @example
 * datatable.getRowByRowId('rowid')
 */
const getRowByRowId = function(rowid) {
    var rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].rowId == rowid)
            return rows[i]
    }
    return null
};

/**
 * 获取Row对象对应的索引
 * @memberof DataTable
 * @param {u.Row} 需要获取索引的row对象
 * @returns {*}
 * @example
 * var row = datatable.getRow(1)
 * datatable.getRowIndex(row) // 1
 */
const getRowIndex = function(row) {
    var rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].rowId === row.rowId)
            return i;
    }
    return -1;
};

/**
 * 根据字段及字段值获取所有数据行
 * @memberof DataTable
 * @param  {string} field 需要获取行的对应字段
 * @param  {string} value 需要获取行的对应字段值
 * @return {array}      根据字段及字段值获取的所有数据行
 * @example
 * datatable.getRowsByField('field1','value1')
 */
const getRowsByField = function(field, value) {
    var rows = this.rows.peek();
    var returnRows = new Array();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].getValue(field) === value)
            returnRows.push(rows[i]);
    }
    return returnRows;
};

/**
 * 根据字段及字段值获取第一条数据行
 * @memberof DataTable
 * @param  {string} field 需要获取行的对应字段
 * @param  {string} value 需要获取行的对应字段值
 * @return {u.Row}      根据字段及字段值获取第一条数据行
 * @example
 * datatable.getRowByField('field1','value1')
 */
const getRowByField = function(field, value) {
    var rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].getValue(field) === value)
            return rows[i]
    }
    return null;
};

/**
 * 获取当前页的所有数据行
 * @memberof DataTable
 * @return {array} 获取到的数据行
 * @example
 * datatable.getAllRows()
 */
const getAllRows = function() {
    return this.rows.peek();
};

/**
 * 获取所有页的所有数据行
 * @memberof DataTable
 * @return {array} 获取到的数据行
 * @example
 * datatable.getAllPageRows()
 */
const getAllPageRows = function() {
    var datas = [],
        rows;
    for (var i = 0; i < this.totalPages(); i++) {
        rows = [];
        if (i == this.pageIndex()) {
            rows = this.getData();
        } else {
            var page = this.cachedPages[i];
            if (page) {
                rows = page.getData();
            }
        }
        for (var j = 0; j < rows.length; j++) {
            datas.push(rows[j]);
        }
    }
    return datas;
};

/**
 * 获取发生变化的数据信息
 * @memberof DataTable
 * @param  {boolean} withEmptyRow=false 未发生变化的数据是否使用空行代替，true表示以空行代替未发生变化行，false相反
 * @return {array}            发生变化的数据信息
 * @example
 * datatable.getChangedDatas()
 */
const getChangedDatas = function(withEmptyRow) {
    var datas = [],
        rows = this.rows();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i] && rows[i].status != Row.STATUS.NORMAL) {
            datas.push(rows[i].getData());
        } else if (withEmptyRow == true) {
            datas.push(rows[i].getEmptyData());
        }
    }
    return datas
};

/**
 * 获取发生改变的Row对象
 * @memberof DataTable
 * @return {array} 发生改变的Row对象
 * @example
 * datatable.getChangedRows()
 */
const getChangedRows = function() {
    var changedRows = [],
        rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i] && rows[i].status != Row.STATUS.NORMAL) {
            changedRows.push(rows[i]);
        }
    }
    return changedRows
};

const getDeleteRows = function() {
    var deleteRows = [],
        rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i] && rows[i].status == Row.STATUS.FALSE_DELETE) {
            deleteRows.push(rows[i]);
        }
    }
    return deleteRows
};

/**
 * 根据字段获取对应Row对象的字段值
 * @memberof DataTable
 * @param  {string} fieldName 需要获取的值对应的字段
 * @param  {u.Row} [row=默认为当前行]     对应的数据行
 * @return {string}     获取到的字段值
 * @example
 * datatable.getValue('field1')
 * var row = datatable.getRow(1)
 * datatable.getValue('field1',row)
 */
const getValue = function(fieldName, row) {
    row = row || this.getCurrentRow();
    if (row)
        return row.getValue(fieldName)
    else
        return ''
};


/**
 * 根据行号获取行索引
 * @memberof DataTable
 * @param {String} rowId
 * @example
 * datatable.getIndexByRowId('rowid')
 */
const getIndexByRowId = function(rowId) {
    var rows = this.rows();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].rowId == rowId)
            return i
    }
    return -1
};

/**
 * 获取所有行数据信息
 * @memberof DataTable
 * @return {array} 所有行数据信息
 * @example
 * datatable.getAllDatas()
 */
const getAllDatas = function() {
    var rows = this.getAllRows();
    var datas = [];
    for (var i = 0, count = rows.length; i < count; i++)
        if (rows[i])
            datas.push(rows[i].getData());
    return datas
};


/**
 * 根据索引获取rowid
 * @memberof DataTable
 * @param  {array} indices 需要获取rowid的索引值
 * @return {array}         获取到的rowid
 * @example
 * datatable.getRowIdsByIndices([1,2,5])
 */
const getRowIdsByIndices = function(indices) {
    var rowIds = [];
    for (var i = 0; i < indices.length; i++) {
        if (this.getRow(indices[i]))
            rowIds.push(this.getRow(indices[i]).rowId);
    }
    return rowIds
};
/**
 * 根据索引获取row
 * @memberof DataTable
 * @param  {array} indices 需要获取rowid的索引值
 * @return {array}         获取到的row
 * @example
 * datatable.getRowIdsByIndices([1,2,5])
 */
const getRowsByIndices = function(indices) {
    var rows = [];
    for (var i = 0; i < indices.length; i++) {
        rows.push(this.getRow(indices[i]));
    }
    return rows
};


const getDataFunObj = {
    getData: getData,
    getDataByRule: getDataByRule,
    getRow: getRow,
    getChildRow: getChildRow,
    getRowByRowId: getRowByRowId,
    getRowIndex: getRowIndex,
    getRowsByField: getRowsByField,
    getRowByField: getRowByField,
    getAllRows: getAllRows,
    getAllPageRows: getAllPageRows,
    getChangedDatas: getChangedDatas,
    getChangedRows: getChangedRows,
    getDeleteRows: getDeleteRows,
    getValue: getValue,
    getIndexByRowId: getIndexByRowId,
    getAllDatas: getAllDatas,
    getRowIdsByIndices: getRowIdsByIndices,
    getRowsByIndices: getRowsByIndices
};

/**
 * Module : kero dataTable getFocus
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-08 09:59:01
 */

/**
 * 获取焦点行
 * @memberof DataTable
 * @return {u.Row} 焦点行
 * @example
 * datatable.getFocusRow()
 */
const getFocusRow = function() {
    if (this.focusIndex() != -1)
        return this.getRow(this.focusIndex())
    else
        return null
};

/**
 * 获取焦点行索引
 * @memberof DataTable
 * @return {number} 焦点行索引
 * @example
 * datatable.getFocusIndex()
 */
const getFocusIndex = function() {
    return this.focusIndex()
};

const getFocusFunObj = {
    getFocusRow: getFocusRow,
    getFocusIndex: getFocusIndex
};

/**
 * Module : kero dataTable getMete
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-07-30 14:34:01
 */


/**
 * 获取meta信息
 * @memberof DataTable
 * @param  {string} [fieldName] 需要获取的字段
 * @param  {string} [key]       需要获取的字段指定meta信息
 * @return {object}           meta信息
 * @example
 * datatable.getMeta() // 获取所有meta信息
 * datatable.getMeta('field1') // 获取field1所有meta信息
 * datatable.getMeta('field1','type') // 获取field1的key信息
 */
const getMeta = function(fieldName, key) {
    if (arguments.length === 0)
        return this.meta;
    else if (arguments.length === 1)
        return this.meta[fieldName];

    if (this.meta[fieldName] && typeof this.meta[fieldName][key] !== 'undefined') {
        return this.meta[fieldName][key];
    } else {
        return null;
    }

};


/**
 * 获取当前行的meta信息，如果不存在当前行则获取DataTable的meta信息
 * @memberof DataTable
 * @param  {string} [fieldName] 需要获取的字段
 * @param  {string} [key]       需要获取的字段指定meta信息
 * @return {object}           meta信息
 * @example
 * datatable.getRowMeta() // 获取当前行所有meta信息
 * datatable.getRowMeta('field1') // 获取当前行field1所有meta信息
 * datatable.getRowMeta('field1','type') // 获取当前行field1的key信息
 */
const getRowMeta = function(fieldName, key) {
    var row = this.getCurrentRow();
    if (row)
        return row.getMeta(fieldName, key)
    else
        return this.getMeta(fieldName, key)
};

const getMetaFunObj = {
    getMeta: getMeta,
    getRowMeta: getRowMeta
};

/**
 * Module : kero dataTable getPage
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-08-01 14:34:01
 */


/**
 * 获取指定索引的Page对象
 * @memberof DataTable
 * @param  {number} pageIndex 需要获取的page对应的索引
 * @return {Page|-1}           获取到的Page对象，不存在则返回-1
 * @example
 * datatable.getPage(1)
 */
const getPage = function(pageIndex) {
    if (this.pageCache) {
        return this.cachedPages[pageIndex]
    }
    return -1;
};

/**
 * 获取所有的Page对象
 * @memberof DataTable
 * @return {array} 所有的Page对象
 * @example
 * datatable.getPages()
 */
const getPages = function() {
    if (this.pageCache) {
        return this.cachedPages
    }
    return [];
};

const getPageFunObj = {
    getPage: getPage,
    getPages: getPages
};

/**
 * Module : kero dataTable getParam
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-07-30 14:34:01
 */

/**
 * 获取Param参数值
 * @memberof DataTable
 * @param  {string} key Param对应的key
 * @return {*}     Param参数值
 * @example
 * datatable.getParam('param1')
 */
const getParam = function(key) {
    return this.params[key]
};

const getParamFunObj = {
    getParam: getParam
};

/**
 * Module : kero dataTable getSelect
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-01 14:34:01
 */


/**
 * 获取选中行索引，多选时，只返回第一个行索引
 * @memberof DataTable
 * @return {number} 选中行索引
 * @example
 * datatable.getSelectedIndex()
 */
const getSelectedIndex = function() {
    var selectedIndices = this.selectedIndices();
    if (selectedIndices == null || selectedIndices.length == 0)
        return -1
    return selectedIndices[0]
};

/**
 * 获取选中的所有行索引数组
 * @memberof DataTable
 * @return {array} 所有行索引数组
 * @example
 * datatable.getSelectedIndices()
 */
const getSelectedIndices = function() {
    var selectedIndices = this.selectedIndices();
    if (selectedIndices == null || selectedIndices.length == 0)
        return []
    return selectedIndices
};

// 兼容保留，不要用
const getSelectedIndexs = function() {
    return this.getSelectedIndices();
};

/**
 * 获取选中行的数据信息
 * @memberof DataTable
 * @param  {boolean} [withEmptyRow=false] 未选中的数据是否使用空行代替，true表示以空行代替未选中行，false相反
 * @return {array}            发生变化的数据信息
 * @example
 * datatable.getSelectedDatas()
 * datatable.getSelectedDatas(true)
 */
const getSelectedDatas = function(withEmptyRow) {
    var selectedIndices = this.selectedIndices();
    var datas = [];
    var sIndices = [];
    for (var i = 0, count = selectedIndices.length; i < count; i++) {
        sIndices.push(selectedIndices[i]);
    }
    var rows = this.rows();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (sIndices.indexOf(i) != -1)
            datas.push(rows[i].getData());
        else if (withEmptyRow == true)
            datas.push(rows[i].getEmptyData());
    }
    return datas
};

/**
 * 获取选中的Row对象
 * @memberof DataTable
 * @return {array} 选中的Row对象
 * @example
 * datatable.getSelectedRows()
 */
const getSelectedRows = function() {
    var selectedIndices = this.selectedIndices();
    var selectRows = [];
    var rows = this.rows.peek();
    var sIndices = [];
    for (var i = 0, count = selectedIndices.length; i < count; i++) {
        sIndices.push(selectedIndices[i]);
    }
    for (var i = 0, count = rows.length; i < count; i++) {
        if (sIndices.indexOf(i) != -1)
            selectRows.push(rows[i]);
    }
    return selectRows
};

const getSelectFunObj = {
    getSelectedIndex: getSelectedIndex,
    getSelectedIndices: getSelectedIndices,
    getSelectedIndexs: getSelectedIndexs,
    getSelectedDatas: getSelectedDatas,
    getSelectedRows: getSelectedRows
};

/**
 * Module : kero dataTable getSimpleData
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-08-01 14:34:01
 */

/**
 * 获取数据信息，只获取字段名与字段值
 * @memberof DataTable
 * @param  {object} [options] [description]
 * @param  {string} [options.type=all]    获取数据的规则
 * all：所有数据
 * current：当前行数据
 * focus：焦点行数据
 * select：选中行数据
 * change：发生改变的数据
 * @param  {array} [options.fields]    需要获取数据的字段名数组
 * @return {array}        获取到的数据信息
 * @example
 * datatable.getSimpleData() // 获取所有数据信息
 * datatable.getSimpleData({type:'current'}) // 获取当前行数据信息
 * datatable.getSimpleData({type:'current','fields':['filed1','field3']}) // 获取当前行field1和filed3数据信息
 */
const getSimpleData = function(options) {
    options = options || {};
    var rows, _rowData = [],
        type = options['type'] || 'all',
        fields = options['fields'] || null;

    if (type === 'all') {
        rows = this.rows.peek();
    } else if (type === 'current') {
        var currRow = this.getCurrentRow();
        rows = currRow == null ? [] : [currRow];
    } else if (type === 'focus') {
        var focusRow = this.getFocusRow();
        rows = focusRow == null ? [] : [focusRow];
    } else if (type === 'select') {
        rows = this.getSelectedRows();
    } else if (type === 'change') {
        rows = this.getChangedRows();
    }

    for (var i = 0; i < rows.length; i++) {
        _rowData.push(rows[i].getSimpleData({
            fields: fields
        }));
    }
    if (_rowData.length == 0) {
        _rowData = this.setSimpleDataReal; //云采提的#需求
    }
    return _rowData;
};



const getSimpleDataFunObj = {
    getSimpleData: getSimpleData
};

/**
 * Module : kero dataTable mete
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-07-30 14:34:01
 */


/**
 * 设置meta信息
 * @memberof DataTable
 * @param {string} fieldName 需要设置meta信息的字段名
 * @param {string} key       meta信息的key
 * @param {string} value     meta信息的值
 * @example
 * datatable.setMeta('filed1','type','string')
 */
const setMeta = function(fieldName, key, value) {
    if (!this.meta[fieldName])
        return;
    var oldValue = this.meta[fieldName][key];
    var currRow = this.getCurrentRow();
    this.meta[fieldName][key] = value;
    if (this.metaChange[fieldName + '.' + key])
        this.metaChange[fieldName + '.' + key](-this.metaChange[fieldName + '.' + key]());
    if (key == 'enable')
        this.enableChange(-this.enableChange());
    this.trigger(DataTable.ON_META_CHANGE, {
        eventType: 'dataTableEvent',
        dataTable: this.id,
        field: fieldName,
        meta: key,
        oldValue: oldValue,
        newValue: value
    });
    if (currRow && !currRow.getMeta(fieldName, key, false)) {
        this.trigger(fieldName + '.' + key + '.' + DataTable.ON_CURRENT_META_CHANGE, {
            eventType: 'dataTableEvent',
            dataTable: this.id,
            oldValue: oldValue,
            newValue: value
        });
    }
};


/**
 * 更新meta信息
 * @memberof DataTable
 * @param  {object} meta 需要更新的meta信息
 * @example
 * var metaObj = {supplier: {meta: {precision:'3', default: '0239900x', display:'显示名称'}}}
 * datatable.updateMeta(metaObj)
 */
const updateMeta = function(meta) {
    if (!meta) {
        return;
    }
    for (var fieldKey in meta) {
        for (var propKey in meta[fieldKey]) {
            var oldValue = this.meta[fieldKey][propKey];
            var newValue = meta[fieldKey][propKey];
            if (propKey === 'default') {
                if (!this.meta[fieldKey]['default']) {
                    this.meta[fieldKey]['default'] = {};
                }
                this.meta[fieldKey]['default'].value = meta[fieldKey][propKey];
            } else if (propKey === 'display') {
                if (!this.meta[fieldKey]['default']) {
                    this.meta[fieldKey]['default'] = {};
                }
                this.meta[fieldKey]['default'].display = meta[fieldKey][propKey];
            } else {
                this.meta[fieldKey][propKey] = meta[fieldKey][propKey];
            }
            if (this.metaChange[fieldKey + '.' + propKey])
                this.metaChange[fieldKey + '.' + propKey](-this.metaChange[fieldKey + '.' + propKey]());

            this.trigger(DataTable.ON_META_CHANGE, {
                eventType: 'dataTableEvent',
                dataTable: this.id,
                field: fieldKey,
                meta: propKey,
                oldValue: oldValue,
                newValue: newValue
            });
        }

    }
};




// 字段不存在时创建字段，fieldName为需要创建的字段
// options.meta为对应的meta信息
const createField = function(fieldName, options) {
    //字段不主动定义，则不创建
    if (this.root.strict == true)
        return;
    //有子表的情况不创建字段
    if (fieldName.indexOf('.') != -1) {
        var fNames = fieldName.split('.');
        var _name = fNames[0];
        for (var i = 0, count = fNames.length; i < count; i++) {
            if (this.meta[_name] && this.meta[_name]['type'] === 'child')
                return;
            if ((i + 1) < count)
                _name = _name + '.' + fNames[i + 1];
        }
    }
    if (!this.meta[fieldName]) {
        this.meta[fieldName] = {};
    }
    if (typeof options === 'object') {
        if (options['meta']) {
            for (var key in options['meta']) {
                //if (!this.meta[fieldName][key]){
                this.meta[fieldName]['meta'][key] = options['meta'][key];
                //}
            }
        } else {
            for (var key in options) {
                //if (!this.meta[fieldName][key]){
                this.meta[fieldName][key] = options[key];
                //}
            }
        }
    }
    // 在顶层dataTable上定义field信息
    if (this.root !== this) {
        var nsArr = this.ns.split('.');
        var _fieldMeta = this.root.meta;
        for (var i = 0; i < nsArr.length; i++) {
            _fieldMeta[nsArr[i]] = _fieldMeta[nsArr[i]] || {};
            _fieldMeta[nsArr[i]]['type'] = _fieldMeta[nsArr[i]]['type'] || 'child';
            _fieldMeta[nsArr[i]]['meta'] = _fieldMeta[nsArr[i]]['meta'] || {};
            _fieldMeta = _fieldMeta[nsArr[i]]['meta'];
        }
        if (!_fieldMeta[fieldName]) {
            _fieldMeta[fieldName] = {};
        }
        if (typeof options === 'object') {
            for (var key in options) {
                if (!_fieldMeta[fieldName][key]) {
                    _fieldMeta[fieldName][key] = options[key];
                }
            }
        }
    }

};

const metaFunObj = {
    setMeta: setMeta,
    updateMeta: updateMeta,
    createField: createField
};

/**
 * Module : kero dataTable page
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-08-01 14:34:01
 */

// 设置当前页
const setCurrentPage = function(pageIndex, notCacheCurrentPage) {
    var nowTotalRow = this.totalRow();
    if (pageIndex != this.pageIndex() && notCacheCurrentPage != true)
        this.cacheCurrentPage();
    this.pageIndex(pageIndex);
    var cachedPage = this.cachedPages[this.pageIndex()];
    if (cachedPage) {
        // 取当前页的选中行重设选中行
        var selectedIndices = cachedPage.selectedIndices;
        this.removeAllRows();
        this.setRows(cachedPage.rows);
        this.setRowsSelect(selectedIndices);
    }
    this.totalRow(nowTotalRow);
};


// 更新分页信息，通过fire调用，不对外提供
const updatePages = function(pages) {
    var pageSize = this.pageSize(),
        pageIndex = 0,
        page, r, row;
    var page, index, i, rows, focus, selectIndices, status, j, row, originRow;
    for (i = 0; i < pages.length; i++) {
        index = pages[i].index;
        rows = pages[i].rows;
        focus = pages[i].current;
        selectIndices = pages[i].select;
        status = pages[i].status;
        if (status === 'del') {
            this.cachedPages[index] = null;
            continue;
        }
        if (!this.cachedPages[index]) {
            page = new Page({
                parent: this
            });
            page.rows = rows;
            for (var j = 0; j < page.rows.length; j++) {
                page.rows[j].rowId = page.rows[j].id;
                delete page.rows[j].id;
            }
            this.cachedPages[index] = page;
            page.selectedIndices = selectIndices;
            page.focus = focus;
        } else {
            page = this.cachedPages[index];
            page.selectedIndices = selectIndices;
            page.focus = focus;
            for (var j = 0; j < rows.length; j++) {
                r = rows[j];
                if (!r.id)
                    r.id = Row.getRandomRowId();
                if (r.status == Row.STATUS.DELETE) {

                    var row = page.getRowByRowId(r.id);
                    if (row) {
                        // 针对后台不传回总行数的情况下更新总行数
                        var oldTotalRow = this.totalRow();
                        var newTotalRow = oldTotalRow - 1;
                        this.totalRow(newTotalRow);
                        if (row.status == Row.STATUS.NEW) {
                            this.newCount -= 1;
                            if (this.newCount < 0)
                                this.newCount = 0;
                        }
                    }
                    this.removeRowByRowId(r.id);
                    page.removeRowByRowId(r.id);

                } else {
                    row = page.getRowByRowId(r.id);
                    if (row) {
                        page.updateRow(row, r);
                        // if(row.status == Row.STATUS.NEW){
                        //     // 针对后台不传回总行数的情况下更新总行数
                        //     var oldTotalRow = this.totalRow();
                        //     var newTotalRow = oldTotalRow + 1;
                        //     this.totalRow(newTotalRow);
                        // }
                        if (row.status == Row.STATUS.NEW && r.status != Row.STATUS.NEW) {
                            this.newCount -= 1;
                            if (this.newCount < 0)
                                this.newCount = 0;
                        }
                        row.setStatus(Row.STATUS.NORMAL);
                        if (r.status == Row.STATUS.NEW) {
                            row.setStatus(Row.STATUS.NEW);
                        }
                    } else {
                        r.rowId = r.id;
                        delete r.id;
                        page.rows.push(r);
                        if (r.status != Row.STATUS.NEW) {
                            row.setStatus(Row.STATUS.NORMAL);
                        } else {
                            this.newCount += 1;
                        }
                        // 针对后台不传回总行数的情况下更新总行数
                        var oldTotalRow = this.totalRow();
                        var newTotalRow = oldTotalRow + 1;
                        this.totalRow(newTotalRow);
                    }
                }
            }
        }

    }
};

// 前端分页方法，不建议使用，建议在后端进行分页
const setPages = function(allRows) {
    var pageSize = this.pageSize(),
        pageIndex = 0,
        page;
    this.cachedPages = [];
    for (var i = 0; i < allRows.length; i++) {
        pageIndex = Math.floor(i / pageSize);
        if (!this.cachedPages[pageIndex]) {
            page = new Page({
                parent: this
            });
            this.cachedPages[pageIndex] = page;
        }
        page.rows.push(allRows[i]);
    }
    if (this.pageIndex() > -1)
        this.setCurrentPage(this.pageIndex());
    this.totalRow(allRows.length);
    this.totalPages(pageIndex + 1);
};

// 判断是否存在索引对应的Page
const hasPage = function(pageIndex) {
    return (this.pageCache && this.cachedPages[pageIndex]) ? true : false
};

// 清空cachedPages
const clearCache = function() {
    this.cachedPages = [];
};

// 更新当前分页的page对象
const cacheCurrentPage = function() {
    if (this.pageCache && this.pageIndex() > -1) {
        var page = new Page({
            parent: this
        });
        page.focus = this.getFocusIndex();
        page.selectedIndices = this.selectedIndices().slice();
        var rows = this.rows.peek();
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i].getData();
            r.rowId = r.id;
            delete r.id;
            page.rows.push(r);
        }
        this.cachedPages[this.pageIndex()] = page;
    }
};

//根据datatable的选中行更新每页的选中行
const updatePagesSelect = function() {
    var selectRows = this.getSelectedRows();
    var pages = this.getPages();
    for (var i = 0; i < pages.length; i++) {
        var rows = pages[i].rows;
        var selectedIndices = [];
        for (var j = 0; j < selectRows.length; j++) {
            var nowSelectRow = selectRows[j];
            for (var k = 0; k < rows.length; k++) {
                var row = rows[k];
                if (nowSelectRow == row) {
                    selectedIndices.push(k);
                    break;
                }
            }
        }
        pages[i].selectedIndices = selectedIndices;
    }

};


//根据datatable的rows更新当前页的rows
const updatePageRows = function() {
    if (this.pageCache) {
        var pageIndex = this.pageIndex();
        var page = this.getPages()[pageIndex];
        if (page) {
            page.rows = this.rows();
        }
    }
};

//根据datatable的选中行更新page的选中行
const updatePageSelect = function() {
    if (this.pageCache) {
        var pageIndex = this.pageIndex();
        var page = this.getPages()[pageIndex];
        if (page) {
            var selectedIndices = this.selectedIndices().slice();
            page.selectedIndices = selectedIndices;
        }
    }
};

//根据datatable的focus更新page的focus
const updatePageFocus = function() {
    if (this.pageCache) {
        var pageIndex = this.pageIndex();
        var page = this.getPages()[pageIndex];
        if (page) {
            page.focus = this.getFocusIndex();
        }
    }
};

// 根据datatable更新page对象
const updatePageAll = function() {
    this.updatePageRows();
    this.updatePageSelect();
    this.updatePageFocus();
};


const pageFunObj = {
    setCurrentPage: setCurrentPage,
    updatePages: updatePages,
    setPages: setPages,
    hasPage: hasPage,
    clearCache: clearCache,
    cacheCurrentPage: cacheCurrentPage,
    updatePagesSelect: updatePagesSelect,
    updatePageRows: updatePageRows,
    updatePageSelect: updatePageSelect,
    updatePageFocus: updatePageFocus,
    updatePageAll: updatePageAll
};

/**
 * Module : kero dataTable param
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-07-30 14:34:01
 */

/**
 * 增加Param参数
 * @memberof DataTable
 * @param {string} key   需要增加的key值
 * @param {*} value 需要增加的具体指
 * @example
 * datatable.addParam('precision','3')
 */
const addParam = function(key, value) {
    this.params[key] = value;
};

/**
 * 增加多个Param参数
 * @memberof DataTable
 * @param {object} params 需要增加的Param对象
 * @example
 * var paramsObj = {
 *  'precision':'3',
 *  'default':'1.234'
 * }
 * datatable.addParams(paramsObj)
 */
const addParams = function(params) {
    for (var key in params) {
        this.params[key] = params[key];
    }
};


const paramFunObj = {
    addParam: addParam,
    addParams: addParams
};

/**
 * Module : kero dataTable ref
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-01 14:34:01
 */

/**
 * 为选中行绑定监听，当选中行发生改变时触发对应方法
 * @memberof DataTable
 * @param {string} fieldName 绑定的字段名
 * @example
 * datatable.refSelectedRows().subscribe(function(){})
 */
const refSelectedRows = function() {
    return ko.pureComputed({
        read: function() {
            var ins = this.selectedIndices() || [];
            var rs = this.rows();
            var selectedRows = [];
            for (var i = 0; i < ins.length; i++) {
                selectedRows.push(rs[i]);
            }
            return selectedRows
        },
        owner: this
    })
};


/**
 * 为某个字段绑定监听，当字段发生改变时触发对应方法
 * @memberof DataTable
 * @param {string} fieldName 绑定的字段名
 * @example
 * datatable.ref('field1').subscribe(function(){})
 */
const ref = function(fieldName) {
    this.createField(fieldName);
    if (!this.valueChange[fieldName])
        this.valueChange[fieldName] = ko.observable(1);
    return ko.pureComputed({
        read: function() {
            this.valueChange[fieldName]();
            this.currentRowChange();
            var row = this.getCurrentRow();
            if (row) {
                return row.getChildValue(fieldName)
            } else
                return ''
        },
        write: function(value) {
            var row = this.getCurrentRow();
            if (row)
                row.setChildValue(fieldName, value);
        },
        owner: this
    })
};

/**
 * 绑定字段属性，当字段属性发生改变时触发对应方法
 * @memberof DataTable
 * @param {string} fieldName 绑定的字段名
 * @param {string} key 绑定的属性key
 * @example
 * datatable.refMeta('field1','type').subscribe(function(){})
 */
const refMeta = function(fieldName, key) {
    if (!this.metaChange[fieldName + '.' + key])
        this.metaChange[fieldName + '.' + key] = ko.observable(1);
    return ko.pureComputed({
        read: function() {
            this.metaChange[fieldName + '.' + key]();
            this.currentRowChange();
            return this.getMeta(fieldName, key)
        },
        write: function(value) {
            this.setMeta(fieldName, key, value);
        },
        owner: this
    })
};

/**
 * 绑定当前行的字段属性，当字段属性发生改变时触发对应方法
 * @memberof DataTable
 * @param {string} fieldName 绑定的字段名
 * @param {string} key 绑定的属性key
 * @example
 * datatable.refRowMeta('field1','type').subscribe(function(){})
 */
const refRowMeta = function(fieldName, key) {
    if (!this.metaChange[fieldName + '.' + key])
        this.metaChange[fieldName + '.' + key] = ko.observable(1);
    return ko.pureComputed({
        read: function() {
            this.metaChange[fieldName + '.' + key]();
            this.currentRowChange();
            var row = this.getCurrentRow();
            if (row)
                return row.getMeta(fieldName, key)
            else
                return this.getMeta(fieldName, key)
        },
        write: function(value) {
            var row = this.getCurrentRow();
            if (row)
                row.setMeta(fieldName, value);
        },
        owner: this
    })
};

/**
 * 绑定字段是否可修改属性，当字段可修改属性发生改变时触发对应方法
 * @memberof DataTable
 * @param {string} fieldName 绑定的字段名
 * @example
 * datatable.refEnable('field1').subscribe(function(){})
 */
const refEnable = function(fieldName) {
    return ko.pureComputed({
        //enable优先级： dataTable.enable >  row上的enable >  field中的enable定义
        read: function() {
            this.enableChange();
            if (!fieldName)
                return this.enable;
            var fieldEnable = this.getRowMeta(fieldName, 'enable');
            if (typeof fieldEnable == 'undefined' || fieldEnable == null)
                fieldEnable = true;
            return fieldEnable && this.enable
        },
        owner: this
    })
};

const refFunObj = {
    refSelectedRows: refSelectedRows,
    ref: ref,
    refMeta: refMeta,
    refRowMeta: refRowMeta,
    refEnable: refEnable
};

/**
 * Module : kero dataTable util
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-08 09:59:01
 */
// 判断DataTable对象是否发生了改变
const isChanged = function() {
    var rows = this.getAllRows();
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].status != Row.STATUS.NORMAL)
            return true
    }
    return false
};

// 将Row对象转为索引数组或者将Row对象数组转为索引数组
const _formatToIndicesArray = function(dataTableObj, indices) {
    if (typeof indices == 'string' || typeof indices == 'number') {
        indices = [indices];
    } else if (indices instanceof Row) {
        indices = [dataTableObj.getIndexByRowId(indices.rowId)];
    } else if (isArray(indices) && indices.length > 0 && indices[0] instanceof Row) {
        for (var i = 0; i < indices.length; i++) {
            indices[i] = dataTableObj.getIndexByRowId(indices[i].rowId);
        }
    }
    return indices;
};

const utilFunObj = {
    isChanged: isChanged,
    _formatToIndicesArray: _formatToIndicesArray

};

/**
 * Module : kero dataTable removeRow
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-01 14:34:01
 */
/**
 * 根据rowId删除指定行
 * @memberof DataTable
 * @param  {string} rowId 需要删除行的rowId
 * @example
 * datatable.removeRowByRowId('rowid1')
 */
const removeRowByRowId = function(rowId) {
    var index = this.getIndexByRowId(rowId);
    if (index != -1)
        this.removeRow(index);
};

/**
 *根据索引删除指定行
 * @memberof DataTable
 * @param  {number} index 需要删除行的索引
 * @example
 * datatable.removeRow(1)
 */
const removeRow = function(index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId);
    }
    this.removeRows([index]);
};

/**
 * 删除所有行
 * @memberof DataTable
 * @example
 * datatable.removeAllRows();
 */
const removeAllRows = function() {
    this.rows([]);
    this.selectedIndices([]);
    this.focusIndex(-1);
    this.trigger(DataTable.ON_DELETE_ALL);
    this.updateCurrIndex();
};

/**
 * 根据索引数据删除多条数据行
 * @memberof DataTable
 * @param  {array} indices 需要删除的数据行对应数组，数组中既可以是索引也可以是row对象
 * @example
 * datatable.removeRows([1,2])
 * datatable.removeRows([row1,row2])
 */
const removeRows = function(indices) {
    this.setRowsDelete(indices);
};


/**
 * 清空datatable的所有数据以及分页数据以及index
 * @memberof DataTable
 * @example
 * datatable.clear()
 */
const clear = function() {
    this.removeAllRows();
    this.cachedPages = [];
    this.totalPages(1);
    this.pageIndex(0);
    this.focusIndex(-1);
    this.selectedIndices([]);
};

const removeRowFunObj = {
    removeRowByRowId: removeRowByRowId,
    removeRow: removeRow,
    removeAllRows: removeAllRows,
    removeRows: removeRows,
    clear: clear
};

/**
 * Module : kero dataTable row
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-08-01 14:34:01
 */
// 添加数据，建议使用setData或者setSimpleData
const setRows = function(rows, options) {
    var insertRows = [],
        _id;
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        _id = r.rowId || r.id;
        if (!_id)
            _id = Row.getRandomRowId();
        if (r.status == Row.STATUS.DELETE) {
            this.removeRowByRowId(_id);
        } else {
            var row = this.getRowByRowId(_id);
            if (row) {
                row.updateRow(r);
                if (!isEmptyObject(r.data)) {
                    this.trigger(DataTable.ON_UPDATE, {
                        index: i,
                        rows: [row]
                    });
                    if (row == this.getCurrentRow()) {
                        this.currentRowChange(-this.currentRowChange());
                        row.currentRowChange(-row.currentRowChange());
                        this.trigger(DataTable.ON_CURRENT_UPDATE, {
                            index: i,
                            rows: [row]
                        });
                    } else {
                        row.currentRowChange(-row.currentRowChange());
                    }
                }

            } else {
                row = new Row({
                    parent: this,
                    id: _id
                });
                row.setData(rows[i], null, options);
                insertRows.push(row);
            }
            // 如果r对象中存在状态则更新状态为返回的状态
            if (r.status) {
                row.setStatus(r.status);
            }
        }
    }
    if (insertRows.length > 0)
        this.addRows(insertRows);
    return insertRows;
};


/**
 * 在最后位置添加一条数据行
 * @memberof DataTable
 * @param {u.Row} row 数据行
 * @example
 * var row1 = new Row({parent: datatable})
 * row1.setData({
 *  data:{
 *    field1: 'value1',
 *    field2: 'value2'
 *  }
 * })
 * datatable.addRow(row1)
 */
const addRow = function(row) {
    this.insertRow(this.rows().length, row);
    this.resetDelRowEnd();
};

const resetDelRowEnd = function() {
    for (var i = this.rows().length - 1; i > -1; i--) {
        var row = this.rows()[i];
        if (row.status == Row.STATUS.DELETE || row.status == Row.STATUS.FALSE_DELETE) {
            this.rows().splice(i, 1);
            this.rows().push(row);
        }
    }
};

/**
 * 在最后位置添加多条数据行
 * @memberof DataTable
 * @param {array} rows  数据行数组
 * @example
 * var row1 = new Row({parent: datatable})
 * row1.setData({
 *  data:{
 *    field1: 'value1',
 *    field2: 'value2'
 *  }
 * })
 * var row2 = new Row({parent: datatable})
 * row2.setData({
 *  data:{
 *    field1: 'value11',
 *    field2: 'value22'
 *  }
 * })
 * datatable.addRows([row1,row2])
 */
const addRows = function(rows) {
    this.insertRows(this.rows().length, rows);
    this.resetDelRowEnd();
};

/**
 * 在指定索引位置添加一条数据行
 * @memberof DataTable
 * @param  {number} index 指定索引
 * @param  {u.Row} row   数据行
 * @example
 * var row1 = new Row({parent: datatable})
 * row1.setData({
 *  data:{
 *    field1: 'value1',
 *    field2: 'value2'
 *  }
 * })
 * datatable.insertRow(1,row1)
 */
const insertRow = function(index, row) {
    if (!row) {
        row = new Row({
            parent: this
        });
    }
    this.insertRows(index, [row]);
};

/**
 * 在指定索引位置添加多条数据行
 * @memberof DataTable
 * @param  {number} index 指定索引
 * @param  {array} rows  数据行数组
 * var row1 = new Row({parent: datatable})
 * row1.setData({
 *  data:{
 *    field1: 'value1',
 *    field2: 'value2'
 *  }
 * })
 * var row2 = new Row({parent: datatable})
 * row2.setData({
 *  data:{
 *    field1: 'value11',
 *    field2: 'value22'
 *  }
 * })
 * datatable.insertRows(1,[row1,row2])
 */
const insertRows = function(index, rows) {
    var args = [index, 0];
    for (var i = 0; i < rows.length; i++) {
        args.push(rows[i]);
    }
    this.rows.splice.apply(this.rows, args);

    this.updateSelectedIndices(index, '+', rows.length);
    this.updateFocusIndex(index, '+', rows.length);
    this.updatePageAll();
    this.trigger(DataTable.ON_INSERT, {
        index: index,
        rows: rows
    });
    if (this.ns) {
        if (this.root.valueChange[this.ns])
            this.root.valueChange[this.ns](-this.root.valueChange[this.ns]());
    }
};

/**
 * 创建空行
 * @memberof DataTable
 * @return {u.Row} 空行对象
 * @example
 * datatable.createEmptyRow();
 * datatable.createEmptyRow({unSelect:true})
 */
const createEmptyRow = function(options) {
    var r = new Row({
        parent: this
    });
    this.addRow(r);
    var unSelect = options ? options.unSelect : false;
    if (!unSelect) {
        if (!this.getCurrentRow())
            this.setRowSelect(r);
    }
    return r
};

const rowFunObj = {
    setRows: setRows,
    addRow: addRow,
    addRows: addRows,
    insertRow: insertRow,
    insertRows: insertRows,
    createEmptyRow: createEmptyRow,
    resetDelRowEnd: resetDelRowEnd
};

/***
 * Module : kero dataTable rowCurrent
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-08 09:59:01
 */



// 更新当前行对应索引
const updateCurrIndex = function() {
    var currentIndex = this.focusIndex() != -1 ? this.focusIndex() : this.getSelectedIndex();
    if (this._oldCurrentIndex != currentIndex) {
        this._oldCurrentIndex = currentIndex;
        this.trigger(DataTable.ON_CURRENT_ROW_CHANGE);
        this.currentRowChange(-this.currentRowChange());
        if (this.ns) {
            if (this.root.valueChange[this.ns])
                this.root.valueChange[this.ns](-this.root.valueChange[this.ns]());
        }
    }
};

const rowCurrentFunObj = {
    updateCurrIndex: updateCurrIndex
};

/**
 * Module : kero dataTable rowDelete
 * Desc: 不建议使用此库方法
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-01 14:34:01
 */
/***
 * 根据索引删除数据行
 * @param {number} index 需要删除数据行的索引
 */
const setRowDelete = function(index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId);
    }
    this.setRowsDelete([index]);
};

/***
 * 删除所有数据行
 */
const setAllRowsDelete = function() {
    var indices = new Array(this.rows().length);
    for (var i = 0; i < indices.length; i++) {
        indices[i] = i;
    }
    this.setRowsDelete(indices);
};

/***
 * 根据索引数组删除数据行
 * @param {Array} indices 需要删除数据行的索引数组
 */
const setRowsDelete = function(indices) {
    indices = utilFunObj._formatToIndicesArray(this, indices);
    indices = indices.sort(function(a, b) {
        return b - a;
    });
    var rowIds = this.getRowIdsByIndices(indices);
    var rows = this.getRowsByIndices(indices);
    var ros = this.rows();
    for (var i = 0; i < indices.length; i++) {
        var row = this.getRow(indices[i]);
        if (row.status == Row.STATUS.NEW || this.forceDel) {
            ros.splice(indices[i], 1);
        } else {
            row.setStatus(Row.STATUS.FALSE_DELETE);
            var temprows = ros.splice(indices[i], 1);
            ros.push(temprows[0]);
        }
        this.updateSelectedIndices(indices[i], '-');
        this.updateFocusIndex(indices[i], '-');
    }
    this.rows(ros);
    this.updateCurrIndex();
    this.trigger(DataTable.ON_DELETE, {
        falseDelete: true,
        indices: indices,
        rowIds: rowIds,
        rows: rows
    });

};

const rowDeleteFunObj = {
    setRowDelete: setRowDelete,
    setAllRowsDelete: setAllRowsDelete,
    setRowsDelete: setRowsDelete
};

/**
 * Module : kero dataTable rowSelect
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-01 14:34:01
 */
/**
 * 设置所有行选中
 * @memberof DataTable
 * @example
 * datatable.setAllRowsSelect()
 */
const setAllRowsSelect = function() {
    var indices = new Array(this.rows().length);
    for (var i = 0; i < indices.length; i++) {
        indices[i] = i;
    }
    this.setRowsSelect(indices);
    this.allSelected(true);
    this.trigger(DataTable.ON_ROW_ALLSELECT, {});
};

/**
 * 根据索引设置选中行，清空之前已选中的所有行
 * @memberof DataTable
 * @param {number} index 需要选中行的索引
 * @example
 * datatable.setRowSelect(1)
 */
const setRowSelect = function(index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId);
    }
    this.setRowsSelect([index]);
    this.setRowFocus(this.getSelectedIndex());
};

/**
 * 根据索引数组设置选中行，清空之前已选中的所有行
 * @memberof DataTable
 * @param {array} indices 需要选中行的索引数组
 * @example
 * datatable.setRowsSelect([1,2])
 */
const setRowsSelect = function(indices) {
    indices = indices || -1;
    if (indices == -1) {
        this.setAllRowsUnSelect({
            quiet: true
        });
        return;
    }
    indices = utilFunObj._formatToIndicesArray(this, indices);
    var sIns = this.selectedIndices();
    if (isArray(indices) && isArray(sIns) && indices.join() == sIns.join()) {
        // 避免与控件循环触发
        return;
    }

    if (isArray(indices)) {
        var rowNum = this.rows().length;
        for (var i = 0; i < indices.length; i++) {
            if (indices[i] < 0 || indices[i] >= rowNum)
                indices.splice(i, 1);
        }
    }

    this.setAllRowsUnSelect({
        quiet: true
    });
    try {
        this.selectedIndices(indices);
    } catch (e) {

    }
    this.updatePageSelect();
    var rowIds = this.getRowIdsByIndices(indices);
    this.currentRowChange(-this.currentRowChange());
    this.trigger(DataTable.ON_ROW_SELECT, {
        indices: indices,
        rowIds: rowIds
    });
    this.updateCurrIndex();

};


/**
 * 根据索引添加选中行，不会清空之前已选中的行
 * @memberof DataTable
 * @param {number} index 需要选中行的索引
 * @example
 * datatable.addRowSelect(1)
 */
const addRowSelect = function(index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId);
    }
    this.addRowsSelect([index]);
};

/**
 * 根据索引数组添加选中行，不会清空之前已选中的行
 * @memberof DataTable
 * @param {array} indices 需要选中行的索引数组
 * @example
 * datatabel.addRowsSelect([1,2])
 */
const addRowsSelect = function(indices) {
    indices = utilFunObj._formatToIndicesArray(this, indices);
    var selectedIndices = this.selectedIndices().slice();
    var needTrigger = false;
    for (var i = 0; i < indices.length; i++) {
        var ind = indices[i],
            toAdd = true;
        for (var j = 0; j < selectedIndices.length; j++) {
            if (selectedIndices[j] == ind) {
                toAdd = false;
            }
        }
        //indices[i]存在并且大于-1
        if (toAdd && indices[i] > -1) {
            needTrigger = true;
            selectedIndices.push(indices[i]);
        }
    }
    this.selectedIndices(selectedIndices);
    this.updatePageSelect();
    var rowIds = this.getRowIdsByIndices(selectedIndices);
    if (needTrigger) {
        this.trigger(DataTable.ON_ROW_SELECT, {
            indices: selectedIndices,
            rowIds: rowIds
        });
    }
    this.updateCurrIndex();

};

/**
 * 全部取消选中
 * @memberof DataTable
 * @param {object} [options] 可选参数
 * @param {boolean} [options.quiet] 如果为true则不触发事件，否则触发事件
 * @example
 * datatable.setAllRowsUnSelect() // 全部取消选中
 * datatable.setAllRowsUnSelect({quiet:true}) // 全部取消选中,不触发事件
 */
const setAllRowsUnSelect = function(options) {
    this.selectedIndices([]);
    this.updatePageSelect();
    if (!(options && options.quiet)) {
        this.trigger(DataTable.ON_ROW_ALLUNSELECT);
    }
    this.updateCurrIndex();
    this.allSelected(false);
};

/**
 * 根据索引取消选中
 * @memberof DataTable
 * @param {number} index 需要取消选中的行索引
 * @example
 * datatable.setRowUnSelect(1)
 */
const setRowUnSelect = function(index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId);
    }
    this.setRowsUnSelect([index]);
};

/**
 * 根据索引数组取消选中
 * @memberof DataTable
 * @param {array} indices 需要取消选中的行索引数组
 * @example
 * datatable.setRowsUnSelect([1,2])
 */
const setRowsUnSelect = function(indices) {
    indices = utilFunObj._formatToIndicesArray(this, indices);
    var selectedIndices = this.selectedIndices().slice();

    // 避免与控件循环触发
    if (selectedIndices.indexOf(indices[0]) == -1) return;

    for (var i = 0; i < indices.length; i++) {
        var index = indices[i];
        var pos = selectedIndices.indexOf(index);
        if (pos != -1)
            selectedIndices.splice(pos, 1);
    }
    this.selectedIndices(selectedIndices);
    this.updatePageSelect();
    var rowIds = this.getRowIdsByIndices(indices);
    this.trigger(DataTable.ON_ROW_UNSELECT, {
        indices: indices,
        rowIds: rowIds
    });
    this.updateCurrIndex();
    this.allSelected(false);
};

/**
 * 当全部选中时取消选中，否则全部选中
 * @memberof DataTable
 */
const toggleAllSelect = function() {
    if (this.allSelected()) {
        this.setAllRowsUnSelect();
    } else {
        this.setAllRowsSelect();
    }

};


/***
 * 数据行发生改变时更新focusindex
 * @memberof DataTable
 * @param  {number} index 发生改变的数据行位置
 * @param  {string} type  +表示新增行，-表示减少行
 * @param  {number} num     新增/减少的行数
 */
const updateSelectedIndices = function(index, type, num) {
    if (!isNumber$1(num)) {
        num = 1;
    }
    var selectedIndices = this.selectedIndices().slice();
    if (selectedIndices == null || selectedIndices.length == 0)
        return
    for (var i = 0, count = selectedIndices.length; i < count; i++) {
        if (type == '+') {
            if (selectedIndices[i] >= index)
                selectedIndices[i] = parseInt(selectedIndices[i]) + num;
        } else if (type == '-') {
            if (selectedIndices[i] >= index && selectedIndices[i] <= index + num - 1) {
                selectedIndices.splice(i, 1);
            } else if (selectedIndices[i] > index + num - 1)
                selectedIndices[i] = selectedIndices[i] - num;
        }
    }
    this.selectedIndices(selectedIndices);
    this.updatePageSelect();
};
const rowSelectFunObj = {
    setAllRowsSelect: setAllRowsSelect,
    setRowSelect: setRowSelect,
    setRowsSelect: setRowsSelect,
    addRowSelect: addRowSelect,
    addRowsSelect: addRowsSelect,
    setAllRowsUnSelect: setAllRowsUnSelect,
    setRowUnSelect: setRowUnSelect,
    setRowsUnSelect: setRowsUnSelect,
    toggleAllSelect: toggleAllSelect,
    updateSelectedIndices: updateSelectedIndices
};

/**
 * Module : kero dataTable rowFocus
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-08 09:59:01
 */
/**
 * 设置焦点行
 * @memberof DataTable
 * @param {number|u.Row} index 行对象或者行index
 * @param {boolean} [quiet] 如果为true则不触发事件，否则触发事件
 * @param {boolean} [force] 如果为true当index行与已focus的行相等时，仍然触发事件，否则不触发事件
 * @example
 * datatable.setRowFocus(1) // 设置第二行为焦点行
 * datatable.setRowFocus(1,true) // 设置第二行为焦点行，不触发事件
 * datatable.setRowFocus(1,false,true) // 设置第二行为焦点行，如果当前焦点行为第二行，仍旧触发事件
 */
const setRowFocus = function(index, quiet, force) {
    var rowId = null;
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId);
        rowId = index.rowId;
    }
    if (index === -1 || (index === this.focusIndex() && !force)) {
        return;
    }
    this.focusIndex(index);
    if (quiet) {
        return;
    }
    this.currentRowChange(-this.currentRowChange());
    if (!rowId) {
        rowId = this.getRow(index).rowId;
    }
    this.trigger(DataTable.ON_ROW_FOCUS, {
        index: index,
        rowId: rowId
    });
    this.updateCurrIndex();
};


/**
 * 焦点行反选
 * @memberof DataTable
 * @example
 * datatable.setRowUnFocus()
 */
const setRowUnFocus = function() {
    this.currentRowChange(-this.currentRowChange());
    var indx = this.focusIndex(),
        rowId = null;
    if (indx !== -1) {
        rowId = this.getRow(indx).rowId;
    }
    this.trigger(DataTable.ON_ROW_UNFOCUS, {
        index: indx,
        rowId: rowId
    });
    this.focusIndex(-1);
    this.updateCurrIndex();
};

/***
 * 数据行发生改变时更新focusindex
 * @memberof DataTable
 * @param  {number} opIndex 发生改变的数据行位置
 * @param  {string} opType  +表示新增行，-表示减少行
 * @param  {number} num     新增/减少的行数
 *
 */
const updateFocusIndex = function(opIndex, opType, num) {
    if (!isNumber$1(num)) {
        num = 1;
    }
    if (opIndex <= this.focusIndex() && this.focusIndex() != -1) {
        if (opType === '+') {
            this.focusIndex(this.focusIndex() + num);
        } else if (opType === '-') {
            if (this.focusIndex() >= opIndex && this.focusIndex() <= opIndex + num - 1) {
                this.focusIndex(-1);
            } else if (this.focusIndex() > opIndex + num - 1) {
                this.focusIndex(this.focusIndex() - num);
            }
        }
    }
};

const rowFocusFunObj = {
    setRowFocus: setRowFocus,
    setRowUnFocus: setRowUnFocus,
    updateFocusIndex: updateFocusIndex
};

/**
 * Module : kero dataTable simpleData
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2016-08-01 14:34:01
 */
/**
 * 设置数据, 只设置字段值
 * @memberof DataTable
 * @param {array} data 数据信息
 * @param {boject} [options] 可配置参数
 * @param {boject} [options.unSelect=false] 是否默认选中第一行，如果为true则不选中第一行，否则选中第一行
 * @example
 * var data = [{
 *   filed1:'value1',
 *   field2:'value2'
 * },{
 *   filed1:'value11',
 *   field2:'value21'
 * }]
 * datatable.setSimpleData(data)
 * datatable.setSimpleData(data,{unSelect:true})
 */
const setSimpleData = function(data,options){
    this.removeAllRows();
    this.cachedPages = [];
    this.focusIndex(-1);
    this.selectedIndices([]);

    this.setSimpleDataReal = [];
    if (!data){
        this.setSimpleDataReal = data;
        // throw new Error("dataTable.setSimpleData param can't be null!");
        return;
    }

    var rows = [];
    if (!isArray(data))
        data = [data];
    for (var i =0; i< data.length; i++){
        var _data = data[i];
        /* 判断data中的字段在datatable中是否存在，如果不存在则创建 */
        // for(var f in _data){
        //     this.createField(f)
        // }
        if (typeof data[i] !== 'object')
            _data = {$data:data[i]};
        rows.push({
            status: Row.STATUS.NORMAL,
            data: _data
        });
    }
    var _data = {
        rows: rows
    };
    if(options) {
        if(typeof options.fieldFlag == 'undefined'){
            options.fieldFlag = true;
        }
    }
    this.setData(_data,options);
};


 /**
  * 追加数据, 只设置字段值
  * @memberof DataTable
  * @param {array} data 数据信息
  * @param {string} [status=nrm] 追加数据信息的状态，参照Row对象的状态介绍
  * @param {boject} [options] 可配置参数
  * @param {boject} [options.unSelect=false] 是否默认选中第一行，如果为true则不选中第一行，否则选中第一行
  * @example
  * var data = [{
  *   filed1:'value1',
  *   field2:'value2'
  * },{
  *   filed1:'value11',
  *   field2:'value21'
  * }]
  * datatable.addSimpleData(data,Row.STATUS.NEW)
  * datatable.addSimpleData(data, null, {unSelect:true})
  */
const addSimpleData = function(data, status, options){
    if (!data){
        throw new Error("dataTable.addSimpleData param can't be null!");
    }
    if (!isArray(data))
        data = [data];
    for (var i =0; i< data.length; i++){
        var r = this.createEmptyRow(options);
        r.setSimpleData(data[i],status);
    }

};

const simpleDataFunObj = {
	setSimpleData:setSimpleData,
	addSimpleData:addSimpleData
};

/**
 * Module : kero DataTable events
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-07-30 14:34:01
 */


/**
 * 为DataTable对象添加监听
 * @memberof DataTable
 * @param  {string|array|object}   name     针对不同用法分别对应监听名称、监听名称对应的数组、监听名称及对应的回调组成的对象
 * @param  {function} [callback] 监听对应的回调函数
 * @param  {boolean}   [one]      是否只执行一次监听，为true则表示只执行一次回调函数，否则每次触发监听都是执行回调函数
 * @return {DataTable}            当前的DataTable对象
 * @example
 * datatable.on(u.DataTable.ON_ROW_FOCUS, function() {}) // 普通
 * datatable.on([u.DataTable.ON_INSERT, u.DataTable.ON_DELETE], function() {}) // 数组
 * datatable.on({u.DataTable.ON_INSERT: function() {}, u.DataTable.ON_DELETE: function() {}}) // map
 */
const on$1 = function(name, callback, one) {
    var self = this,
        origCb = callback;
    if (Object.prototype.toString.call(name) == '[object Array]') {
        // 数组
        for (var i in name) {
            this.on(name[i], callback);
        }
        return this;
    } else if (typeof name == 'object') {
        // map
        for (var key in name) {
            this.on(key, name[key]);
        }
        return this;
    }
    if (one) {
        callback = function() {
            self.off(name, callback);
            origCb.apply(this, arguments);
        };
    }
    name = name.toLowerCase();
    this._events || (this._events = {});
    var events = this._events[name] || (this._events[name] = []);
    events.push({
        callback: callback
    });
    return this;
};

/**
 * 为DataTable对象取消监听
 * @memberof DataTable
 * @param  {string|array|object}   name     针对不同用法分别对应监听名称、监听名称对应的数组、监听名称及对应的回调组成的对象
 * @param  {function} [callback] 监听对应的回调函数
 * @return {DataTable}            当前的DataTable对象
 * @example
 * datatable.off(u.DataTable.ON_ROW_FOCUS, function() {}) // 普通
 * datatable.off([u.DataTable.ON_INSERT, u.DataTable.ON_DELETE], function() {}) // 数组
 * datatable.off({u.DataTable.ON_INSERT: function() {}, u.DataTable.ON_DELETE: function() {}}) // map
 */
const off$1 = function(name, callback) {
    name = name.toLowerCase();
    if (!this._events)
        return this;
    if (Object.prototype.toString.call(name) == '[object Array]') {
        // 数组
        for (var i in name) {
            this.off(name[i], callback);
        }
        return this;
    } else if (typeof name == 'object') {
        // map
        for (var key in name) {
            this.off(key, name[key]);
        }
        return this;
    }
    var cbs = this._events[name];
    if (!cbs) return this;
    if (!callback) {
        // 解绑所有事件
        cbs = null;
    } else {
        for (var i = cbs.length - 1; i >= 0; i--) {
            if (cbs[i] == callback) {
                cbs.splice(i, 1);
            }
        }
    }
    return this;
};

/**
 * 为DataTable对象添加只执行一次的监听
 * @memberof DataTable
 * @param  {string|array|object}   name     针对不同用法分别对应监听名称、监听名称对应的数组、监听名称及对应的回调组成的对象
 * @param  {function} [callback] 监听对应的回调函数
 * @example
 * datatable.one(u.DataTable.ON_ROW_FOCUS, function() {}) // 普通
 * datatable.one([u.DataTable.ON_INSERT, u.DataTable.ON_DELETE], function() {}) // 数组
 * datatable.one({u.DataTable.ON_INSERT: function() {}, u.DataTable.ON_DELETE: function() {}}) // map
 */
const one = function(name, callback) {
    this.on(name, callback, 1);
};

/**
 * 触发DataTable对象绑定的事件监听
 * @memberof DataTable
 * @param  {string} name 需要触发的事件监听对应的名称
 * @return {DataTable}            当前的DataTable对象
 * @example
 * datatable.trigger('valuechange')
 */
const trigger$1 = function(name) {
    name = name.toLowerCase();
    if (!this._events || !this._events[name]) return this;
    var args = Array.prototype.slice.call(arguments, 1);
    var events = this._events[name];
    for (var i = 0, count = events.length; i < count; i++) {
        events[i].callback.apply(this, args);
    }
    return this;
};

// 带返回值的trigger，可以获取回调函数的返回值
const triggerReturn = function(name) {
    name = name.toLowerCase();
    if (!this._events || !this._events[name]) return this;
    var args = Array.prototype.slice.call(arguments, 1);
    var events = this._events[name];
    var flag = true;
    for (var i = 0, count = events.length; i < count; i++) {
        flag = flag && events[i].callback.apply(this, args);
    }
    return flag;
};

// 获取监听名称对应的回调函数
const getEvent = function(name) {
    name = name.toLowerCase();
    this._events || (this._events = {});
    return this._events[name]
};

const eventsFunObj = {
    on: on$1,
    off: off$1,
    one: one,
    trigger: trigger$1,
    triggerReturn: triggerReturn,
    getEvent: getEvent
};

/**
  * Module : Kero webpack entry dataTable index
  * Author : liuyk(liuyuekai@yonyou.com)
  * Date   : 2016-08-09 15:24:46
  */

 /**
  * DataTable
  * @namespace
  * @description 前端数据模型对象
  */
 class DataTable$1 {
     constructor(options) {
         options = options || {};
         /**
          * DataTable对应的唯一标识
          * @type {string}
          */
         this.id = options['id'];
         /**
          * 在设置数据时是否自动创建对应字段，如果为true则不自动创建，如果为false则自动创建缺失的字段
          * @type {boolean}
          * @default false
          */
         this.strict = options['strict'] || false;
         /**
          * DataTable的所有字段属性信息
          * @type {object}
          */
         this.meta = DataTable$1.createMetaItems(options['meta']);
         /**
          * DataTable的是否支持编辑功能
          * @type {boolean}
          * @default true
          */
         this.enable = options['enable'] || DataTable$1.DEFAULTS.enable;
         /**
          * DataTable支持翻页功能时每页显示数据条数
          * @type {number}
          * @default 20
          */
         this.pageSize = ko.observable(options['pageSize'] || DataTable$1.DEFAULTS.pageSize);
         /**
          * DataTable支持翻页功能时当前页码
          * @type {number}
          * @default 0
          */
         this.pageIndex = ko.observable(options['pageIndex'] || DataTable$1.DEFAULTS.pageIndex);
         /**
          * DataTable支持翻页功能时总页数
          * @type {number}
          * @default 0
          */
         this.totalPages = ko.observable(options['totalPages'] || DataTable$1.DEFAULTS.totalPages);
         // 存储所有行对象
         this.totalRow = ko.observable();
         /**
          * DataTable的是否支持前端缓存，支持前端缓存则前端会存储所有页的数据信息，否则只保存当前页的数据信息。如果使用前端缓存则需要使用框架封装的fire方法来与后台进行交互
          * @type {boolean}
          * @default false
          */
         this.pageCache = options['pageCache'] === undefined ? DataTable$1.DEFAULTS.pageCache : options['pageCache'];
         /**
          * DataTable删除数据时是否强制删除，如果设置为true则不再考虑数据的状态，执行删除时则删除此条数据。如果设置为false则需要考虑数据的状态，如果状态为new则删除此条数据否则将状态修改为fdel
          * @type {boolean}
          * @default false
          */
         this.forceDel = options['forceDel'] === undefined ? DataTable$1.DEFAULTS.pageCache : options['forceDel'];
         // 存储所有row对象
         this.rows = ko.observableArray([]);
         // 存储所有的选中行的index
         this.selectedIndices = ko.observableArray([]);
         // 原有的当前行，用于判断当前行是否发生变化
         this._oldCurrentIndex = -1;
         // 当前focus行
         this.focusIndex = ko.observable(-1);
         // 存储所有页对象
         this.cachedPages = [];
         // 存储meta改变信息
         this.metaChange = {};
         // 存储valuecahnge改变信息
         this.valueChange = {}; //ko.observable(1);
         // 监听当前行改变
         this.currentRowChange = ko.observable(1);
         // 监听是否可修改属性的改变
         this.enableChange = ko.observable(1);
         /**
          * 使用者自定义的属性合集，框架内部不会针对此属性进行特殊处理，仅用于设置及获取
          * @type {object}
          */
         this.params = options['params'] || {};
         /**
          * 使用者自定义的属性，框架内部不会针对此属性进行特殊处理，仅用于设置及获取。
          * @type {string}
          */
         this.master = options['master'] || '';
         // 监听是否全部选中
         this.allSelected = ko.observable(false);
         /**
          * 通过getSimpleData获取数据时，日期字段是否转化为long型，如果为true时不进行转化，为false时转化为long型
          * @type {boolean}
          * @default false
          */
         this.dateNoConvert = options['dateNoConvert'] || false;
         // 对于子表通过root字段存储根datatable对象
         if (options['root']) {
             this.root = options['root'];
         } else {
             this.root = this;
         }
         // 记录子表的路径
         if (options['ns']) {
             this.ns = options['ns'];
         } else {
             this.ns = '';
         }
         // 前端分页情况下记录前端新增的数据
         this.newCount = 0;
     }
 }

 var DataTableProto = DataTable$1.prototype;
 Object.assign(DataTableProto, copyRowFunObj);
 Object.assign(DataTableProto, dataFunObj);
 Object.assign(DataTableProto, enableFunObj);
 Object.assign(DataTableProto, getCurrentFunObj);
 Object.assign(DataTableProto, getDataFunObj);
 Object.assign(DataTableProto, getFocusFunObj);
 Object.assign(DataTableProto, getMetaFunObj);
 Object.assign(DataTableProto, getPageFunObj);
 Object.assign(DataTableProto, getParamFunObj);
 Object.assign(DataTableProto, getSelectFunObj);
 Object.assign(DataTableProto, getSimpleDataFunObj);
 Object.assign(DataTableProto, pageFunObj);
 Object.assign(DataTableProto, metaFunObj);
 Object.assign(DataTableProto, refFunObj);
 Object.assign(DataTableProto, paramFunObj);
 Object.assign(DataTableProto, rowFunObj);
 Object.assign(DataTableProto, removeRowFunObj);
 Object.assign(DataTableProto, rowCurrentFunObj);
 Object.assign(DataTableProto, simpleDataFunObj);
 Object.assign(DataTableProto, rowFocusFunObj);
 Object.assign(DataTableProto, eventsFunObj);
 Object.assign(DataTableProto, utilFunObj);
 Object.assign(DataTableProto, rowSelectFunObj);
 Object.assign(DataTableProto, rowDeleteFunObj);

 DataTable$1.DEFAULTS = {
     pageSize: 20,
     pageIndex: 0,
     totalPages: 0,
     pageCache: false,
     enable: true,
     forceDel: false
 };

 DataTable$1.META_DEFAULTS = {
     enable: true,
     required: false,
     descs: {}
 };

 //事件类型
 DataTable$1.ON_ROW_SELECT = 'select';
 DataTable$1.ON_ROW_UNSELECT = 'unSelect';
 DataTable$1.ON_ROW_ALLSELECT = 'allSelect';
 DataTable$1.ON_ROW_ALLUNSELECT = 'allUnselect';
 DataTable$1.ON_VALUE_CHANGE = 'valueChange';
 DataTable$1.ON_BEFORE_VALUE_CHANGE = 'beforeValueCHange';
 DataTable$1.ON_CURRENT_VALUE_CHANGE = 'currentValueChange'; //当前行变化
 //  DataTable.ON_AFTER_VALUE_CHANGE = 'afterValueChange'
 //  DataTable.ON_ADD_ROW = 'addRow'
 DataTable$1.ON_INSERT = 'insert';
 DataTable$1.ON_UPDATE = 'update';
 DataTable$1.ON_CURRENT_UPDATE = 'currentUpdate';
 DataTable$1.ON_DELETE = 'delete';
 DataTable$1.ON_DELETE_ALL = 'deleteAll';
 DataTable$1.ON_ROW_FOCUS = 'focus';
 DataTable$1.ON_ROW_UNFOCUS = 'unFocus';
 DataTable$1.ON_LOAD = 'load';
 DataTable$1.ON_ENABLE_CHANGE = 'enableChange';
 DataTable$1.ON_META_CHANGE = 'metaChange';
 DataTable$1.ON_ROW_META_CHANGE = 'rowMetaChange';
 DataTable$1.ON_CURRENT_META_CHANGE = 'currentMetaChange';
 DataTable$1.ON_CURRENT_ROW_CHANGE = 'currentRowChange';

 DataTable$1.SUBMIT = {
     current: 'current',
     focus: 'focus',
     all: 'all',
     select: 'select',
     change: 'change',
     empty: 'empty',
     allSelect: 'allSelect',
     allPages: 'allPages'
 };


 DataTable$1.createMetaItems = function(metas) {
     var newMetas = {};
     for (var key in metas) {
         var meta = metas[key];
         if (typeof meta == 'string')
             meta = {};
         newMetas[key] = extend({}, DataTable$1.META_DEFAULTS, meta);
     }
     return newMetas
 };

/**
 * Module : Kero tree adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-16 10:44:14
 */

var TreeAdapter = u.BaseAdapter.extend({
    mixins: [],
    init: function() {
        var options = this.options,
            opt = options || {},
            viewModel = this.viewModel;
        var element = this.element;
        this.id = opt['id'];

        var oThis = this;
        this.dataTable = getJSObject(viewModel, options["data"]);
        this.element = element;
        this.$element = $(element);
        this.id = options['id'];
        this.element.id = this.id;
        this.options = options;
        this.events = $.extend(true, {}, options.events);
        var treeSettingDefault = {
            //			async: {  //缓加载
            //				enable: oThis.options.asyncFlag,
            //				url: oThis.options.asyncFun
            //			},
            data: {
                simpleData: {
                    enable: true
                }
            },
            check: {
                chkboxType: {
                    "Y": "",
                    "N": ""
                }
            },
            callback: {
                //点击前
                beforeClick: function(e, id, node) {
                    if (oThis.events.beforeClick) {
                        getFunction(viewModel, oThis.events.beforeClick)(e, id, node);
                    }
                },
                // 选中/取消选中事件
                onCheck: function(e, id, node) {
                    if (oThis.selectSilence) {
                        return;
                    }
                    var nodes = oThis.tree.getCheckedNodes();
                    var nowSelectIndexs = oThis.dataTable.getSelectedIndexs();
                    var indexArr = [];
                    for (var i = 0; i < nodes.length; i++) {
                        // 获取到节点的idValue
                        var idValue = nodes[i].id;
                        // 根据idValue查找到对应数据的rowId
                        var rowId = oThis.getRowIdByIdValue(idValue);
                        var index = oThis.dataTable.getIndexByRowId(rowId);
                        indexArr.push(index);
                    }

                    // 比较2个数组的差异然后进行选中及反选
                    var needSelectArr = [];
                    for (var i = 0; i < indexArr.length; i++) {
                        var nowIndex = indexArr[i];
                        var hasFlag = false;
                        for (var j = 0; j < nowSelectIndexs.length; j++) {
                            if (nowIndex == nowSelectIndexs[j]) {
                                hasFlag = true;
                                break;
                            }
                        }
                        if (!hasFlag) {
                            needSelectArr.push(nowIndex);
                        }
                    }
                    var needUnSelectArr = [];
                    for (var i = 0; i < nowSelectIndexs.length; i++) {
                        var nowIndex = nowSelectIndexs[i];
                        var hasFlag = false;
                        for (var j = 0; j < indexArr.length; j++) {
                            if (nowIndex == indexArr[j]) {
                                hasFlag = true;
                                break;
                            }
                        }
                        if (!hasFlag) {
                            needUnSelectArr.push(nowIndex);
                        }
                    }

                    oThis.dataTable.addRowsSelect(needSelectArr);
                    oThis.dataTable.setRowsUnSelect(needUnSelectArr);
                    // 获取到节点的idValue
                    var idValue = node.id;
                    // 根据idValue查找到对应数据的rowId
                    var rowId = oThis.getRowIdByIdValue(idValue);
                    var index = oThis.dataTable.getIndexByRowId(rowId);
                    oThis.dataTable.setRowFocus(index);
                },
                // 单选时点击触发选中
                onClick: function(e, id, node) {
                    if (oThis.selectSilence) {
                        return;
                    }
                    //点击时取消所有超链接效果
                    $('#' + id + ' li').removeClass('focusNode');
                    $('#' + id + ' a').removeClass('focusNode');
                    //添加focusNode样式
                    $('#' + node.tId).addClass('focusNode');
                    $('#' + node.tId + '_a').addClass('focusNode');
                    // 获取到节点的idValue
                    var idValue = node.id;
                    // 根据idValue查找到对应数据的rowId
                    var rowId = oThis.getRowIdByIdValue(idValue);
                    var index = oThis.dataTable.getIndexByRowId(rowId);
                    //上面这种情况说明是checkbox选中需要addRowSelect
                    if (oThis.tree.setting.check.enable && oThis.tree.setting.check.chkStyle === 'checkbox') {
                        oThis.dataTable.addRowSelect(index);
                    } else {
                        oThis.dataTable.setRowSelect(index);
                    }
                    oThis.dataTable.setRowFocus(index);

                    if (oThis.events.onClick) {
                        getFunction(viewModel, oThis.events.onClick)(e, id, node);
                    }
                }
            }

        };

        var setting = {};
        if (this.options.setting) {
            //if (typeof(JSON) == "undefined")
            //	setting = eval("(" + this.options.setting + ")");
            //else
            setting = getJSObject(viewModel, this.options.setting) || getJSObject(window, this.options.setting);
        }

        // 遍历callback先执行默认之后再执行用户自定义的。
        var callbackObj = treeSettingDefault.callback;
        var userCallbackObj = setting.callback;


        var callbackObj = treeSettingDefault.callback;
        var userCallbackObj = setting.callback;

        var userBeforeClick = userCallbackObj && userCallbackObj['beforeClick'];
        if (userBeforeClick) {
            var newBeforeClick = function() {
                callbackObj['beforeClick'].apply(this, arguments);
                userBeforeClick.apply(this, arguments);
            };
            userCallbackObj['beforeClick'] = newBeforeClick;
        }

        var userOnCheck = userCallbackObj && userCallbackObj['onCheck'];
        if (userOnCheck) {
            var newOnCheck = function() {
                callbackObj['onCheck'].apply(this, arguments);
                userOnCheck.apply(this, arguments);
            };
            userCallbackObj['onCheck'] = newOnCheck;
        }

        var userOnClick = userCallbackObj && userCallbackObj['onClick'];
        if (userOnClick) {
            var newOnClick = function() {
                callbackObj['onClick'].apply(this, arguments);
                userOnClick.apply(this, arguments);
            };
            userCallbackObj['onClick'] = newOnClick;
        }

        /*for(var f in callbackObj){
        	var fun = callbackObj[f],
        		userFun = userCallbackObj && userCallbackObj[f];
        	if(userFun){
        		var newF = function(){
        			fun.apply(this,arguments);
        			userFun.apply(this,arguments);
        		}
        		userCallbackObj[f] = newF;
        	}
        }*/


        var treeSetting = $.extend(true, {}, treeSettingDefault, setting);

        var treeData = [];
        // 根据idField、pidField、nameField构建ztree所需data
        var data = this.dataTable.rows();
        if (data.length > 0) {
            if (this.options.codeTree) {
                // 首先按照string进行排序
                data.sort(function(a, b) {
                    var aObj = a.data;
                    var bObj = b.data;
                    var v1 = aObj[oThis.options.idField].value + '';
                    var v2 = bObj[oThis.options.idField].value + '';
                    try {
                        return v1.localeCompare(v2);
                    } catch (e) {
                        return 0;
                    }
                });
                var idArr = new Array();
                $.each(data, function() {
                    var dataObj = this.data;
                    var idValue = dataObj[oThis.options.idField].value;
                    idArr.push(idValue);
                });
                var preValue = '';
                $.each(data, function() {
                    var value = oThis.cloneValue(this.data);
                    var dataObj = this.data;
                    var idValue = dataObj[oThis.options.idField].value;
                    var nameValue = dataObj[oThis.options.nameField].value;
                    var pidValue = '';
                    var startFlag = -1;
                    // 如果当前值包含上一个值则上一个值为pid
                    if (preValue != '') {
                        var startFlag = idValue.indexOf(preValue);
                    }
                    if (startFlag == 0) {
                        pidValue = preValue;
                    } else {
                        for (var i = 1; i < preValue.length; i++) {
                            var s = preValue.substr(0, i);
                            var f = idValue.indexOf(s);
                            if (f == 0) {
                                var index = $.inArray(s, idArr);
                                if (index > 0 || index == 0) {
                                    pidValue = s;
                                }
                            } else {
                                break;
                            }
                        }

                    }
                    value['id'] = idValue;
                    value['pId'] = pidValue;
                    value['name'] = nameValue;

                    treeData.push(value);
                    preValue = idValue;
                });
            } else {
                var values = new Array();
                $.each(data, function() {
                    var value = oThis.cloneValue(this.data);
                    var dataObj = this.data;
                    var idValue = dataObj[oThis.options.idField].value;
                    var pidValue = dataObj[oThis.options.pidField].value;
                    var nameValue = dataObj[oThis.options.nameField].value;

                    value['id'] = idValue;
                    value['pId'] = pidValue;
                    value['name'] = nameValue;
                    treeData.push(value);
                });
            }
        }

        this.tree = $.fn.zTree.init(this.$element, treeSetting, treeData);


        // dataTable事件
        this.dataTable.on(DataTable$1.ON_ROW_SELECT, function(event) {
            oThis.selectSilence = true;
            var nodes = oThis.tree.getCheckedNodes();
            $.each(nodes, function() {
                var node = this;
                if (oThis.tree.setting.view.selectedMulti == true && node.checked) {
                    oThis.tree.checkNode(node, false, true, true);
                } else {
                    oThis.tree.cancelSelectedNode(node);
                }
            });
            /*index转化为grid的index*/
            $.each(event.rowIds, function() {
                var row = oThis.dataTable.getRowByRowId(this);
                var dataObj = row.data;
                var idValue = dataObj[oThis.options.idField].value;
                var node = oThis.tree.getNodeByParam('id', idValue);
                if (oThis.tree.setting.view.selectedMulti == true) {
                    if (!node.checked)
                        oThis.tree.checkNode(node, true, false, true);
                } else {
                    oThis.tree.selectNode(node, false);
                }
            });
            oThis.selectSilence = false;
        });

        this.dataTable.on(DataTable$1.ON_ROW_UNSELECT, function(event) {
            /*index转化为grid的index*/
            $.each(event.rowIds, function() {
                var row = oThis.dataTable.getRowByRowId(this);
                var dataObj = row.data;
                var idValue = dataObj[oThis.options.idField].value;
                var node = oThis.tree.getNodeByParam('id', idValue);
                if (oThis.tree.setting.view.selectedMulti == true && node.checked) {
                    oThis.tree.checkNode(node, false, true, true);
                } else {
                    oThis.tree.cancelSelectedNode(node);
                }
            });
        });

        this.dataTable.on(DataTable$1.ON_INSERT, function(event) {
            //var gridRows = new Array();
            var dataArray = [],
                nodes = [];
            var hasChild = false; //是否含有子节点
            $.each(event.rows, function() {
                var value = oThis.cloneValue(this.data),
                    hasPar = false;
                var dataObj = this.data;
                var idValue = dataObj[oThis.options.idField].value;
                var pidValue = dataObj[oThis.options.pidField].value;
                var nameValue = dataObj[oThis.options.nameField].value;
                value['id'] = idValue;
                value['pId'] = pidValue;
                value['name'] = nameValue;
                var childNode = oThis.tree.getNodeByParam('pid', idValue);
                var pNode = oThis.tree.getNodeByParam('id', pidValue);
                if (childNode && childNode.length > 0) {
                    hasChild = true;
                }
                if (pNode && pNode.length > 0) {
                    hasPar = true;
                    //oThis.tree.addNodes(pNode, value, true);
                }
                if (!hasChild && hasPar) { //不存在子节点,存在父节点之间插入
                    oThis.tree.addNodes(pNode, value, true);
                } else {
                    dataArray.push(value);
                }

            });
            if (!hasChild) { //如果没有子节点，将当前节点作为根节点之间插入
                nodes = oThis.tree.transformTozTreeNodes(dataArray);
                oThis.tree.addNodes(null, nodes, true, event.index);
            } else { //如果含有子节点,重新渲染

            }
        });


        this.dataTable.on(DataTable$1.ON_DELETE, function(event) {
            /*index转化为grid的index*/
            $.each(event.rows, function() {
                var row = this;
                var idValue = row.getValue(oThis.options.idField);
                var node = oThis.tree.getNodeByParam('id', idValue);
                oThis.tree.removeNode(node);
            });
        });

        this.dataTable.on(DataTable$1.ON_DELETE_ALL, function(event) {
            var nodes = oThis.tree.getNodes();
            for (var i = 0, l = nodes.length; i < l; i++) {
                var node = oThis.tree.getNodeByParam('id', nodes[i].id);
                oThis.tree.removeNode(node);
                i--;
                l = nodes.length;
            }
        });

        // 加载数据,只考虑viewModel传入grid
        this.dataTable.on(DataTable$1.ON_LOAD, function(data) {
            var data = oThis.dataTable.rows();
            if (data.length > 0) {
                var values = new Array();
                $.each(data, function() {
                    var value = {};
                    var dataObj = this.data;
                    var idValue = dataObj[oThis.options.idField].value;
                    var pidValue = dataObj[oThis.options.pidField].value;
                    var nameValue = dataObj[oThis.options.nameField].value;

                    value['id'] = idValue;
                    value['pId'] = pidValue;
                    value['name'] = nameValue;
                    treeData.push(value);
                });
            }

            this.tree = $.fn.zTree.init(this.$element, treeSetting, treeData);
        });

        this.dataTable.on(DataTable$1.ON_VALUE_CHANGE, function(event) {
            var row = oThis.dataTable.getRowByRowId(event.rowId);
            if (!row) return
            var treeArray = oThis.tree.getNodes();
            var id = row.getValue(oThis.options.idField);
            var node = oThis.tree.getNodeByParam('id', id);
            if (!node && treeArray) { //如果node为null则取树数组的最后一个节点

                node = treeArray[treeArray.length - 1];
            }
            var field = event.field;
            var value = event.newValue;
            if (oThis.options.idField == field && node) {
                node.id = value;
                oThis.tree.updateNode(node);
            }
            if (oThis.options.nameField == field && node) {
                node.name = value;
                oThis.tree.updateNode(node);
            } else if (oThis.options.pidField == field) {
                var targetNode = oThis.tree.getNodeByParam('id', value);
                oThis.tree.moveNode(targetNode, node, "inner");
            }
        });

        // 通过树id获取dataTable的rowId
        this.getRowIdByIdValue = function(idValue) {
            var oThis = this;
            var rowId = null;
            $.each(this.dataTable.rows(), function() {
                var dataObj = this.data;
                var id = this.rowId;
                if (dataObj[oThis.options.idField].value == idValue) {
                    rowId = id;
                }
            });
            return rowId;
        };

        return this;
    },

    getName: function() {
        return 'tree'
    },

    cloneValue: function(Data) {
        var newData = {};
        for (var field in Data) {
            var value = Data[field].value;
            newData[field] = value;
        }
        return newData;
    }


});

if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: TreeAdapter,
        name: 'tree'
        //dataType: 'float'
    });

exports.TreeAdapter = TreeAdapter;

}((this.bar = this.bar || {})));
