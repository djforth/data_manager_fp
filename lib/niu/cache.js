'use strict';

var _ = require('lodash/core');
function cachedChecker(values) {
  var checker = {
    text: this.checkCacheText(values('text'), values('keys')),
    filters: this.checkCacheFilters(values('filters')),
    daterange: this.checkCachedDateRanges(values('dateRanges')),
    tab: this.checkTabsCache(values('tab'))
  };

  var checkAll = function checkAll() {
    return _.reduce(_.values(checker), function (t, n) {
      return n && t;
    });
  };

  return function (key) {
    return key === 'all' ? checkAll() : checker[key];
  };
}

function checkCachedDateRanges(dateRanges) {

  var check = this.checkEmptyOrCached(dateRanges, this.cache.dateRanges);

  if (_.isBoolean(check)) {
    return check;
  }

  check = true;
  var cacheDR = this.cache.dateRanges;

  _.forIn(dateRanges, function (v, k) {
    var dr = cacheDR[k];

    if (v.st !== dr.st || v.fn !== dr.fn) {
      check = false;
      return false;
    }
  });

  return check;
}

function checkCacheFilters(filters) {
  var _this = this;

  var check = this.checkEmptyOrCached(filters, this.cache.filters);

  if (_.isBoolean(check)) {
    return check;
  }

  check = true;
  _.forEach(filters, function (f) {
    var cached = _this.getFilterByKey('filter_by', f.filter_by);

    if (!f.selected.equals(cached.selected)) {
      check = false;
      return false;
    }
  });

  return check;
}

function checkTabsCache(tab) {
  var checkTabs = this.checkEmptyOrCached(tab, this.cache.tab);
  if (_.isBoolean(checkTabs)) {
    return checkTabs;
  }

  return this.cache.tabs === tab;
}

function checkCacheText(val, keys) {
  var checkKeys = this.checkEmptyOrCached(keys, this.cache.keys);
  if (_.isBoolean(checkKeys)) {
    return checkKeys;
  }

  if (!this.cache.text) {
    return false;
  }

  return this.cache.text === val && _.difference(keys, this.cache.keys).length === 0;
}

function checkCache(items, key) {
  var check = this.checkEmptyOrCached(items, key);
  if (_.isBoolean(check)) {
    return check;
  }

  return function (tester) {
    return tester(items);
  };
}

function cacher(presets) {
  var cache = presets || {};
  return {
    isEmpty: function isEmpty(items, key) {
      return cache[key] ? true : false;
    },
    get: function get(key) {
      return _.get(cache, key);
    },
    set: function set(key, value) {
      cache[key] = value;
    }
  };
}

function checkEmptyOrCached(items, cache) {
  if (_.isEmpty(items) || !items) {
    return true;
  }

  return !cache ? false : null;
}