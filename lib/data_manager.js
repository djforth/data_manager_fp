const Immutable = require('immutable'),
      _ = require('lodash/core');

const History = require('./manage_history'),
      Add = require('./add_data'),
      Tabs = require('./tabs');

module.exports = function (defs) {
  let add, data, history, tab;
  add = Add(defs);
  history = History();
  data = Immutable.fromJS([]);

  var obj = {
    add: function (items) {
      history.add(data);
      data = add(items, data);
      return obj;
    },
    get: () => data,
    getTabData: t => {
      if (_.isUndefined(tab)) return data;
      return tab(data, t);
    },
    tabKey: key => {
      tab = Tabs(key, data);
      return obj;
    }
  };

  return obj;
};