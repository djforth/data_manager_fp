function dateRangeSearch(search, dateRanges){
    this.cache.dateRanges       = _.cloneDeep(dateRanges);
    if(!_.isEmpty(dateRanges)){
      search = search.filter((d)=>{
        let checked = false;
        _.forIn(dateRanges, (dr, key)=>{
          if(this.checkDates(d.get(key), dr)){
            checked = true;
            return false;
          }
        });

        return checked;
      });
    }

    this.cache.dateRangesSearch = search;
    return search;
  }
