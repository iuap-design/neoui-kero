/**
 * Module : Kero time adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 12:40:46
 */

import {BaseAdapter} from '../core/baseAdapter';
import {ValueMixin} from '../core/valueMixin';
import {EnableMixin} from '../core/enableMixin';
import {RequiredMixin} from '../core/requiredMixin';
import {ValidateMixin} from '../core/validateMixin';
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
                    _date = date.getDateObj(_date);
                    if (!_date){
                        self.dataModel.setValue(self.field,'');
                    }else {
                        if (event.value == _date.getHours() + ':' + _date.getMinutes() + ':' + _date.getSeconds())
                            return;
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
                compValue = _date.getHours() + ':' + _date.getMinutes() + ':' + _date.getSeconds();
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

