/**
 * Module : Kero time adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 12:40:46
 */

import {BaseAdapter} from '../core/baseAdapter';

import {ValueMixin} from 'neoui-kero-mixin/js/valueMixin';
import {EnableMixin} from 'neoui-kero-mixin/js/enableMixin';
import {RequiredMixin} from 'neoui-kero-mixin/js/requiredMixin';
import {ValidateMixin} from 'neoui-kero-mixin/js/validateMixin';

import {on} from 'tinper-sparrow/js/event';
import {core} from 'tinper-sparrow/js/core';
import {env} from 'tinper-sparrow/js/env';
import {date} from 'tinper-sparrow/js/util/dateUtils';
import {ClockPicker} from 'tinper-neoui/js/neoui-clockpicker';
import {Time} from 'tinper-neoui/js/neoui-time';
import {compMgr} from 'tinper-sparrow/js/compMgr';



var TimeAdapter = BaseAdapter.extend({
    mixins: [ValueMixin,EnableMixin,RequiredMixin, ValidateMixin],
    init: function (options) {
        var self = this;
        this.validType = 'time';

        this.maskerMeta = core.getMaskerMeta('time') || {};
        this.maskerMeta.format = this.dataModel.getMeta(this.field, "format") || this.maskerMeta.format

        if (this.options.type == 'u-clockpicker' && !env.isIE8)
            this.comp = new ClockPicker(this.element);
        else
            this.comp = new Time(this.element);
        var dataType = this.dataModel.getMeta(this.field,'type');
        this.dataType =  dataType || 'string';


        this.comp.on('valueChange', function(event){
            self.slice = true;
            if(event.value == ''){
                self.dataModel.setValue(self.field,'')
            }else{
                var _date = self.dataModel.getValue(self.field);
                if (self.dataType === 'datetime') {
                    var valueArr = event.value.split(':');
                   //如果_date为空时赋值就无法赋值，所以为空时设置了个默认值
                    if (!_date) {
                        _date = "1970-01-01 00:00:00";
                    }
                    _date = date.getDateObj(_date);
                    if (!_date){
                        self.dataModel.setValue(self.field,'');
                    }else {
                        if (event.value == (_date.getHours()<10 ?'0'+_date.getHours() :_date.getHours()) + ':' + (_date.getMinutes() <10 ? '0'+_date.getMinutes() :_date.getMinutes()) + ':' +( _date.getSeconds()<10?'0'+_date.getSeconds():_date.getSeconds()) ) {
                            self.slice = false;
                            return;
                        }
                        _date.setHours(valueArr[0]);
                        _date.setMinutes(valueArr[1]);
                        _date.setSeconds(valueArr[2]);
                        self.dataModel.setValue(self.field, u.date.format(_date, 'YYYY-MM-DD HH:mm:ss'));
                    }
                }
                else{
                    if (event.value == _date)
                        return;
                    self.dataModel.setValue(self.field, event.value);
                }
            }
            
            self.slice = false;
            //self.setValue(event.value);
        });
        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },
    modelValueChange: function (value) {
        if (this.slice) return;
        var compValue = '';
        if (this.dataType === 'datetime') {
            var _date = date.getDateObj(value);
            if (!_date)
                compValue = ''
            else
                compValue = (_date.getHours()<10 ?'0'+_date.getHours() :_date.getHours()) + ':' + (_date.getMinutes() <10 ? '0'+_date.getMinutes() :_date.getMinutes()) + ':' +( _date.getSeconds()<10?'0'+_date.getSeconds():_date.getSeconds()) ;
        }
        else{
            compValue = value;
        }
        this.comp.setValue(compValue);
    },
    setEnable: function (enable) {
    }
});

compMgr.addDataAdapter({
	adapter: TimeAdapter,
	name: 'u-time'
});

compMgr.addDataAdapter({
	adapter: TimeAdapter,
	name: 'u-clockpicker'
});

export {TimeAdapter};

