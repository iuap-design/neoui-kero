/** 
 * tinper-neoui-grid v3.1.22
 * grid
 * author : yonyou FED
 * homepage : https://github.com/iuap-design/tinper-neoui-grid#readme
 * bugs : https://github.com/iuap-design/tinper-neoui-grid/issues
 **/ 
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _dataSource = __webpack_require__(1);

	var _column = __webpack_require__(7);

	var _gridComp = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./gridComp\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var old = $.fn.grid;
	// 方法扩展
	/*
	 * 对象所支持的属性及默认值
	 */

	$.fn.grid = function (options) {
		var grid = $(this).data('gridComp');
		if (!grid) $(this).data('gridComp', grid = new _gridComp.gridComp(this, options));
		return grid;
	};
	$.fn.grid.gridComp = _gridComp.gridComp;
	$.fn.grid.gridCompColumn = _column.column;
	$.fn.grid.dataSource = _dataSource.dataSource;

	$.fn.grid.noConflict = function () {
		$.fn.grid = old;
		return this;
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.dataSource = undefined;

	var _dataSourceInit = __webpack_require__(2);

	var _re_gridCompSort = __webpack_require__(3);

	var _re_gridCompTree = __webpack_require__(6);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var dataSource = function dataSource(options, gridComp) {
	    _classCallCheck(this, dataSource);

	    this.init(options, gridComp);
	    this.sortRows();
	};

	;

	var dataSourceProto = dataSource.prototype;

	dataSourceProto.init = _dataSourceInit.init;
	dataSourceProto.sortRows = _dataSourceInit.sortRows;
	dataSourceProto.basicSortRows = _dataSourceInit.basicSortRows;
	dataSourceProto.treeSortRows = _dataSourceInit.treeSortRows;
	dataSourceProto.getSumValue = _dataSourceInit.getSumValue;

	dataSourceProto.basicSortRows = _re_gridCompSort.re_basicSortRows;

	/*
	 * tree
	 */


	dataSourceProto.treeSortRows = _re_gridCompTree.re_treeSortRows;
	dataSourceProto.pushChildRows = _re_gridCompTree.pushChildRows;

	exports.dataSource = dataSource;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	/*
	 * 处理参数
	 */
	var init = function init(options, gridComp) {
	    this.defaults = {};
	    this.gridComp = gridComp;
	    this.options = $.extend({}, this.defaults, options);
	    this.rows = new Array(); // 存储数据行
	    this.hasParentRows = new Array(); // 存在父项
	    this.nothasParentRows = new Array(); // 不存在父项
	};
	/*
	 * 将values转化为rows并进行排序
	 */
	var sortRows = function sortRows(field, sortType) {
	    if (this.gridComp.options.showTree) {
	        this.treeSortRows(field, sortType);
	    } else {
	        this.basicSortRows(field, sortType);
	    }
	    this.gridComp.eidtRowIndex = -1;
	};
	/*
	 * 将values转化为rows并进行排序(标准)
	 */
	var basicSortRows = function basicSortRows(field, sortType) {
	    var oThis = this,
	        dataType = "";
	    if (field) {
	        dataType = this.gridComp.getColumnByField(field).options.dataType;
	    }
	    this.rows = new Array();
	    if (this.options.values) {
	        $.each(this.options.values, function (i) {
	            var rowObj = {};
	            rowObj.value = this;
	            rowObj.valueIndex = i;
	            oThis.rows.push(rowObj);
	        });
	    }
	};
	var treeSortRows = function treeSortRows(field, sortType) {
	    this.basicSortRows(field, sortType);
	};
	/*
	 * 获取合计值
	 */
	var getSumValue = function getSumValue(field, gridCompColumn, gridComp) {
	    var sumValue = null;
	    if (gridCompColumn.options.sumCol) {
	        $.each(this.rows, function (i) {
	            var v = $(this.value).attr(field);
	            if (gridCompColumn.options.dataType == 'Int') {
	                v = gridComp.getInt(v, 0);
	                sumValue += parseInt(v);
	            } else {
	                v = gridComp.getFloat(v, 0);
	                sumValue = gridComp.accAdd(sumValue, parseFloat(v));
	            }
	        });
	    }
	    // 处理精度
	    if (gridCompColumn.options.dataType == 'Float' && gridCompColumn.options.precision) {
	        var o = {};
	        o.value = sumValue;
	        o.precision = gridCompColumn.options.precision;
	        sumValue = gridComp.DicimalFormater(o);
	    }
	    if (sumValue != null && sumValue != undefined && sumValue != 'null' && sumValue != 'undefined') {
	        return sumValue + '';
	    } else {
	        return '';
	    }
	};
	exports.init = init;
	exports.sortRows = sortRows;
	exports.basicSortRows = basicSortRows;
	exports.treeSortRows = treeSortRows;
	exports.getSumValue = getSumValue;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.re_basicSortRows = exports.sortRowsByPrio = exports.re_deleteOneRowTree = exports.canSortable = exports.sort_initGridEventFun = exports.sort_initEventFun = undefined;

	var _gridCompEvent = __webpack_require__(4);

	var sort_initEventFun = function sort_initEventFun() {
		// 扩展方法
		var oThis = this;
		$('#' + this.options.id).on('mouseup', function (e) {
			if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
				// 点击的是header区域
				oThis.mouseUpX = e.clientX;
				oThis.mouseUpY = e.clientY;
				//点击过程中鼠标没有移动
				if (oThis.mouseDownX == oThis.mouseUpX && oThis.mouseDownY == oThis.mouseUpY) {
					//或者移动距离小于5px(由于移动之后会显示屏幕div，暂时不做处理)
					oThis.columnClickX = e.clientX;
					oThis.columnClickY = e.clientY;
					var eleTh = $(e.target).closest('th')[0];
					if ($(e.target).hasClass('u-grid-header-columnmenu')) {} else {
						// 执行click操作,进行排序
						oThis.canSortable(e, eleTh);
					}
				}
			} else if ($(e.target).closest('#' + oThis.options.id + '_content').length > 0) {
				// 点击的是数据区域

			}
		});
	};
	var sort_initGridEventFun = function sort_initGridEventFun() {
		// 扩展方法
		var oThis = this;
	};
	/*
	 * 处理排序
	 */
	var canSortable = function canSortable(e, ele) {
		var oThis = this,
		    $ele = $(ele),
		    field = $ele.attr('field'),
		    sortable = this.getColumnAttr('sortable', field);
		if (sortable) {
			if (e.ctrlKey) {
				// 构建排序信息的数据结构
				var prioArray = [];
				$('.u-grid-header-sort-priority').each(function (index, domEle) {
					var $el = $(domEle);
					var p = parseInt($el.text());
					var f = $el.closest('th').attr('field');
					var st;
					if ($el.parent().hasClass("uf-arrow-up")) {
						st = 'asc';
					} else if ($el.parent().hasClass("uf-arrow-down")) {
						st = 'desc';
					}
					prioArray[p - 1] = { field: f, sortType: st };
				});
				// 页面调整
				/*修改ue将caret调整为caret*/
				var $caret;
				if (($caret = $ele.find('.uf-arrow-up')).length > 0) {
					var p = parseInt($caret.find('.u-grid-header-sort-priority').text());
					prioArray[p - 1].sortType = 'desc';
					$caret.removeClass('uf-arrow-up').addClass('uf-arrow-down');
				} else if (($caret = $ele.find('.uf-arrow-down')).length > 0) {
					var p = parseInt($caret.find('.u-grid-header-sort-priority').text());
					for (var i = p; i < prioArray.length; i++) {
						var $flag = $('[field=' + prioArray[i].field + ']').find('.u-grid-header-sort-priority');
						$flag.text(parseInt($flag.text()) - 1);
					}
					prioArray.splice(p - 1, 1);
					$caret.remove();
				} else {
					prioArray.push({ field: field, sortType: 'asc' });
					// $ele.first().append('<span class="uf uf-arrow-up u-grid-header-sort-span" ><span class="u-grid-header-sort-priority">'+prioArray.length+'</span></span>')
					$ele.first().first().append('<span class="uf uf-arrow-up u-grid-header-sort-span" ></span>');
				}
				// 执行排序逻辑
				this.dataSourceObj.sortRowsByPrio(prioArray);
			} else {
				if ($(".uf-arrow-up").parent().parent().parent()[0] == ele) {
					//原来为升序，本次为降序
					$(".uf-arrow-up").remove();
					//$(ele.firstChild)[0].insertAdjacentHTML('beforeEnd','<span class="uf uf-arrow-down u-grid-header-sort-span" ><span class="u-grid-header-sort-priority">1</span></span>');
					$(ele.firstChild.firstChild)[0].insertAdjacentHTML('beforeEnd', '<span class="uf uf-arrow-down u-grid-header-sort-span" ></span>');
					if (typeof this.options.onSortFun == 'function') {
						this.options.onSortFun(field, 'asc');
					} else {
						this.dataSourceObj.sortRows(field, "asc");
					}
				} else if ($(".uf-arrow-down").parent().parent().parent()[0] == ele) {
					//原来为降序，本次为不排序
					$(".uf-arrow-down").remove();
					if (typeof this.options.onSortFun == 'function') {
						this.options.onSortFun();
					} else {
						this.dataSourceObj.sortRows();
					}
				} else {
					//本次为升序
					$(".uf-arrow-up").remove();
					$(".uf-arrow-down").remove();
					// $(ele.firstChild)[0].insertAdjacentHTML('beforeEnd','<span class="uf uf-arrow-up u-grid-header-sort-span"><span class="u-grid-header-sort-priority">1</span></span>');
					$(ele.firstChild.firstChild)[0].insertAdjacentHTML('beforeEnd', '<span class="uf uf-arrow-up u-grid-header-sort-span"></span>');
					if (typeof this.options.onSortFun == 'function') {
						this.options.onSortFun(field, "desc");
					} else {
						this.dataSourceObj.sortRows(field, "desc");
					}
				}
			}

			oThis.repairContent();
			oThis.afterGridDivsCreate();
		}
	};
	var re_deleteOneRowTree = function re_deleteOneRowTree() {
		if (this.options.showTree) {
			this.dataSourceObj.sortRows();
		}
	};
	/*
	 * 根据排序的优先级的排序
	 * prioArray = [{field:'f2', sortType:'asc'}, {field:'f3', sortType:'desc'}, {field:'f1', sortType:'asc'}]
	 */
	var sortRowsByPrio = function sortRowsByPrio(prioArray, cancelSort) {
		var oThis = this;
		if (cancelSort) {
			this.rows = new Array();
			if (this.options.values) {
				$.each(this.options.values, function (i) {
					var rowObj = {};
					rowObj.value = this;
					rowObj.valueIndex = i;
					oThis.rows.push(rowObj);
				});
			}
		}

		var evalStr = function evalStr(i) {
			if (i == prioArray.length - 1) {
				return 'by(prioArray[' + i + '].field, prioArray[' + i + '].sortType)';
			} else {
				return 'by(prioArray[' + i + '].field, prioArray[' + i + '].sortType,' + evalStr(i + 1) + ')';
			}
		};

		var by = function by(field, sortType, eqCall) {
			var callee = arguments.callee;
			return function (a, b) {
				var v1 = $(a.value).attr(field);
				var v2 = $(b.value).attr(field);
				var dataType = oThis.gridComp.getColumnByField(field).options.dataType;
				if (dataType == 'Float') {
					v1 = parseFloat(v1);
					v2 = parseFloat(v2);
					if (isNaN(v1)) {
						return 1;
					}
					if (isNaN(v2)) {
						return -1;
					}
					if (v1 == v2 && eqCall) {
						return eqCall();
					}
					return sortType == 'asc' ? v1 - v2 : v2 - v1;
				} else if (dataType == 'Int') {
					v1 = parseInt(v1);
					v2 = parseInt(v2);
					if (isNaN(v1)) {
						return 1;
					}
					if (isNaN(v2)) {
						return -1;
					}
					if (v1 == v2 && eqCall) {
						return eqCall();
					}
					return sortType == 'asc' ? v1 - v2 : v2 - v1;
				} else {
					v1 = oThis.gridComp.getString(v1, '');
					v2 = oThis.gridComp.getString(v2, '');
					try {
						var rsl = v1.localeCompare(v2);
						if (rsl === 0 && eqCall) {
							return eqCall();
						}
						if (rsl === 0) {
							return 0;
						}
						return sortType == 'asc' ? rsl : -rsl;
					} catch (e) {
						return 0;
					}
				}
			};
		};

		this.rows.sort(eval(evalStr(0)));
	};
	/*
	 * 将values转化为rows并进行排序(标准)
	 */
	var re_basicSortRows = function re_basicSortRows(field, sortType) {
		var oThis = this;
		var dataType = "";
		if (field) {
			dataType = this.gridComp.getColumnByField(field).options.dataType;
		}
		if (sortType == "asc") {
			this.rows.sort(function (a, b) {
				var v1 = $(b.value).attr(field);
				var v2 = $(a.value).attr(field);
				if (dataType == 'Float') {
					v1 = parseFloat(v1);
					v2 = parseFloat(v2);
					if (isNaN(v1)) {
						return 1;
					}
					if (isNaN(v2)) {
						return -1;
					}
					return v1 - v2;
				} else if (dataType == 'Int') {
					v1 = parseInt(v1);
					v2 = parseInt(v2);
					if (isNaN(v1)) {
						return 1;
					}
					if (isNaN(v2)) {
						return -1;
					}
					return v1 - v2;
				} else {
					v1 = oThis.gridComp.getString(v1, '');
					v2 = oThis.gridComp.getString(v2, '');
					try {
						return v1.localeCompare(v2);
					} catch (e) {
						return 0;
					}
				}
			});
		} else if (sortType == "desc") {
			this.rows.sort(function (a, b) {
				var v1 = $(a.value).attr(field);
				var v2 = $(b.value).attr(field);
				if (dataType == 'Float') {
					v1 = parseFloat(v1);
					v2 = parseFloat(v2);
					if (isNaN(v1)) {
						return 1;
					}
					if (isNaN(v2)) {
						return -1;
					}
					return v1 - v2;
				} else if (dataType == 'Int') {
					v1 = parseInt(v1);
					v2 = parseInt(v2);
					if (isNaN(v1)) {
						return 1;
					}
					if (isNaN(v2)) {
						return -1;
					}
					return v1 - v2;
				} else {
					v1 = oThis.gridComp.getString(v1, '');
					v2 = oThis.gridComp.getString(v2, '');
					try {
						return v1.localeCompare(v2);
					} catch (e) {
						return 0;
					}
				}
			});
		} else {
			this.rows = new Array();
			if (this.options.values) {
				$.each(this.options.values, function (i) {
					var rowObj = {};
					rowObj.value = this;
					rowObj.valueIndex = i;
					oThis.rows.push(rowObj);
				});
			}
		}
	};
	exports.sort_initEventFun = sort_initEventFun;
	exports.sort_initGridEventFun = sort_initGridEventFun;
	exports.canSortable = canSortable;
	exports.re_deleteOneRowTree = re_deleteOneRowTree;
	exports.sortRowsByPrio = sortRowsByPrio;
	exports.re_basicSortRows = re_basicSortRows;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.initContentDivEventFun = exports.initGridEventFun = exports.initEventFun = undefined;

	var _gridBrowser = __webpack_require__(5);

	/*
	 * 创建完成之后顶层div添加监听
	 */
	var initEventFun = function initEventFun() {
	    var oThis = this;
	    $('#' + this.options.id).on('mousedown', function (e) {
	        if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
	            // 点击的是header区域
	            oThis.mouseDownX = e.clientX;
	            oThis.mouseDownY = e.clientY;
	        } else if ($(e.target).closest('#' + oThis.options.id + '_content').length > 0) {
	            // 点击的是数据区域
	        }
	    });
	};
	/*
	 * 创建完成之后grid层 div添加监听
	 */
	var initGridEventFun = function initGridEventFun() {
	    var oThis = this;
	    // 拖动
	    this.initContentDivEventFun();
	    // 全选
	    $('#' + this.options.id + '_header_multi_input').on('click', function (e) {
	        if (this.hasChecked) {
	            oThis.setAllRowUnSelect();
	            this.hasChecked = false;
	        } else {
	            oThis.setAllRowSelect();
	            this.hasChecked = true;
	        }
	    });
	};
	/*
	 * 内容区 div添加监听
	 */
	var initContentDivEventFun = function initContentDivEventFun() {
	    var oThis = this;
	    // 通过复选框设置选中行
	    $('#' + oThis.options.id + '_content .u-grid-content-left').on('click', function (e) {
	        var $input = $(e.target).closest('.u-grid-checkbox-outline');
	        if ($input.length > 0) {
	            var $div = $($input.parent());
	            var index = $('.u-grid-content-multiSelect', $div.parent()).index($div);
	            if ($input.hasClass('is-checked')) {
	                oThis.setRowUnselect(index);
	            } else {
	                oThis.setRowSelect(index);
	            }
	        }
	    });
	    // 同步滚动条
	    $('#' + this.options.id + '_content_div').on('scroll', function (e) {
	        oThis.scrollLeft = this.scrollLeft;
	        oThis.scrollTop = this.scrollTop;
	        $('#' + oThis.options.id + '_header_table').css('left', oThis.leftW - oThis.scrollLeft + oThis.fixedWidth + "px");
	        $('#' + oThis.options.id + '_noRowsShow').css('left', oThis.scrollLeft + "px");
	        $('#' + oThis.options.id + '_edit_form').css('left', oThis.scrollLeft + "px");
	        $('#' + oThis.options.id + '_content_multiSelect').css('top', -oThis.scrollTop + "px");
	        $('#' + oThis.options.id + '_content_numCol').css('top', -oThis.scrollTop + "px");
	        $('#' + oThis.options.id + '_content_fixed_div').css('top', -oThis.scrollTop + "px");
	        if (_gridBrowser.gridBrowser.isIE10 || _gridBrowser.gridBrowser.isIPAD) {
	            //ie10下示例系统中的档案节点新增数据之后前两次无法输入，因为此处会关闭输入控件
	        } else {
	            oThis.editClose();
	        }
	    });
	    // 数据行相关事件
	    $('#' + this.options.id + '_content_tbody').on('click', function (e) {
	        // 双击处理
	        if (typeof oThis.options.onDblClickFun == 'function') {
	            oThis.isDblEvent('tbodyClick', oThis.dblClickFun, e, oThis.clickFun, e);
	        } else {
	            oThis.clickFun(e);
	        }
	    });
	    $('#' + this.options.id + '_content_fixed_tbody').on('click', function (e) {
	        // 双击处理
	        if (typeof oThis.options.onDblClickFun == 'function') {
	            oThis.isDblEvent('tbodyClick', oThis.dblClickFun, e, oThis.clickFun, e);
	        } else {
	            oThis.clickFun(e);
	        }
	    });
	    $('#' + this.options.id + '_content').on('mousemove', function (e) {
	        var $tr = $(e.target).closest('tr'),
	            $div = $(e.target).closest('div'),
	            mousemoveIndex = -1;
	        // 首先清除所有的背景
	        if ($tr.length > 0) {
	            mousemoveIndex = $('tr', $tr.parent()).index($tr);
	        } else if ($div.length > 0 && ($div.hasClass('u-grid-content-multiSelect') || $div.hasClass('u-grid-content-num'))) {
	            //左侧复选及数字列
	            mousemoveIndex = $('div', $div.parent()).index($div);
	        }

	        oThis.trHoverFun(mousemoveIndex);
	    });
	    $('#' + this.options.id + '_content').on('mouseout', function (e) {
	        $('#' + oThis.options.id + '_content_tbody').find('tr').removeClass('u-grid-move-bg');
	        $('#' + oThis.options.id + '_content_fixed_tbody').find('tr').removeClass('u-grid-move-bg');
	        if (oThis.options.multiSelect) $('#' + oThis.options.id + '_content_multiSelect').find('div').removeClass('u-grid-move-bg');
	        if (oThis.options.showNumCol) $('#' + oThis.options.id + '_content_numCol').find('div').removeClass('u-grid-move-bg');
	        if (typeof oThis.options.onContentOut == 'function') {
	            var obj = {};
	            obj.gridObj = oThis;
	            var $tr = $(e.target).closest('tr');
	            if ($tr.length > 0 && !$tr.is('.u-grid-content-sum-row')) {
	                var mouseoutIndex = $('tr[role="row"]', $tr.parent()).index($tr);
	                obj.rowObj = oThis.dataSourceObj.rows[mouseoutIndex];
	                obj.rowIndex = mouseoutIndex;
	            }
	            oThis.options.onContentOut(obj);
	        }
	    });
	};

	exports.initEventFun = initEventFun;
	exports.initGridEventFun = initGridEventFun;
	exports.initContentDivEventFun = initContentDivEventFun;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	var gridBrowser = {},
	    userAgent = navigator.userAgent,
	    ua = userAgent.toLowerCase(),
	    s;
	if (s = ua.match(/msie ([\d.]+)/)) {
	    gridBrowser.isIE = true;
	}
	if (gridBrowser.isIE) {
	    var mode = document.documentMode;
	    if (mode == null) {} else {
	        if (mode == 8) {
	            gridBrowser.isIE8 = true;
	        } else if (mode == 9) {
	            gridBrowser.isIE9 = true;
	        } else if (mode == 10) {
	            gridBrowser.isIE10 = true;
	        }
	    }
	}

	if (ua.indexOf('Android') > -1 || ua.indexOf('android') > -1 || ua.indexOf('Adr') > -1 || ua.indexOf('adr') > -1) {
	    gridBrowser.isAndroid = true;
	}

	if (gridBrowser.isAndroid) {
	    if (window.screen.width >= 768 && window.screen.width < 1024) {
	        gridBrowser.isAndroidPAD = true;
	    }
	    if (window.screen.width <= 768) {
	        gridBrowser.isAndroidPhone = true;
	    }
	}

	if (ua.match(/iphone/i)) {
	    gridBrowser.isIOS = true;
	    gridBrowser.isIphone = true;
	}

	if (ua.match(/ipad/i)) {
	    gridBrowser.isIOS = true;
	    gridBrowser.isIPAD = true;
	}

	if (gridBrowser.isIphone || gridBrowser.isAndroidPhone) {
	    gridBrowser.isMobile = true;
	}

	exports.gridBrowser = gridBrowser;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	var re_initTree = function re_initTree(options, gridOptions) {
		if (gridOptions.showTree) {
			options.sortable = false;
		}
		return options;
	};
	var re_initOptionsTree = function re_initOptionsTree() {
		if (this.options.showTree) {
			this.options.showNumCol = false;
		}
	};
	var re_clickFunTree = function re_clickFunTree(e) {
		var oThis = this,
		    $target = $(e.target),
		    $td = $target.closest('td');

		if ($td.length > 0) {
			var $tr = $td.parent();
			var index = this.getTrIndex($tr);
			var row = oThis.dataSourceObj.rows[index];
			if (row) {
				var rowChildIndex = oThis.getChildRowIndex(row);
				if ($target.hasClass('uf-reduce-s-o') || $target.hasClass('uf-add-s-o')) {
					var minus = $td.find('.uf-reduce-s-o');
					var plus = $td.find('.uf-add-s-o');
					if (minus.length > 0) {
						// 合上 需要将所有的都合上
						minus.removeClass('uf-reduce-s-o').addClass('uf-add-s-o');
						if (rowChildIndex.length > 0) {
							var allChildRowIndex = oThis.getAllChildRowIndex(row);
							$.each(allChildRowIndex, function () {
								var $tr1 = $('tr[role="row"]:eq(' + parseInt(this) + ')', $tr.parent());
								$tr1.css('display', 'none');
								// 左侧复选区隐藏
								$('#' + oThis.options.id + '_content_multiSelect >div:nth-child(' + (parseInt(this) + 1) + ')').css('display', 'none');
								$('.uf-reduce-s-o', $tr1).removeClass('uf-reduce-s-o').addClass('uf-add-s-o');
							});
						}
						if (this.options.editType == 'form') {
							$('#' + this.options.id + '_multiSelect_edit').remove(null, true);
							$('#' + this.options.id + '_numCol_edit').remove(null, true);
							$('#' + this.options.id + '_edit_tr').remove(null, true);
							$('#' + this.options.id + '_edit_tr1').remove(null, true);
						}
					} else if (plus.length > 0) {
						// 展开
						plus.removeClass('uf-add-s-o').addClass('uf-reduce-s-o');
						if (rowChildIndex.length > 0) {
							$.each(rowChildIndex, function () {
								var $tr1 = $('tr[role="row"]:eq(' + parseInt(this) + ')', $tr.parent());
								$tr1.css('display', '');
								var ss = $('#' + oThis.options.id + '_content_multiSelect >div:nth-child(' + (parseInt(this) + 1) + ')')[0];
								$('#' + oThis.options.id + '_content_multiSelect >div:nth-child(' + (parseInt(this) + 1) + ')').css('display', '');
							});
						}
					}
					this.resetLeftHeight();
				}
			}
		}
	};
	var re_addOneRowTree = function re_addOneRowTree(row, index, rowObj) {
		var oThis = this,
		    l = this.dataSourceObj.rows.length,
		    displayFlag;
		// 存在树结构
		if (this.options.showTree) {
			this.hasParent = false;
			this.hasChildF = false;
			var keyField = this.options.keyField;
			var parentKeyField = this.options.parentKeyField;
			var keyValue = this.getString($(row).attr(keyField), '');
			rowObj.keyValue = keyValue;
			var parentKeyValue = this.getString($(row).attr(parentKeyField), '');
			rowObj.parentKeyValue = parentKeyValue;
			var parentChildLength;
			/* 判断是否存在父项/子项 */
			$.each(this.dataSourceObj.rows, function (i) {
				var value = this.value;
				var nowKeyValue = oThis.getString($(value).attr(keyField), '');
				var nowParentKeyValue = oThis.getString($(value).attr(parentKeyField), '');
				if (nowKeyValue == parentKeyValue) {
					/* 取父项的index和父项的子index*/
					oThis.hasParent = true;
					oThis.addRowParentIndex = i;
					parentChildLength = oThis.getAllChildRow(this).length;
					var parentLevel = this.level;
					rowObj.level = parentLevel + 1;
					// 由于不止需要计算最后一个子节点，同时需要计算子节点的子节点。所以现在添加到父节点的下面一个
					index = oThis.addRowParentIndex + parentChildLength + 1;
					if (!oThis.options.needTreeSort) return false;
				}
				if (nowParentKeyValue == keyValue) {
					oThis.hasChildF = true;
				}
				if (oThis.hasParent && oThis.hasChildF) return false;
			});
			if (!this.hasParent) {
				rowObj.level = 0;
				if (index != l) {
					// 如果没有父项则插入到最后，因为index有可能插入到其他节点的子节点之中，计算复杂
					index = l;
				}
			}
			if (this.hasParent) {
				var $pTr = $('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]').eq(oThis.addRowParentIndex);
				if (parentChildLength > 0) {
					// 如果存在父项并且父项存在子项则需要判断父项是否展开
					var openDiv = $('.uf-add-s-o', $pTr);
					if (!(openDiv.length > 0)) {
						displayFlag = 'block';
					}
				} else {
					// 如果存在父项并且父项原来没有子项则需要添加图标
					if (this.options.autoExpand) {
						displayFlag = 'block';
					}

					var d = $("div:eq(0)", $pTr);
					var openDiv = $('.uf-add-s-o', $pTr);
					var closeDiv = $('.uf-reduce-s-o', $pTr);
					if (this.options.autoExpand) {
						var spanHtml = '<span class="uf u-grid-content-tree-span uf-reduce-s-o"></span>';
					} else {
						var spanHtml = '<span class="uf u-grid-content-tree-span uf-add-s-o"></span>';
					}
					if (d.length > 0 && openDiv.length == 0 && closeDiv.length == 0) {
						d[0].insertAdjacentHTML('afterBegin', spanHtml);
						var oldLeft = parseInt(d[0].style.left);
						l = oldLeft - 16;
						if (l > 0 || l == 0) {
							d[0].style.left = l + "px";
						}
					}
					if (openDiv.length > 0) {
						openDiv.removeClass('uf-add-s-o').addClass('uf-reduce-s-o');
					}
				}
			}
		}

		return {
			index: index,
			displayFlag: displayFlag
		};
	};
	var re_addOneRowTreeHasChildF = function re_addOneRowTreeHasChildF(rowObj) {
		if (this.hasChildF) {
			//如果存在子项则重新渲染整个区域
			this.dataSourceObj.sortRows();
			this.repairContent();
		} else {
			// 修改rowObj 和parent的变量
			if (this.hasParent) {
				var parentRowObj = this.dataSourceObj.rows[this.addRowParentIndex];
				parentRowObj.hasChild = true;
				parentRowObj.childRow.push(rowObj);
				parentRowObj.childRowIndex.push(rowObj.valueIndex);
				rowObj.parentRow = parentRowObj;
				rowObj.parentRowIndex = this.addRowParentIndex;
			}
			rowObj.hasChild = false;
			rowObj.childRow = new Array();
			rowObj.childRowIndex = new Array();
		}
	};
	var re_updateValueAtTree = function re_updateValueAtTree(rowIndex, field, value, force) {
		var oThis = this;
		var keyField = this.options.keyField;
		var parentKeyField = this.options.parentKeyField;
		if (this.options.showTree && (field == keyField || field == parentKeyField)) {
			// 目前已经不适用grid源生的编辑设置了，因为树表时关闭edit
			var hasParent = false;
			var hasChildF = false;

			$.each(this.dataSourceObj.rows, function (i) {
				var vv = this.value;
				var nowKeyValue = oThis.getString($(vv).attr(keyField), '');
				var nowParentKeyValue = oThis.getString($(vv).attr(parentKeyField), '');
				if (field == keyField && value == nowParentKeyValue) {
					//修改的是keyfield，判断是否存在子项
					hasChildF = true;
				}
				if (field == parentKeyField && value == nowKeyValue) {
					//修改的是parentKeyField，判断是否存在父项
					hasParent = true;
				}
			});
			if (hasChildF || hasParent) {
				//删除当前行之后重新插入当前行由addonerow来进行树结构处理
				var rowValue = $(this.dataSourceObj.rows[rowIndex].value);
				this.deleteOneRow(rowIndex);
				this.addOneRow(rowValue[0]);
			}
		}
		if (this.options.showTree && (field == keyField || field == parentKeyField) && (hasChildF || hasParent)) {
			rowIndex = this.getRowIndexByValue(field, value);
		}
		return rowIndex;
	};
	/*
	 * 获取数据行下所有子元素
	 */
	var getAllChildRow = function getAllChildRow(row) {
		// if(row.allChildRow && row.allChildRow.length > 0){
		// 	return row.allChildRow;
		// }
		row.allChildRow = new Array();
		this.getAllChildRowFun(row, row.allChildRow);
		return row.allChildRow;
	};
	var re_getChildRowIndex = function re_getChildRowIndex(row) {
		var result = [];
		if (row.childRow && row.childRow.length > 0) {
			$.each(row.childRow, function () {
				result.push(this.valueIndex);
			});
		}
		return result;
	};
	/*
	 * 获取数据行下所有子元素的index
	 */
	var getAllChildRowIndex = function getAllChildRowIndex(row) {
		// if(row.allChildRowIndex && row.allChildRowIndex.length > 0){
		// 	return row.allChildRowIndex;
		// }
		row.allChildRowIndex = new Array();
		this.getAllChildRowIndexFun(row, row.allChildRowIndex);
		return row.allChildRowIndex;
	};
	var getAllChildRowFun = function getAllChildRowFun(row, rowArry) {
		var oThis = this;
		if (row.childRow.length > 0) {
			Array.prototype.push.apply(rowArry, row.childRow);
			$.each(row.childRow, function () {
				oThis.getAllChildRowFun(this, rowArry);
			});
		}
	};
	var getAllChildRowIndexFun = function getAllChildRowIndexFun(row, rowArry) {
		var oThis = this;
		if (row.childRow.length > 0) {
			Array.prototype.push.apply(rowArry, this.getChildRowIndex(row));
			$.each(row.childRow, function () {
				oThis.getAllChildRowIndexFun(this, rowArry);
			});
		}
	};
	/* 展开某个节点 */
	var expandNode = function expandNode(keyValue) {
		var rowIndex = this.getRowIndexByValue(this.options.keyField, keyValue);
		this.expandNodeByIndex(rowIndex);
	};
	var expandNodeByIndex = function expandNodeByIndex(rowIndex) {
		var row = this.getRowByIndex(rowIndex);
		var parentExpand = false,
		    parentIndex,
		    needExpanedParent = new Array();
		var whileRow = row;
		while (!parentExpand) {
			if (whileRow.parentKeyValue == '') {
				parentExpand = true;
				break;
			} else {
				parentIndex = whileRow.parentRowIndex;
				whileRow = whileRow.parentRow;
				var $pTr = $('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]').eq(parentIndex);
				var openDiv = $('.uf-add-s-o', $pTr);
				if (openDiv.length > 0) {
					//合着
					needExpanedParent.push(parentIndex);
				} else {
					parentExpand = true;
					break;
				}
			}
		}
		if (needExpanedParent.length > 0) {
			for (var i = needExpanedParent.length - 1; i > -1; i--) {
				var index = needExpanedParent[i];
				var $pTr = $('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]').eq(index);
				var openDiv = $('.uf-add-s-o', $pTr);
				openDiv.click();
			}
		}

		var $Tr = $('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]').eq(rowIndex);
		var openDiv = $('.uf-add-s-o', $Tr);
		var firstDiv = $('.u-grid-content-td-div', $Tr);
		if (openDiv.length > 0) openDiv.click();else firstDiv.click();
	};
	/*
	 * 将values转化为rows并进行排序(数表)
	 */
	var re_treeSortRows = function re_treeSortRows(field, sortType) {
		var oThis = this;
		var spliceHasParentRows = new Array();
		this.rows = new Array();
		this.hasParentRows = new Array();
		this.nothasParentRows = new Array();
		if (this.options.values) {
			$.each(this.options.values, function (i) {
				var rowObj = {};
				var $this = $(this);
				var keyField = oThis.gridComp.options.keyField;
				var parentKeyField = oThis.gridComp.options.parentKeyField;
				var keyValue = oThis.gridComp.getString($this.attr(keyField), '');
				var parentKeyValue = oThis.gridComp.getString($this.attr(parentKeyField), '');
				rowObj.valueIndex = i;
				rowObj.value = this;
				rowObj.keyValue = keyValue;
				rowObj.parentKeyValue = parentKeyValue;
				if (parentKeyValue == '') {
					oThis.nothasParentRows.push(rowObj);
				} else {
					oThis.hasParentRows.push(rowObj);
				}
				oThis.rows.push(rowObj);
			});
			// 判断存在父项的数据的父项是否真正存在
			$.each(this.hasParentRows, function (i) {
				var parentKeyValue = this.parentKeyValue;
				var hasParent = false;
				$.each(oThis.rows, function () {
					if (this.keyValue == parentKeyValue) {
						hasParent = true;
					}
				});
				if (!hasParent) {
					spliceHasParentRows.push(this);
					oThis.nothasParentRows.push(this);
				}
			});
			$.each(spliceHasParentRows, function () {
				var index = oThis.hasParentRows.indexOf(this);
				oThis.hasParentRows.splice(index, 1);
			});
			oThis.rows = new Array();
			var level = 0;
			// 遍历nothasParentRows，将子项加入rows
			$.each(this.nothasParentRows, function (i) {
				this.level = level;
				oThis.rows.push(this);
				oThis.pushChildRows(this, level);
			});
		}
	};
	/*
	 * 将当前行子项插入rows数组
	 */
	var pushChildRows = function pushChildRows(row, level) {
		var keyValue = row.keyValue;
		var oThis = this;
		var nowLevel = parseInt(level) + 1;
		var hasChild = false;
		var childRowArray = new Array();
		var childRowIndexArray = new Array();
		var spliceHasParentRows = new Array();
		$.each(this.hasParentRows, function (i) {
			if (this && this.parentKeyValue == keyValue) {
				hasChild = true;
				this.level = nowLevel;
				oThis.rows.push(this);
				childRowArray.push(this);
				var index = parseInt(oThis.rows.length - 1);
				childRowIndexArray.push(index);
				spliceHasParentRows.push(this);
				oThis.pushChildRows(this, nowLevel);
			}
		});
		$.each(spliceHasParentRows, function () {
			var index = oThis.hasParentRows.indexOf(this);
			oThis.hasParentRows.splice(index, 1);
		});
		row.hasChild = hasChild;
		row.childRow = childRowArray;
		row.childRowIndex = childRowIndexArray;
	};
	exports.re_initTree = re_initTree;
	exports.re_initOptionsTree = re_initOptionsTree;
	exports.re_clickFunTree = re_clickFunTree;
	exports.re_addOneRowTree = re_addOneRowTree;
	exports.re_addOneRowTreeHasChildF = re_addOneRowTreeHasChildF;
	exports.re_updateValueAtTree = re_updateValueAtTree;
	exports.getAllChildRow = getAllChildRow;
	exports.re_getChildRowIndex = re_getChildRowIndex;
	exports.getAllChildRowIndex = getAllChildRowIndex;
	exports.getAllChildRowFun = getAllChildRowFun;
	exports.getAllChildRowIndexFun = getAllChildRowIndexFun;
	exports.expandNode = expandNode;
	exports.expandNodeByIndex = expandNodeByIndex;
	exports.re_treeSortRows = re_treeSortRows;
	exports.pushChildRows = pushChildRows;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.column = undefined;

	var _columnInit = __webpack_require__(8);

	var _re_gridCompTree = __webpack_require__(6);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var column = function column(options, gridComp) {
	    _classCallCheck(this, column);

	    this.init(options, gridComp);
	};

	;

	var gridCompColumnProto = column.prototype;

	gridCompColumnProto.init = _columnInit.init;
	gridCompColumnProto.initTree = _columnInit.initTree;
	gridCompColumnProto.getBooleanOptions = _columnInit.getBooleanOptions;

	/*
	 * tree
	 */


	gridCompColumnProto.initTree = _re_gridCompTree.re_initTree;

	exports.column = column;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	/*
	 * 处理参数
	 */
	var init = function init(options, gridComp) {
	    // this.gridComp = gridComp; // 在处理前端缓存将column转为string的时候会因为此属性出现死循环
	    var gridOptions = gridComp.options;
	    this.gridGetBoolean = gridComp.getBoolean;
	    this.defaults = {
	        width: '200', // 默认宽度为200
	        sortable: true, // 是否可以排序
	        canDrag: true, // 是否可以拖动
	        fixed: false, // 是否固定列
	        visible: true, // 是否显示
	        canVisible: true, // 是否可以隐藏
	        sumCol: false, // 是否计算合计
	        editable: true, // 是否可修改
	        editFormShow: true, // 是否可修改
	        autoExpand: false, // 是否自动扩展列
	        editType: 'text', // 编辑类型，支持传入function扩展
	        dataType: 'String', // 数据类型,String, Date, Datetime, Int, Float
	        //precision:  //精度
	        format: 'YYYY-MM-DD hh:mm:ss',
	        //renderType:'', 渲染类型
	        //headerColor
	        headerLevel: 1, // header层级
	        hiddenLevel: 1 };
	    // 从grid继承的属性
	    var gridDefault = {
	        sortable: gridOptions.sortable,
	        canDrag: gridOptions.canDrag,
	        width: gridOptions.columnWidth
	    };
	    if (options.dataType == 'Date') {
	        this.defaults.format = 'YYYY-MM-DD';
	    }
	    // 树表暂时不支持排序
	    options = this.initTree(options, gridOptions);
	    this.options = $.extend({}, this.defaults, gridDefault, options);
	    this.getBooleanOptions();
	    try {
	        if (typeof this.options.renderType == 'string') this.options.renderType = eval(this.options.renderType);
	    } catch (e) {}
	    try {
	        if (typeof this.options.editType == 'string') this.options.editType = eval(this.options.editType);
	    } catch (e) {}

	    this.options.width = this.options.width;
	    this.firstColumn = false;
	};
	var initTree = function initTree(options) {
	    return options;
	};
	var getBooleanOptions = function getBooleanOptions() {
	    this.options.sortable = this.gridGetBoolean(this.options.sortable);
	    this.options.canDrag = this.gridGetBoolean(this.options.canDrag);
	    this.options.fixed = this.gridGetBoolean(this.options.fixed);
	    this.options.visible = this.gridGetBoolean(this.options.visible);
	    this.options.canVisible = this.gridGetBoolean(this.options.canVisible);
	    this.options.sumCol = this.gridGetBoolean(this.options.sumCol);
	    this.options.editable = this.gridGetBoolean(this.options.editable);
	    this.options.editFormShow = this.gridGetBoolean(this.options.editFormShow);
	    this.options.autoExpand = this.gridGetBoolean(this.options.autoExpand);
	};

	exports.init = init;
	exports.initTree = initTree;
	exports.getBooleanOptions = getBooleanOptions;

/***/ }
/******/ ]);