

function sort(key, asc = true) {
  // this.addToHistory();
  return this.data.sort((a, b) => {
    let itemA = asc ? a.get(key) : b.get(key);
    let itemB = asc ? b.get(key) : a.get(key);
    if (_.isString(itemA) && _.isString(itemB)) {
      itemA = itemA.toLowerCase();
      itemB = itemB.toLowerCase();
    }
    return this.sortAlgorithm(itemA, itemB);
  });
}

function sortAlgorithm(itemA, itemB) {
  if (itemA < itemB) {
    return -1;
  }

  if (itemA > itemB) {
    return 1;
  }

  return 0;
}