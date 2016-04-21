var _ = require("lodash");

var manage_history = require('../src/manage_history')

const checkCalls = require("@djforth/morse-jasmine/check_calls")


describe('manage history', function() {
  let history;
  beforeEach(function() {
    history = manage_history();
  });

  it('should add to history', function() {
    history.add("data");
    expect(history.getAll()).toContain("data");
  });

  it('should add to history', function() {
    history.add("data").add("data1").add("data2");
    expect(history.get(1)).toContain("data1");
  });

  it('should remove to history', function() {
    history.add("data").add("data1").add("data2");
    history.remove(1)
    expect(history.getAll()).not.toContain("data1");
  });

  it('should reset history', function() {
    history.add("data").add("data1").add("data2");
    expect(history.reset()).toEqual("data1");
    expect(history.getAll()).not.toContain("data2");
  });
});