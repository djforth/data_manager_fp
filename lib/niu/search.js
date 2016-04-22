'use strict';

function getSearch(data, val, keys) {
  var _this = this;

  //Do search
  var regex = new RegExp(val, 'i');
  var search = data.filter(function (d) {
    return _this.searchTxt(regex, d, keys);
  });

  this.cache.text = val;
  this.cache.keys = keys;
  this.cache.search = search;

  return search;
}

function searchTxt(regex, data, keys) {
  var values = this.getValues(data, keys);

  if (values) {
    return String(values).search(regex) > -1;
  }

  return false;
}