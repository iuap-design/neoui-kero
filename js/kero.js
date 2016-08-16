/**
 * Module : Kero webpack entry index
 * Author : liuyk(liuyuekai@yonyou.com)
 * Date	  : 2016-08-08 15:24:46
 */

import {
    App,
    processXHRError,
    createApp
} from 'kero/js/app/indexApp';

window.App = App;
window.processXHRError = processXHRError;


import {
    ServerEvent
} from 'kero/js/app/indexServerEvent';
window.ServerEvent = ServerEvent;


import {
    DataTable
} from 'kero/js/dataTable/indexDataTable';
window.DataTable = DataTable;


import {
    Page
} from 'kero/js/dataTable/indexPage';
window.Page = Page;

import {
    Row
} from 'kero/js/dataTable/indexRow';
window.Row = Row;

window.u = window.u || {};
u = window.u;
u.createApp = createApp;
u.DataTable = DataTable;
u.Row = Row;

export {
    u,
    DataTable
}