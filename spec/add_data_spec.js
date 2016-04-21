var _ = require("lodash")
  , Immutable    = require('immutable');

var add_data = require('../src/add_data')

const checkCalls = require("@djforth/morse-jasmine/check_calls")
  , getMod     = require("@djforth/morse-jasmine/get_module")(add_data)
  , mockClass = require("@djforth/morse-jasmine/mock_class")
  , spyManager = require("@djforth/morse-jasmine/spy_manager")()
  , stubs      = require("@djforth/morse-jasmine/stub_inner")(add_data);



let item = {
  date       : "2015-01-18"
  , dateTime : "2015-01-18 16:44"
  , string   : "foo"
  , array    : ["foo"]
  , boolean  : false
  , integer  : 1
}

function fillArray(n) {
  var arr = Array.apply(null, Array(n));
  return arr.map(function (x, i) {
    return i
  });
}

function createItems(n){
  return _.map(fillArray(n), (i)=>{
    let d = _.clone(item);
    d.id = i;
    return d;
  });
}

describe('add_data', function() {
  afterEach(function () {
    stubs.revertAll();
    spyManager.removeAll();
  });

  describe('defaults', function() {
    let def, defaults, addDefaults
    beforeEach(function () {
      def = {
        test:"foo"
      };

      addDefaults = getMod("addDefaults");
      defaults = addDefaults(def)
    });

    it('should retrun a function', function() {
      expect(_.isFunction(defaults)).toBeTruthy()
    });

    it('should add default value', function() {
      let obj = defaults(item)
      expect(_.has(obj, "test")).toBeTruthy();
    });

    it('should not value if present', function() {
      let d = _.clone(item)
      d.test = "bar";
      let obj = defaults(d)
      expect(obj.test).toEqual("bar");
    });
  });

  describe('manage_default', function() {
    let items, current, add, data, all;
    beforeEach(function() {
      stubs.addSpy(["addDefaults", "manage_dates"]);
      spyManager.addSpy("defaults");
      stubs.getSpy("addDefaults").and.returnValue(spyManager.getSpy("defaults"));
      stubs.getSpy("manage_dates").and.callFake((d)=>d);
      spyManager.addReturn("defaults")("callFake", (d)=>d);

      all     = createItems(10);
      items   = _.cloneDeep(all);
      current = Immutable.fromJS(items.splice(0, 5));
      add = add_data({test:"foo"})
      data = add(items, current)
    });

    it('should return a function', function() {
      expect(_.isFunction(add)).toBeTruthy();
    });

    it('should combine data and return immutable list', function() {
      expect(data.size).toEqual(10);
    });

    checkCalls(()=>{
        return stubs.getSpy("addDefaults")
      }, "addDefaults", ()=>[{test:"foo"}]);

    checkCalls(()=>{
        return stubs.getSpy("manage_dates")
      }, "addDefaults", ()=>[items]);

    checkCalls(()=>{
        return spyManager.getSpy("defaults");
      }, "addDefaults", ()=>[items]);
  });

});