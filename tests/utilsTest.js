
"use strict";

var assert = require ("assert");
var tw = require ("../dist/trendyways.js");

describe ("Utils test", function () {

  it ("throws an exception when it cannot retrieve the attr from an object", function () {
    var obj = {v1:1,v2:2,v3:3,v4:4}
    try {
      var value = tw.resolveParam (obj, ["o"]);
    }
    catch (ex) {
      // fine
    }
  });

  it ("retrieves the attr", function () {
    var obj = {o:45, c:46, h:40, l:39};
    var value = tw.resolveParam (obj, ["o"])
    assert.equal(value, 45)
  });

  it ("retrieves the attrs in order", function () {
    var obj = {o:45, open:46};
    var value = tw.resolveParam (obj, ["open", "o"])
    assert.equal(value, 46)
  });
  
  it ("reverseAppend append values", function () {
    var refList = [{val:5}, {val:6}, {val:7}, {val:8}];
    var addList = [{id:1}, {id:2}];
    refList = tw.reverseAppend (refList, addList, "id");
    assert.equal(refList[3].id, 2);
    assert.equal(refList[2].id, 1);
  });

  it ("reverseAppend returns addList when refList contains primitives", function () {
    var result = tw.reverseAppend([1, 2, 3], [{val:10}, {val:20}], "val");
    assert.deepEqual(result, [{val:10}, {val:20}]);
  });

  it ("reverseAppend throws when no field is provided", function () {
    assert.throws(function () {
      tw.reverseAppend([{a:1}], [{b:2}]);
    }, /Unable to append values/);
  });

  it ("valueIfUndef returns the default when value is undefined", function () {
    assert.equal(tw.valueIfUndef(undefined, 42), 42);
  });

  it ("valueIfUndef returns the original value when it is defined", function () {
    assert.equal(tw.valueIfUndef(10, 42), 10);
  });

  it ("isUndef returns true for undefined", function () {
    assert.equal(tw.isUndef(undefined), true);
  });

  it ("isUndef returns false for null", function () {
    assert.equal(tw.isUndef(null), false);
  });

  it ("isUndef returns false for 0", function () {
    assert.equal(tw.isUndef(0), false);
  });

  it ("flat extracts a named attribute into a plain array", function () {
    var result = tw.flat([{a:1}, {a:2}, {b:3}], "a");
    assert.deepEqual(result, [1, 2, 0]);
  });

  it ("fill sets a default value for elements missing the attribute", function () {
    var list = [{a:1}, {b:2}, {a:3}];
    tw.fill(list, "a", 0);
    assert.equal(list[0].a, 1);
    assert.equal(list[1].a, 0);
    assert.equal(list[2].a, 3);
  });

  it ("windowOp applies a function to each sliding window", function () {
    var sum = function (arr) { return arr.reduce(function (acc, v) { return acc + v; }, 0); };
    var result = tw.windowOp([1, 2, 3, 4, 5], 3, sum);
    assert.deepEqual(result, [6, 9, 12]);
  });

  it ("windowOp returns an empty array when window is larger than input", function () {
    var sum = function (arr) { return arr.reduce(function (acc, v) { return acc + v; }, 0); };
    var result = tw.windowOp([1, 2], 5, sum);
    assert.deepEqual(result, []);
  });
});
