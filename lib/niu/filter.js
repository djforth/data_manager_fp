'use strict';

function filterSearch(search, filters) {
  var _this = this;

  this.cache.filters = filters;

  filters = _.where(filters, { all: false });

  if (filters.length > 0) {
    search = search.filter(function (d) {
      var checked = false;
      _.forEach(filters, function (filter) {
        if (_this.checkFilters(d.get('filters'), filter)) {
          checked = true;
          return false;
        }
      });

      return checked;
    });
  }

  this.cache.filterSearch = search;
  return search;
}

function filterByIds(ids) {
  if (this.data) {
    return this.data.filter(function (d) {
      // console.log(ids, d.get('id'));
      return _.contains(ids, Number(d.get('id')));
    });
  }
  return null;
}

function getFilterByKey(key, keyComp) {
  return _.find(this.cache.filters, function (c) {
    return c[key] === keyComp;
  });
}