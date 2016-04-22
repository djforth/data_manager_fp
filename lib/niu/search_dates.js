"use strict";

function dateRangeSearch(search, dateRanges) {
  var _this = this;

  this.cache.dateRanges = _.cloneDeep(dateRanges);
  if (!_.isEmpty(dateRanges)) {
    search = search.filter(function (d) {
      var checked = false;
      _.forIn(dateRanges, function (dr, key) {
        if (_this.checkDates(d.get(key), dr)) {
          checked = true;
          return false;
        }
      });

      return checked;
    });
  }

  this.cache.dateRangesSearch = search;
  return search;
}