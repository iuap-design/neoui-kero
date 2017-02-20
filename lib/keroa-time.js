'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TimeAdapter = undefined;

var _keroaBaseAdapter = require('./keroa-baseAdapter');

var _event = require('tinper-sparrow/src/event');

var _core = require('tinper-sparrow/src/core');

var _env = require('tinper-sparrow/src/env');

var _dateUtils = require('tinper-sparrow/src/util/dateUtils');

var _neouiClockpicker = require('tinper-neoui/src/neoui-clockpicker');

var _neouiTime = require('tinper-neoui/src/neoui-time');

var _compMgr = require('compox/src/compMgr');

/**
 * Module : Kero time adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 12:40:46
 */

var TimeAdapter = _keroaBaseAdapter.BaseAdapter.extend({
    init: function init(options) {
        var self = this;
        this.validType = 'time';

        this.maskerMeta = _core.core.getMaskerMeta('time') || {};
        this.maskerMeta.format = this.dataModel.getMeta(this.field, "format") || this.maskerMeta.format;

        if (this.options.type == 'u-clockpicker' && !_env.env.isIE8) this.comp = new _neouiClockpicker.ClockPicker(this.element);else this.comp = new _neouiTime.Time(this.element);
        var dataType = this.dataModel.getMeta(this.field, 'type');
        this.dataType = dataType || 'string';

        this.comp.on('valueChange', function (event) {
            self.slice = true;
            if (event.value == '') {
                self.dataModel.setValue(self.field, '');
            } else {
                var _date = self.dataModel.getValue(self.field);
                if (self.dataType === 'datetime') {
                    var valueArr = event.value.split(':');
                    //如果_date为空时赋值就无法赋值，所以为空时设置了个默认值
                    if (!_date) {
                        _date = "1970-01-01 00:00:00";
                    }
                    _date = _dateUtils.date.getDateObj(_date);
                    if (!_date) {
                        self.dataModel.setValue(self.field, '');
                    } else {
                        if (event.value == (_date.getHours() < 10 ? '0' + _date.getHours() : _date.getHours()) + ':' + (_date.getMinutes() < 10 ? '0' + _date.getMinutes() : _date.getMinutes()) + ':' + (_date.getSeconds() < 10 ? '0' + _date.getSeconds() : _date.getSeconds())) {
                            self.slice = false;
                            return;
                        }
                        _date.setHours(valueArr[0]);
                        _date.setMinutes(valueArr[1]);
                        _date.setSeconds(valueArr[2]);
                        self.dataModel.setValue(self.field, u.date.format(_date, 'YYYY-MM-DD HH:mm:ss'));
                    }
                } else {
                    if (event.value == _date) return;
                    self.dataModel.setValue(self.field, event.value);
                }
            }

            self.slice = false;
            //self.setValue(event.value);
        });
        this.dataModel.ref(this.field).subscribe(function (value) {
            self.modelValueChange(value);
        });
    },
    modelValueChange: function modelValueChange(value) {
        if (this.slice) return;
        var compValue = '';
        if (this.dataType === 'datetime') {
            var _date = _dateUtils.date.getDateObj(value);
            if (!_date) compValue = '';else compValue = (_date.getHours() < 10 ? '0' + _date.getHours() : _date.getHours()) + ':' + (_date.getMinutes() < 10 ? '0' + _date.getMinutes() : _date.getMinutes()) + ':' + (_date.getSeconds() < 10 ? '0' + _date.getSeconds() : _date.getSeconds());
        } else {
            compValue = value;
        }
        this.comp.setValue(compValue);
    },
    setEnable: function setEnable(enable) {}
});

_compMgr.compMgr.addDataAdapter({
    adapter: TimeAdapter,
    name: 'u-time'
});

_compMgr.compMgr.addDataAdapter({
    adapter: TimeAdapter,
    name: 'u-clockpicker'
});

exports.TimeAdapter = TimeAdapter;