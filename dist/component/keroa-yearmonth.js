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

var U_LANGUAGES = "i_languages";
var U_THEME = "u_theme";
var U_LOCALE = "u_locale";
var U_USERCODE = "usercode";
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
 * Module : Sparrow cookies
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

var setCookie = function(sName, sValue, oExpires, sPath, sDomain, bSecure) {
	var sCookie = sName + "=" + encodeURIComponent(sValue);
	if(oExpires)
		sCookie += "; expires=" + oExpires.toGMTString();
	if(sPath)
		sCookie += "; path=" + sPath;
	if(sDomain)
		sCookie += "; domain=" + sDomain;
	if(bSecure)
		sCookie += "; secure=" + bSecure;
	document.cookie = sCookie;
};

var getCookie = function(sName) {
	var sRE = "(?:; )?" + sName + "=([^;]*);?";
	var oRE = new RegExp(sRE);

	if(oRE.test(document.cookie)) {
		return decodeURIComponent(RegExp["$1"]);
	} else
		return null;
};

/**
 * Module : Sparrow i18n
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-29 10:16:54
 */
//import {uuii18n} from '?';//缺失故修改为default值
// 从datatable/src/compatiable/u/JsExtension.js抽取
window.getCurrentJsPath = function() {
	var doc = document,
	a = {},
	expose = +new Date(),
	rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/,
	isLtIE8 = ('' + doc.querySelector).indexOf('[native code]') === -1;
	// FF,Chrome
	if (doc.currentScript){
		return doc.currentScript.src;
	}

	var stack;
	try{
		a.b();
	}
	catch(e){
		stack = e.stack || e.fileName || e.sourceURL || e.stacktrace;
	}
	// IE10
	if (stack){
		var absPath = rExtractUri.exec(stack)[1];
		if (absPath){
			return absPath;
		}
	}

	// IE5-9
	for(var scripts = doc.scripts,
		i = scripts.length - 1,
		script; script = scripts[i--];){
		if (script.className !== expose && script.readyState === 'interactive'){
			script.className = expose;
			// if less than ie 8, must get abs path by getAttribute(src, 4)
			return isLtIE8 ? script.getAttribute('src', 4) : script.src;
		}
	}
};

if (window.i18n) {
	window.u = window.u || {};
    var scriptPath = getCurrentJsPath(),
        _temp = scriptPath.substr(0, scriptPath.lastIndexOf('/')),
        __FOLDER__ = _temp.substr(0, _temp.lastIndexOf('/')),
        resGetPath = u.i18nPath || __FOLDER__ + '/locales/__lng__/__ns__.json';
    i18n.init({
        postAsync: false,
        getAsync: false,
        fallbackLng: false,
        ns: {namespaces: ['uui-trans']},
		lng:getCookie(U_LOCALE) || 'zh',
        resGetPath: resGetPath
    });
}

var trans = function (key, dftValue) {
    return  window.i18n ?  i18n.t('uui-trans:' + key) : dftValue
};

/**
 * Module : Sparrow util tools
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

/**
 * 创建一个带壳的对象,防止外部修改
 * @param {Object} proto
 */
var createShellObject = function(proto) {
	var exf = function() {};
	exf.prototype = proto;
	return new exf();
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


var dateFormat = function ( str ) {
	//如果不是string类型  原型返回
	if ( typeof ( str ) !== 'string')
	{
		return str;
	}
	//判断 str 格式如果是 yy-mm-dd
	if (str && str.indexOf ('-') > -1){
		//获取当前是否是 ios版本,>8是因为ios不识别new Date（“2016/11”）格式
		var ua = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(ua)) {
			//转换成 yy/mm/dd
		    str = str.replace(/-/g,"/");
			str = str.replace(/(^\s+)|(\s+$)/g,"");
			if(str.length <= 8){
				str = str += "/01";
			}
		}
	}


	return str;
};

/**
 * Module : Sparrow core context
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-28 13:52:19
 */
var environment = {};
/**
 * client attributes
 */
var clientAttributes = {};

var sessionAttributes = {};

var fn = {};
var maskerMeta = {
	'float': {
		precision: 2
	},
	'datetime': {
		format: 'YYYY-MM-DD HH:mm:ss',
		metaType: 'DateTimeFormatMeta',
		speratorSymbol: '-'
	},
	'time': {
		format: 'HH:mm'
	},
	'date': {
		format: 'YYYY-MM-DD'
	},
	'currency': {
		precision: 2,
		curSymbol: '￥'
	},
	'percent': {

	},
	'phoneNumber': {
		
	}
};
/**
 * 获取环境信息
 * @return {environment}
 */
fn.getEnvironment = function() {
	return createShellObject(environment);
};

/**
 * 获取客户端参数对象
 * @return {clientAttributes}
 */
fn.getClientAttributes = function() {
	var exf = function() {};
	return createShellObject(clientAttributes);
};

fn.setContextPath = function(contextPath) {
	return environment[IWEB_CONTEXT_PATH] = contextPath
};
fn.getContextPath = function(contextPath) {
		return environment[IWEB_CONTEXT_PATH]
	};
	/**
	 * 设置客户端参数对象
	 * @param {Object} k 对象名称
	 * @param {Object} v 对象值(建议使用简单类型)
	 */
fn.setClientAttribute = function(k, v) {
		clientAttributes[k] = v;
	};
	/**
	 * 获取会话级参数对象
	 * @return {clientAttributes}
	 */
fn.getSessionAttributes = function() {
	var exf = function() {};
	return createShellObject(sessionAttributes);
};

/**
 * 设置会话级参数对象
 * @param {Object} k 对象名称
 * @param {Object} v 对象值(建议使用简单类型)
 */
fn.setSessionAttribute = function(k, v) {
	sessionAttributes[k] = v;
	setCookie("ISES_" + k, v);
};

/**
 * 移除客户端参数
 * @param {Object} k 对象名称
 */
fn.removeClientAttribute = function(k) {
	clientAttributes[k] = null;
	execIgnoreError(function() {
		delete clientAttributes[k];
	});
};

/**
 * 获取地区信息编码
 */
fn.getLocale = function() {
	return this.getEnvironment().locale
};

/**
 * 获取多语信息
 */
fn.getLanguages = function() {
	return this.getEnvironment().languages
};
/**
 * 收集环境信息(包括客户端参数)
 * @return {Object}
 */
fn.collectEnvironment = function() {
	var _env = this.getEnvironment();
	var _ses = this.getSessionAttributes();

	for(var i in clientAttributes) {
		_ses[i] = clientAttributes[i];
	}
	_env.clientAttributes = _ses;
	return _env
};

/**
 * 设置数据格式信息
 * @param {String} type
 * @param {Object} meta
 */
fn.setMaskerMeta = function(type, meta) {
	if(typeof type == 'function') {
		getMetaFunc = type;
	} else {
		if(!maskerMeta[type])
			maskerMeta[type] = meta;
		else {
			if(typeof meta != 'object')
				maskerMeta[type] = meta;
			else
				for(var key in meta) {
					maskerMeta[type][key] = meta[key];
				}
		}
	}
};
fn.getMaskerMeta = function(type) {
	if(typeof getMetaFunc == 'function') {
		var meta = getMetaFunc.call(this);
		return meta[type];
	} else
		return extend({}, maskerMeta[type]);
};
environment.languages = getCookie(U_LANGUAGES) ? getCookie(U_LANGUAGES).split(',') : navigator.language ? navigator.language : 'zh-CN';
if(environment.languages == 'zh-cn')
	environment.languages = 'zh-CN';
if(environment.languages == 'en-us')
	environment.languages = 'en-US';

environment.theme = getCookie(U_THEME);
environment.locale = getCookie(U_LOCALE);
//environment.timezoneOffset = (new Date()).getTimezoneOffset()
environment.usercode = getCookie(U_USERCODE);
//init session attribute
document.cookie.replace(/ISES_(\w*)=([^;]*);?/ig, function(a, b, c) {
	sessionAttributes[b] = c;
});

var Core = function() {};
Core.prototype = fn;

var core = new Core();

/**
 * Module : Sparrow date util
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-06 13:37:20
 */

var u$2 = {};
u$2.date = {

    /**
     * 多语言处理
     */
    //TODO 后续放到多语文件中
    _dateLocale: {
        'zh-CN': {
            months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
            monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
            weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
            weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
            weekdaysMin: '日_一_二_三_四_五_六'.split('_')
        },
        'en-US': {
            months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
            monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thurday_Friday_Saturday'.split('_'),
            weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            weekdaysMin: 'S_M_T_W_T_F_S'.split('_')
        }
    },
    _jsonLocale: {
        months: trans('date.months', "一月\n二月\n三月\n四月\n五月\n六月\n七月\n八月\n九月\n十月\n十一月\n十二月").split('\n'),
        monthsShort: trans('date.monthsShort', "1月\n2月\n3月\n4月\n5月\n6月\n7月\n8月\n9月\n10月\n11月\n12月").split('\n'),
        weekdays: trans('date.weekdays', "星期日\n星期一\n星期二\n星期三\n星期四\n星期五\n星期六").split('\n'),
        weekdaysShort: trans('date.weekdaysShort', "周日\n周一\n周二\n周三\n周四\n周五\n周六").split('\n'),
        weekdaysMin: trans('date.weekdaysMin', "日\n一\n二\n三\n四\n五\n六").split('\n'),
        defaultMonth: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
    },

    _formattingTokens: /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYY|YY|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,

    leftZeroFill: function(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    },

    _formats: {
        //year
        YY: function(date) {
            return u$2.date.leftZeroFill(date.getFullYear() % 100, 2);
        },
        YYYY: function(date) {
            return date.getFullYear();
        },
        //month
        M: function(date) {
            return date.getMonth() + 1;
        },
        MM: function(date) {
            var m = u$2.date._formats.M(date);
            return u$2.date.leftZeroFill(m, 2);
        },
        MMM: function(date, language) {
            var m = date.getMonth();
            // return u.date._dateLocale[language].monthsShort[m];
            return u$2.date._jsonLocale.monthsShort[m];
        },
        MMMM: function(date, language) {
            var m = date.getMonth();
            // return u.date._dateLocale[language].months[m];
            return u$2.date._jsonLocale.months[m];
        },
        //date
        D: function(date) {
            return date.getDate();
        },
        DD: function(date) {
            var d = u$2.date._formats.D(date);
            return u$2.date.leftZeroFill(d, 2);
        },
        // weekday
        d: function(date) {
            return date.getDay();
        },
        dd: function(date, language) {
            var d = u$2.date._formats.d(date);
            // return u.date._dateLocale[language].weekdaysMin[d];
            return u$2.date._jsonLocale.weekdaysMin[d];
        },
        ddd: function(date, language) {
            var d = u$2.date._formats.d(date);
            // return u.date._dateLocale[language].weekdaysShort[d];
            return u$2.date._jsonLocale.weekdaysShort[d];
        },
        dddd: function(date, language) {
            var d = u$2.date._formats.d(date);
            // return u.date._dateLocale[language].weekdays[d];
            return u$2.date._jsonLocale.weekdays[d];
        },
        // am pm
        a: function(date) {
            if (date.getHours() > 12) {
                return 'pm';
            } else {
                return 'am';
            }
        },
        //hour
        h: function(date) {
            var h = date.getHours();
            h = h > 12 ? h - 12 : h;
            return h
        },
        hh: function(date) {
            var h = u$2.date._formats.h(date);
            return u$2.date.leftZeroFill(h, 2);
        },
        H: function(date) {
            return date.getHours();
        },
        HH: function(date) {
            return u$2.date.leftZeroFill(date.getHours(), 2);
        },
        // minutes
        m: function(date) {
            return date.getMinutes();
        },
        mm: function(date) {
            return u$2.date.leftZeroFill(date.getMinutes(), 2);
        },
        //seconds
        s: function(date) {
            return date.getSeconds();
        },
        ss: function(date) {
            return u$2.date.leftZeroFill(date.getSeconds(), 2);
        }
    },

    /**
     * 日期格式化
     * @param date
     * @param formatString
     */
    format: function(date, formatString, language) {
        if (!date && date != 0) return ''; // renturn date 改为 return '',因：setFormat初始会赋值为undefined,造成二次选择报错
        var array = formatString.match(u$2.date._formattingTokens),
            i, length, output = '';
        var _date = u$2.date.getDateObj(date);
        if (!_date) return date;
        language = language || core.getLanguages();
        for (i = 0, length = array.length; i < length; i++) {
            if (u$2.date._formats[array[i]]) {
                output += u$2.date._formats[array[i]](_date, language);
            } else {
                output += array[i];
            }
        }
        return output;
    },
    strToDateByTimezone: function(str, timezone) {
        var dateObj = u$2.date.getDateObj(str);
        var localTime = dateObj.getTime();
        var localOffset = dateObj.getTimezoneOffset() * 60000;
        var utc = localTime + localOffset; //得到国际标准时间
        utc = utc + (3600000 * parseFloat(timezone));
        return utc;
    },

    /**
     * 根据当前时区日期对象获取指定时区日期对象
     * @param  {Date} date     当前时区日期对象
     * @param  {number} timezone 指定时区
     * @return {Date}          转化后的日期对象
     */
    getDateByTimeZonec2z: function(date, timezone) {
        var dateObj = u$2.date.getDateObj(date);
        var localTime = dateObj.getTime();
        var localOffset = dateObj.getTimezoneOffset() * 60000;
        var utc = localTime + localOffset;
        var calctime = utc + (3600000 * parseFloat(timezone));
        return new Date(calctime);
    },
    /**
     * 根据指定时区日期对象获取当前时区日期对象
     * @param  {Date} date     指定时区日期对象
     * @param  {number} timezone 指定时区
     * @return {Date}          转化后的日期对象
     */
    getDateByTimeZonez2c: function(date, timezone) {
        var dateObj = u$2.date.getDateObj(date);
        var localTime = dateObj.getTime();
        var localOffset = dateObj.getTimezoneOffset() * 60000;
        var utc = localTime - (3600000 * parseFloat(timezone)) - localOffset;
        return new Date(utc)
    },

    _addOrSubtract: function(date, period, value, isAdding) {
        var times = date.getTime(),
            d = date.getDate(),
            m = date.getMonth(),
            _date = u$2.date.getDateObj(date);
        if (period === 'ms') {
            times = times + value * isAdding;
            _date.setTime(times);
        } else if (period == 's') {
            times = times + value * 1000 * isAdding;
            _date.setTime(times);
        } else if (period == 'm') {
            times = times + value * 60000 * isAdding;
            _date.setTime(times);
        } else if (period == 'h') {
            times = times + value * 3600000 * isAdding;
            _date.setTime(times);
        } else if (period == 'd') {
            d = d + value * isAdding;
            _date.setDate(d);
        } else if (period == 'w') {
            d = d + value * 7 * isAdding;
            _date.setDate(d);
        } else if (period == 'M') {
            m = m + value * isAdding;
            _date.setMonth(m);
        } else if (period == 'y') {
            m = m + value * 12 * isAdding;
            _date.setMonth(m);
        }
        return _date;
    },

    add: function(date, period, value) {
        return u$2.date._addOrSubtract(date, period, value, 1);
    },
    sub: function(date, period, value) {
        return u$2.date._addOrSubtract(date, period, value, -1);
    },
    getDateObj: function(value, obj) {
        var timezone;
        if (obj) {
            timezone = obj.timezone;
        }
        if ((!value && value != 0) || typeof value == 'undefined') return value;
        var dateFlag = false;
        var _date = new Date(dateFormat(value));
        if (isNaN(_date)) {
            // IE的话对"2016-2-13 12:13:22"进行处理
            var index1, index2, index3, s1, s2, s3, s4;
            if (value.indexOf) {
                index1 = value.indexOf('-');
                index2 = value.indexOf(':');
                index3 = value.indexOf(' ');
                if (index1 > 0 || index2 > 0 || index3 > 0) {
                    _date = new Date();
                    if (index3 > 0) {
                        s3 = value.split(' ');
                        s1 = s3[0].split('-');
                        s2 = s3[1].split(':');
                        s4 = s3[2];
                    } else if (index1 > 0) {
                        s1 = value.split('-');
                    } else if (index2 > 0) {
                        s2 = value.split(':');
                    }
                    if (s1 && s1.length > 0) {
                        _date.setYear(s1[0]);
                        _date.setMonth(parseInt(s1[1] - 1));
                        _date.setDate(s1[2] ? s1[2] : 0);
                        _date.setMonth(parseInt(s1[1] - 1));
                        _date.setDate(s1[2] ? s1[2] : 0);
                        dateFlag = true;
                    }
                    if (s2 && s2.length > 0) {
                        //解决ie和firefox等时间pm直接变am问题
                        if (s4 == "pm") {
                            s2[0] = s2[0] - (-12);
                        }
                        _date.setHours(s2[0] ? s2[0] : 0);
                        _date.setMinutes(s2[1] ? s2[1] : 0);
                        _date.setSeconds(s2[2] ? s2[2] : 0);
                        dateFlag = true;
                    }
                } else {
                    _date = new Date(parseInt(value));
                    if (isNaN(_date)) {
                        // throw new TypeError('invalid Date parameter');
                    } else {
                        dateFlag = true;
                    }
                }
            }
        } else {
            dateFlag = true;
        }
        if (dateFlag) {
            if (timezone) {
                _date = u$2.date.getDateByTimeZonec2z(_date, timezone);
            }
            return _date;
        } else
            return null;
    }

};

var date = u$2.date;

/**
 * Module : neoui-year
 * Author : liuyk(liuyk@yonyou.com)
 * Date   : 2016-08-11 15:17:07
 */

const YearMonth = u.BaseComponent.extend({
    DEFAULTS: {},
    init: function() {
        var _fmt, _defaultFmt;
        var self = this;
        var element = this.element;
        this.options = extend({}, this.DEFAULTS, this.options);
        this.panelDiv = null;
        this.input = this.element.querySelector("input");

        _defaultFmt = "YYYY-M";
        _fmt = this.element.getAttribute("format");
        this.format = _fmt || this.options['format'] || _defaultFmt;

        var d = new Date();
        this.year = d.getFullYear();
        this.startYear = this.year - this.year % 10 - 1;
        this.month = d.getMonth() + 1;

        on(this.input, 'blur', function(e) {
            self._inputFocus = false;
            self.setValue(self.input.value);
        });

        // 添加focus事件
        this.focusEvent();
        // 添加右侧图标click事件
        this.clickEvent();
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

        // this.preBtn = makeDOM('<button class="u-date-pre-button u-button flat floating mini" style="display:none;">&lt;</button>');
        // this.nextBtn = makeDOM('<button class="u-date-next-button u-button flat floating mini" style="display:none;">&gt;</button>');
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
        var oThis = this;
        on(yearDiv, 'click', function(e) {
            var _y = e.target._value;
            oThis.year = _y;
            oThis._fillMonth();
            stopEvent(e);
        });

        this.preBtn.style.display = 'block';
        this.nextBtn.style.display = 'block';
        // this._zoomIn(yearPage);
        this.panelContentDiv.appendChild(yearPage);
        this.contentPage = yearPage;
        this.currentPanel = 'year';
    },

    /**
     * 填充月份选择面板
     * @private
     */
    _fillMonth: function() {
        var oldPanel, template, monthPage, _month, cells, i;
        oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
        if (oldPanel)
            this.panelContentDiv.removeChild(oldPanel);
        _month = this.month;
        var _defaultMonth = _month + '月';
        var monthIndex = date._jsonLocale.defaultMonth.indexOf(_defaultMonth);
        template = ['<div class="u-date-content-page">',
            '<div class="u-date-content-title">' + date._jsonLocale.monthsShort[monthIndex] + '</div>',

            '<div class="u-date-content-panel">',
            '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[0] + '</div>',
            '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[1] + '</div>',
            '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[2] + '</div>',
            '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[3] + '</div>',
            '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[4] + '</div>',
            '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[5] + '</div>',
            '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[6] + '</div>',
            '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[7] + '</div>',
            '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[8] + '</div>',
            '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[9] + '</div>',
            '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[10] + '</div>',
            '<div class="u-date-content-year-cell">' + date._jsonLocale.monthsShort[11] + '</div>',
            '</div>',
            '</div>'
        ].join("");

        monthPage = makeDOM(template);
        cells = monthPage.querySelectorAll('.u-date-content-year-cell');
        for (i = 0; i < cells.length; i++) {
            if (_month == i + 1) {
                addClass(cells[i], 'current');
            }
            cells[i]._value = i + 1;
            new URipple(cells[i]);
        }
        var oThis = this;
        on(monthPage, 'click', function(e) {
            var _m = e.target._value;
            if (_m) {
                oThis.month = _m;
            }
            monthPage.querySelector('.u-date-content-title').innerHTML = _m + '月';
            oThis.setValue(oThis.year + '-' + oThis.month);
            oThis.hide();
        });

        this.preBtn.style.display = 'none';
        this.nextBtn.style.display = 'none';
        this._zoomIn(monthPage);
        this.currentPanel = 'month';
    },


    /**
     * 淡入动画效果
     * @private
     */
    _zoomIn: function(newPage) {
        if (!this.contentPage) {
            this.panelContentDiv.appendChild(newPage);
            this.contentPage = newPage;
            return;
        }
        addClass(newPage, 'zoom-in');
        this.panelContentDiv.appendChild(newPage);
        if (env.isIE8) {
            this.contentPage = newPage;
        } else {
            var cleanup = function() {
                newPage.removeEventListener('transitionend', cleanup);
                newPage.removeEventListener('webkitTransitionEnd', cleanup);
                // this.panelContentDiv.removeChild(this.contentPage);
                this.contentPage = newPage;
            }.bind(this);
            if (this.contentPage) {
                newPage.addEventListener('transitionend', cleanup);
                newPage.addEventListener('webkitTransitionEnd', cleanup);
            }
            //ie9 requestAnimationFrame兼容问题
            if (requestAnimationFrame) {
                requestAnimationFrame(function() {
                    addClass(this.contentPage, 'is-hidden');
                    removeClass(newPage, 'zoom-in');
                }.bind(this));
            }
        }

    },


    setValue: function(value) {
        value = value ? value : '';
        if (value && value.indexOf('-') > -1) {
            var vA = value.split("-");
            this.year = vA[0];
            var month = vA[1];
            this.month = month % 12;
            if (this.month == 0)
                this.month = 12;

            value = this.year + '-' + this.month;
        }
        this.value = value;
        // this.input.value = value;
        this.input.value = date.format(this.value, this.format);
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
        if (this.value && this.value.indexOf('-') > -1) {
            var vA = this.value.split("-");
            this.year = vA[0];
            var month = vA[1];
            this.month = month % 12;
            if (this.month == 0)
                this.month = 12;
        }
        this.createPanel();
        /*因为元素可能变化位置，所以显示的时候需要重新计算*/
        this.width = this.element.offsetWidth;
        if (this.width < 300)
            this.width = 300;

        this.panelDiv.style.width = this.width + 'px';

        if (this.options.showFix) {
            document.body.appendChild(this.panelDiv);
            this.panelDiv.style.position = 'fixed';
            showPanelByEle({
                ele: this.input,
                panel: this.panelDiv,
                position: "bottomLeft"
            });
        } else {
            //    this.element.parentNode.appendChild(this.panelDiv);
            // //调整left和top
            //    this.left = this.element.offsetLeft;
            //    var inputHeight = this.element.offsetHeight;
            //    this.top = this.element.offsetTop + inputHeight;
            //    this.panelDiv.style.left = this.left + 'px';
            //    this.panelDiv.style.top = this.top + 'px';

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
        var oThis = this;
        var callback = function(e) {
            if (e !== evt && e.target !== oThis.input && !oThis.clickPanel(e.target) && oThis._inputFocus != true) {
                // document.removeEventListener('click', callback);
                off(document, 'click', callback);
                oThis.hide();
            }
        };
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
        comp: YearMonth,
        compAsString: 'u.YearMonth',
        css: 'u-yearmonth'
    });

/**
 * Module : Kero yearmonth adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 14:11:50
 */

var YearMonthAdapter = u.BaseAdapter.extend({
    init: function() {
        var self = this;
        this.validType = 'yearmonth';
        this.format = this.getOption('format');
        this.comp = new YearMonth({
            el: this.element,
            showFix: this.options.showFix,
            format: this.format
        });


        this.comp.on('valueChange', function(event) {
            self.slice = true;
            self.dataModel.setValue(self.field, event.value);
            self.slice = false;
        });


    },
    modelValueChange: function(value) {
        if (this.slice) return;
        this.comp.setValue(value);
    },
    setEnable: function(enable) {}
});

if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: YearMonthAdapter,
        name: 'u-yearmonth'
    });

exports.YearMonthAdapter = YearMonthAdapter;

}((this.bar = this.bar || {})));
