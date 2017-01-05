/**
 * Module : Kero datetime
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 14:59:37
 */

import {BaseAdapter} from '../core/baseAdapter';
import {ValueMixin} from '../core/valueMixin';
import {EnableMixin} from '../core/enableMixin';
import {RequiredMixin} from '../core/requiredMixin';
import {ValidateMixin} from '../core/validateMixin';
import {on,off,stopEvent} from 'tinper-sparrow/js/event';
import {addClass,removeClass} from 'tinper-sparrow/js/dom';
import {core} from 'tinper-sparrow/js/core';

import {DataTable} from 'kero/js/dataTable/indexDataTable';
import {env} from 'tinper-sparrow/js/env';
import {DateTimePicker} from 'tinper-neoui/js/neoui-datetimepicker';
import {date} from 'tinper-sparrow/js/util/dateUtils';
import {compMgr} from 'tinper-sparrow/js/compMgr';
import {getFunction} from 'tinper-sparrow/js/util';

var DateTimeAdapter = BaseAdapter.extend({
	mixins: [ValueMixin,EnableMixin,RequiredMixin, ValidateMixin],
	init: function (options) {
		var self = this,adapterType,format;
		// DateTimeAdapter.superclass.initialize.apply(this, arguments);
		if (this.options.type === 'u-date'){
			this.adapterType = 'date';
		}else{
			this.adapterType = 'datetime'
			addClass(this.element,'time');
		}

		this.beforeValueChangeFun = getFunction(this.viewModel, this.options['beforeValueChangeFun']);

		this.maskerMeta = core.getMaskerMeta(this.adapterType) || {};
		this.maskerMeta.format = this.options['format'] || this.maskerMeta.format;
		if(this.dataModel){
			this.dataModel.on(this.field + '.format.' +  DataTable.ON_CURRENT_META_CHANGE, function(event){
				self.setFormat(event.newValue)
			});
		}

		if(this.dataModel && !this.options['format'])
			this.options.format = this.dataModel.getMeta(this.field, "format")

		if(!this.options['format']){
			if(this.options.type === 'u-date'){
				this.options.format = "YYYY-MM-DD";
			}else if(this.options.type === 'year'){
				this.options.format = "YYYY";
			}else if(this.options.type === 'month'){
				this.options.format = "MM";
			}else if(this.options.type === 'yearmonth'){
				this.options.format = "YYYY-MM";
			}else{
				this.options.format = "YYYY-MM-DD HH:mm:ss";
			}
		}
		format = this.options.format;
		this.maskerMeta.format = format || this.maskerMeta.format

		this.startField = this.options.startField?this.options.startField : this.dataModel.getMeta(this.field, "startField");

		this.endField = this.options.endField?this.options.endField : this.dataModel.getMeta(this.field, "endField");

		// this.formater = new $.DateFormater(this.maskerMeta.format);
		// this.masker = new DateTimeMasker(this.maskerMeta);
		this.op = {};
		var mobileDateFormat = "", mobileTimeFormat = "", dateOrder = "", timeOrder = "";
		if(env.isMobile){
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
				theme:"ios",
				mode:"scroller",
				lang: "zh",
				cancelText: null,
				dateFormat: mobileDateFormat,
				timeWheels: timeOrder,
				dateWheels: dateOrder,
				timeFormat: mobileTimeFormat,
				onSelect:function(val){
					if(typeof self.options.beforeValueChangeFun == 'function'){
				        if(!self.options.beforeValueChangeFun.call(this,this.pickerDate)){
				            return;
				        }
				    }
					self.setValue(val);
				}
			}
			this._span = this.element.querySelector("span");
			this.element = this.element.querySelector("input");
			this.element.setAttribute('readonly','readonly');
			if (this._span){
		        on(this._span, 'click', function(e){
		            self.element.focus();
		            stopEvent(e);
		        });
		    }
			if(this.adapterType == 'date'){
				$(this.element).mobiscroll().date(this.op);
			}else{
				$(this.element).mobiscroll().datetime(this.op);
			}
		}else{
			this.comp = new DateTimePicker({el:this.element,format:this.maskerMeta.format,showFix:this.options.showFix,beforeValueChangeFun:this.beforeValueChangeFun});
		}

		this.element['u.DateTimePicker'] = this.comp;

		if(!env.isMobile){
			this.comp.on('select', function(event){
				self.setValue(event.value);
			});
		}

		this.setStartField(this.startField);
		this.setEndField(this.endField);
        if(!env.isMobile){
			// 校验
			this.comp.on('validate', function(event){
				self.doValidate();
			});
		}
	},

	setEndField: function(endField){
		var self = this;
		self.endField = endField;
		if(self.dataModel){
			if(self.endField){
				self.dataModel.ref(self.endField).subscribe(function(value) {
					if(env.isMobile){
						var valueObj = date.getDateObj(value);
						if(valueObj){
				            self.resetDataObj(valueObj);
				        }
						self.op.minDate = valueObj;
						if(self.adapterType == 'date'){
							$(self.element).mobiscroll().date(self.op);
						}else{
							$(self.element).mobiscroll().datetime(self.op);
						}
						var nowDate = date.getDateObj(self.dataModel.getValue(self.field));
						if(nowDate){
				            self.resetDataObj(nowDate);
				        }
						if(nowDate && nowDate.getTime() > valueObj.getTime() && value){
							self.dataModel.setValue(self.field,'');
						}
					}else{
						self.comp.setEndDate(value);
						var nowDate = self.comp.date;
						if(nowDate){
				            self.resetDataObj(nowDate);
				        }
				        var valueObj = date.getDateObj(value);
						if(valueObj){
				            self.resetDataObj(valueObj);
				        }
						if(nowDate && value && nowDate.getTime() > valueObj.getTime() ){
							self.dataModel.setValue(self.field,'');
						}
					}

				});
			}

			if(self.endField){
				var endValue = self.dataModel.getValue(self.endField);
				if(endValue){
					if(env.isMobile){
						self.op.minDate = date.getDateObj(endValue);
						if(self.adapterType == 'date'){
							$(self.element).mobiscroll().date(self.op);
						}else{
							$(self.element).mobiscroll().datetime(self.op);
						}
					}else{
						self.comp.setEndDate(endValue);
					}
				}
			}
		}
	},

	setStartField: function(startField){
		var self = this;
		self.startField = startField;
		if(self.dataModel){
			if(self.startField){
				self.dataModel.ref(self.startField).subscribe(function(value) {
					if(env.isMobile){
						value = date.getDateObj(value);

						// var valueObj = self.setMobileStartDate(value, self.options.format);
						var valueObj = value;
						if(valueObj){
				            self.resetDataObj(valueObj);
				        }
						self.op.minDate = valueObj;
						if(self.adapterType == 'date'){
							$(self.element).mobiscroll().date(self.op);
						}else{
							$(self.element).mobiscroll().datetime(self.op);
						}
						var nowDate = date.getDateObj(self.dataModel.getValue(self.field));
						if(nowDate){
				            self.resetDataObj(nowDate);
				        }
						if(nowDate && nowDate.getTime() < valueObj.getTime() && value){
							self.dataModel.setValue(self.field,'');
						}
					}else{
						self.comp.setStartDate(value, self.options.format);
						var nowDate = self.comp.date;
						if(nowDate){
				            self.resetDataObj(nowDate);
				        }
				        var valueObj = date.getDateObj(value);
				        if(valueObj){
				            self.resetDataObj(valueObj);
				        }
						if(nowDate && value && nowDate.getTime() < valueObj.getTime() ){
							self.dataModel.setValue(self.field,'');
						}
					}

				});
			}
			if(self.startField){
				var startValue = self.dataModel.getValue(self.startField);
				if(startValue){
					if(env.isMobile){
						startValue = date.getDateObj(startValue);
						self.op.minDate = self.setMobileStartDate(startValue, self.options.format);
						if(self.adapterType == 'date'){
							$(self.element).mobiscroll().date(self.op);
						}else{
							$(self.element).mobiscroll().datetime(self.op);
						}
					}else{
						self.comp.setStartDate(startValue, self.options.format);
					}
				}
			}
		}
	},

	setMobileStartDate: function (startDate, type) {

	    if(startDate){
	        switch (type) {
	            case 'YYYY-MM':
	                startDate = date.add(startDate, 'M', 1);
	                break;
	            case 'YYYY-MM-DD':
	                startDate = date.add(startDate, 'd', 1);
	                break;
	        }
	    }
	    return startDate;
	},


	modelValueChange: function(value){
		if (this.slice) return;
		this.trueValue = value;
		if(env.isMobile){
			if(value){
				value = date.format(value,this.options.format);
				$(this.element).scroller('setDate', date.getDateObj(value), true);
			}else{
				this.setShowValue('');
			}
		}else{
			this.comp.setDate(value);
		}

	},
	setFormat: function(format){
		if (this.maskerMeta.format == format) return;
		this.options.format = format;
		this.maskerMeta.format = format;
		if(!env.isMobile)
			this.comp.setFormat(format);
		// this.formater = new $.DateFormater(this.maskerMeta.format);
		// this.masker = new DateTimeMasker(this.maskerMeta);
	},
	setValue: function (value) {
		if(this.dataModel){
			var valueObj = date.getDateObj(value);
			if(valueObj){
	            this.resetDataObj(valueObj);
	        }
			if(this.startField){
				var startValue = this.dataModel.getValue(this.startField);
				var startValueObj = date.getDateObj(startValue);
				if(startValueObj){
		            this.resetDataObj(startValueObj);
		        }
				if(startValueObj && valueObj && valueObj.getTime() < startValueObj.getTime()){
					return;
				}
			}
			if(this.endField){
				var endValue = this.dataModel.getValue(this.endField);
				var endValueObj = date.getDateObj(endValue);
				if(endValueObj){
					this.resetDataObj(endValueObj);
		        }
				if(endValueObj && valueObj && valueObj.getTime() > endValueObj.getTime()){
					return;
				}
			}
		}
		value = date.format(value,this.options.format);
		ValueMixin.methods.setValue.call(this,value);
        // this.trueValue = this.formater ? this.formater.format(value) : value;
        // this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
        // this.setShowValue(this.showValue);
        // this.slice = true;
        // this.dataModel.setValue(this.field, this.trueValue);
        // this.slice = false;
    },
    setEnable: function(enable){
        if (enable === true || enable === 'true') {
            this.enable = true;
            if(env.isMobile){
            	this.element.removeAttribute('disabled');
            }else{
            	this.comp._input.removeAttribute('readonly');
            }
            removeClass(this.element.parentNode,'disablecover');
        } else if (enable === false || enable === 'false') {
            this.enable = false;
            if(env.isMobile){
            	this.element.setAttribute('disabled','disabled');
            }else{
            	this.comp._input.setAttribute('readonly', 'readonly');
            }
            addClass(this.element.parentNode,'disablecover');
        }
        if(!env.isMobile)
        	this.comp.setEnable(enable);
    },

    resetDataObj: function(dataObj){
    	if(this.options.format.indexOf('h') < 0 && this.options.format.indexOf('H') < 0){
    		dataObj.setHours(0);
    	}
    	if(this.options.format.indexOf('m') < 0){
    		dataObj.setMinutes(0);
    	}
    	if(this.options.format.indexOf('s') < 0){
    		dataObj.setSeconds(0);
		    dataObj.setMilliseconds(0);
    	}
    }

});

compMgr.addDataAdapter({
	adapter: DateTimeAdapter,
	name: 'u-date'
});

compMgr.addDataAdapter({
	adapter: DateTimeAdapter,
	name: 'u-datetime'
});

export {DateTimeAdapter};
