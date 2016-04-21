function filterSearch(search, filters){
    this.cache.filters = filters;

    filters = _.where(filters, {all:false});

    if(filters.length > 0){
      search = search.filter((d)=>{
        let checked = false;
        _.forEach(filters, (filter)=>{
          if(this.checkFilters(d.get('filters'), filter)){
            checked = true;
            return false;
          }
        });

        return checked;
      });
    }

    this.cache.filterSearch = search;
    return search;
  }


function filterByIds(ids){
    if(this.data){
      return this.data.filter((d)=>{
        // console.log(ids, d.get('id'));
        return _.contains(ids, Number(d.get('id')));
      });
    }
    return null;
  }

function getFilterByKey(key, keyComp){
    return _.find(this.cache.filters, (c)=>{
      return c[key] === keyComp;
    });
  }