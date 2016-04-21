var _ = require("lodash")
  , Immutable = require('immutable')
  , Moment    = require('moment-strftime');

var tabs = require('../src/tabs');

const checkCalls = require("@djforth/morse-jasmine/check_calls")
  , checkMulti = require("@djforth/morse-jasmine/check_multiple_calls")
  , getMod     = require("@djforth/morse-jasmine/get_module")(tabs)
  , mockClass = require("@djforth/morse-jasmine/mock_class")
  , spyManager = require("@djforth/morse-jasmine/spy_manager")()
  , stubs      = require("@djforth/morse-jasmine/stub_inner")(tabs);

let Data = require('./data/test_data');
let MockData = Immutable.fromJS(Data.getJSON(5));
let filtered = MockData.filter((d)=>{
  return d.get("filters").get("type") === "event"
})

describe('tabs', function() {
  afterEach(function () {
    stubs.revertAll();
    spyManager.removeAll();
  });

  describe('inner functions', function() {
    describe('checkTab', function() {
      let checker,checkTab;
      beforeEach(function() {
        checkTab = getMod('checkTab');
        checker  = checkTab("type");
      });

      it('should return a function', function() {
        expect(_.isFunction(checker)).toBeTruthy();
      });

      it('should return true if key matches', function() {
        expect(checker(MockData.get(0), "event")).toBeTruthy()
      });

      it('should return false if it doesn\'t', function() {
        expect(checker(MockData.get(1), "event")).toBeFalsy()
      });
    });

    describe('checkValue', function() {
      let checker,checkValue;
      beforeEach(function() {
        checkValue = getMod('checkValue');
        checker    = checkValue();
      });

      it('should return a function', function() {
        expect(_.isFunction(checker)).toBeTruthy();
      });

      it('should return true if all', function() {
        expect(checker("all")).toBeTruthy();
      });

      it('should return true if matches', function() {
        expect(checker("event")).toBeFalsy()
        expect(checker("event")).toBeTruthy();
      });

      it('should return false if doesn\'t matches', function() {
        expect(checker("event")).toBeFalsy()
        expect(checker("sport")).toBeFalsy();
      });


    });

    describe('search', function() {
      let searchTab, search;
      beforeEach(function() {
        spyManager.addSpy("checker");
        spyManager.addReturn("checker")("callFake", (d)=>{
          return d.get('filters').get('type') === "event"
        });
        search = getMod('search');
        searchTab  = search(spyManager.getSpy("checker"));
      });

      it('should return a function', function() {
        expect(_.isFunction(searchTab)).toBeTruthy();
      });

      it('should return all data if value is "all"', function() {
        let data = searchTab(MockData, "all");
        expect(data.equals(MockData)).toBeTruthy();
      });

      it('should return filtered data', function() {
        let data = searchTab(MockData, "event");
        expect(data.size).toEqual(3);
        expect(data.equals(MockData)).toBeFalsy();
        let spy = spyManager.getSpy("checker")
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.count()).toEqual(5);
      });
    });

  });

  describe('main method', function() {
    let data, tab;
    beforeEach(function() {
      stubs.addSpy(['checkTab', 'checkValue', 'search']);
      spyManager.addSpy(['checker', "valueCheck", "tabSearch"]);

      spyManager.addReturn("valueCheck")("callFake", (d)=>{
          return d === "sport"
        });
      spyManager.addReturn("tabSearch")("returnValue", filtered);

      stubs.setSpies([
        {title:'checkTab', func:"returnValue", value:spyManager.getSpy('checker')}
        , {title:'checkValue', func:"returnValue", value:spyManager.getSpy('valueCheck')}
        , {title:'search', func:"returnValue", value:spyManager.getSpy('tabSearch')}
        ]);
        tab = tabs("type", MockData);
      });

      let calls = {
        "checkTab":[()=>stubs.getSpy("checkTab")
        , ()=>['type'] ]
        , "checkValue":()=>stubs.getSpy("checkValue")
        , "search":[()=>stubs.getSpy("search")
         , ()=>[spyManager.getSpy('checker')]]
      }
      checkMulti(calls);

      it('should return a function', function() {
        expect(_.isFunction(tab)).toBeTruthy();
      });

      describe('when filtering', function() {
        describe('should call search when data & value don\'t match cache', function() {
          beforeEach(function() {
            data = tab(MockData, "event");
          });

          it('should return filtered data', function() {
            expect(data.equals(filtered)).toBeTruthy()
          });

          let calls = {
            "valueCheck":[()=>spyManager.getSpy("valueCheck")
            , ()=>['event'] ]
            , "tabSearch":[()=>spyManager.getSpy("tabSearch")
             , ()=>[MockData, 'event']]
          }
          checkMulti(calls);

        });

        describe('should return cache when data & value match cache', function() {
          beforeEach(function() {
            data = tab(MockData, "sport");
          });

          it('should return cached data', function() {
            expect(data.equals(MockData)).toBeTruthy()
          });

          checkCalls(()=>{
            return spyManager.getSpy("valueCheck")
          }, "valueCheck", ()=>["sport"]);


          it('should not call search', function() {
            expect(spyManager.getSpy("tabSearch")).not.toHaveBeenCalled();
          });



        });
      });
  });
});