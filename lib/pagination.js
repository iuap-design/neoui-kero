'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PaginationAdapter = undefined;

var _baseAdapter = require('./baseAdapter');

var _extend = require('neoui-sparrow/lib/extend');

var _neouiPagination = require('neoui/lib/neoui-pagination');

var _util = require('neoui-sparrow/lib/util');

/**
 * Module : Kero pagination
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 19:09:39
 */
var PaginationAdapter = _baseAdapter.BaseAdapter.extend({
    initialize: function initialize(comp, options) {
        var self = this;
        PaginationAdapter.superclass.initialize.apply(this, arguments);

        //var Pagination = function(element, options, viewModel) {

        if (!this.dataModel.pageSize() && this.options.pageSize) this.dataModel.pageSize(this.options.pageSize);
        this.options.pageSize = this.dataModel.pageSize() || this.options.pageSize;
        //this.$element.pagination(options);
        //this.comp = this.$element.data('u.pagination');
        var options = (0, _extend.extend)({}, { el: this.element, jumppage: true }, this.options);
        this.comp = new _neouiPagination.pagination(options);
        this.element['u.pagination'] = this.comp;
        this.comp.dataModel = this.dataModel;
        this.pageChange = (0, _util.getFunction)(this.viewModel, this.options['pageChange']);
        this.sizeChange = (0, _util.getFunction)(this.viewModel, this.options['sizeChange']);

        this.comp.on('pageChange', function (pageIndex) {
            if (typeof self.pageChange == 'function') {
                self.pageChange(pageIndex);
            } else {
                self.defaultPageChange(pageIndex);
            }
        });
        this.comp.on('sizeChange', function (size, pageIndex) {
            if (typeof self.sizeChange == 'function') {
                self.sizeChange(size, pageIndex);
            } else {
                self.defaultSizeChange(size, pageIndex);
                // showMessage({msg:"没有注册sizeChange事件"});
            }
        });

        this.dataModel.totalPages.subscribe(function (value) {
            self.comp.update({ totalPages: value });
        });

        this.dataModel.pageSize.subscribe(function (value) {
            self.comp.update({ pageSize: value });
        });

        this.dataModel.pageIndex.subscribe(function (value) {
            self.comp.update({ currentPage: value + 1 });
        });

        this.dataModel.totalRow.subscribe(function (value) {
            self.comp.update({ totalCount: value });
        });

        if (this.comp.options.pageList.length > 0) {
            this.comp.options.pageSize = this.comp.options.pageList[0];
            ///this.comp.trigger('sizeChange', options.pageList[0])
            this.dataModel.pageSize(this.comp.options.pageList[0]);
        }

        // 如果datatable已经创建则根据datatable设置分页组件
        // self.comp.update({totalPages: this.dataModel.totalPages()})
        // self.comp.update({pageSize: this.dataModel.pageSize()})
        // self.comp.update({currentPage: this.dataModel.pageIndex() + 1})
        // self.comp.update({totalCount: this.dataModel.totalRow()})
        self.comp.update({ totalPages: this.dataModel.totalPages(), pageSize: this.dataModel.pageSize(), currentPage: this.dataModel.pageIndex() + 1, totalCount: this.dataModel.totalRow() });
    },

    defaultPageChange: function defaultPageChange(pageIndex) {
        if (this.dataModel.hasPage(pageIndex)) {
            this.dataModel.setCurrentPage(pageIndex);
        } else {}
    },

    defaultSizeChange: function defaultSizeChange(size, pageIndex) {
        this.dataModel.pageSize(size);
    },

    disableChangeSize: function disableChangeSize() {
        this.comp.disableChangeSize();
    },

    enableChangeSize: function enableChangeSize() {
        this.comp.enableChangeSize();
    }
});

compMgr.addDataAdapter({
    adapter: PaginationAdapter,
    name: 'pagination'
});

exports.PaginationAdapter = PaginationAdapter;