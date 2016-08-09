'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DateTimeAdapter = undefined;

var _baseAdapter = require('./baseAdapter');

var _valueMixin = require('./valueMixin');

var _event = require('neoui-sparrow/lib/event');

var _dom = require('neoui-sparrow/lib/dom');

var _core = require('neoui-sparrow/lib/core');

var _env = require('neoui-sparrow/lib/env');

var _dateUtils = require('neoui-sparrow/lib/util/dateUtils');

var _compMgr = require('neoui-sparrow/lib/compMgr');

//miss DateTimePicker
var DateTimeAdapter = _baseAdapter.BaseAdapter.extend({
	mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin, _valueMixin.RequiredMixin, _valueMixin.ValidateMixin],
	init: function init(options) {
		var self = this,
		    adapterType,
		    format;
		// DateTimeAdapter.superclass.initialize.apply(this, arguments);
		if (this.options.type === 'u-date') {
			this.adapterType = 'date';
		} else {
			this.adapterType = 'datetime';
			(0, _dom.addClass)(this.element, 'time');
		}

		this.maskerMeta = _core.core.getMaskerMeta(this.adapterType) || {};
		this.maskerMeta.format = this.options['format'] || this.maskerMeta.format;
		if (this.dataModel) {
			this.dataModel.on(this.field + '.format.' + DataTable.ON_CURRENT_META_CHANGE, function (event) {
				self.setFormat(event.newValue);
			});
		}

		if (this.dataModel && !this.options['format']) this.options.format = this.dataModel.getMeta(this.field, "format");

		if (!this.options['format']) {
			if (this.options.type === 'u-date') {
				this.options.format = "YYYY-MM-DD";
			} else {
				this.options.format = "YYYY-MM-DD HH:mm:ss";
			}
		}
		format = this.options.format;
		this.maskerMeta.format = format || this.maskerMeta.format;

		this.startField = this.options.startField ? this.options.startField : this.dataModel.getMeta(this.field, "startField");

		// this.formater = new $.DateFormater(this.maskerMeta.format);
		// this.masker = new DateTimeMasker(this.maskerMeta);
		var op;
		if (_env.env.isMobile) {
			op = {
				theme: "ios",
				mode: "scroller",
				lang: "zh",
				cancelText: null,
				onSelect: function onSelect(val) {
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
				$(this.element).mobiscroll().date(op);
			} else {
				$(this.element).mobiscroll().datetime(op);
			}
		} else {
			this.comp = new DateTimePicker({ el: this.element, format: this.maskerMeta.format, showFix: this.options.showFix });
		}

		this.element['u.DateTimePicker'] = this.comp;

		if (!_env.env.isMobile) {
			this.comp.on('select', function (event) {
				self.setValue(event.value);
			});
		}
		if (this.dataModel) {
			this.dataModel.ref(this.field).subscribe(function (value) {
				self.modelValueChange(value);
			});
			if (this.startField) {
				this.dataModel.ref(this.startField).subscribe(function (value) {
					if (_env.env.isMobile) {
						var valueObj = _dateUtils.date.getDateObj(value);
						op.minDate = valueObj;
						if (self.adapterType == 'date') {
							$(self.element).mobiscroll().date(op);
						} else {
							$(self.element).mobiscroll().datetime(op);
						}
						var nowDate = _dateUtils.date.getDateObj(self.dataModel.getValue(self.field));
						if (nowDate < valueObj || !value) {
							self.dataModel.setValue(self.field, '');
						}
					} else {
						self.comp.setStartDate(value);
						if (self.comp.date < _dateUtils.date.getDateObj(value) || !value) {
							self.dataModel.setValue(self.field, '');
						}
					}
				});
			}
			if (this.startField) {
				var startValue = this.dataModel.getValue(this.startField);
				if (startValue) {
					if (_env.env.isMobile) {
						op.minDate = _dateUtils.date.getDateObj(startValue);
						if (this.adapterType == 'date') {
							$(this.element).mobiscroll().date(op);
						} else {
							$(this.element).mobiscroll().datetime(op);
						}
					} else {
						self.comp.setStartDate(startValue);
					}
				}
			}
		}
	},
	modelValueChange: function modelValueChange(value) {
		if (this.slice) return;
		this.trueValue = value;
		if (_env.env.isMobile) {
			if (value) {
				value = _dateUtils.date.format(value, this.options.format);
				$(this.element).scroller('setDate', _dateUtils.date.getDateObj(value), true);
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
	setValue: function setValue(value) {
		value = _dateUtils.date.format(value, this.options.format);
		this.trueValue = this.formater ? this.formater.format(value) : value;
		this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
		this.setShowValue(this.showValue);
		this.slice = true;
		this.dataModel.setValue(this.field, this.trueValue);
		this.slice = false;
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
	}

});
//miss DataTable;
/**
 * Module : Kero datetime
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 14:59:37
 */

_compMgr.compMgr.addDataAdapter({
	adapter: DateTimeAdapter,
	name: 'u-date'
});

_compMgr.compMgr.addDataAdapter({
	adapter: DateTimeAdapter,
	name: 'u-datetime'
});

exports.DateTimeAdapter = DateTimeAdapter;