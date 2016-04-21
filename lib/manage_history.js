const _ = require('lodash/core');

module.exports = function () {
  let history = [];
  var obj = {
    add: function (data) {
      history.push(data);
      return obj;
    },
    get: function (i) {
      return history[i];
    },
    getAll: () => history,
    remove: function (i) {
      history.splice(i, 1);
      return obj;
    },
    reset: function () {
      history.pop();
      return _.last(history);
    }
  };

  return obj;
};