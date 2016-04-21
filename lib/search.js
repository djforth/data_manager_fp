

function getSearch(data, val, keys) {
  //Do search
  let regex = new RegExp(val, 'i');
  let search = data.filter(d => {
    return this.searchTxt(regex, d, keys);
  });

  this.cache.text = val;
  this.cache.keys = keys;
  this.cache.search = search;

  return search;
}

function searchTxt(regex, data, keys) {
  let values = this.getValues(data, keys);

  if (values) {
    return String(values).search(regex) > -1;
  }

  return false;
}