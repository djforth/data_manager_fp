"use strict";

function sort(key) {
  var _this = this;

  var asc = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  // this.addToHistory();
  return this.data.sort(function (a, b) {
    var itemA = asc ? a.get(key) : b.get(key);
    var itemB = asc ? b.get(key) : a.get(key);
    if (_.isString(itemA) && _.isString(itemB)) {
      itemA = itemA.toLowerCase();
      itemB = itemB.toLowerCase();
    }
    return _this.sortAlgorithm(itemA, itemB);
  });
}

function sortAlgorithm(itemA, itemB) {
  if (itemA < itemB) {
    return -1;
  }

  if (itemA > itemB) {
    return 1;
  }

  return 0;
}