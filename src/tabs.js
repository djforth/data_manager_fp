
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
    if (v === current || v === 'all'){
      current = v;
      return true;
    }
    current = v;
    return false;
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
    if (valueCheck(value) && data.equals(cache.unfiltered)){
      return cache.filtered;
    }

    cache.unfiltered = data;
    let filtered = cache.filtered = tabSearch(data, value);

    return filtered;
  };
};
