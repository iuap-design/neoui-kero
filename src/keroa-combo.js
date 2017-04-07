/**
 * Module : Kero webpack entry index
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 09:52:13
 */

import {
    getJSObject
} from 'tinper-sparrow/src/util';
import {
    Combo
} from 'tinper-neoui/src/neoui-combo';
import {
    env
} from 'tinper-sparrow/src/env';
import {
    on,
    off,
    stopEvent
} from 'tinper-sparrow/src/event';
import {
    addClass,
    removeClass
} from 'tinper-sparrow/src/dom';


var ComboboxAdapter = u.BaseAdapter.extend({
    init: function() {
        var self = this;
        this.datasource = getJSObject(this.viewModel, this.options['datasource']);
        this.mutil = this.options.mutil || false;
        this.onlySelect = this.options.onlySelect || false;
        this.showFix = this.options.showFix || false;
        this.validType = 'combobox';
        this.isAutoTip = this.options.isAutoTip || false;

        if (!this.element['u.Combo']) {
            this.comp = new u.Combo({
                el: this.element,
                mutilSelect: this.mutil,
                onlySelect: this.onlySelect,
                showFix: this.showFix,
                isAutoTip: this.isAutoTip
            });
            this.element['u.Combo'] = this.comp;

        } else {
            this.comp = this.element['u.Combo']
        }

        var isDsObservable = ko.isObservable(this.datasource);
        if (this.datasource) {
            this.comp.setComboData(isDsObservable ? ko.toJS(this.datasource) : this.datasource);
        } else {
            if (u.isIE8 || u.isIE9)
                alert("IE8/IE9必须设置datasource");
        }
        if (isDsObservable) {
            // datasource 发生变化时改变控件
            this.datasource.subscribe(function(value) {
                self.comp.setComboData(value);
            });
        }



        this.comp.on('select', function(event) {
            self.setValue(event.value);
            self.setShowValue(event.name);
        });

    },
    modelValueChange: function(value) {
        if (this.slice) return;
        //this.trueValue = value;
        if (value === null || typeof value == "undefined")
            value = "";
        this.comp.setValue(value);
        if (this.mutil)
            this.showValue = this.comp.name;
        //下面两句会在校验中用到
        this.trueValue = this.formater ? this.formater.format(value) : value;
        this.element.trueValue = this.trueValue;
    },

    //getValue: function () {
    //    return this.trueValue
    //},
    setEnable: function(enable) {
        var self = this;
        if (enable === true || enable === 'true') {
            this.enable = true;
            this.element.removeAttribute('readonly');
            this.comp._input.removeAttribute('readonly');
            removeClass(this.element.parentNode, 'disablecover');
            on(this.comp._input, 'focus', function(e) {
                self.comp.show(e);
                stopEvent(e);
            })
            if (this.comp.iconBtn) {
                on(this.comp.iconBtn, 'click', function(e) {
                    self.comp.show(e);
                    stopEvent(e);
                })
            }
        } else if (enable === false || enable === 'false') {
            this.enable = false;
            this.element.setAttribute('readonly', 'readonly');
            this.comp._input.setAttribute('readonly', 'readonly');
            addClass(this.element.parentNode, 'disablecover');
            off(this.comp._input, 'focus')
            if (this.comp.iconBtn) {
                off(this.comp.iconBtn, 'click')
            }
        }
    }
});

if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: ComboboxAdapter,
        name: 'u-combobox'
    });

export {
    ComboboxAdapter
};
