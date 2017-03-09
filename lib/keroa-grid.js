(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', './keroa-baseAdapter', 'tinper-sparrow/src/util', 'tinper-sparrow/src/util/formater', 'tinper-sparrow/src/util/masker', 'tinper-sparrow/src/util/dataRender', 'kero/src/indexDataTable', 'tinper-sparrow/src/event', './keroa-year', './keroa-month', './keroa-yearmonth', './keroa-time', './keroa-string', './keroa-integer', './keroa-checkbox', './keroa-combo', './keroa-radio', './keroa-float', './keroa-currency', './keroa-datetimepicker', './keroa-url', './keroa-password', './keroa-percent', 'tinper-neoui/src/neoui-validate', 'tinper-neoui/src/neoui-message', 'compox/src/compMgr', 'tinper-sparrow/src/util/i18n', 'tinper-sparrow/src/core', 'tinper-sparrow/src/dom'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('./keroa-baseAdapter'), require('tinper-sparrow/src/util'), require('tinper-sparrow/src/util/formater'), require('tinper-sparrow/src/util/masker'), require('tinper-sparrow/src/util/dataRender'), require('kero/src/indexDataTable'), require('tinper-sparrow/src/event'), require('./keroa-year'), require('./keroa-month'), require('./keroa-yearmonth'), require('./keroa-time'), require('./keroa-string'), require('./keroa-integer'), require('./keroa-checkbox'), require('./keroa-combo'), require('./keroa-radio'), require('./keroa-float'), require('./keroa-currency'), require('./keroa-datetimepicker'), require('./keroa-url'), require('./keroa-password'), require('./keroa-percent'), require('tinper-neoui/src/neoui-validate'), require('tinper-neoui/src/neoui-message'), require('compox/src/compMgr'), require('tinper-sparrow/src/util/i18n'), require('tinper-sparrow/src/core'), require('tinper-sparrow/src/dom'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.keroaBaseAdapter, global.util, global.formater, global.masker, global.dataRender, global.indexDataTable, global.event, global.keroaYear, global.keroaMonth, global.keroaYearmonth, global.keroaTime, global.keroaString, global.keroaInteger, global.keroaCheckbox, global.keroaCombo, global.keroaRadio, global.keroaFloat, global.keroaCurrency, global.keroaDatetimepicker, global.keroaUrl, global.keroaPassword, global.keroaPercent, global.neouiValidate, global.neouiMessage, global.compMgr, global.i18n, global.core, global.dom);
		global.keroaGrid = mod.exports;
	}
})(this, function (exports, _keroaBaseAdapter, _util, _formater, _masker, _dataRender, _indexDataTable, _event, _keroaYear, _keroaMonth, _keroaYearmonth, _keroaTime, _keroaString, _keroaInteger, _keroaCheckbox, _keroaCombo, _keroaRadio, _keroaFloat, _keroaCurrency, _keroaDatetimepicker, _keroaUrl, _keroaPassword, _keroaPercent, _neouiValidate, _neouiMessage, _compMgr, _i18n, _core, _dom) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.GridAdapter = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	var GridAdapter = _keroaBaseAdapter.BaseAdapter.extend({
		mixins: [],
		init: function init() {
			var options = this.options,

			// 初始options中包含grid的属性设置，还需要增加dataSource、columns、transMap以及事件处理
			opt = options || {},
			    viewModel = this.viewModel;
			var element = this.element;

			this.id = opt['id'];

			var oThis = this;
			var compDiv = null;
			var comp = null;
			this.dataTable = (0, _util.getJSObject)(viewModel, options["data"]);
			this.element = element;
			this.$element = $(element);
			this.editComponentDiv = {};
			this.editComponent = {};
			this.id = options['id'];
			this.gridOptions = options;

			// 在html中将函数类参数进行处理
			this.gridOptions.onBeforeRowSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeRowSelected);
			this.gridOptions.onRowSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onRowSelected);
			this.gridOptions.onBeforeRowUnSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeRowUnSelected);
			this.gridOptions.onRowUnSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onRowUnSelected);
			this.gridOptions.onBeforeAllRowSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeAllRowSelected);
			this.gridOptions.onAllRowSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onAllRowSelected);
			this.gridOptions.onBeforeAllRowUnSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeAllRowUnSelected);
			this.gridOptions.onAllRowUnSelected = (0, _util.getFunction)(viewModel, this.gridOptions.onAllRowUnSelected);
			this.gridOptions.onBeforeRowFocus = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeRowFocus);
			this.gridOptions.onRowFocus = (0, _util.getFunction)(viewModel, this.gridOptions.onRowFocus);
			this.gridOptions.onBeforeRowUnFocus = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeRowUnFocus);
			this.gridOptions.onRowUnFocus = (0, _util.getFunction)(viewModel, this.gridOptions.onRowUnFocus);
			this.gridOptions.onDblClickFun = (0, _util.getFunction)(viewModel, this.gridOptions.onDblClickFun);
			this.gridOptions.onBeforeValueChange = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeValueChange);
			this.gridOptions.onValueChange = (0, _util.getFunction)(viewModel, this.gridOptions.onValueChange);
			this.gridOptions.onBeforeClickFun = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeClickFun);
			this.gridOptions.onBeforeEditFun = (0, _util.getFunction)(viewModel, this.gridOptions.onBeforeEditFun);
			this.gridOptions.onRowHover = (0, _util.getFunction)(viewModel, this.gridOptions.onRowHover);
			this.gridOptions.afterCreate = (0, _util.getFunction)(viewModel, this.gridOptions.afterCreate);

			/*扩展onBeforeEditFun，如果点击的是单选或者复选的话则不执行原有的编辑处理，直接通过此js进行处理*/
			var customOnBeforeEditFun = this.gridOptions.onBeforeEditFun;
			var newOnBeforeEditFun = function newOnBeforeEditFun(obj) {
				var colIndex = obj.colIndex;
				var $tr = obj.$tr;

				if ($($tr.find('td')[colIndex]).find('[type=radio]').length > 0 || $($tr.find('td')[colIndex]).find('[type=checkbox]').length > 0) {
					return false;
				} else {
					if (typeof customOnBeforeEditFun == 'function') {
						return customOnBeforeEditFun(obj);
					} else {
						return true;
					}
				}
			};
			this.gridOptions.onBeforeEditFun = newOnBeforeEditFun;
			/*
    * 处理column参数  item
    * div子项div存储column信息
    */
			var columns = [];
			$("div", this.$element).each(function () {
				var ops = $(this).attr('options');
				if (typeof ops == "undefined") var column = eval("(" + ops + ")");else var column = JSON.parse(ops);
				// 处理精度，以dataTable的精度为准

				/*处理editType*/
				var eType = (0, _util.getFunction)(viewModel, column.editType);
				var rType = (0, _util.getFunction)(viewModel, column.renderType);
				var afterEType = (0, _util.getFunction)(viewModel, column.afterEType);
				var afterRType = (0, _util.getFunction)(viewModel, column.afterRType);
				var sumRenderType = (0, _util.getFunction)(viewModel, column.sumRenderType);
				column.sumRenderType = sumRenderType;
				var eOptions = {};
				if (column.editOptions) {
					if (typeof column.editOptions == "undefined") var eOptions = eval("(" + column.editOptions + ")");else var eOptions = column.editOptions;
				}
				eOptions.data = options['data'];
				eOptions.field = column['field'];
				// 默认按照string处理
				if (!eType) eType = 'string';
				if (eType == 'number') // 兼容之前版本
					eType = 'integer';
				if (eType == 'string' || eType == 'integer' || eType == 'checkbox' || eType == 'combo' || eType == 'radio' || eType == 'float' || eType == 'currency' || eType == 'datetime' || eType == 'year' || eType == 'month' || eType == 'yearmonth' || eType == 'date' || eType == 'time' || eType == 'url' || eType == 'password' || eType == 'percent' || eType == 'phoneNumber' || eType == 'landLine') {
					oThis.createDefaultEdit(eType, eOptions, options, viewModel, column);
					column.editType = function (obj) {
						if (oThis.editComponentDiv[column.field] && oThis.editComponentDiv[column.field][0].childNodes.length > 0) {} else {
							//IE8有问题，所以需要重新创建div,将上面的代码直接拷贝
							oThis.createDefaultEdit(eType, eOptions, options, viewModel, column);
						}
						var comp = oThis.editComponent[column.field];
						var rowId = obj.rowObj['$_#_@_id'];
						var row = oThis.dataTable.getRowByRowId(rowId);
						var index = oThis.dataTable.getRowIndex(row);
						if (comp) {
							comp.options.rowIndex = index;
						}
						if (!comp) {
							$(obj.element).parent().focus();
							return;
						}
						obj.element.innerHTML = '';
						var row = oThis.getDataTableRow(obj.rowObj);
						$(obj.element).append(oThis.editComponentDiv[column.field]);

						if (comp.required) {
							$(obj.element).parent().parent().find('.u-grid-edit-mustFlag').show();
						}

						// checkbox 类型  此段逻辑不知道是什么，暂时注释掉
						// if($Div.find('.checkbox').length > 0) {
						// 	$Div.closest('.u-grid-edit-div').css({'position': 'absolute', 'left': '83px'});
						// 	$Div.closest('.u-grid-edit-whole-div').find('.u-grid-edit-label').css({'margin-left': '112px', 'text-align': 'left'})
						// }
						$(obj.element).parent().focus();
						if (comp) comp.modelValueChange(obj.value);
						obj.gridObj.editComp = comp;

						// form也按照showFix为true处理，如果有问题则调整组件显示
						// if(obj.gridObj.options.editType == 'form'){
						// 	//form默认为false
						// 	try{
						// 		comp.options.showFix = false;
						// 	}catch(e){

						// 	}
						// 	try{
						// 		comp.comp.options.showFix = false;
						// 	}catch(e){

						// 	}
						// }else{
						// 	try{
						// 		comp.options.showFix = true;
						// 	}catch(e){

						// 	}
						// 	try{
						// 		comp.comp.options.showFix = true;
						// 	}catch(e){

						// 	}
						// }

						// 根据惊道需求增加editype之后的处理,此处只针对grid.js中的默认eType进行处理，非默认通过eType进行处理
						if (typeof afterEType == 'function') {
							afterEType.call(this, obj);
						}
					};
				} else if (typeof eType == 'function') {
					column.editType = eType;
				}

				if (rType == 'booleanRender') {
					column.renderType = function (obj) {

						var grid = obj.gridObj;
						var datatable = grid.dataTable;
						var rowId = obj.row.value['$_#_@_id'];
						var row = datatable.getRowByRowId(rowId);
						var checkStr = '',
						    disableStr = '';

						if (obj.value == 'Y' || obj.value == 'true') {
							checkStr = 'is-checked';
						}
						if (grid.options.editType == 'form') {
							disableStr = 'is-disabled';
						}
						var htmlStr = '<label class="u-checkbox is-upgraded ' + checkStr + disableStr + '">' + '<input type="checkbox" class="u-checkbox-input">' + '<span class="u-checkbox-label"></span>' + '<span class="u-checkbox-focus-helper"></span><span class="u-checkbox-outline"><span class="u-checkbox-tick-outline"></span></span>' + '</label>';

						obj.element.innerHTML = htmlStr;

						$(obj.element).find('input').on('click', function (e) {
							$(this).parent().toggleClass('is-checked');
							if (!obj.gridObj.options.editable) {
								(0, _event.stopEvent)(e);
								return false;
							}
							if ($(this).parent().hasClass('is-checked')) {
								this.checked = true;
							} else {
								this.checked = false;
							}
							var value = this.checked ? "Y" : "N";
							var column = obj.gridCompColumn;
							var field = column.options.field;
							row.setValue(field, value);
						});

						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
					// 如果是booleanRender并且没有设置eType则设置eType为空方法
					if (!column.eType && !column.editable) {
						column.editable = false;
					}
				} else if (rType == 'integerRender') {
					column.renderType = function (obj) {
						var grid = obj.gridObj;
						var column = obj.gridCompColumn;
						var field = column.options.field;
						obj.element.innerHTML = obj.value;
						/*设置header为right*/
						$('#' + grid.options.id + '_header_table').find('th[field="' + field + '"]').css('text-align', 'right');
						$(obj.element).css('text-align', 'right');
						$(obj.element).css('color', '#e33c37');
						$(obj.element).find('.u-grid-header-link').css('padding-right', '3em');
						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'currencyRender') {
					column.renderType = function (obj) {
						//需要处理精度

						var grid = obj.gridObj;
						var column = obj.gridCompColumn;
						var field = column.options.field;
						var rowIndex = obj.rowIndex;
						var datatable = grid.dataTable;
						var rowId = $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
						var row = datatable.getRowByRowId(rowId);
						if (!row) return;
						var rprec = row.getMeta(field, 'precision');
						var maskerMeta = _core.core.getMaskerMeta('currency') || {};
						var precision = typeof parseFloat(rprec) == 'number' ? rprec : maskerMeta.precision;
						maskerMeta.precision = precision;

						maskerMeta.precision = precision || maskerMeta.precision;
						var formater = new _formater.NumberFormater(maskerMeta.precision);
						var masker = new _masker.CurrencyMasker(maskerMeta);
						var svalue = masker.format(formater.format(obj.value)).value;
						obj.element.innerHTML = svalue;
						/*设置header为right*/
						$('#' + grid.options.id + '_header_table').find('th[field="' + field + '"]').css('text-align', 'right');
						$(obj.element).css('text-align', 'right');
						$(obj.element).css('color', '#e33c37');
						$(obj.element).find('.u-grid-header-link').css('padding-right', '3em');
						$(obj.element).attr('title', svalue);

						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'floatRender') {
					column.renderType = function (obj) {
						//需要处理精度

						var grid = obj.gridObj;
						var column = obj.gridCompColumn;
						var field = column.options.field;
						var rowIndex = obj.rowIndex;
						var datatable = grid.dataTable;
						var rowId = $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
						var row = datatable.getRowByRowId(rowId);
						if (!row) return;
						var rprec = row.getMeta(field, 'precision') || column.options.precision;
						var maskerMeta = _core.core.getMaskerMeta('float') || {};
						var precision = typeof parseFloat(rprec) == 'number' ? rprec : maskerMeta.precision;
						maskerMeta.precision = precision;

						var formater = new _formater.NumberFormater(maskerMeta.precision);
						var masker = new _masker.NumberMasker(maskerMeta);
						var svalue = masker.format(formater.format(obj.value)).value;
						obj.element.innerHTML = svalue;
						/*设置header为right*/
						$('#' + grid.options.id + '_header_table').find('th[field="' + field + '"]').css('text-align', 'right');
						$(obj.element).css('text-align', 'right');
						$(obj.element).css('color', '#e33c37');
						$(obj.element).find('.u-grid-header-link').css('padding-right', '3em');
						$(obj.element).attr('title', svalue);

						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'comboRender') {
					column.renderType = function (obj) {

						//需要将key转化为name
						var ds = (0, _util.getJSObject)(viewModel, eOptions['datasource']);
						if (!ds) ds = (0, _util.getJSObject)(viewModel, column['datasource']);
						obj.element.innerHTML = '';
						if (nameArr) {
							nameArr.length = 0;
						}

						var valArr = obj.value.split(',');
						var nameArr = [];
						for (var i = 0, length = ds.length; i < length; i++) {
							for (var j = 0; j < valArr.length; j++) {
								if (ds[i].value == valArr[j]) {
									nameArr.push(ds[i].name);
								}
							}
						}
						var svalue = nameArr.toString();
						if (!svalue) svalue = obj.value;
						obj.element.innerHTML = svalue;
						$(obj.element).attr('title', svalue);

						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'dateRender') {
					//通过grid的dataType为Date format处理
					column.renderType = function (obj) {
						var svalue = (0, _dataRender.dateRender)(obj.value, obj.gridCompColumn.options['format']);
						obj.element.innerHTML = svalue;
						$(obj.element).attr('title', svalue);
						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'dateTimeRender') {
					//通过grid的dataType为DateTime format处理
					column.renderType = function (obj) {
						var svalue = (0, _dataRender.dateTimeRender)(obj.value);
						obj.element.innerHTML = svalue;
						$(obj.element).attr('title', svalue);

						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (typeof rType == 'function') {
					column.renderType = rType;
				} else if (rType == 'radioRender') {
					column.renderType = function (params) {
						//debugger
						var ds = (0, _util.getJSObject)(viewModel, eOptions['datasource']);
						if (!ds) ds = (0, _util.getJSObject)(viewModel, column['datasource']);
						var value = params.value;
						var compDiv = $('<div class="u-grid-edit-item-radio"></div>');
						var checkStr = '';

						params.element.innerHTML = "";
						$(params.element).append(compDiv);

						for (var i = 0; i < ds.length; i++) {
							// if (ds[i].value == value) compDiv.append('<input name="' + column.field + params.row.value['$_#_@_id'] + '" type="radio" value="' + ds[i].value + '" checked="true" /><i data-role="name">' + ds[i].name + '</i>');else compDiv.append('<input name="' + column.field + params.row.value['$_#_@_id'] + '" type="radio" value="' + ds[i].value + '"/><i data-role="name">' + ds[i].name + '</i>');
							// 修改处
							checkStr = "";
							if (ds[i].value == value) {
								checkStr = "is-checked";
							}
							var htmlStr = '<label class="u-radio is-upgraded ' + checkStr + '" for="' + column.field + params.row.value['$_#_@_id'] + i + '" >' + '<input type="radio" id="' + column.field + params.row.value['$_#_@_id'] + i + '" class="u-radio-button" name="' + column.field + params.row.value['$_#_@_id'] + '" value="' + ds[i].value + '">' + '<span class="u-radio-label">' + ds[i].name + '</span>' + '<span class="u-radio-outer-circle"></span><span class="u-radio-inner-circle"></span>' + '</label>';

							compDiv.append(htmlStr);
						}
						compDiv.find(":radio").each(function () {

							$(this).on('click', function () {

								var val = this.value;
								compDiv.find(":radio").each(function () {
									if (this.value == val) {
										$(this).parent().addClass('is-checked');
									} else {
										$(this).parent().removeClass('is-checked');
									}
								});
								var grid = params.gridObj;
								var column = params.gridCompColumn;
								var field = column.options.field;
								var datatable = grid.dataTable;
								//var rowIndex = params.rowIndex
								//var tmprowId =  $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
								var rowId = params.row.value['$_#_@_id'];

								var row = datatable.getRowByRowId(rowId);

								row.setValue(field, val);
							});
						});
						//					var comp = new $.compManager.plugs.radio(compDiv[0],eOptions,viewModel);
						//					for( var i=0,length=rdo.length; i<length; i++){
						//					   if(rdo[i].pk==value){
						//					   	 obj.element.innerHTML = '<input type="radio" checked><i data-role="name">'+rdo[i].name+'</i>';
						//					   	 break;
						//					   }
						//					}
						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'urlRender') {
					//通过grid的dataType为DateTime format处理
					column.renderType = function (obj) {
						obj.element.innerHTML = '<a href="' + obj.value + '" target="_blank">' + obj.value + '</a>';

						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'passwordRender') {
					//通过grid的dataType为DateTime format处理
					column.renderType = function (obj) {
						obj.element.innerHTML = '<input type="password" disable="true" role="grid-for-edit" readonly="readonly" style="border:0px;background:none;padding:0px;" value="' + obj.value + '" title=""><span class="uf uf-eyeopen right-span" role="grid-for-edit"></span>';
						var span = obj.element.querySelector('span');
						var input = obj.element.querySelector('input');
						input.value = obj.value;
						$(span).on('click', function () {
							if (input.type == 'password') {
								input.type = 'text';
							} else {
								input.type = 'password';
							}
						});
						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				} else if (rType == 'percentRender') {
					column.renderType = function (obj) {
						//需要处理精度

						var grid = obj.gridObj;
						var column = obj.gridCompColumn;
						var field = column.options.field;
						var rowIndex = obj.rowIndex;
						var datatable = grid.dataTable;
						var rowId = $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
						var row = datatable.getRowByRowId(rowId);
						if (!row) return;
						var rprec = row.getMeta(field, 'precision') || column.options.precision;
						var maskerMeta = _core.core.getMaskerMeta('percent') || {};
						var precision = typeof parseFloat(rprec) == 'number' ? rprec : maskerMeta.precision;
						maskerMeta.precision = precision;
						if (maskerMeta.precision) {
							maskerMeta.precision = parseInt(maskerMeta.precision) + 2;
						}

						var formater = new _formater.NumberFormater(maskerMeta.precision);
						var masker = new _masker.PercentMasker(maskerMeta);
						var svalue = masker.format(formater.format(obj.value)).value;
						obj.element.innerHTML = svalue;
						$(obj.element).css('text-align', 'right');
						$(obj.element).attr('title', svalue);

						// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
						if (typeof afterRType == 'function') {
							afterRType.call(this, obj);
						}
					};
				}

				var defineSumRenderType = column.sumRenderType;
				column.sumRenderType = function (obj) {
					obj.value = parseFloat(obj.value);
					var grid = obj.gridObj;
					var column = obj.gridCompColumn;
					var rprec = column.options.precision;
					var maskerMeta = _core.core.getMaskerMeta('float') || {};
					var precision = rprec == 0 || rprec && typeof parseFloat(rprec) == 'number' ? rprec : maskerMeta.precision;
					maskerMeta.precision = precision;

					var formater = new _formater.NumberFormater(maskerMeta.precision);
					var masker = new _masker.NumberMasker(maskerMeta);
					var svalue = masker.format(formater.format(obj.value)).value;
					obj.element.innerHTML = svalue;
					$(obj.element).parent().css('text-align', 'right');
					$(obj.element).css('text-align', 'right');
					$(obj.element).attr('title', svalue);
					if (typeof defineSumRenderType == 'function') defineSumRenderType.call(grid, obj);
				};

				columns.push(column);
			});

			//暂时未使用，后续考虑完善代码，不要删除！
			/*
   var app = options['app'];
   if (app && app.adjustFunc)
    	app.adjustFunc.call(app, {id: this.id, type:'gridColumn', columns:columns});
   */
			this.gridOptions.columns = columns;

			/*
    * 处理viewModel与grid之间的绑定
    *
    */

			this.dataTable.pageIndex.subscribe(function (value) {
				oThis.grid.setDataSource({});
			});

			this.dataTable.pageSize.subscribe(function (value) {
				oThis.grid.setDataSource({});
			});

			var onRowSelectedFun = this.gridOptions.onRowSelected;
			// 选中
			this.gridOptions.onRowSelected = function (obj) {
				if (!oThis.silence) {
					var rowId = oThis.grid.dataSourceObj.rows[obj.rowIndex].value['$_#_@_id'];
					var index = oThis.dataTable.getIndexByRowId(rowId);
					if (oThis.grid.options.multiSelect) {
						oThis.dataTable.addRowsSelect([index]);
					} else {
						oThis.dataTable.setRowSelect(index);
					}
				}
				if (onRowSelectedFun) {
					onRowSelectedFun.call(oThis, obj);
				}
			};
			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_SELECT, function (event) {
				oThis.silence = true;
				var gridSelectRows = [];
				$.each(oThis.grid.getSelectRows(), function () {
					gridSelectRows.push(this);
				});
				$.each(gridSelectRows, function () {
					var rowId = this['$_#_@_id'];
					var unSelectFlag = true;
					$.each(event.rowIds, function () {
						if (this == rowId) unSelectFlag = false;
					});
					if (unSelectFlag) {
						var index = oThis.grid.getRowIndexByValue('$_#_@_id', rowId);
						oThis.silence = true;
						oThis.grid.setRowUnselect(index);
						oThis.silence = false;
					}
				});

				/*index转化为grid的index*/
				$.each(event.rowIds, function () {
					var index = oThis.grid.getRowIndexByValue('$_#_@_id', this);
					var selectFlag = true;
					if (index > -1) {
						selectFlag = oThis.grid.setRowSelect(parseInt(index));
						if (!selectFlag) {
							oThis.dataTable.setRowUnSelect(oThis.dataTable.getIndexByRowId(this));
						}
					}
				});
				oThis.silence = false;
			});

			//全选
			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_ALLSELECT, function (event) {
				oThis.silence = true;
				oThis.grid.setAllRowSelect();
				oThis.silence = false;
			});

			//全返选
			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_ALLUNSELECT, function (event) {
				oThis.silence = true;
				oThis.grid.setAllRowUnSelect();
				oThis.silence = false;
			});

			// 反选
			var onRowUnSelectedFun = this.gridOptions.onRowUnSelected;
			this.gridOptions.onRowUnSelected = function (obj) {
				if (!oThis.silence) {
					var rowId = oThis.grid.dataSourceObj.rows[obj.rowIndex].value['$_#_@_id'];
					var index = oThis.dataTable.getIndexByRowId(rowId);
					oThis.dataTable.setRowUnSelect(index);
				}
				if (onRowUnSelectedFun) {
					onRowUnSelectedFun.call(oThis, obj);
				}
			};
			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_UNSELECT, function (event) {
				oThis.silence = true;
				$.each(event.rowIds, function () {
					var index = oThis.grid.getRowIndexByValue('$_#_@_id', this);
					var unSelectFlag = true;
					if (index > -1) {
						unSelectFlag = oThis.grid.setRowUnselect(parseInt(index));
						if (!unSelectFlag) {
							if (oThis.grid.options.multiSelect) {
								oThis.dataTable.addRowsSelect([oThis.dataTable.getIndexByRowId(this)]);
							} else {
								oThis.dataTable.setRowSelect(oThis.dataTable.getIndexByRowId(this));
							}
						}
					}
				});
				oThis.silence = false;
			});

			var onRowFocusFun = this.gridOptions.onRowFocus;
			// focus
			this.gridOptions.onRowFocus = function (obj) {
				if (!oThis.silence) {
					var rowId = oThis.grid.dataSourceObj.rows[obj.rowIndex].value['$_#_@_id'];
					var index = oThis.dataTable.getIndexByRowId(rowId);

					if (oThis.grid.options.rowClickBan) {
						oThis.dataTable.setRowFocus(index, true);
					} else {
						oThis.dataTable.setRowFocus(index);
					}
				}

				if (onRowFocusFun) {
					onRowFocusFun.call(oThis, obj);
				}
			};
			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_FOCUS, function (event) {
				oThis.silence = true;
				/*index转化为grid的index*/
				var index = oThis.grid.getRowIndexByValue('$_#_@_id', event.rowId);

				var focusFlag = true;
				if (index > -1) {
					focusFlag = oThis.grid.setRowFocus(parseInt(index));

					if (!focusFlag) {
						oThis.dataTable.setRowUnFocus(oThis.dataTable.getIndexByRowId(event.rowId));
					}
				}
				oThis.silence = false;
			});

			// 反focus
			var onRowUnFocusFun = this.gridOptions.onRowUnFocus;
			this.gridOptions.onRowUnFocus = function (obj) {
				if (!oThis.silence) {
					var rowId = oThis.grid.dataSourceObj.rows[obj.rowIndex].value['$_#_@_id'];
					var index = oThis.dataTable.getIndexByRowId(rowId);
					oThis.dataTable.setRowUnFocus(index);
				}
				if (onRowUnFocusFun) {
					onRowUnFocusFun.call(oThis, obj);
				}
			};
			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_UNFOCUS, function (event) {
				oThis.silence = true;
				var index = oThis.grid.getRowIndexByValue('$_#_@_id', event.rowId);
				var unFocusFlag = true;
				if (index > -1) {
					unFocusFlag = oThis.grid.setRowUnFocus(parseInt(index));
					if (!unFocusFlag) {
						oThis.dataTable.setRowFocus(oThis.dataTable.getIndexByRowId(event.rowId));
					}
				}
				oThis.silence = false;
			});

			// 增行,只考虑viewModel传入grid
			//		var onRowInsertFun = this.gridOptions.onRowInsert;
			//		this.gridOptions.onRowInsert = function(obj){
			//			dataTable.insertRow(obj.index,obj.row);
			//			if(onRowSelectedFun){
			//				viewModel[onRowUnSelectedFun].call(grid,grid, row, rowindex);
			//			}
			//		};
			this.dataTable.on(_indexDataTable.DataTable.ON_INSERT, function (event) {
				oThis.silence = true;
				var gridRows = new Array();
				$.each(event.rows, function () {
					var row = this.data;
					var id = this.rowId;
					var gridRow = {};
					for (var filed in row) {
						gridRow[filed] = row[filed].value;
					}
					gridRow['$_#_@_id'] = id;
					gridRows.push(gridRow);
				});
				oThis.grid.addRows(gridRows, event.index);
				oThis.silence = false;
			});

			this.dataTable.on(_indexDataTable.DataTable.ON_UPDATE, function (event) {
				oThis.silence = true;
				$.each(event.rows, function () {
					var row = this.data;
					var id = this.rowId;
					var gridRow = {};
					for (var filed in row) {
						gridRow[filed] = row[filed].value;
					}
					gridRow['$_#_@_id'] = id;
					var index = oThis.grid.getRowIndexByValue('$_#_@_id', id);
					oThis.grid.updateRow(index, gridRow);
				});
				oThis.silence = false;
			});

			this.dataTable.on(_indexDataTable.DataTable.ON_VALUE_CHANGE, function (obj) {
				oThis.silence = true;
				var id = obj.rowId;
				var index = oThis.grid.getRowIndexByValue('$_#_@_id', id);
				if (index == -1) {
					return;
				}
				var field = obj.field;
				var value = obj.newValue;
				oThis.grid.updateValueAt(index, field, value);
				//oThis.grid.editClose();
				oThis.silence = false;
			});

			this.gridOptions.onRowDelete = function (obj) {
				if (!oThis.silence) {
					var row = obj.row;
					var datatableIndex = oThis.getDatatableRowIndexByGridRow(row.value);
					oThis.dataTable.setRowDelete(datatableIndex);
					$('.tooltip').remove();
				}
			};
			this.dataTable.on(_indexDataTable.DataTable.ON_DELETE, function (event) {
				oThis.silence = true;
				/*index转化为grid的index*/
				var gridIndexs = new Array();
				$.each(event.rowIds, function () {
					var index = oThis.grid.getRowIndexByValue('$_#_@_id', this);
					gridIndexs.push(index);
				});
				oThis.grid.deleteRows(gridIndexs);
				$('.tooltip').remove();
				oThis.silence = false;
			});

			this.dataTable.on(_indexDataTable.DataTable.ON_DELETE_ALL, function (event) {
				oThis.silence = true;
				oThis.grid.setDataSource({});
				$('.tooltip').remove();
				oThis.silence = false;
			});

			// 数据改变
			var onValueChangeFun = this.gridOptions.onValueChange;
			this.gridOptions.onValueChange = function (obj) {
				if (!oThis.silence) {
					var row = oThis.getDataTableRow(oThis.grid.dataSourceObj.rows[obj.rowIndex].value);
					if (row) {
						if ($.type(obj.newValue) == 'object') {
							row.setValue(obj.field, obj.newValue.trueValue);
							row.setMeta(obj.field, 'display', obj.newValue.showValue);
						} else {
							row.setValue(obj.field, obj.newValue);
						}
					}
				}
				if (onValueChangeFun) {
					onValueChangeFun.call(oThis, obj);
				}
			};

			// 加载数据,只考虑viewModel传入grid
			this.dataTable.on(_indexDataTable.DataTable.ON_LOAD, function (data) {
				oThis.silence = true;
				if (data.length > 0) {
					var values = new Array();

					$.each(data, function () {
						var value = {};
						var dataObj = this.data;
						var id = this.rowId;
						for (var p in dataObj) {
							var v = dataObj[p].value;
							value[p] = v;
						}
						value['$_#_@_id'] = id;
						values.push(value);
					});
					var dataSource = {};
					dataSource['values'] = values;
					oThis.grid.setDataSource(dataSource);
				}
				oThis.silence = false;
			});
			this.dataTable.on(_indexDataTable.DataTable.ON_ENABLE_CHANGE, function (enable) {
				oThis.silence = true;
				oThis.grid.setEditable(enable.enable);
				oThis.silence = false;
			});

			this.dataTable.on(_indexDataTable.DataTable.ON_ROW_META_CHANGE, function (event) {
				oThis.silence = true;
				var field = event.field,
				    meta = event.meta,
				    row = event.row,
				    newValue = event.newValue;
				if (meta == 'required') {
					oThis.grid.setRequired(field, newValue);
				}
				if (meta == 'precision') {
					var comp = oThis.editComponent[field];
					if (comp && comp.setPrecision) {
						comp.setPrecision(newValue);
					}

					var index = oThis.grid.getRowIndexByValue('$_#_@_id', row.rowId);
					if (index == -1) {
						return;
					}
					var value = row.getValue(field);

					oThis.grid.updateValueAt(index, field, value, true);
				}
				oThis.silence = false;
			});

			this.dataTable.on(_indexDataTable.DataTable.ON_META_CHANGE, function (event) {
				oThis.silence = true;
				var field = event.field;
				var meta = event.meta;
				if (meta == 'precision') {
					oThis.grid.renderTypeFun({ field: field });
				}
				oThis.silence = false;
			});

			this.gridOptions.transMap = {
				ml_show_column: (0, _i18n.trans)('gridComp.show_column', '显示/隐藏列'),
				ml_clear_set: (0, _i18n.trans)('gridComp.clear_set', '清除设置'),
				ml_no_rows: (0, _i18n.trans)('gridComp.no_rows', '无数据'),
				ml_sum: (0, _i18n.trans)('gridComp.sum', '合计:'),
				ml_close: (0, _i18n.trans)('gridComp.close', '关闭')
			};
			// 创建grid
			this.grid = $(element).grid(this.gridOptions);
			this.grid.dataTable = this.dataTable;
			this.grid.viewModel = viewModel;
			this.grid.gridModel = this;

			//如果先插入数据再创建grid需要处理 load
			var data = this.dataTable.rows();
			if (data.length > 0) {
				var values = new Array();

				$.each(data, function () {
					var value = {};
					var dataObj = this.data;
					var id = this.rowId;
					for (var p in dataObj) {
						var v = dataObj[p].value;
						value[p] = v;
					}
					value['$_#_@_id'] = id;
					values.push(value);
				});
				var dataSource = {};
				dataSource['values'] = values;
				oThis.grid.setDataSource(dataSource);
			}
			// 选中行
			var selectIndexs = this.dataTable.getSelectedIndexs();
			if (selectIndexs.length > 0) {
				$.each(selectIndexs, function () {
					oThis.grid.setRowSelect(this);
				});
			}

			return this;
		},

		getName: function getName() {
			return 'grid';
		},

		setRenderType: function setRenderType(obj) {
			this.createDefaultRender(obj);
		},

		createDefaultRender: function createDefaultRender(obj) {
			var field = obj.field,
			    rType = obj.rType,
			    eOptions = obj.eOptions;
			var oThis = this;
			var column = oThis.grid.getColumnByField(field).options;
			var viewModel = oThis.grid.viewModel;
			if (eOptions) {
				//判断是否为json对象
				if ((typeof eOptions === 'undefined' ? 'undefined' : _typeof(eOptions)) == "object" && Object.prototype.toString.call(eOptions).toLowerCase() == "[object object]" && !obj.length) {
					eOptions = eOptions;
					//判断是否为string
				} else if (typeof eOptions == "string") {
					eOptions = JSON.parse(eOptions);
				}
			} else {
				eOptions = {};
				if (column.editOptions) {
					if (typeof column.editOptions == "undefined") var eOptions = eval("(" + column.editOptions + ")");else var eOptions = column.editOptions;
				}
				eOptions.data = options['data'];
				eOptions.field = column['field'];
			}
			if (rType == 'booleanRender') {
				var renderType = function renderType(obj) {
					var checkStr = '';
					if (obj.value == 'Y') {
						checkStr = 'checked';
					}
					var htmlStr = '<input type="checkbox"   style="cursor:default;" ' + checkStr + '>';
					obj.element.innerHTML = htmlStr;

					var grid = obj.gridObj;
					var datatable = grid.dataTable;
					var rowId = obj.row.value['$_#_@_id'];

					var row = datatable.getRowByRowId(rowId);
					$(obj.element).find('input').on('click', function () {
						if (!obj.gridObj.options.editable) {
							(0, _event.stopEvent)(e);
							return false;
						}
						var value = this.checked ? "Y" : "N";
						var column = obj.gridCompColumn;
						var field = column.options.field;
						row.setValue(field, value);
					});

					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if (typeof afterRType == 'function') {
						afterRType.call(this, obj);
					}
				};
			} else if (rType == 'integerRender') {
				column.dataType = 'Int';
				var renderType = function renderType(obj) {
					var grid = obj.gridObj;
					var column = obj.gridCompColumn;
					var field = column.options.field;
					obj.element.innerHTML = obj.value;
					/*设置header为right*/
					$('#' + grid.options.id + '_header_table').find('th[field="' + field + '"]').css('text-align', 'right');
					$(obj.element).css('text-align', 'right');
					$(obj.element).css('color', '#e33c37');
					$(obj.element).find('.u-grid-header-link').css('padding-right', '3em');
					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if (typeof afterRType == 'function') {
						afterRType.call(this, obj);
					}
				};
			} else if (rType == 'currencyRender') {
				var renderType = function renderType(obj) {
					//需要处理精度

					var grid = obj.gridObj;
					var column = obj.gridCompColumn;
					var field = column.options.field;
					var rowIndex = obj.rowIndex;
					var datatable = grid.dataTable;
					var rowId = $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
					var row = datatable.getRowByRowId(rowId);
					if (!row) return;
					var rprec = row.getMeta(field, 'precision');
					var maskerMeta = _core.core.getMaskerMeta('float') || {};
					var precision = typeof parseFloat(rprec) == 'number' ? rprec : maskerMeta.precision;
					maskerMeta.precision = precision;

					maskerMeta.precision = precision || maskerMeta.precision;
					var formater = new _formater.NumberFormater(maskerMeta.precision);
					var masker = new _masker.NumberMasker(maskerMeta);
					var svalue = masker.format(formater.format(obj.value)).value;
					obj.element.innerHTML = svalue;
					/*设置header为right*/
					$('#' + grid.options.id + '_header_table').find('th[field="' + field + '"]').css('text-align', 'right');
					$(obj.element).css('text-align', 'right');
					$(obj.element).css('color', '#e33c37');
					$(obj.element).find('.u-grid-header-link').css('padding-right', '3em');
					$(obj.element).attr('title', svalue);

					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if (typeof afterRType == 'function') {
						afterRType.call(this, obj);
					}
				};
			} else if (rType == 'floatRender') {
				column.dataType = 'Float';
				var renderType = function renderType(obj) {
					//需要处理精度

					var grid = obj.gridObj;
					var column = obj.gridCompColumn;
					var field = column.options.field;
					var rowIndex = obj.rowIndex;
					var datatable = grid.dataTable;
					var rowId = $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
					var row = datatable.getRowByRowId(rowId);
					if (!row) return;
					var rprec = row.getMeta(field, 'precision') || column.options.precision;
					var maskerMeta = _core.core.getMaskerMeta('float') || {};
					var precision = typeof parseFloat(rprec) == 'number' ? rprec : maskerMeta.precision;
					maskerMeta.precision = precision;

					var formater = new _formater.NumberFormater(maskerMeta.precision);
					var masker = new _masker.NumberMasker(maskerMeta);
					var svalue = masker.format(formater.format(obj.value)).value;
					obj.element.innerHTML = svalue;
					/*设置header为right*/
					$('#' + grid.options.id + '_header_table').find('th[field="' + field + '"]').css('text-align', 'right');
					$(obj.element).css('text-align', 'right');
					$(obj.element).css('color', '#e33c37');
					$(obj.element).find('.u-grid-header-link').css('padding-right', '3em');
					$(obj.element).attr('title', svalue);

					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if (typeof afterRType == 'function') {
						afterRType.call(this, obj);
					}
				};
			} else if (rType == 'comboRender') {
				var renderType = function renderType(obj) {

					//需要将key转化为name
					var ds = (0, _util.getJSObject)(viewModel, eOptions['datasource']);
					if (!ds) ds = (0, _util.getJSObject)(viewModel, column['datasource']);
					obj.element.innerHTML = '';
					if (nameArr) {
						nameArr.length = 0;
					}

					var valArr = obj.value.split(',');
					var nameArr = [];
					for (var i = 0, length = ds.length; i < length; i++) {
						for (var j = 0; j < valArr.length; j++) {
							if (ds[i].value == valArr[j]) {
								nameArr.push(ds[i].name);
							}
						}
					}
					var svalue = nameArr.toString();
					if (!svalue) svalue = obj.value;
					obj.element.innerHTML = svalue;
					$(obj.element).attr('title', svalue);

					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if (typeof afterRType == 'function') {
						afterRType.call(this, obj);
					}
				};
			} else if (rType == 'dateRender') {
				//通过grid的dataType为Date format处理
				var renderType = function renderType(obj) {
					var svalue = (0, _dataRender.dateRender)(obj.value, obj.gridCompColumn.options['format']);
					obj.element.innerHTML = svalue;
					$(obj.element).attr('title', svalue);
					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if (typeof afterRType == 'function') {
						afterRType.call(this, obj);
					}
				};
			} else if (rType == 'dateTimeRender') {
				//通过grid的dataType为DateTime format处理
				var renderType = function renderType(obj) {
					var svalue = (0, _dataRender.dateTimeRender)(obj.value);
					obj.element.innerHTML = svalue;
					$(obj.element).attr('title', svalue);

					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if (typeof afterRType == 'function') {
						afterRType.call(this, obj);
					}
				};
			} else if (typeof rType == 'function') {
				var renderType = rType;
			} else if (rType == 'radioRender') {
				var renderType = function renderType(params) {
					//debugger
					var ds = (0, _util.getJSObject)(viewModel, eOptions['datasource']);
					if (!ds) ds = (0, _util.getJSObject)(viewModel, column['datasource']);
					var value = params.value;
					var compDiv = $('<div class="u-grid-edit-item-radio"></div>');

					params.element.innerHTML = "";
					$(params.element).append(compDiv);

					for (var i = 0; i < ds.length; i++) {
						if (ds[i].value == value) compDiv.append('<input name="' + column.field + params.row.value['$_#_@_id'] + '" type="radio" value="' + ds[i].value + '" checked="true" /><i data-role="name">' + ds[i].name + '</i>');else compDiv.append('<input name="' + column.field + params.row.value['$_#_@_id'] + '" type="radio" value="' + ds[i].value + '"/><i data-role="name">' + ds[i].name + '</i>');
					}
					compDiv.find(":radio").each(function () {

						$(this).on('click', function () {

							var val = this.value;
							compDiv.find(":radio").each(function () {
								if (this.value == val) {
									this.checked = true;
								} else {
									this.checked = false;
								}
							});
							var grid = params.gridObj;
							var column = params.gridCompColumn;
							var field = column.options.field;
							var datatable = grid.dataTable;
							//var rowIndex = params.rowIndex
							//var tmprowId =  $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
							var rowId = params.row.value['$_#_@_id'];

							var row = datatable.getRowByRowId(rowId);

							row.setValue(field, val);
						});
					});
					//					var comp = new $.compManager.plugs.radio(compDiv[0],eOptions,viewModel);
					//					for( var i=0,length=rdo.length; i<length; i++){
					//					   if(rdo[i].pk==value){
					//					   	 obj.element.innerHTML = '<input type="radio" checked><i data-role="name">'+rdo[i].name+'</i>';
					//					   	 break;
					//					   }
					//					}
					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if (typeof afterRType == 'function') {
						afterRType.call(this, obj);
					}
				};
			} else if (rType == 'urlRender') {
				//通过grid的dataType为DateTime format处理
				var renderType = function renderType(obj) {
					obj.element.innerHTML = '<a href="' + obj.value + '" target="_blank">' + obj.value + '</a>';

					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if (typeof afterRType == 'function') {
						afterRType.call(this, obj);
					}
				};
			} else if (rType == 'passwordRender') {
				//通过grid的dataType为DateTime format处理
				var renderType = function renderType(obj) {
					obj.element.innerHTML = '<input type="password" disable="true" role="grid-for-edit" readonly="readonly" style="border:0px;background:none;padding:0px;" value="' + obj.value + '" title=""><span class="uf uf-eyeopen right-span" role="grid-for-edit"></span>';
					var span = obj.element.querySelector('span');
					var input = obj.element.querySelector('input');
					input.value = obj.value;
					$(span).on('click', function () {
						if (input.type == 'password') {
							input.type = 'text';
						} else {
							input.type = 'password';
						}
					});
					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if (typeof afterRType == 'function') {
						afterRType.call(this, obj);
					}
				};
			} else if (rType == 'percentRender') {
				var renderType = function renderType(obj) {
					//需要处理精度

					var grid = obj.gridObj;
					var column = obj.gridCompColumn;
					var field = column.options.field;
					var rowIndex = obj.rowIndex;
					var datatable = grid.dataTable;
					var rowId = $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
					var row = datatable.getRowByRowId(rowId);
					if (!row) return;
					var rprec = row.getMeta(field, 'precision') || column.options.precision;
					var maskerMeta = _core.core.getMaskerMeta('percent') || {};
					var precision = typeof parseFloat(rprec) == 'number' ? rprec : maskerMeta.precision;
					maskerMeta.precision = precision;
					if (maskerMeta.precision) {
						maskerMeta.precision = parseInt(maskerMeta.precision) + 2;
					}

					var formater = new _formater.NumberFormater(maskerMeta.precision);
					var masker = new _masker.PercentMasker(maskerMeta);
					var svalue = masker.format(formater.format(obj.value)).value;
					obj.element.innerHTML = svalue;
					$(obj.element).css('text-align', 'right');
					$(obj.element).attr('title', svalue);

					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if (typeof afterRType == 'function') {
						afterRType.call(this, obj);
					}
				};
			}
			var renderArr = {};
			renderArr[column.field] = renderType;

			column.renderType = function (obj) {
				var rendertypefun = renderArr[column.field];

				rendertypefun.call(this, obj);
			};
		},

		setEditType: function setEditType(obj) {
			var eType = obj.eType,
			    field = obj.field,
			    eOptions = obj.eOptions;
			var oThis = this;
			var column = oThis.grid.getColumnByField(field).options;
			var viewModel = oThis.grid.viewModel;
			var options = oThis.gridOptions;

			if (eOptions) {
				//判断是否为json对象
				if ((typeof eOptions === 'undefined' ? 'undefined' : _typeof(eOptions)) == "object" && Object.prototype.toString.call(eOptions).toLowerCase() == "[object object]" && !obj.length) {
					eOptions = eOptions;
					//判断是否为string
				} else if (typeof eOptions == "string") {
					eOptions = JSON.parse(eOptions);
				}
			} else {
				eOptions = {};
				if (column.editOptions) {
					if (typeof column.editOptions == "undefined") var eOptions = eval("(" + column.editOptions + ")");else var eOptions = column.editOptions;
				}
				eOptions.data = options['data'];
				eOptions.field = column['field'];
			}
			if (!field) {
				return false;
			}
			if (column) {
				oThis.createDefaultEdit(eType, eOptions, options, viewModel, column);
			}
		},

		createDefaultEdit: function createDefaultEdit(eType, eOptions, options, viewModel, column) {
			var oThis = this;
			eOptions.showFix = true;
			eOptions.rowIndex = 0;
			var compDiv, comp;
			if (eType == 'string') {
				compDiv = $('<div ><input type="text" class="u-input"><label class="u-label"></label></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				eOptions.dataType = 'string';
				comp = new u.TextFieldAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});
				//$.compManager.plugs.string(compDiv.find("input")[0],eOptions,viewModel);
			} else if (eType == 'integer') {
				compDiv = $('<div><input type="text" class="u-grid-edit-item-integer"></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				eOptions.dataType = 'integer';
				comp = new _keroaInteger.IntegerAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});
				column.dataType = 'Int';
				//comp = new $.compManager.plugs.integer(compDiv.find("input")[0],eOptions,viewModel);
			} else if (eType == 'checkbox') {
				compDiv = $('<div><input id="' + oThis.id + "_edit_field_" + column['field'] + '" type="checkbox" class="u-grid-edit-item-checkbox"></div>');
				//eOptions.dataType = 'integer';

				if ($.CheckboxComp) {
					comp = new $.CheckboxComp(compDiv.find("input")[0], eOptions, viewModel);
				} else {
					comp = new _keroaCheckbox.CheckboxAdapter({
						el: compDiv[0],
						options: eOptions,
						model: viewModel
					});
				}

				//comp = new $.compManager.plugs.check(compDiv.find("input")[0],eOptions,viewModel);
			} else if (eType == 'combo') {
				// compDiv = $('<div class="input-group  form_date u-grid-edit-item-comb"><div  type="text" class="form-control grid-combox"></div><i class="input-group-addon" ><i class="uf uf-anglearrowdown"></i></i></div>');
				compDiv = $('<div class="eType-input"><input type="text" class="u-grid-edit-item-float"></div>');
				//comp = new $.compManager.plugs.combo(compDiv[0],eOptions,viewModel);
				//comp = new Combobox({
				//	el:compDiv[0],
				//	options:eOptions,
				//	model: viewModel
				//});
				if ($.Combobox) {
					//兼容旧版本
					compDiv = $('<div class="input-group  form_date u-grid-edit-item-comb"><div  type="text" class="form-control grid-combox"></div><i class="input-group-addon" ><i class="uf uf-anglearrowdown"></i></i></div>');
					comp = new $.Combobox(compDiv[0], eOptions, viewModel);
				} else {
					comp = new _keroaCombo.ComboboxAdapter({
						el: compDiv[0],
						options: eOptions,
						model: viewModel
					});
					if (oThis.gridOptions.customEditPanelClass) {
						if (oThis.gridOptions.customEditPanelClass.indexOf('u-combo-ul') < 0) {
							oThis.gridOptions.customEditPanelClass += ',u-combo-ul';
						}
					} else {
						oThis.gridOptions.customEditPanelClass = 'u-combo-ul';
					}
				}
			} else if (eType == 'radio') {
				if (!options.editType || options.editType == "default") {
					compDiv = null;
					comp = null;
				} else {
					compDiv = $('<div class="u-grid-edit-item-radio"><input type="radio" name="identity" /><i data-role="name"></i></div>');
					//comp = new $.compManager.plugs.radio(compDiv[0],eOptions,viewModel);
					comp = new _keroaRadio.RadioAdapter({
						el: compDiv[0],
						options: eOptions,
						model: viewModel
					});
				}
			} else if (eType == 'float') {
				compDiv = $('<div><input type="text" class="u-grid-edit-item-float"></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				//comp = new $.compManager.plugs.float(compDiv.find("input")[0],eOptions,viewModel);
				eOptions.dataType = 'float';
				comp = new _keroaFloat.FloatAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});
				column.dataType = 'Float';
			} else if (eType == 'currency') {
				compDiv = $('<div><input type="text" class="u-grid-edit-item-currency"></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				//comp = new $.compManager.plugs.currency(compDiv.find("input")[0],eOptions,viewModel);
				eOptions.dataType = 'currency';
				comp = new _keroaCurrency.CurrencyAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});
			} else if (eType == 'datetime') {
				compDiv = $('<div class="input-group u-grid-edit-item-datetime" ><input class="form-control" /><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div>');

				//comp = new $.compManager.plugs.datetime(compDiv[0],eOptions,viewModel);
				if ($.DateTime) {
					comp = new $.DateTime(compDiv[0], eOptions, viewModel);
				} else {
					comp = new _keroaDatetimepicker.DateTimeAdapter({
						el: compDiv[0],
						options: eOptions,
						model: viewModel
					});
					if (oThis.gridOptions.customEditPanelClass) {
						if (oThis.gridOptions.customEditPanelClass.indexOf('u-date-panel') < 0) {
							oThis.gridOptions.customEditPanelClass += ',u-date-panel';
						}
					} else {
						oThis.gridOptions.customEditPanelClass = 'u-date-panel';
					}
				}
			} else if (eType == 'time') {
				compDiv = $('<div class="input-group u-grid-edit-item-datetime" ><input class="form-control" /><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div>');

				//comp = new $.compManager.plugs.datetime(compDiv[0],eOptions,viewModel);
				if ($.DateTime) {
					comp = new $.DateTime(compDiv[0], eOptions, viewModel);
				} else {
					comp = new _keroaTime.TimeAdapter({
						el: compDiv[0],
						options: eOptions,
						model: viewModel
					});
					if (oThis.gridOptions.customEditPanelClass) {
						if (oThis.gridOptions.customEditPanelClass.indexOf('u-date-panel') < 0) {
							oThis.gridOptions.customEditPanelClass += ',u-date-panel';
						}
					} else {
						oThis.gridOptions.customEditPanelClass = 'u-date-panel';
					}
				}
			} else if (eType == 'date') {
				compDiv = $('<div class="input-group u-grid-edit-item-date" ><input class="form-control" /><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div>');

				//comp = new $.compManager.plugs.date(compDiv[0],eOptions,viewModel);
				if ($.DateComp) {
					comp = new $.DateComp(compDiv[0], eOptions, viewModel);
				} else {
					eOptions.type = 'u-date';
					comp = new _keroaDatetimepicker.DateTimeAdapter({
						el: compDiv[0],
						options: eOptions,
						model: viewModel
					});
					if (oThis.gridOptions.customEditPanelClass) {
						if (oThis.gridOptions.customEditPanelClass.indexOf('u-date-panel') < 0) {
							oThis.gridOptions.customEditPanelClass += ',u-date-panel';
						}
					} else {
						oThis.gridOptions.customEditPanelClass = 'u-date-panel';
					}
				}
			} else if (eType == 'year') {
				compDiv = $('<div class="input-group u-grid-edit-item-date" ><input class="form-control" /><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div>');

				//comp = new $.compManager.plugs.date(compDiv[0],eOptions,viewModel);
				if ($.DateComp) {
					comp = new $.DateComp(compDiv[0], eOptions, viewModel);
				} else {
					eOptions.type = 'year';
					comp = new _keroaYear.YearAdapter({
						el: compDiv[0],
						options: eOptions,
						model: viewModel
					});
					if (oThis.gridOptions.customEditPanelClass) {
						if (oThis.gridOptions.customEditPanelClass.indexOf('u-date-panel') < 0) {
							oThis.gridOptions.customEditPanelClass += ',u-date-panel';
						}
					} else {
						oThis.gridOptions.customEditPanelClass = 'u-date-panel';
					}
				}
			} else if (eType == 'month') {
				compDiv = $('<div class="input-group u-grid-edit-item-date" ><input class="form-control" /><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div>');

				//comp = new $.compManager.plugs.date(compDiv[0],eOptions,viewModel);
				if ($.DateComp) {
					comp = new $.DateComp(compDiv[0], eOptions, viewModel);
				} else {
					eOptions.type = 'month';
					comp = new _keroaMonth.MonthAdapter({
						el: compDiv[0],
						options: eOptions,
						model: viewModel
					});
					if (oThis.gridOptions.customEditPanelClass) {
						if (oThis.gridOptions.customEditPanelClass.indexOf('u-date-panel') < 0) {
							oThis.gridOptions.customEditPanelClass += ',u-date-panel';
						}
					} else {
						oThis.gridOptions.customEditPanelClass = 'u-date-panel';
					}
				}
			} else if (eType == 'yearmonth') {
				compDiv = $('<div class="input-group u-grid-edit-item-date" ><input class="form-control" /><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div>');

				//comp = new $.compManager.plugs.date(compDiv[0],eOptions,viewModel);
				if ($.DateComp) {
					comp = new $.DateComp(compDiv[0], eOptions, viewModel);
				} else {
					eOptions.type = 'yearmonth';
					comp = new _keroaYearmonth.YearMonthAdapter({
						el: compDiv[0],
						options: eOptions,
						model: viewModel
					});
					if (oThis.gridOptions.customEditPanelClass) {
						if (oThis.gridOptions.customEditPanelClass.indexOf('u-date-panel') < 0) {
							oThis.gridOptions.customEditPanelClass += ',u-date-panel';
						}
					} else {
						oThis.gridOptions.customEditPanelClass = 'u-date-panel';
					}
				}
			} else if (eType == 'url') {
				compDiv = $('<div><input type="text" class="u-grid-edit-item-string"></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				eOptions.dataType = 'url';
				comp = new _keroaUrl.UrlAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});
				//$.compManager.plugs.string(compDiv.find("input")[0],eOptions,viewModel);
			} else if (eType == 'password') {
				compDiv = $('<div><input type="text" class="u-grid-edit-item-string"><span class="uf uf-eyeopen right-span"></span></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				eOptions.dataType = 'password';
				comp = new _keroaPassword.PassWordAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});
				//$.compManager.plugs.string(compDiv.find("input")[0],eOptions,viewModel);
			} else if (eType == 'percent') {

				compDiv = $('<div><input type="text" class="u-grid-edit-item-float"></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				//comp = new $.compManager.plugs.float(compDiv.find("input")[0],eOptions,viewModel);
				eOptions.dataType = 'precent';
				comp = new _keroaPercent.PercentAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});
			} else if (eType == 'phoneNumber') {
				compDiv = $('<div ><input type="text" class="u-input"></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				eOptions.dataType = 'phoneNumber';
				comp = new u.PhoneNumberAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});
			} else if (eType == 'landLine') {
				compDiv = $('<div ><input type="text" class="u-input"></div>');
				if (!options.editType || options.editType == "default") {
					compDiv.addClass("eType-input");
				}
				eOptions.dataType = 'landLine';
				comp = new u.LandLineAdapter({
					el: compDiv[0],
					options: eOptions,
					model: viewModel
				});
			}

			if (comp && comp.dataAdapter) {
				comp = comp.dataAdapter;
			}

			oThis.editComponentDiv[column.field] = compDiv;
			oThis.editComponent[column.field] = comp;
		},

		/**
   * 获取grid行对应的数据模型行对象
   * @param {Object} gridRow
   */
		getDataTableRow: function getDataTableRow(gridRow) {
			var rowId = gridRow['$_#_@_id'];
			var row = null;
			var rowIndex = this.dataTable.getIndexByRowId(rowId);
			if (rowIndex > -1) row = this.dataTable.getRow(rowIndex);
			return row;
		},

		getDatatableRowIndexByGridRow: function getDatatableRowIndexByGridRow(gridRow) {
			var rowId = gridRow['$_#_@_id'];
			var rowIndex = this.dataTable.getIndexByRowId(rowId);
			return rowIndex;
		},

		setEnable: function setEnable(enable) {
			this.grid.setEditable(enable);
		},

		setShowHeader: function setShowHeader(showHeader) {
			this.grid.setShowHeader(showHeader);
		},

		// 传入要编辑的tr对应的jquery对象
		editRowFun: function editRowFun(index) {
			this.dataTable.setRowSelect(index);
			this.grid.editRowIndexFun(index);
		},
		/*
  grid校验之后不显示提示信息，只返回提示信息，由调用者主动处理
  传入参数：	trueValue 不处理
  			showMsg 不处理
  返回：	passed 是否通过
  		MsgObj 包含id以及提示信息，后续可扩展
  		Msg 提示信息
  */
		doValidate: function doValidate(options) {
			var rows = this.grid.dataSourceObj.rows,
			    gridColumnArr = this.grid.gridCompColumnArr,
			    passed = true,
			    MsgArr = new Array(),
			    evalStr = '',
			    rowMsg = '',
			    wholeMsg = '',
			    columnShowMsg = '',
			    hasErrow = false;

			// 遍历所有列
			for (var j = 0; j < gridColumnArr.length; j++) {
				// 遍历所有行
				var column = gridColumnArr[j],
				    columnOptions = gridColumnArr[j].options,
				    field = columnOptions.field,
				    title = columnOptions.title,
				    required = columnOptions.required,
				    validType,
				    placement,
				    tipId,
				    errorMsg,
				    nullMsg,
				    maxLength,
				    minLength,
				    max,
				    min,
				    maxNotEq,
				    minNotEq,
				    reg;
				if (columnOptions.editOptions) {
					validType = columnOptions.editOptions.validType || '';
					placement = columnOptions.editOptions.placement || '';
					tipId = columnOptions.editOptions.tipId || '';
					errorMsg = columnOptions.editOptions.errorMsg || '';
					nullMsg = columnOptions.editOptions.nullMsg || '';
					maxLength = columnOptions.editOptions.maxLength || '';
					minLength = columnOptions.editOptions.minLength || '';
					max = columnOptions.editOptions.max || '';
					min = columnOptions.editOptions.min || '';
					maxNotEq = columnOptions.editOptions.maxNotEq || '';
					minNotEq = columnOptions.editOptions.minNotEq || '';
					reg = columnOptions.editOptions.regExp || '';
					required = columnOptions.editOptions.required || columnOptions.required || '';
				}

				var columnPassedFlag = true,
				    columnMsg = '',
				    elel = document.body;
				if (this.editComponent[field] && this.editComponent[field].element) {
					elel = this.editComponent[field].element;
				}
				var validate = new _neouiValidate.Validate({
					el: elel,
					single: true,
					required: required,
					validType: validType,
					placement: placement,
					tipId: tipId,
					errorMsg: errorMsg,
					nullMsg: nullMsg,
					maxLength: maxLength,
					minLength: minLength,
					max: max,
					min: min,
					maxNotEq: maxNotEq,
					minNotEq: minNotEq,
					reg: reg,
					showFix: true
				});
				for (var i = 0; i < rows.length; i++) {
					var value = rows[i].value[field];
					var result = validate.check({ pValue: value, showMsg: false });
					passed = result.passed && passed;
					if (!result.passed) {
						columnPassedFlag = false;
						if (options.showMsg && columnMsg.indexOf(result.Msg) < 0) {
							columnMsg += result.Msg + ' ';
						}
						// 设置背景色
						var index = this.grid.getIndexOfColumn(column);
						var contentDiv = document.getElementById(this.grid.options.id + '_content_tbody');
						var row = contentDiv.querySelectorAll('tr')[i];
						var td = row.querySelectorAll('td')[index];
						var div = td.querySelector('div');
						(0, _dom.addClass)(td, 'u-grid-err-td');
						(0, _dom.addClass)(div, 'u-grid-err-td');
						var msg = '(' + title + ')' + result.Msg + ';';
						evalStr = 'if(typeof obj' + i + ' == \'undefined\'){var obj' + i + '= {}; MsgArr.push(obj' + i + ');obj' + i + '.rowNum = ' + i + '; obj' + i + '.arr = new Array();}obj' + i + '.arr.push(msg)';
						eval(evalStr);
					}
				}
				// 如果存在错误信息并且提示信息
				if (!columnPassedFlag && options.showMsg) {
					columnShowMsg += title + ':' + columnMsg + '<br>';
				}
				if (!columnPassedFlag) {
					if (!hasErrow) {
						// 滚动条要滚动到第一次出现错误的数据列
						hasErrow = true;
						var ind = this.grid.getIndexOfColumn(column);
						var thDom = $('#' + this.grid.options.id + '_header_table th', this.grid.$ele)[ind];
						var left = thDom.attrLeftTotalWidth;
						var contentDom = $('#' + this.grid.options.id + '_content_div', this.grid.$ele)[0];
						contentDom.scrollLeft = left;
					}
				}
			}
			if (columnShowMsg) (0, _neouiMessage.showMessage)({ msg: columnShowMsg, showSeconds: 3 });
			if (MsgArr.length > 0) {
				MsgArr.sort(function (a1, a2) {
					if (a1.rowNum > a2.rowNum) return 1;else return -1;
				});
			}

			for (var k = 0; k < MsgArr.length; k++) {
				var rowNum = MsgArr[k].rowNum;
				rowMsg = MsgArr[k].arr.join('');
				wholeMsg += '第' + (rowNum + 1) + '行:' + rowMsg;
			}

			return {
				passed: passed,
				comp: this,
				Msg: wholeMsg
			};
		},
		/**
   * [动态的设置下拉框的数据源]
   * 只有renderType设置为comboRender，editType为combo的情况才能通过此方式修改datasource
   * @param {[object]} data {fieldName:字段名, comboData:下拉的数据源}
   */
		setComboDataByField: function setComboDataByField(data) {
			var oThis, comboboxAdapter;
			oThis = this;
			// 如果data不存在则不赋值
			if (!data) {
				return;
			}
			//获取comboboxAdapter
			comboboxAdapter = oThis.editComponent[data.fieldName];
			comboboxAdapter.comp.setComboData(data.comboData);
		}
	});

	_compMgr.compMgr.addDataAdapter({
		adapter: GridAdapter,
		name: 'grid'
	});

	exports.GridAdapter = GridAdapter;
});