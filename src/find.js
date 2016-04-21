module.exports = {
  findById: function(data, id){
    return this.data.find((d)=>d.get('id') === id);
  }

  , findByIndex: function(i){
    return this.data.get(i);
  }
};
