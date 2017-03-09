(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', './keroa-baseAdapter', 'tinper-sparrow/src/event', 'tinper-sparrow/src/dom', 'tinper-sparrow/src/core', 'kero/src/indexDataTable', 'tinper-sparrow/src/env', 'tinper-neoui/src/neoui-datetimepicker', 'tinper-sparrow/src/util/dateUtils', 'compox/src/compMgr', 'tinper-sparrow/src/util'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('./keroa-baseAdapter'), require('tinper-sparrow/src/event'), require('tinper-sparrow/src/dom'), require('tinper-sparrow/src/core'), require('kero/src/indexDataTable'), require('tinper-sparrow/src/env'), require('tinper-neoui/src/neoui-datetimepicker'), require('tinper-sparrow/src/util/dateUtils'), require('compox/src/compMgr'), require('tinper-sparrow/src/util'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.keroaBaseAdapter, global.event, global.dom, global.core, global.indexDataTable, global.env, global.neouiDatetimepicker, global.dateUtils, global.compMgr, global.util);
		global.keroaDatetimepicker = mod.exports;
	}
})(this, function (exports, _keroaBaseAdapter, _event, _dom, _core, _indexDataTable, _env, _neouiDatetimepicker, _dateUtils, _compMgr, _util) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.DateTimeAdapter = undefined;
	/**
  * Module : Kero datetime
  * Author : Kvkens(yueming@yonyou.com)
  * Date	  : 2016-08-09 14:59:37
  */

	var DateTimeAdapter = _keroaBaseAdapter.BaseAdapter.extend({
		init: function init() {
			var self = this,
			    adapterType,
			    format;
			if (this.options.type === 'u-date') {
				this.adapterType = 'date';
			} else {
				this.adapterType = 'datetime';
				(0, _dom.addClass)(this.element, 'time');
			}

			this.beforeValueChangeFun = (0, _util.getFunction)(this.viewModel, this.options['beforeValueChangeFun']);

			this.maskerMeta = _core.core.getMaskerMeta(this.adapterType) || {};
			this.maskerMeta.format = this.options['format'] || this.maskerMeta.format;
			if (this.dataModel) {
				this.dataModel.on(this.field + '.format.' + _indexDataTable.DataTable.ON_CURRENT_META_CHANGE, function (event) {
					self.setFormat(event.newValue);
				});
			}

			if (this.dataModel && !this.options['format']) this.options.format = this.dataModel.getMeta(this.field, "format");

			if (!this.options['format']) {
				if (this.options.type === 'u-date') {
					this.options.format = "YYYY-MM-DD";
				} else if (this.options.type === 'year') {
					this.options.format = "YYYY";
				} else if (this.options.type === 'month') {
					this.options.format = "MM";
				} else if (this.options.type === 'yearmonth') {
					this.options.format = "YYYY-MM";
				} else {
					this.options.format = "YYYY-MM-DD HH:mm:ss";
				}
			}
			format = this.options.format;
			this.maskerMeta.format = format || this.maskerMeta.format;

			this.startField = this.options.startField ? this.options.startField : this.dataModel.getMeta(this.field, "startField");

			this.endField = this.options.endField ? this.options.endField : this.dataModel.getMeta(this.field, "endField");

			// this.formater = new $.DateFormater(this.maskerMeta.format);
			// this.masker = new DateTimeMasker(this.maskerMeta);
			this.op = {};
			var mobileDateFormat = "",
			    mobileTimeFormat = "",
			    dateOrder = "",
			    timeOrder = "";
			if (_env.env.isMobile) {
				switch (format) {
					case "YYYY-MM-DD":
						mobileDateFormat = "yy-mm-dd";
						dateOrder = mobileDateFormat.replace(/-/g, '');
						break;
					case "YYYY-MM-DD HH:mm":
						mobileDateFormat = "yy-mm-dd";
						mobileTimeFormat = "HH:ii";
						dateOrder = mobileDateFormat.replace(/-/g, '');
						timeOrder = mobileTimeFormat.replace(/\:/g, '');
						break;
					case "YYYY-MM":
						mobileDateFormat = "yy-mm";
						dateOrder = mobileDateFormat.replace(/-/g, '');
						break;
					default:
						mobileDateFormat = "yy-mm-dd";
						mobileTimeFormat = "HH:ii:ss";
						dateOrder = mobileDateFormat.replace(/-/g, '');
						timeOrder = mobileTimeFormat.replace(/\:/g, '');
				}

				this.op = {
					theme: "android-holo-light",
					mode: "scroller",
					lang: "zh",
					endYear: '9999',
					cancelText: null,
					dateFormat: mobileDateFormat,
					timeWheels: timeOrder,
					dateWheels: dateOrder,
					timeFormat: mobileTimeFormat,
					onSelect: function onSelect(val) {
						if (typeof self.options.beforeValueChangeFun == 'function') {
							if (!self.options.beforeValueChangeFun.call(this, this.pickerDate)) {
								return;
							}
						}
						self.setValue(val);
					}
				};
				this._span = this.element.querySelector("span");
				this.element = this.element.querySelector("input");
				this.element.setAttribute('readonly', 'readonly');
				if (this._span) {
					(0, _event.on)(this._span, 'click', function (e) {
						self.element.focus();
						(0, _event.stopEvent)(e);
					});
				}
				if (this.adapterType == 'date') {
					$(this.element).mobiscroll().date(this.op);
				} else {
					$(this.element).mobiscroll().datetime(this.op);
				}
			} else {
				this.comp = new _neouiDatetimepicker.DateTimePicker({ el: this.element, format: this.maskerMeta.format, showFix: this.options.showFix, beforeValueChangeFun: this.beforeValueChangeFun });
			}

			this.element['u.DateTimePicker'] = this.comp;

			if (!_env.env.isMobile) {
				this.comp.on('select', function (event) {
					self.setValue(event.value);
				});
			}

			this.setStartField(this.startField);
			this.setEndField(this.endField);
			if (!_env.env.isMobile) {
				// 校验
				this.comp.on('validate', function (event) {
					self.doValidate();
				});
			}
		},

		setEndField: function setEndField(endField) {
			var self = this;
			self.endField = endField;
			if (self.dataModel) {
				if (self.endField) {
					self.dataModel.ref(self.endField).subscribe(function (value) {
						if (_env.env.isMobile) {
							var valueObj = _dateUtils.date.getDateObj(value);
							if (valueObj) {
								self.resetDataObj(valueObj);
							}
							self.op.minDate = valueObj;
							if (self.adapterType == 'date') {
								$(self.element).mobiscroll().date(self.op);
							} else {
								$(self.element).mobiscroll().datetime(self.op);
							}
							var nowDate = _dateUtils.date.getDateObj(self.dataModel.getValue(self.field));
							if (nowDate) {
								self.resetDataObj(nowDate);
							}
							if (nowDate && nowDate.getTime() > valueObj.getTime() && value) {
								self.dataModel.setValue(self.field, '');
							}
						} else {
							self.comp.setEndDate(value);
							var nowDate = self.comp.date;
							if (nowDate) {
								self.resetDataObj(nowDate);
							}
							var valueObj = _dateUtils.date.getDateObj(value);
							if (valueObj) {
								self.resetDataObj(valueObj);
							}
							if (nowDate && value && nowDate.getTime() > valueObj.getTime()) {
								self.dataModel.setValue(self.field, '');
							}
						}
					});
				}

				if (self.endField) {
					var endValue = self.dataModel.getValue(self.endField);
					if (endValue) {
						if (_env.env.isMobile) {
							self.op.minDate = _dateUtils.date.getDateObj(endValue);
							if (self.adapterType == 'date') {
								$(self.element).mobiscroll().date(self.op);
							} else {
								$(self.element).mobiscroll().datetime(self.op);
							}
						} else {
							self.comp.setEndDate(endValue);
						}
					}
				}
			}
		},

		setStartField: function setStartField(startField) {
			var self = this;
			self.startField = startField;
			if (self.dataModel) {
				if (self.startField) {
					self.dataModel.ref(self.startField).subscribe(function (value) {
						if (_env.env.isMobile) {
							value = _dateUtils.date.getDateObj(value);

							// var valueObj = self.setMobileStartDate(value, self.options.format);
							var valueObj = value;
							if (valueObj) {
								self.resetDataObj(valueObj);
							}
							self.op.minDate = valueObj;
							if (self.adapterType == 'date') {
								$(self.element).mobiscroll().date(self.op);
							} else {
								$(self.element).mobiscroll().datetime(self.op);
							}
							var nowDate = _dateUtils.date.getDateObj(self.dataModel.getValue(self.field));
							if (nowDate) {
								self.resetDataObj(nowDate);
							}
							if (nowDate && nowDate.getTime() < valueObj.getTime() && value) {
								self.dataModel.setValue(self.field, '');
							}
						} else {
							self.comp.setStartDate(value, self.options.format);
							var nowDate = self.comp.date;
							if (nowDate) {
								self.resetDataObj(nowDate);
							}
							var valueObj = _dateUtils.date.getDateObj(value);
							if (valueObj) {
								self.resetDataObj(valueObj);
							}
							if (nowDate && value && nowDate.getTime() < valueObj.getTime()) {
								self.dataModel.setValue(self.field, '');
							}
						}
					});
				}
				if (self.startField) {
					var startValue = self.dataModel.getValue(self.startField);
					if (startValue) {
						if (_env.env.isMobile) {
							startValue = _dateUtils.date.getDateObj(startValue);
							self.op.minDate = self.setMobileStartDate(startValue, self.options.format);
							if (self.adapterType == 'date') {
								$(self.element).mobiscroll().date(self.op);
							} else {
								$(self.element).mobiscroll().datetime(self.op);
							}
						} else {
							self.comp.setStartDate(startValue, self.options.format);
						}
					}
				}
			}
		},

		setMobileStartDate: function setMobileStartDate(startDate, type) {

			if (startDate) {
				switch (type) {
					case 'YYYY-MM':
						startDate = _dateUtils.date.add(startDate, 'M', 1);
						break;
					case 'YYYY-MM-DD':
						startDate = _dateUtils.date.add(startDate, 'd', 1);
						break;
				}
			}
			return startDate;
		},

		modelValueChange: function modelValueChange(value) {
			if (this.slice) return;
			this.trueValue = value;
			if (_env.env.isMobile) {
				if (value) {
					value = _dateUtils.date.format(value, this.options.format);
					$(this.element).scroller('setDate', _dateUtils.date.getDateObj(value), true);
				} else {
					this.setShowValue('');
				}
			} else {
				this.comp.setDate(value);
			}
		},
		setFormat: function setFormat(format) {
			if (this.maskerMeta.format == format) return;
			this.options.format = format;
			this.maskerMeta.format = format;
			if (!_env.env.isMobile) this.comp.setFormat(format);
			// this.formater = new $.DateFormater(this.maskerMeta.format);
			// this.masker = new DateTimeMasker(this.maskerMeta);
		},
		beforeSetValue: function beforeSetValue(value) {
			if (this.dataModel) {
				var valueObj = _dateUtils.date.getDateObj(value);
				if (valueObj) {
					this.resetDataObj(valueObj);
				}
				if (this.startField) {
					var startValue = this.dataModel.getValue(this.startField);
					var startValueObj = _dateUtils.date.getDateObj(startValue);
					if (startValueObj) {
						this.resetDataObj(startValueObj);
					}
					if (startValueObj && valueObj && valueObj.getTime() < startValueObj.getTime()) {
						return;
					}
				}
				if (this.endField) {
					var endValue = this.dataModel.getValue(this.endField);
					var endValueObj = _dateUtils.date.getDateObj(endValue);
					if (endValueObj) {
						this.resetDataObj(endValueObj);
					}
					if (endValueObj && valueObj && valueObj.getTime() > endValueObj.getTime()) {
						return;
					}
				}
			}
			value = _dateUtils.date.format(value, this.options.format);
			return value;
		},
		setEnable: function setEnable(enable) {
			if (enable === true || enable === 'true') {
				this.enable = true;
				if (_env.env.isMobile) {
					this.element.removeAttribute('disabled');
				} else {
					this.comp._input.removeAttribute('readonly');
				}
				(0, _dom.removeClass)(this.element.parentNode, 'disablecover');
			} else if (enable === false || enable === 'false') {
				this.enable = false;
				if (_env.env.isMobile) {
					this.element.setAttribute('disabled', 'disabled');
				} else {
					this.comp._input.setAttribute('readonly', 'readonly');
				}
				(0, _dom.addClass)(this.element.parentNode, 'disablecover');
			}
			if (!_env.env.isMobile) this.comp.setEnable(enable);
		},

		resetDataObj: function resetDataObj(dataObj) {
			if (this.options.format.indexOf('h') < 0 && this.options.format.indexOf('H') < 0) {
				dataObj.setHours(0);
			}
			if (this.options.format.indexOf('m') < 0) {
				dataObj.setMinutes(0);
			}
			if (this.options.format.indexOf('s') < 0) {
				dataObj.setSeconds(0);
				dataObj.setMilliseconds(0);
			}
		}

	});

	_compMgr.compMgr.addDataAdapter({
		adapter: DateTimeAdapter,
		name: 'u-date'
	});

	_compMgr.compMgr.addDataAdapter({
		adapter: DateTimeAdapter,
		name: 'u-datetime'
	});

	exports.DateTimeAdapter = DateTimeAdapter;
});