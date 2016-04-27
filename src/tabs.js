
function checkTab(key){
  return function(data, value){
    if (!data.get('filters').has(key)) return false;
    let v = data.get('filters').get(key);
    return v === value;
  };
}

function checkValue(){
  let current = 'all';
  return function(v){
    let check = 0;
    switch (v){
      case 'all':
        check = 2;
        break;
      case current:
        check = 1;
        break;
      default:
        check = 0;
    }
    current = v;
    return check;
  };
}

function search(checker){
  return function(data, value){
    if (value === 'all') return data;
    return data.filter((d)=>{
      return checker(d, value);
    });
  };
}

module.exports = function(key, data = []){
  let cache, checker, tabSearch, valueCheck;
  checker    = checkTab(key);
  valueCheck = checkValue();
  tabSearch  = search(checker);
  cache = {
    filtered: data
    , unfiltered: data
  };

  return function(data, value){
    if (data.equals(cache.unfiltered)){
      let check = valueCheck(value);
      if (check === 2) return cache.unfiltered;
      if (check === 1) return cache.filtered;
    }

    cache.unfiltered = data;
    let filtered = cache.filtered = tabSearch(data, value);

    return filtered;
  };
};
