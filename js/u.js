// import * as u from 'neoui-sparrow/js/index';
// import * as neoui from 'neoui/js/index';
// import {DataTable, u as kero} from 'kero/js/index';
// import * as adapter from 'kero-adapter/js/index';

import {u} from 'neoui-sparrow/js/index';
import * as neoui from 'neoui/js/index';
import {DataTable, u as kero} from 'kero/js/index';
import * as adapter from './index';


u.extend(u, neoui.u);
u.extend(u, kero.u);
u.extend(u, adapter.u);

export {
	u,
	DataTable
};
