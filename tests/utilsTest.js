var assert = require ("assert");
var Trendyways = require ("../trendyways.js");

describe ("Utils test", function () {

  it ("throws an exception when it cannot retrieve the attr from an object", function () {
    var obj = {v1:1,v2:2,v3:3,v4:4}
    try {
      var value = resolveParam (obj, ["o"]);
    }
    catch (ex) {
      // fine
    }
  });

  it ("retrieves the attr", function () {
    var obj = {o:45, c:46, h:40, l:39};
    var value = resolveParam (obj, ["o"])
    assert.equal(value, 45)
  });

  it ("retrieves the attrs in order", function () {
    var obj = {o:45, open:46};
    var value = resolveParam (obj, ["open", "o"])
    assert.equal(value, 46)
  });
  
  it ("ignore missing attrs", function () {
    var obj = {o1:45, c1:46, h:40, open:39};
    var value = resolveParam (obj, ["a", "c", "open"])
    assert.equal(value, 39)
  });

  it ("reverseAppend append values", function () {
    var refList = [{val:5}, {val:6}, {val:7}, {val:8}];
    var addList = [{id:1}, {id:2}];
    refList = reverseAppend (refList, addList, "id");
    assert.equal(refList[3].id, 2);
    assert.equal(refList[2].id, 1);
  });
});
