'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PercentAdapter = undefined;

var _float = require('./float');

var _formater = require('neoui-sparrow/lib/util/formater');

var _masker = require('neoui-sparrow/lib/util/masker');

var _core = require('neoui-sparrow/lib/core');

var _compMgr = require('neoui-sparrow/lib/compMgr');

/**
 * 百分比控件
 */
var PercentAdapter = _float.FloatAdapter.extend({
  init: function init() {
    PercentAdapter.superclass.init.apply(this);
    this.validType = 'float';
    this.maskerMeta = _core.core.getMaskerMeta('percent') || {};
    this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
    if (this.maskerMeta.precision) {
      this.maskerMeta.precision = parseInt(this.maskerMeta.precision) + 2;
    }
    this.formater = new _formater.NumberFormater(this.maskerMeta.precision);
    this.masker = new _masker.PercentMasker(this.maskerMeta);
  }
}); /**
     * Module : Kero percent
     * Author : Kvkens(yueming@yonyou.com)
     * Date	  : 2016-08-09 20:02:50
     */

_compMgr.compMgr.addDataAdapter({
  adapter: PercentAdapter,
  name: 'percent'
});
exports.PercentAdapter = PercentAdapter;