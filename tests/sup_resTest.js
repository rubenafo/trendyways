var assert = require ("assert");
var Trendyways = require ("../trendyways.js");

describe ("Supports and resistances", function () {

  it ("Floor pivot level, supports and resistances", function () {
    var lowList = [5];
    var highList = [18];
    var closeList = [15];
    var values = floorPivots (highList, lowList, closeList);
    assert.deepEqual (values[0].r3, 33.33333333333333, "Resistance R3 ok");
    assert.deepEqual (values[0].r2, 25.666666666666664, "Resistance R2 ok");
    assert.deepEqual (values[0].r1, 20.333333333333332, "Resistance R1 ok");
    assert.deepEqual (values[0].pl, 12.666666666666666, "Pivot level ok");
    assert.deepEqual (values[0].s1, 7.333333333333332, "Support R1 ok");
    assert.deepEqual (values[0].s2, -0.3333333333333339, "Support R2 ok");
    assert.deepEqual (values[0].s3, -5.666666666666668, "Support R3 ok");
  });

  it ("Tom Demarks's predicted low and high value (support and resistance)", function () {
    var highList = [10, 15, 25];
    var lowList = [5, 8, 10];
    var openList = [6, 10, 17];
    var closeList = [7, 11, 12];
    var values = tomDemarksPoints (highList, lowList, openList, closeList);
    assert.deepEqual (values.length, 3, "Returned values ok");
    // first predicted values
    assert.deepEqual (values[0].low, 6 , "Support for first value ok");
    assert.deepEqual (values[0].high, 11, "Resistance for first value ok");
    // second predicted values
    assert.deepEqual (values[1].low, 9.5, "Support for second value  ok");
    assert.deepEqual (values[1].high, 16.5, "Resistance for second value ok");
    // third predicted values
    assert.deepEqual (values[2].low, 3.5, "Support for third value ok");
    assert.deepEqual (values[2].high, 18.5, "Resistance for third value ok");
  });

  it ("Woodies predicted points (support and resistance)", function () {
    var highList = [10, 15, 25, 10];
    var lowList = [5, 8, 10, 8];
    var closeList = [7, 11, 12, 9];
    var values = woodiesPoints (highList, lowList, closeList);
    assert.deepEqual (values.length, 4, "Returned values ok");
    // first predicted values
    assert.deepEqual (values[0].pivot, 7.25, "Pivot for first value ok");
    assert.deepEqual (values[0].r1, 9.5, "Resistance for first value ok");
    assert.deepEqual (values[0].r2, 12.25, "Resistance for first value ok");
    assert.deepEqual (values[0].s1, 4.5, "Resistance for first value ok");
    assert.deepEqual (values[0].s2, 2.25, "Resistance for first value ok");
    // second predicted values
    assert.deepEqual (values[1].pivot, 11.25, "Pivot for second value ok");
    assert.deepEqual (values[1].r1, 14.5, "Resistance for second value ok");
    assert.deepEqual (values[1].r2, 18.25, "Resistance for second value ok");
    assert.deepEqual (values[1].s1, 7.5, "Resistance for second value ok");
    assert.deepEqual (values[1].s2, 4.25, "Resistance for second value ok");
    // third predicted values
    assert.deepEqual (values[2].pivot, 14.75, "Pivot for third value ok");
    assert.deepEqual (values[2].r1, 19.5, "Resistance for third value ok");
    assert.deepEqual (values[2].r2, 29.75, "Resistance for third value ok");
    assert.deepEqual (values[2].s1, 4.5, "Resistance for third value ok");
    assert.deepEqual (values[2].s2, -0.25, "Resistance for third value ok");
    // fourth predicted values
    assert.deepEqual (values[3].pivot, 9, "Pivot for fourth value ok");
    assert.deepEqual (values[3].r1, 10, "Resistance for fourth value ok");
    assert.deepEqual (values[3].r2, 11, "Resistance for fourth value ok");
    assert.deepEqual (values[3].s1, 8, "Resistance for fourth value ok");
    assert.deepEqual (values[3].s2, 7, "Resistance for fourth value ok");
  });

  it ("Camarilla predicted points (supports and resistances)", function () {
    var highList = [10, 15, 25, 10];
    var lowList = [5, 8, 10, 8];
    var closeList = [7, 11, 12, 9];
    var values = camarillaPoints (highList, lowList, closeList);
    assert.deepEqual (values.length, 4, "Returned values ok");
    // first predicted values
    assert.deepEqual (values[0].r1, 7.458333333333333, "Resistance r1 for first value ok");
    assert.deepEqual (values[0].r2, 7.916666666666667, "Resistance r2 for first value ok");
    assert.deepEqual (values[0].r3, 8.375, "Resistance r3 for first value ok");
    assert.deepEqual (values[0].r4, 9.75, "Resistance r4 for first value ok");
    assert.deepEqual (values[0].s1, 6.541666666666667, "Support s1 for first value ok");
    assert.deepEqual (values[0].s2, 6.083333333333333, "Support s2 for first value ok");
    assert.deepEqual (values[0].s3, 5.625, "Support s3 for first value ok");
    assert.deepEqual (values[0].s4, 4.25, "Support s4 for first value ok");
    // second predicted values
    assert.deepEqual (values[1].r1, 11.641666666666667, "Resistance r1 for second value ok");
    assert.deepEqual (values[1].r2, 12.283333333333333, "Resistance r2 for second value ok");
    assert.deepEqual (values[1].r3, 12.925, "Resistance r3 for second value ok");
    assert.deepEqual (values[1].r4, 14.850000000000001, "Resistance r4 for second value ok");
    assert.deepEqual (values[1].s1, 10.358333333333333, "Support s1 for second value ok");
    assert.deepEqual (values[1].s2, 9.716666666666667, "Support s2 for second value ok");
    assert.deepEqual (values[1].s3, 9.075, "Support s3 for second value ok");
    assert.deepEqual (values[1].s4, 7.1499999999999995, "Support s4 for second value ok");
    // third predicted values
    assert.deepEqual (values[2].r1, 13.375, "Resistance r1 for third value ok");
    assert.deepEqual (values[2].r2, 14.75, "Resistance r2 for third value ok");
    assert.deepEqual (values[2].r3, 16.125, "Resistance r3 for third value ok");
    assert.deepEqual (values[2].r4, 20.25, "Resistance r4 for third value ok");
    assert.deepEqual (values[2].s1, 10.625, "Support s1 for third value ok");
    assert.deepEqual (values[2].s2, 9.25, "Support s2 for third value ok");
    assert.deepEqual (values[2].s3, 7.875, "Support s3 for third value ok");
    assert.deepEqual (values[2].s4, 3.75, "Support s4 for third value ok");
    // fourth predicted values
    assert.deepEqual (values[3].r1, 9.183333333333334, "Resistance r1 for fourth value ok");
    assert.deepEqual (values[3].r2, 9.366666666666667, "Resistance r2 for fourth value ok");
    assert.deepEqual (values[3].r3, 9.55, "Resistance r3 for fourth value ok");
    assert.deepEqual (values[3].r4, 10.1, "Resistance r4 for fourth value ok");
    assert.deepEqual (values[3].s1, 8.816666666666666, "Support s1 for fourth value ok");
    assert.deepEqual (values[3].s2, 8.633333333333333, "Support s2 for fourth value ok");
    assert.deepEqual (values[3].s3, 8.45, "Support s3 for fourth value ok");
    assert.deepEqual (values[3].s4, 7.9, "Support s4 for fourth value ok");
  });

  it ("Fibonacci retracement uptrend ([5,8,7,6,9], [10,12,9,15,16], 'UPTREND')", function ()
  {
    var highList = [10, 12, 9, 15, 16];
    var lowList = [5, 8, 7, 6, 9];
    var values = fibonacciRetrs (lowList, highList, 'UPTREND');
    assert.deepEqual (values.length, 5, "Returned values ok");
    for (var i = 0; i < values.length; i++)
    {
      assert.deepEqual (values[i].length, 6, "Values in pos " + i + " ok");
    }
    var solsUptrend = [[10, 8.09, 7.5, 6.91, 6.18, 5],
             [12, 10.47, 10, 9.53, 8.94, 8],
             [9, 8.24, 8, 7.76, 7.47, 7],
             [15, 11.56, 10.50, 9.44, 8.12, 6],
             [16, 13.33, 12.50, 11.67, 10.65, 9]];
    var retracement = [100, 61.8, 50, 38.2, 23.6, 0]; // only for the text output
    for (var i = 0; i < 5; i++)
    {
      for (var j = 0; j < 6; j++)
      {
        assert.deepEqual (values[i][j].toFixed(2), solsUptrend[i][j].toFixed(2), "test " + i + " uptrend, " + retracement[j] + "% retracement OK");
      }
    }
  });

  it ("Fibonacci retracement downtrend ([10,9,5,7,2], [5,6,3,6,1], 'DOWNTREND')", function ()
  {
    var highList = [10, 9, 5, 7, 2];
    var lowList = [5, 6, 3, 6, 1];
    var values = fibonacciRetrs (lowList, highList, 'DOWNTREND');
    assert.deepEqual (values.length, 5, "Returned values ok");
    for (var i = 0; i < values.length; i++)
    {
      assert.deepEqual (values[i].length, 6, "Values in pos " + i + " ok");
    }
    var solsDownTrend = [[5, 6.91, 7.5, 8.09, 8.82, 10],
             [6, 7.15, 7.5, 7.85, 8.29, 9],
             [3, 3.76, 4, 4.24, 4.53, 5],
             [6, 6.38, 6.5, 6.62, 6.76, 7],
             [1, 1.38, 1.5, 1.62, 1.76, 2]];
    var retracement = [100, 61.8, 50, 38.2, 23.6, 0]; // only for the text output
    for (var i = 0; i < 5; i++)
    {
      for (var j = 0; j < 6; j++)
      {
        assert.deepEqual (values[i][j].toFixed(2), solsDownTrend[i][j].toFixed(2), "test " + i + " downtrend, " + retracement[j] + "% retracement OK");
      }
    }
  });
});
