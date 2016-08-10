/**
 * Module : Kero time adapter
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-10 12:40:46
 */

import {BaseAdapter} from './baseAdapter';
import {ValueMixin} from './valueMixin';
import {EnableMixin} from './valueMixin';
import {RequiredMixin} from './valueMixin';
import {ValidateMixin} from './valueMixin';
import {on} from 'neoui-sparrow/lib/event';
import {core} from 'neoui-sparrow/lib/core';
import {env} from 'neoui-sparrow/lib/env';
import {date} from 'neoui-sparrow/lib/util/dateUtils';
//miss ClockPicker
//miss Time
import {compMgr} from 'neoui-sparrow/lib/compMgr';



var TimeAdapter = BaseAdapter.extend({
    initialize: function (options) {
        var self = this;
        TimeAdapter.superclass.initialize.apply(this, arguments);
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

