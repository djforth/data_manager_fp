'use strict';

function checkTab(key) {
  return function (data, value) {
    if (!data.get('filters').has(key)) return false;
    var v = data.get('filters').get(key);
    return v === value;
  };
}

function checkValue() {
  var current = 'all';
  return function (v) {
    var check = 0;
    switch (v) {
      case 'all':
        check = 2;
        break;
      case current:
        check = 1;
        break;
      default:
        check = 0;
    }
    current = v;
    return check;
  };
}

function search(checker) {
  return function (data, value) {
    if (value === 'all') return data;
    return data.filter(function (d) {
      return checker(d, value);
    });
  };
}

module.exports = function (key) {
  var data = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  var cache = void 0,
      checker = void 0,
      tabSearch = void 0,
      valueCheck = void 0;
  checker = checkTab(key);
  valueCheck = checkValue();
  tabSearch = search(checker);
  cache = {
    filtered: data,
    unfiltered: data
  };

  return function (data, value) {
    if (data.equals(cache.unfiltered)) {
      var check = valueCheck(value);
      if (check === 2) return cache.unfiltered;
      if (check === 1) return cache.filtered;
    }

    cache.unfiltered = data;
    var filtered = cache.filtered = tabSearch(data, value);

    return filtered;
  };
};