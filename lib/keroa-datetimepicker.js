/**
 * Module : Kero datetime
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 14:59:37
 */

import { on, off, stopEvent } from 'tinper-sparrow/src/event';
import { addClass, removeClass } from 'tinper-sparrow/src/dom';
import { core } from 'tinper-sparrow/src/core';
import { DataTable } from 'kero/src/indexDataTable';
import { env } from 'tinper-sparrow/src/env';
import { getCookie } from 'tinper-sparrow/src/cookies';
import { U_TIMEZONE } from 'tinper-sparrow/src/enumerables';
import { DateTimePicker } from 'tinper-neoui/src/neoui-datetimepicker';
import { date } from 'tinper-sparrow/src/util/dateUtils';
import { getFunction } from 'tinper-sparrow/src/util';

var DateTimeAdapter = u.BaseAdapter.extend({
    init: function init() {
        var self = this,
            adapterType,
            format;
        if (this.options.type === 'u-date') {
            this.adapterType = 'date';
        } else {
            this.adapterType = 'datetime';
            addClass(this.element, 'time');
        }

        this.timezone = this.getOption('timezone') || getCookie(U_TIMEZONE);
        this.isMobile = env.isMobile;

        if (!this.options['format'] && typeof getFormatFun == 'function') {
            // 根据语种获取format
            this.options['format'] = getFormatFun();
        }

        this.beforeValueChangeFun = getFunction(this.viewModel, this.options['beforeValueChangeFun']);

        this.maskerMeta = core.getMaskerMeta(this.adapterType) || {};
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
        this.fformat = format;
        this.maskerMeta.format = format || this.maskerMeta.format;

        this.startField = this.options.startField ? this.options.startField : this.dataModel.getMeta(this.field, "startField");

        this.endField = this.options.endField ? this.options.endField : this.dataModel.getMeta(this.field, "endField");

        // this.formater = new $.DateFormater(this.maskerMeta.format);
        // this.masker = new DateTimeMasker(this.maskerMeta);
        this.createUIComp({
            format: format
        });

        this.setStartField(this.startField);
        this.setEndField(this.endField);
        if (!this.isMobile && !this.antFlag) {
            // 校验
            this.comp.on('validate', function (event) {
                self.doValidate();
            });
        }
    },

    createUIComp: function createUIComp(obj) {
        this.op = {};
        var format = obj.format,
            self = this,
            mobileDateFormat = "",
            mobileTimeFormat = "",
            dateOrder = "",
            timeOrder = "";
        if (this.antFlag) {} else if (this.isMobile) {
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
            var placeholder = this.options['placeholder'];
            if (placeholder) this.element.placeholder = placeholder;
            if (this._span) {
                on(this._span, 'click', function (e) {
                    self.element.focus();
                    stopEvent(e);
                });
            }
            if (this.adapterType == 'date') {
                $(this.element).mobiscroll().date(this.op);
            } else {
                $(this.element).mobiscroll().datetime(this.op);
            }
        } else {
            this.comp = new DateTimePicker({
                el: this.element,
                placeholder: this.options.placeholder,
                format: this.maskerMeta.format,
                showFix: this.options.showFix,
                beforeValueChangeFun: this.beforeValueChangeFun,
                timezone: this.timezone
            });
        }

        this.element['u.DateTimePicker'] = this.comp;

        if (!this.isMobile && !this.antFlag) {
            this.comp.on('select', function (event) {
                self.setValue(event.value);
            });
        }
    },

    setEndField: function setEndField(endField) {
        var self = this;
        self.endField = endField;
        if (self.dataModel) {
            if (self.endField) {
                self.dataModel.ref(self.endField).subscribe(function (value) {
                    if (self.antFlag) {} else if (self.isMobile) {
                        var valueObj = date.getDateObj(value);
                        if (valueObj) {
                            self.resetDataObj(valueObj);
                        }
                        self.op.minDate = valueObj;
                        if (self.adapterType == 'date') {
                            $(self.element).mobiscroll().date(self.op);
                        } else {
                            $(self.element).mobiscroll().datetime(self.op);
                        }
                        var nowDate = date.getDateObj(self.dataModel.getValue(self.field));
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
                        var valueObj = date.getDateObj(value);
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
                    if (self.antFlag) {} else if (self.isMobile) {
                        self.op.minDate = date.getDateObj(endValue);
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
                    if (self.antFlag) {} else if (self.isMobile) {
                        value = date.getDateObj(value);

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
                        var nowDate = date.getDateObj(self.dataModel.getValue(self.field));
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
                        var valueObj = date.getDateObj(value);
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
                    if (self.antFlag) {} else if (self.isMobile) {
                        startValue = date.getDateObj(startValue);
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
                    startDate = date.add(startDate, 'M', 1);
                    break;
                case 'YYYY-MM-DD':
                    startDate = date.add(startDate, 'd', 1);
                    break;
            }
        }
        return startDate;
    },

    modelValueChange: function modelValueChange(value) {
        if (this.slice) return;
        this.trueValue = value;
        if (this.antFlag) {} else if (this.isMobile) {
            if (value) {
                value = date.format(value, this.options.format);
                $(this.element).scroller('setDate', date.getDateObj(value), true);
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
        if (!this.isMobile && this.antFlag) this.comp.setFormat(format);
        // this.formater = new $.DateFormater(this.maskerMeta.format);
        // this.masker = new DateTimeMasker(this.maskerMeta);
    },

    beforeSetValue: function beforeSetValue(value) {
        var valueObj = date.getDateObj(value);
        if (this.dataModel) {
            if (valueObj) {
                if (!(typeof this.timezone != 'undefined' && this.timezone != null && this.timezone != '')) {
                    this.resetDataObj(valueObj);
                }
            }
            if (this.startField) {
                var startValue = this.dataModel.getValue(this.startField);
                var startValueObj = date.getDateObj(startValue);
                if (startValueObj) {
                    if (!(typeof this.timezone != 'undefined' && this.timezone != null && this.timezone != '')) {
                        this.resetDataObj(startValueObj);
                    }
                }
                if (startValueObj && valueObj && valueObj.getTime() < startValueObj.getTime()) {
                    return;
                }
            }
            if (this.endField) {
                var endValue = this.dataModel.getValue(this.endField);
                var endValueObj = date.getDateObj(endValue);
                if (endValueObj) {
                    if (!(typeof this.timezone != 'undefined' && this.timezone != null && this.timezone != '')) {
                        this.resetDataObj(endValueObj);
                    }
                }
                if (endValueObj && valueObj && valueObj.getTime() > endValueObj.getTime()) {
                    return;
                }
            }
        }
        if (!(typeof this.timezone != 'undefined' && this.timezone != null && this.timezone != '')) {
            value = date.format(value, this.options.format);
        } else {
            value = valueObj.getTime();
        }
        return value;
    },
    setEnable: function setEnable(enable) {
        if (enable === true || enable === 'true') {
            this.enable = true;
            if (this.antFlag) {} else if (this.isMobile) {
                this.element.removeAttribute('disabled');
            } else {
                this.comp._input.removeAttribute('readonly');
            }
            removeClass(this.element.parentNode, 'disablecover');
        } else if (enable === false || enable === 'false') {
            this.enable = false;
            if (this.antFlag) {} else if (this.isMobile) {
                this.element.setAttribute('disabled', 'disabled');
            } else {
                this.comp._input.setAttribute('readonly', 'readonly');
            }
            addClass(this.element.parentNode, 'disablecover');
        }
        if (!this.isMobile && !this.antFlag) this.comp.setEnable(enable);
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

if (u.compMgr) u.compMgr.addDataAdapter({
    adapter: DateTimeAdapter,
    name: 'u-date'
});

if (u.compMgr) u.compMgr.addDataAdapter({
    adapter: DateTimeAdapter,
    name: 'u-datetime'
});

export { DateTimeAdapter };