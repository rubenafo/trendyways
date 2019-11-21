
"use strict";

var assert = require ("assert");
var tw = require ("../dist/trendyways.js");

describe ("Averages", function () {

  it ("Moving Average of a sample serie", function () {
    var serie = [{c:2},{c:6},{c:5},{c:7},{c:10},{c:9},{c:12},{c:5}]
    var correctValues = [5, 7, 7.75, 9.5, 9];
    var movingAvg = tw.ma(serie,4);
    assert.deepEqual (movingAvg.length, serie.length, "Moving Average result's length is correct");
    for (var i = 0; i < 5; i++)
    {
      assert.deepEqual (movingAvg[i+3].ma, correctValues[i], "MA value " + i + " is correct");
    }
  });

  it ("MA accepts list as input", function () {
    var serie = [{c:2},{c:6},{c:5},{c:7},{c:10},{c:9},{c:12},{c:5}]
    var input = [2, 6, 5, 7, 10, 9, 12, 5];
    var result1 = tw.ma(serie, 4);
    var result2 = tw.ma(input, 4);
    assert.deepEqual(result1.map(r => r.ma).slice(3), result2)
  });

  it ("Exponential moving average test", function ()
  {
    var series = [{c:64.75},{c:63.79},{c:63.73},{c:63.73},{c:63.55},
                  {c:63.19},{c:63.91},{c:63.85},{c:62.95},{c:63.37},
                  {c:61.33},{c:61.51},{c:61.87},{c:60.25},{c:59.35},
                  {c:59.95},{c:58.93},{c:57.68},{c:58.82},{c:58.87}];
    var expected = [ 63.682,63.254,62.937,62.743,62.290,
                     61.755,61.427,60.973,60.374,60.092,
                     59.870];
    var result = tw.ema(series, 10, ["c"]);
    assert.equal (result.length, series.length, "EMA length = " + result.length);
    for (var i = 0; i < expected.length; i++)
    {
      assert.equal (result[i+9].ema.toFixed(3), expected[i].toFixed(3), "Checking EMA i = " + i)
    }
    result = tw.ema(series, 1, ["c"]);
    for (var i = 0; i < result.length; i++)
    {
      assert.equal (result[i].ema.toFixed(3), series[i].c, "EMA = 1, value " + i + " unchanged");
    }
  });

  it ("EMA accepts list as input", () => {
    var series = [64.75,63.79,63.73,63.73,63.55,
        63.19,63.91,63.85,62.95,63.37,
        61.33,61.51,61.87,60.25,59.35,
        59.95,58.93,57.68,58.82,58.87];
    var expected = [ 63.682,63.254,62.937,62.743,62.290,
           61.755,61.427,60.973,60.374,60.092,
           59.870];
    assert.deepEqual(tw.ema(series, 10).map(v => v.toFixed(3)), expected);
  });

  it ("Weighted moving average test", function ()
  {
    var series = [{c:1}, {c:2}, {c:3}, {c:4}, {c:5}, {c:6}];
    var expected = [0.5, 0.83333, 1.16667, 1.5]
    var result = tw.wma (series, [0.6, 0.3, 0.1]);
    for (var i = 0; i < expected.length; i++)
    {
      assert.equal (expected[i], result[i+2].wma.toFixed(5), "WMA i = " + i + ", "+ expected[i]);
    }
  });

  it ("WMA takes list as input", () => {
    var series = [1, 2, 3, 4, 5, 6];
    var expected = [0.5, 0.83333, 1.16667, 1.5];
    var result = tw.wma(series, [0.6, 0.3, 0.1]);
    assert.deepEqual(result.map(v => v.toFixed(5)), expected);
  });
});
