(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './keroa-float', 'tinper-sparrow/src/util/formater', 'tinper-sparrow/src/util/masker', 'tinper-sparrow/src/core', 'compox/src/compMgr'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./keroa-float'), require('tinper-sparrow/src/util/formater'), require('tinper-sparrow/src/util/masker'), require('tinper-sparrow/src/core'), require('compox/src/compMgr'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.keroaFloat, global.formater, global.masker, global.core, global.compMgr);
    global.keroaPercent = mod.exports;
  }
})(this, function (exports, _keroaFloat, _formater, _masker, _core, _compMgr) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.PercentAdapter = undefined;

  /**
   * 百分比控件
   */
  var PercentAdapter = _keroaFloat.FloatAdapter.extend({
    init: function init() {
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
});