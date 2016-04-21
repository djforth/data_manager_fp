var _ = require("lodash")
  , Immutable = require('immutable')
  , Moment    = require('moment-strftime');

var data_manager = require('../src/data_manager')

const checkCalls = require("@djforth/morse-jasmine/check_calls")
  , checkMulti = require("@djforth/morse-jasmine/check_multiple_calls")
  , getMod     = require("@djforth/morse-jasmine/get_module")(data_manager)
  , mockClass = require("@djforth/morse-jasmine/mock_class")
  , spyManager = require("@djforth/morse-jasmine/spy_manager")()
  , stubs      = require("@djforth/morse-jasmine/stub_inner")(data_manager);

let Data = require('./data/test_data');
let MockData = Immutable.fromJS(Data.getJSON(5));
let filtered = MockData.filter((d)=>{
  return d.get("filters").get("type") === "event"
});

describe('data_manager', function() {
  let dataM, data;
  afterEach(function () {
    stubs.revertAll();
    spyManager.removeAll();
  });

  beforeEach(function() {
    stubs.addSpy(['Add', 'History', 'Tabs']);
    spyManager.addSpy(['add', {title:'history', opts:['add']}, 'tab'])
    spyManager.addReturn("add")("returnValue", MockData);
    spyManager.addReturn("tab")("returnValue", filtered);

    stubs.setSpies([
      {title:'Add', func:"returnValue", value:spyManager.getSpy('add')}
    , {title:'History', func:"returnValue", value:spyManager.getSpy('history')}
    , {title:'Tabs', func:"returnValue", value:spyManager.getSpy('tab')}
    ]);

    dataM = data_manager({foo:"bar"})
  });

  it('should return object ', function() {
    expect(_.isPlainObject(dataM)).toBeTruthy();
  });

  let calls = {
      "Add":[()=>stubs.getSpy("Add")
      , ()=>[{foo:"bar"}] ]
      , "History":()=>stubs.getSpy("History")
    }
    checkMulti(calls);

  describe('add', function() {
    beforeEach(function() {
      dataM.add(MockData)
    });

    checkCalls(()=>{
      return spyManager.getSpy("history").add
    }, "history", ()=>[Immutable.fromJS([])]);

    checkCalls(()=>{
      return spyManager.getSpy("add")
    }, "history", ()=>[MockData, Immutable.fromJS([])]);
  });

  describe('get', function() {
    it('should return data', function() {
      expect(dataM.get()).toEqual(Immutable.fromJS([]))
    });
  });

  describe('getTabData', function() {
    beforeEach(function () {
      //Sets data
      dataM.add(MockData)
    });

    it('should return all data if tab not defined', function() {
      let data = dataM.getTabData("event");
      expect(data.equals(MockData)).toBeTruthy();
    });

    describe('when tab defined', function() {

      beforeEach(function () {
        dataM.tabKey('type');
        data = dataM.getTabData("event");
      });

      it('should return filtered data if tab defined', function() {
        expect(data.equals(filtered)).toBeTruthy();
      });

      checkCalls(()=>{
        return spyManager.getSpy("tab")
      }, "tab", ()=>[MockData, 'event']);
    });

  });

  describe('tabKey', function() {
    beforeEach(function() {
      dataM.tabKey('type');
    });

    checkCalls(()=>{
        return stubs.getSpy("Tabs")
      }, "tab", ()=>['type', Immutable.fromJS([])]);
  });

});