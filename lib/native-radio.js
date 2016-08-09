'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NativeRadioAdapter = undefined;

var _baseAdapter = require('./baseAdapter');

var _valueMixin = require('./valueMixin');

var _util = require('neoui-sparrow/lib/util');

var _event = require('neoui-sparrow/lib/event');

var _compMgr = require('neoui-sparrow/lib/compMgr');

/**
 * Module : Kero native-radio
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 19:03:30
 */

var NativeRadioAdapter = _baseAdapter.BaseAdapter.extend({
    mixins: [_valueMixin.ValueMixin, _valueMixin.EnableMixin],
    init: function init() {
        this.isDynamic = false;
        //如果存在datasource，动态创建radio
        if (this.options['datasource']) {
            this.isDynamic = true;
            var datasource = (0, _util.getJSObject)(this.viewModel, this.options['datasource']);
            //if(!u.isArray(datasource)) return;

            this.radioTemplateArray = [];
            for (var i = 0, count = this.element.childNodes.length; i < count; i++) {
                this.radioTemplateArray.push(this.element.childNodes[i]);
            }
            this.setComboData(datasource);
        } else {}
    },
    setComboData: function setComboData(comboData) {
        var self = this;
        //if(!this.radioTemplate.is(":radio")) return;
        this.element.innerHTML = '';
        for (var i = 0, len = comboData.length; i < len; i++) {
            for (var j = 0; j < this.radioTemplateArray.length; j++) {
                try {
                    this.element.appendChild(this.radioTemplateArray[j].cloneNode(true));
                } catch (e) {}
            }
            //this.radioTemplate.clone().appendTo(this.element)
        }

        var allRadio = this.element.querySelectorAll('[type=radio]');
        var allName = this.element.querySelectorAll('[data-role=name]');
        for (var k = 0; k < allRadio.length; k++) {
            allRadio[k].value = comboData[k].pk || comboData[k].value;
            allName[k].innerHTML = comboData[k].name;
        }

        this.radioInputName = allRadio[0].name;

        this.element.querySelectorAll('[type=radio][name="' + this.radioInputName + '"]').forEach(function (ele) {
            (0, _event.on)(ele, 'click', function () {
                if (this.checked) {
                    self.setValue(this.value);
                }
            });
        });
    },
    modelValueChange: function modelValueChange(value) {
        if (this.slice) return;
        this.setValue(value);
    },
    setValue: function setValue(value) {
        this.trueValue = value;
        this.element.querySelectorAll('[type=radio][name="' + this.radioInputName + '"]').forEach(function (ele) {
            if (ele.value == value) {
                ele.checked = true;
            } else {
                ele.checked = false;
            }
        });
        this.slice = true;
        this.dataModel.setValue(this.field, this.trueValue);
        this.slice = false;
    },
    getValue: function getValue() {
        return this.trueValue;
    }

});

_compMgr.compMgr.addDataAdapter({
    adapter: NativeRadioAdapter,
    name: 'radio'
});
exports.NativeRadioAdapter = NativeRadioAdapter;