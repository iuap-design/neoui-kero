/**
 * Module : Kero Value Mixin
 * Author : Kvkens(yueming@yonyou.com)
 * Date   : 2016-08-08 15:58:49
 */


var ValueMixin = {
    init: function(){
        var self = this;

        // 如果存在行对象则处理数据都针对此行进行处理
        if(this.options.rowIndex > -1){
            // 添加监听，判断当前field并且为当前行的情况下才修改值
            this.dataModel.on(DataTable.ON_VALUE_CHANGE, function(obj) {
                if(self.field == obj.field){
                    var rowId = obj.rowId;
                    var row = self.dataModel.getRowByRowId(rowId);
                    var index = self.dataModel.getRowIndex(row);
                    if(index == self.options.rowIndex){
                        self.modelValueChange(obj.newValue);
                    }
                }
            });

            var rowObj = this.dataModel.getRow(this.options.rowIndex);
            if(rowObj){
                this.modelValueChange(rowObj.getValue(this.field));
            }
        }else{
            this.dataModel.ref(this.field).subscribe(function(value) {
                self.modelValueChange(value)
            });
            this.modelValueChange(this.dataModel.getValue(this.field));
        }
        

    },
    methods:{
        /**
         * 模型数据改变
         * @param {Object} value
         */
        modelValueChange: function (value) {
            if (this.slice) return;
            if (value === null || typeof value == "undefined")
                value = "";
            this.trueValue = this.formater ? this.formater.format(value) : value;
            //this.element.trueValue = this.trueValue;
            this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
            this.setShowValue(this.showValue);

            //this.trueValue = value;
            //this.showValue = value;
            //this.setShowValue(this.showValue);
        },

        ///**
        // * 设置模型值
        // * @param {Object} value
        // */
        //setModelValue: function (value) {
        //    if (!this.dataModel) return;
        //    this.dataModel.setValue(this.field, value)
        //},
        /**
         * 设置控件值
         * @param {Object} value
         */
        setValue: function (value) {
            this.trueValue = this.formater ? this.formater.format(value) : value;
            this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
            this.setShowValue(this.showValue);
            this.slice = true;
            if(this.options.rowIndex > -1){
                var rowObj = this.dataModel.getRow(this.options.rowIndex);
                if(rowObj)
                    rowObj.setValue(this.field, this.trueValue);
            }else{
                this.dataModel.setValue(this.field, this.trueValue);
            }
            this.slice = false;
        },
        /**
         * 取控件的值
         */
        getValue: function () {
            return this.trueValue;
        },
        setShowValue: function (showValue) {
            this.showValue = showValue;
            this.element.value = showValue;
            this.element.title = showValue;

        },
        getShowValue: function () {
            return this.showValue
        },
        setModelValue: function (value) {
            if (!this.dataModel) return
             if(this.options.rowIndex > -1){
                var rowObj = this.dataModel.getRow(this.options.rowIndex);
                if(rowObj)
                    rowObj.setValue(this.field, value)
            }else{
                this.dataModel.setValue(this.field, value)
            }
        },
    }
}

export {ValueMixin};
