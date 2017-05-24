/**
 * Module : Kero pagination
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 19:09:39
 */

import {
    extend
} from 'tinper-sparrow/src/extend';
import {
    pagination
} from 'tinper-neoui/src/neoui-pagination';
import {
    getFunction
} from 'tinper-sparrow/src/util';



var PaginationAdapter = u.BaseAdapter.extend({
    mixins: [],
    init: function() {
        var self = this;
        if (!this.dataModel.pageSize() && this.options.pageSize)
            this.dataModel.pageSize(this.options.pageSize)
        this.options.pageSize = this.dataModel.pageSize() || this.options.pageSize;
        var options = extend({}, {
            el: this.element
        }, this.options);
        this.comp = new pagination(options);
        this.element['u.pagination'] = this.comp;
        this.comp.dataModel = this.dataModel;
        this.pageChange = getFunction(this.viewModel, this.options['pageChange']);
        this.sizeChange = getFunction(this.viewModel, this.options['sizeChange']);

        this.comp.on('pageChange', function(pageIndex) {
            self.defaultPageChange(pageIndex);
            if (typeof self.pageChange == 'function') {
                self.pageChange(pageIndex);
            }

        });
        this.comp.on('sizeChange', function(size, pageIndex) {
            self.defaultSizeChange(size, pageIndex);
            if (typeof self.sizeChange == 'function') {
                self.sizeChange(size, pageIndex);
            }
        });


        this.dataModel.totalPages.subscribe(function(value) {
            self.comp.update({
                totalPages: value
            })
        })

        this.dataModel.pageSize.subscribe(function(value) {
            self.comp.update({
                pageSize: value
            })
        })

        this.dataModel.pageIndex.subscribe(function(value) {
            self.comp.update({
                currentPage: value + 1
            })
        })

        this.dataModel.totalRow.subscribe(function(value) {
            self.comp.update({
                totalCount: value
            })
        })

        if (this.comp.options.pageList.length > 0) {
            this.comp.options.pageSize = this.comp.options.pageList[0];
            ///this.comp.trigger('sizeChange', options.pageList[0])
            var checkIndex = 0;
            var defalutPageSize = this.comp.dataModel.pageSize();
            if (defalutPageSize > 0) {
                checkIndex = this.comp.options.pageList.indexOf(defalutPageSize);
            }
            checkIndex = checkIndex < 0 ? 0 : checkIndex;
            this.dataModel.pageSize(this.comp.options.pageList[checkIndex]);
        }


        // 如果datatable已经创建则根据datatable设置分页组件
        // self.comp.update({totalPages: this.dataModel.totalPages()})
        // self.comp.update({pageSize: this.dataModel.pageSize()})
        // self.comp.update({currentPage: this.dataModel.pageIndex() + 1})
        // self.comp.update({totalCount: this.dataModel.totalRow()})
        self.comp.update({
            totalPages: this.dataModel.totalPages(),
            pageSize: this.dataModel.pageSize(),
            currentPage: this.dataModel.pageIndex() + 1,
            totalCount: this.dataModel.totalRow()
        })
    },

    defaultPageChange: function(pageIndex) {
        this.dataModel.pageIndex(pageIndex);
        if (this.dataModel.hasPage(pageIndex)) {
            this.dataModel.setCurrentPage(pageIndex)
        } else {}
    },

    defaultSizeChange: function(size, pageIndex) {
        this.dataModel.pageSize(size);
    },

    disableChangeSize: function() {
        this.comp.disableChangeSize();
    },

    enableChangeSize: function() {
        this.comp.enableChangeSize();
    }
});

if (u.compMgr)
    u.compMgr.addDataAdapter({
        adapter: PaginationAdapter,
        name: 'pagination'
    });

export {
    PaginationAdapter
};
