const Immutable = require('immutable'),
      _ = require('lodash/core');

const manage_dates = require('./manage_dates');

function addDefaults(defaults) {
  return function (data) {
    return _.defaults(data, defaults);
  };
}

module.exports = function (defs) {
  let defaults = addDefaults(defs);
  return function (data, current) {
    data = _.isArray(data) ? data : [data];
    data = Immutable.fromJS(defaults(manage_dates(data)));
    return current.concat(data);
  };
};