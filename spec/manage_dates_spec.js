var _ = require("lodash")
  , Moment    = require('moment-strftime');

var manage_dates = require('../src/manage_dates')

const checkCalls = require("@djforth/morse-jasmine/check_calls")
  , checkMulti = require("@djforth/morse-jasmine/check_multiple_calls")
  , getMod     = require("@djforth/morse-jasmine/get_module")(manage_dates)
  , mockClass = require("@djforth/morse-jasmine/mock_class")
  , spyManager = require("@djforth/morse-jasmine/spy_manager")()
  , stubs      = require("@djforth/morse-jasmine/stub_inner")(manage_dates);

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

describe('manage_dates', function() {
  afterEach(function () {
    stubs.revertAll();
    spyManager.removeAll();
  });

  describe('getDateKeys', function() {
    let getDateKeys;

    beforeEach(function() {
      getDateKeys = getMod("getDateKeys");
    });

    it('should return keys that contain date or dateTime', function() {
      let keys = getDateKeys(item);
      expect(keys.length).toEqual(2);
      expect(keys).toContain("date");
      expect(keys).toContain("dateTime");
    });

  });

  describe('checkKeys', function() {
    let checkKeys, count, items;

    beforeEach(function() {

      count = 0;
      stubs.addSpy("getDateKeys");
      stubs.getSpy("getDateKeys").and.callFake(()=>{
        count ++;
        return (count > 4) ? ["date", "dateTime"] : []
      })
      checkKeys = getMod("checkKeys");
    });

    it('should create date objects from less than 20', function() {
      let keys = checkKeys(createItems(20));
      expect(keys).toEqual(["date", "dateTime"]);
      let stub = stubs.getSpy("getDateKeys");
      expect(stub).toHaveBeenCalled()
      expect(stub.calls.count()).toEqual(5)
    });

  });

  describe('addDates', function() {
    let addDates;

    beforeEach(function() {
      addDates = getMod("addDates");
    });

    it('should create date objects', function() {
      let data = addDates(_.clone(item), ["date", "dateTime"]);
      let date = data.date;

      expect(_.keys(date)).toEqual(["date", "fmt"]);

      expect(_.isDate(date.date)).toBeTruthy();
      expect(_.isObject(date.fmt)).toBeTruthy();
    });

  });

  describe('process data', function() {
    let checkKeys, count, items, processed;

    beforeEach(function() {
      count = 0;
      stubs.addSpy(["addDates", "checkKeys"]);
      stubs.getSpy("checkKeys").and.returnValue(["date", "dateTime"])
      stubs.getSpy("addDates").and.callFake((d)=>{
        _.forEach(["date", "dateTime"], (k)=>{
          // console.log(d)
          d = _.clone(d)
          let fmt = Moment(d[k]);
          d[k] = {
            date  : fmt.toDate()
            , fmt : fmt
          }
        });

        return d
      });
      items = createItems(20);
      manage_dates(items);
    });

    checkCalls(()=>{
        return stubs.getSpy("checkKeys")
      }, "checkKeys", ()=>[items]);

    it('should call addDates', function() {
      let spy = stubs.getSpy("addDates")
      expect(spy).toHaveBeenCalled();
      expect(spy.calls.count()).toEqual(20)
      let calls = spy.calls.argsFor(0);
      expect(calls).toContain(items[0]);
      expect(calls).toContain(["date", "dateTime"]);
    });
  });


});



