'use strict';

var _ = require('lodash/core');

module.exports = function () {
  var history = [];
  var obj = {
    add: function add(data) {
      history.push(data);
      return obj;
    },
    get: function get(i) {
      return history[i];
    },
    getAll: function getAll() {
      return history;
    },
    remove: function remove(i) {
      history.splice(i, 1);
      return obj;
    },
    reset: function reset() {
      history.pop();
      return _.last(history);
    }
  };

  return obj;
};