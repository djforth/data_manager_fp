'use strict';

var Immutable = require('immutable'),
    _ = require('lodash/core');

var History = require('./manage_history'),
    Add = require('./add_data'),
    Tabs = require('./tabs');

module.exports = function (defs) {
  var _add = void 0,
      data = void 0,
      history = void 0,
      tab = void 0;
  _add = Add(defs);
  history = History();
  data = Immutable.fromJS([]);

  var obj = {
    add: function add(items) {
      history.add(data);
      data = _add(items, data);
      return obj;
    },
    get: function get() {
      return data;
    },
    getTabData: function getTabData(t) {
      if (_.isUndefined(tab)) return data;
      return tab(data, t);
    },
    tabKey: function tabKey(key) {
      tab = Tabs(key, data);
      return obj;
    }
  };

  return obj;
};