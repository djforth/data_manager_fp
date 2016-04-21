const _ = require('lodash/core');
function cachedChecker(values) {
  let checker = {
    text: this.checkCacheText(values('text'), values('keys')),
    filters: this.checkCacheFilters(values('filters')),
    daterange: this.checkCachedDateRanges(values('dateRanges')),
    tab: this.checkTabsCache(values('tab'))
  };

  let checkAll = function () {
    return _.reduce(_.values(checker), (t, n) => {
      return n && t;
    });
  };

  return function (key) {
    return key === 'all' ? checkAll() : checker[key];
  };
}

function checkCachedDateRanges(dateRanges) {

  let check = this.checkEmptyOrCached(dateRanges, this.cache.dateRanges);

  if (_.isBoolean(check)) {
    return check;
  }

  check = true;
  let cacheDR = this.cache.dateRanges;

  _.forIn(dateRanges, (v, k) => {
    let dr = cacheDR[k];

    if (v.st !== dr.st || v.fn !== dr.fn) {
      check = false;
      return false;
    }
  });

  return check;
}

function checkCacheFilters(filters) {
  let check = this.checkEmptyOrCached(filters, this.cache.filters);

  if (_.isBoolean(check)) {
    return check;
  }

  check = true;
  _.forEach(filters, f => {
    let cached = this.getFilterByKey('filter_by', f.filter_by);

    if (!f.selected.equals(cached.selected)) {
      check = false;
      return false;
    }
  });

  return check;
}

function checkTabsCache(tab) {
  let checkTabs = this.checkEmptyOrCached(tab, this.cache.tab);
  if (_.isBoolean(checkTabs)) {
    return checkTabs;
  }

  return this.cache.tabs === tab;
}

function checkCacheText(val, keys) {
  let checkKeys = this.checkEmptyOrCached(keys, this.cache.keys);
  if (_.isBoolean(checkKeys)) {
    return checkKeys;
  }

  if (!this.cache.text) {
    return false;
  }

  return this.cache.text === val && _.difference(keys, this.cache.keys).length === 0;
}

function checkCache(items, key) {
  let check = this.checkEmptyOrCached(items, key);
  if (_.isBoolean(check)) {
    return check;
  }

  return tester => {
    return tester(items);
  };
}

function cacher(presets) {
  let cache = presets || {};
  return {
    isEmpty: (items, key) => {
      return cache[key] ? true : false;
    },
    get: key => _.get(cache, key),
    set: (key, value) => {
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