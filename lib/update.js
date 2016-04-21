function update(id, updates, sync = false) {
  if (this.dataCheck(updates)) {
    this.addToHistory();
    this.data = this.data.map(d => {
      // console.log(d)
      if (String(d.get('id')) === String(id)) {
        return this.updateItem(d, updates);
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
  forIn(data, (v, k) => item = item.set(k, v));
  return item;
}

function updateAll(updates) {
  if (this.dataCheck(updates)) {
    this.addToHistory();

    this.data = this.data.map(d => {
      return this.updateItem(d, updates);
    });
  }
  return null;
}