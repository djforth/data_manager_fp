'use strict';

module.exports = {
  findById: function findById(data, id) {
    return this.data.find(function (d) {
      return d.get('id') === id;
    });
  },

  findByIndex: function findByIndex(i) {
    return this.data.get(i);
  }
};