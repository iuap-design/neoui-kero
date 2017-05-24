(function (exports) {
'use strict';

/**
 * Module : Sparrow extend enum
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

var U_LOCALE = "u_locale";
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
var each = function(obj, callback) {
	if(obj.forEach) {
		obj.forEach(function(v, k) {
			callback(k, v);
		});

	} else if(obj instanceof Object) {
		for(var k in obj) {
			callback(k, obj[k]);
		}
	} else {
		return;
	}

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
 * Module : Sparrow cookies
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-27 21:46:50
 */

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
 * Module : neoui-pagination
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-03 08:45:49
 */

var pagination = u.BaseComponent.extend({

});

var PageProxy = function(options, page) {
    this.isCurrent = function() {
        return page == options.currentPage;
    };
    this.isFirst = function() {
        return page == 1;
    };
    this.isLast = function() {
        return page == options.totalPages;
    };
    this.isPrev = function() {
        return page == (options.currentPage - 1);
    };
    this.isNext = function() {
        return page == (options.currentPage + 1);
    };
    this.isLeftOuter = function() {
        return page <= options.outerWindow;
    };
    this.isRightOuter = function() {
        return (options.totalPages - page) < options.outerWindow;
    };
    this.isInsideWindow = function() {
        if (options.currentPage < options.innerWindow + 1) {
            return page <= ((options.innerWindow * 2) + 1);
        } else if (options.currentPage > (options.totalPages - options.innerWindow)) {
            return (options.totalPages - page) <= (options.innerWindow * 2);
        } else {
            return Math.abs(options.currentPage - page) <= options.innerWindow;
        }
    };
    this.number = function() {
        return page;
    };
    this.pageSize = function() {
        return options.pageSize;

    };
};

var View = {
    firstPage: function(pagin, options, currentPageProxy) {
        return '<li role="first"' + (currentPageProxy.isFirst() ? 'class="disabled"' : '') + '><a >' + options.first + '</a></li>';
    },
    prevPage: function(pagin, options, currentPageProxy) {
        return '<li role="prev"' + (currentPageProxy.isFirst() ? 'class="disabled"' : '') + '><a  rel="prev">' + options.prev + '</a></li>';
    },
    nextPage: function(pagin, options, currentPageProxy) {
        return '<li role="next"' + (currentPageProxy.isLast() ? 'class="disabled"' : '') + '><a  rel="next">' + options.next + '</a></li>';
    },
    lastPage: function(pagin, options, currentPageProxy) {

        return '<li role="last"' + (currentPageProxy.isLast() ? 'class="disabled"' : '') + '><a >' + options.last + '</a></li>';
    },
    gap: function(pagin, options) {
        return '<li role="gap" class="disabled"><a >' + options.gap + '</a></li>';
    },
    page: function(pagin, options, pageProxy) {
        return '<li role="page"' + (pageProxy.isCurrent() ? 'class="active"' : '') + '><a ' + (pageProxy.isNext() ? ' rel="next"' : '') + (pageProxy.isPrev() ? 'rel="prev"' : '') + '>' + pageProxy.number() + '</a></li>';
    }
};

//pagination.prototype.compType = 'pagination';
pagination.prototype.init = function(element, options) {
    var self = this;
    var element = this.element;
    this.$element = element;
    this.options = extend({}, this.DEFAULTS, this.options);
    this.$ul = this.$element; //.find("ul");
    this.render();
};

pagination.prototype.DEFAULTS = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    pageList: [5, 10, 20, 50, 100],
    innerWindow: 2,
    outerWindow: 0,
    first: '&laquo;',
    prev: '<i class="uf uf-anglepointingtoleft"></i>',
    next: '<i class="uf uf-anglearrowpointingtoright"></i>',
    last: '&raquo;',
    gap: '···',
    //totalText: '合计:',
    totalText: trans('pagination.totalText', '共'),
    listText: trans('pagination.listText', '条'),
    showText: trans('pagination.showText', '显示'),
    pageText: trans('pagination.pageText', '页'),
    toText: trans('pagination.toText', '到'),
    okText: trans('public.ok', '确定'),
    truncate: false,
    showState: true,
    showTotal: true, //初始默认显示总条数 “共xxx条”
    showColumn: true, //初始默认显示每页条数 “显示xx条”
    showJump: true, //初始默认显示跳转信息 “到xx页 确定”
    page: function(page) {
        return true;
    }
};

pagination.prototype.update = function(options) {
    this.$ul.innerHTML = "";
    this.options = extend({}, this.options, options);
    this.render();
};
pagination.prototype.render = function() {
    var a = (new Date()).valueOf();

    var options = this.options;

    if (!options.totalPages) {
        this.$element.style.display = "none";
        return;
    } else {
        this.$element.style.display = "block";
    }

    var htmlArr = [];
    var currentPageProxy = new PageProxy(options, options.currentPage);

    //update pagination by pengyic@yonyou.com
    //预设显示页码数
    var windows = 2;
    var total = options.totalPages - 0;
    var current = options.currentPage - 0;
    //预设显示页码数截断修正
    var fix = 0;
    var pageProxy;
    if (current - 2 <= windows + 1) {
        for (var i = 1; i <= current; i++) {
            pageProxy = new PageProxy(options, i);
            htmlArr.push(View.page(this, options, pageProxy));
        }

        fix = windows - (current - 1) < 0 ? 0 : windows - (current - 1);

        if (total - current - fix <= windows + 1) {
            for (var i = current + 1; i <= total; i++) {
                pageProxy = new PageProxy(options, i);
                htmlArr.push(View.page(this, options, pageProxy));
            }
        } else {
            for (var i = current + 1; i <= current + windows + fix; i++) {
                pageProxy = new PageProxy(options, i);
                htmlArr.push(View.page(this, options, pageProxy));
            }
            //添加分割'...'
            htmlArr.push(View.gap(this, options));

            pageProxy = new PageProxy(options, total);
            htmlArr.push(View.page(this, options, pageProxy));
        }

    } else {
        if (total - current <= windows + 1) {
            fix = windows - (total - current) < 0 ? 0 : windows - (total - current);

            for (var i = current - windows - fix; i <= total; i++) {
                pageProxy = new PageProxy(options, i);
                htmlArr.push(View.page(this, options, pageProxy));
            }
            if (i >= 2) {
                //添加分割'...'
                htmlArr.unshift(View.gap(this, options));
                pageProxy = new PageProxy(options, 1);
                htmlArr.unshift(View.page(this, options, pageProxy));
            }
        } else {
            for (var i = current - windows; i <= current + windows; i++) {
                pageProxy = new PageProxy(options, i);
                htmlArr.push(View.page(this, options, pageProxy));
            }
            //添加分割'...'
            htmlArr.push(View.gap(this, options));

            pageProxy = new PageProxy(options, total);
            htmlArr.push(View.page(this, options, pageProxy));

            //添加分割'...'
            htmlArr.unshift(View.gap(this, options));
            pageProxy = new PageProxy(options, 1);
            htmlArr.unshift(View.page(this, options, pageProxy));
        }
    }
    htmlArr.unshift(View.prevPage(this, options, currentPageProxy));
    htmlArr.push(View.nextPage(this, options, currentPageProxy));

    if (options.totalCount === undefined || options.totalCount <= 0) {
        options.totalCount = 0;
    }
    if (options.showState) {
        // 处理pageOption字符串
        var pageOption = '';
        options.pageList.forEach(function(item) {
            if (options.pageSize - 0 == item) {
                pageOption += '<option selected>' + item + '</option>';
            } else {
                pageOption += '<option>' + item + '</option>';
            }
        });
        var htmlTmp = '';
        //分别得到分页条后“共xxx条”、“显示xx条”、“到xx页 确定”三个html片段
        if (options.showTotal) {
            htmlTmp += '<div class="pagination-state">' + options.totalText + '&nbsp;' + options.totalCount + '&nbsp;' + options.listText + '</div>';
        }
        if (options.showColumn) {

            if (hasClass(this.$ul, 'pagination-sm')) {
                htmlTmp += '<div class="pagination-state">' + options.showText + '<select  class="page_z page_z_sm">' + pageOption + '</select>' + options.listText + '</div>';
            } else if (hasClass(this.$ul, 'pagination-lg')) {
                htmlTmp += '<div class="pagination-state">' + options.showText + '<select  class="page_z page_z_lg">' + pageOption + '</select>' + options.listText + '</div>';

            } else {
                htmlTmp += '<div class="pagination-state">' + options.showText + '<select  class="page_z">' + pageOption + '</select>' + options.listText + '</div>';
            }
        }
        if (options.showJump) {
            if (hasClass(this.$ul, 'pagination-sm')) {
                htmlTmp += '<div class="pagination-state">' + options.toText + '<input class="page_j text-center page_j_sm padding-left-0" value=' + options.currentPage + '>' + options.pageText + '<input class="pagination-jump pagination-jump-sm" type="button" value="' + options.okText + '"/></div>';

            } else if (hasClass(this.$ul, 'pagination-lg')) {
                htmlTmp += '<div class="pagination-state">' + options.toText + '<input class="page_j text-center page_j_lg padding-left-0" value=' + options.currentPage + '>' + options.pageText + '<input class="pagination-jump pagination-jump-lg" type="button" value="' + options.okText + '"/></div>';

            } else {
                htmlTmp += '<div class="pagination-state">' + options.toText + '<input class="page_j text-center padding-left-0" value=' + options.currentPage + '>' + options.pageText + '<input class="pagination-jump" type="button" value="' + options.okText + '"/></div>';

            }
        }
        htmlArr.push(htmlTmp);
    }

    //在将htmlArr插入到页面之前，对htmlArr进行处理
    this.$ul.innerHTML = "";
    this.$ul.insertAdjacentHTML('beforeEnd', htmlArr.join(''));

    var me = this;
    on(this.$ul.querySelector(".pagination-jump"), "click", function() {
        var jp, pz;
        jp = me.$ul.querySelector(".page_j").value || options.currentPage;
        pz = me.$ul.querySelector(".page_z").value || options.pageSize;
        if (isNaN(jp)) return;
        //if (pz != options.pageSize){
        //	me.$element.trigger('sizeChange', [pz, jp - 1])
        //}else{
        //	me.$element.trigger('pageChange', jp - 1)
        //}
        me.page(jp, options.totalPages, pz);
        //me.$element.trigger('pageChange', jp - 1)
        //me.$element.trigger('sizeChange', pz)
        return false;
    });

    on(this.$ul.querySelector('[role="first"] a'), 'click', function() {
        if (options.currentPage <= 1) return;
        me.firstPage();
        //me.$element.trigger('pageChange', 0)
        return false;
    });
    on(this.$ul.querySelector('[role="prev"] a'), 'click', function() {
        if (options.currentPage <= 1) return;
        me.prevPage();
        //me.$element.trigger('pageChange', options.currentPage - 1)
        return false;
    });
    on(this.$ul.querySelector('[role="next"] a'), 'click', function() {
        if (parseInt(options.currentPage) + 1 > options.totalPages) return;
        me.nextPage();
        //me.$element.trigger('pageChange', parseInt(options.currentPage) + 1)
        return false;
    });
    on(this.$ul.querySelector('[role="last"] a'), 'click', function() {
        if (options.currentPage == options.totalPages) return;
        me.lastPage();
        //me.$element.trigger('pageChange', options.totalPages - 1)
        return false;
    });
    each(this.$ul.querySelectorAll('[role="page"] a'), function(i, node) {
        on(node, 'click', function() {
            var pz = (me.$element.querySelector(".page_z") && $(this).val()) || options.pageSize;
            me.page(parseInt(this.innerHTML), options.totalPages, pz);
            //me.$element.trigger('pageChange', parseInt($(this).html()) - 1)

            return false;
        });
    });
    on(this.$ul.querySelector('.page_z'), 'change', function() {
        var pz = (me.$element.querySelector(".page_z") && $(this).val()) || options.pageSize;
        me.trigger('sizeChange', pz);
    });

};

pagination.prototype.page = function(pageIndex, totalPages, pageSize) {

    var options = this.options;

    if (totalPages === undefined) {
        totalPages = options.totalPages;
    }
    if (pageSize === undefined) {
        pageSize = options.pageSize;
    }
    var oldPageSize = options.pageSize;
    // if (pageIndex > 0 && pageIndex <= totalPages) {
    // 	if (options.page(pageIndex)) {

    // 		this.$ul.innerHTML="";
    // 		options.pageSize = pageSize;
    // 		options.currentPage = pageIndex;
    // 		options.totalPages = totalPages;
    // 		this.render();

    // 	}
    // }else{
    // 	return false;
    // }

    if (options.page(pageIndex)) {
        if (pageIndex <= 0) {
            pageIndex = 1;
        }

        if (pageIndex > totalPages) {
            pageIndex = totalPages;
        }
        this.$ul.innerHTML = "";
        options.pageSize = pageSize;
        options.currentPage = pageIndex;
        options.totalPages = totalPages;
        this.render();

    }
    var temppageIndex = (pageIndex - 1) < 0 ? 0 : (pageIndex - 1);
    if (pageSize != oldPageSize) {
        this.trigger('sizeChange', [pageSize, temppageIndex]);
    } else {
        this.trigger('pageChange', temppageIndex);
    }

    //this.$element.trigger('pageChange', pageIndex)

    return false;
};

pagination.prototype.firstPage = function() {
    return this.page(1);
};

pagination.prototype.lastPage = function() {
    return this.page(this.options.totalPages);
};

pagination.prototype.nextPage = function() {
    return this.page(parseInt(this.options.currentPage) + 1);
};

pagination.prototype.prevPage = function() {
    return this.page(this.options.currentPage - 1);
};

pagination.prototype.disableChangeSize = function() {
    this.$element.querySelector('.page_z').setAttribute('readonly', true);
};

pagination.prototype.enableChangeSize = function() {
    this.$element.querySelector('.page_z').removeAttribute('readonly');
};

// var old = $.fn.pagination;

// $.fn.pagination = Plugin
// $.fn.pagination.Constructor = Pagination

if (u.compMgr)
    u.compMgr.regComp({
        comp: pagination,
        compAsString: 'u.pagination',
        css: 'u-pagination'
    });

/**
 * Module : Kero pagination
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 19:09:39
 */

var PaginationAdapter = u.BaseAdapter.extend({
    mixins: [],
    init: function() {
        var self = this;
        if (!this.dataModel.pageSize() && this.options.pageSize)
            this.dataModel.pageSize(this.options.pageSize);
        this.options.pageSize = this.dataModel.pageSize() || this.options.pageSize;
        var options = extend({}, {
            el: this.element
        }, this.options);
        this.comp = new pagination(options);
        this.element['u.pagination'] = this.comp;
        this.comp.dataModel = this.dataModel;
        this.pageChange = getFunction(this.viewModel, this.options['pageChange']);
        this.sizeChange = getFunction(this.viewModel, this.options['sizeChange']);

        this.comp.on('pageChange', function(pageIndex) {
            self.defaultPageChange(pageIndex);
            if (typeof self.pageChange == 'function') {
                self.pageChange(pageIndex);
            }

        });
        this.comp.on('sizeChange', function(size, pageIndex) {
            self.defaultSizeChange(size, pageIndex);
            if (typeof self.sizeChange == 'function') {
                self.sizeChange(size, pageIndex);
            }
        });


        this.dataModel.totalPages.subscribe(function(value) {
            self.comp.update({
                totalPages: value
            });
        });

        this.dataModel.pageSize.subscribe(function(value) {
            self.comp.update({
                pageSize: value
            });
        });

        this.dataModel.pageIndex.subscribe(function(value) {
            self.comp.update({
                currentPage: value + 1
            });
        });

        this.dataModel.totalRow.subscribe(function(value) {
            self.comp.update({
                totalCount: value
            });
        });

        if (this.comp.options.pageList.length > 0) {
            this.comp.options.pageSize = this.comp.options.pageList[0];
            ///this.comp.trigger('sizeChange', options.pageList[0])
            var checkIndex = 0;
            var defalutPageSize = this.comp.dataModel.pageSize();
            if (defalutPageSize > 0) {
                checkIndex = this.comp.options.pageList.indexOf(defalutPageSize);
            }
            checkIndex = checkIndex < 0 ? 0 : checkIndex;
            this.dataModel.pageSize(this.comp.options.pageList[checkIndex]);
        }


        // 如果datatable已经创建则根据datatable设置分页组件
        // self.comp.update({totalPages: this.dataModel.totalPages()})
        // self.comp.update({pageSize: this.dataModel.pageSize()})
        // self.comp.update({currentPage: this.dataModel.pageIndex() + 1})
        // self.comp.update({totalCount: this.dataModel.totalRow()})
        self.comp.update({
            totalPages: this.dataModel.totalPages(),
            pageSize: this.dataModel.pageSize(),
            currentPage: this.dataModel.pageIndex() + 1,
            totalCount: this.dataModel.totalRow()
        });
    },

    defaultPageChange: function(pageIndex) {
        this.dataModel.pageIndex(pageIndex);
        if (this.dataModel.hasPage(pageIndex)) {
            this.dataModel.setCurrentPage(pageIndex);
        } else {}
    },

    defaultSizeChange: function(size, pageIndex) {
        this.dataModel.pageSize(size);
    },

    disableChangeSize: function() {
        this.comp.disableChangeSize();
    },

    enableChangeSize: function() {
        this.comp.enableChangeSize();
    }
});

if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: PaginationAdapter,
        name: 'pagination'
    });

exports.PaginationAdapter = PaginationAdapter;

}((this.bar = this.bar || {})));
