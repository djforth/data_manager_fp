'use strict';

function update(id, updates) {
  var _this = this;

  var sync = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  if (this.dataCheck(updates)) {
    this.addToHistory();
    this.data = this.data.map(function (d) {
      // console.log(d)
      if (String(d.get('id')) === String(id)) {
        return _this.updateItem(d, updates);
      }

      return d;
    });

    if (sync) {
      this.sync(id);
    }
  }

  return null;
}

function updateItem(item, data) {
  forIn(data, function (v, k) {
    return item = item.set(k, v);
  });
  return item;
}

function updateAll(updates) {
  var _this2 = this;

  if (this.dataCheck(updates)) {
    this.addToHistory();

    this.data = this.data.map(function (d) {
      return _this2.updateItem(d, updates);
    });
  }
  return null;
}