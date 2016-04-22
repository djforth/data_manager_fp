"use strict";

function checkFilters(opts, filter) {
  var selected = this.getIds(filter.selected);
  var ids = opts.get(filter.filter_by);

  return this.checkIds(selected, ids);
}

function checkIds(selected, ids) {
  if (_.isArray(ids)) {
    if (_.intersection(selected, ids).length > 0) {
      return true;
    }
  } else if (_.include(selected, ids)) {
    return true;
  }

  return false;
}