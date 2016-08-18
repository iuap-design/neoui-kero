/**
 * Module : Kero datetime
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 14:59:37
 */

import {BaseAdapter} from './baseAdapter';
import {ValueMixin} from './valueMixin';
import {EnableMixin} from './enableMixin';
import {RequiredMixin} from './requiredMixin';
import {ValidateMixin} from './validateMixin';
import {on,off,stopEvent} from 'neoui-sparrow/js/event';
import {addClass,removeClass} from 'neoui-sparrow/js/dom';
import {core} from 'neoui-sparrow/js/core';
import {DataTable} from 'kero/js/dataTable/indexDataTable';
import {env} from 'neoui-sparrow/js/env';
import {DateTimePicker} from 'neoui/js/neoui-datetimepicker';
import {date} from 'neoui-sparrow/js/util/dateUtils';
import {compMgr} from 'neoui-sparrow/js/compMgr';

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
			}else{
				this.options.format = "YYYY-MM-DD HH:mm:ss";
			}
		}
		format = this.options.format;
		this.maskerMeta.format = format || this.maskerMeta.format

		this.startField = this.options.startField?this.options.startField : this.dataModel.getMeta(this.field, "startField");
		
			
		// this.formater = new $.DateFormater(this.maskerMeta.format);
		// this.masker = new DateTimeMasker(this.maskerMeta);
		var op;
		if(env.isIphone || env.isAndroidPhone){
			op = {
				theme:"ios",
				mode:"scroller",
				lang: "zh",  
				cancelText: null,
				onSelect:function(val){
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
				$(this.element).mobiscroll().date(op);
			}else{
				$(this.element).mobiscroll().datetime(op);
			}
		}else{
			this.comp = new DateTimePicker({el:this.element,format:this.maskerMeta.format,showFix:this.options.showFix});
		}
		
		this.element['u.DateTimePicker'] = this.comp;

		if(!(env.isIphone || env.isAndroidPhone)){
			this.comp.on('select', function(event){
				self.setValue(event.value);
			});
		}
		if(this.dataModel){
			this.dataModel.ref(this.field).subscribe(function(value) {
				self.modelValueChange(value);
			});
			if(this.startField){
				this.dataModel.ref(this.startField).subscribe(function(value) {
					if(env.isIphone || env.isAndroidPhone){
						var valueObj = date.getDateObj(value);
						op.minDate = valueObj;
						if(self.adapterType == 'date'){
							$(self.element).mobiscroll().date(op);
						}else{
							$(self.element).mobiscroll().datetime(op);
						}
						var nowDate = date.getDateObj(self.dataModel.getValue(self.field));
						if(nowDate < valueObj || !value){
							self.dataModel.setValue(self.field,'');
						}
					}else{
						self.comp.setStartDate(value);
						if(self.comp.date < date.getDateObj(value) || !value){
							self.dataModel.setValue(self.field,'');
						}
					}
					
				});
			}
			if(this.startField){
				var startValue = this.dataModel.getValue(this.startField);
				if(startValue){
					if(env.isIphone || env.isAndroidPhone){
						op.minDate = date.getDateObj(startValue);
						if(this.adapterType == 'date'){
							$(this.element).mobiscroll().date(op);
						}else{
							$(this.element).mobiscroll().datetime(op);
						}
					}else{
						self.comp.setStartDate(startValue);
					}
				}
			}
			
		}
			
	},
	modelValueChange: function(value){
		if (this.slice) return;
		this.trueValue = value;
		if(env.isIphone || env.isAndroidPhone){
			if(value){
				value = date.format(value,this.options.format);
				$(this.element).scroller('setDate', date.getDateObj(value), true);
			}
		}else{
			this.comp.setDate(value);
		}
		
	},
	setFormat: function(format){
		if (this.maskerMeta.format == format) return;
		this.options.format = format;
		this.maskerMeta.format = format;
		if(!(env.isIphone || env.isAndroidPhone))
			this.comp.setFormat(format);
		// this.formater = new $.DateFormater(this.maskerMeta.format);
		// this.masker = new DateTimeMasker(this.maskerMeta);
	},
	setValue: function (value) {
		value = date.format(value,this.options.format);
        this.trueValue = this.formater ? this.formater.format(value) : value;
        this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
        this.setShowValue(this.showValue);
        this.slice = true;
        this.dataModel.setValue(this.field, this.trueValue);
        this.slice = false;
    },
    setEnable: function(enable){
        if (enable === true || enable === 'true') {
            this.enable = true;
            if(env.isIphone || env.isAndroidPhone){
            	this.element.removeAttribute('disabled');
            }else{
            	this.comp._input.removeAttribute('readonly');
            }
            removeClass(this.element.parentNode,'disablecover');
        } else if (enable === false || enable === 'false') {
            this.enable = false;
            if(env.isIphone || env.isAndroidPhone){
            	this.element.setAttribute('disabled','disabled');
            }else{
            	this.comp._input.setAttribute('readonly', 'readonly');
            }
            addClass(this.element.parentNode,'disablecover');
        }
        if(!(env.isIphone || env.isAndroidPhone))
        	this.comp.setEnable(enable);
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
