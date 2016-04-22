'use strict';

var _ = require('lodash/core'),
    Moment = require('moment-strftime');

// Patch as lodash/core missing method
// _.forIn = function(obj, iterator){
//   for (var props in obj){
//     iterator(obj[props], props);
//   }
// };

function getDateKeys(obj) {
  /* eslint-disable */
  var dateRegExp = new RegExp(/^\s*(\d{4})-(\d{2})-(\d{2})+!?(\s(\d{2}):(\d{2})|\s(\d{2}):(\d{2}):(\d+))?$/);
  /* eslint-enable */
  var dateKeys = [];
  _.forIn(obj, function (v, k) {
    if (_.isString(v)) {
      var date_match = v.match(dateRegExp);
      if (!_.isNull(date_match)) {
        dateKeys.push(k);
      }
    }
  });

  return dateKeys;
}

function addDates(item, keys) {
  item = _.clone(item);
  _.forEach(keys, function (k) {
    if (_.has(item, k)) {
      var v = item[k];
      var dateFmt = Moment(v);
      item[k] = {
        date: dateFmt.toDate(),
        fmt: dateFmt
      };
    }
  });

  return item;
}

function checkKeys(data) {
  var date_keys = [];
  var i = 0;

  var length = data.length > 20 ? 20 : data.length;

  do {
    date_keys = getDateKeys(data[i]);
    i++;
  } while (_.isEmpty(date_keys) && i < length);

  return date_keys;
}

module.exports = function (data) {
  var keys = checkKeys(data);
  return _.map(data, function (d) {
    return addDates(d, keys);
  });
};