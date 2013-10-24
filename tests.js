/*
* Copyright 2013, Ruben Afonso - http://www.figurebelow.com
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/**
 * This tests check most of the TrendyWays.js functionality.
 */

test ("Max value in a simple serie", function () {
   var serie = [0,6,2,7,8,9]
   deepEqual (max (serie), 9, "Correct max value of a sample serie");
});

test ("Min value in a simple serie", function () {
   var serie = [0,6,2,7,8,9]
   deepEqual (min (serie), 0, "Correct min value of a sample serie");
});

test ("Mean of zero is zero", function () {
   var serie = [];
   deepEqual (mean(serie), 0, "Mean of zeor values is zero");
});

test ("Mean of a simple serie", function () {
   var serie = [2,6,5,7,10,9,12,5]
   deepEqual (mean(serie), 7, "Mean value of a sample serie");
});

// Values from the wikipedia for an example of Standard Deviation:
// http://en.wikipedia.org/wiki/Standard_deviation 
test ("Standard deviation of a serie", function () {
   var serie = [2,4,4,4,5,5,7,9]
   deepEqual (sd(serie), 2, "Correct standard deviation of a sample serie");
});

test ("Moving Average of a sample serie", function () {
   var serie = [2,6,5,7,10,9,12,5];
   var correctValues = [5,7,7.75,9.5,9];
   var movingAvg = ma(serie,4);
   deepEqual (movingAvg.length, 5, "Moving Average result's length is correct");
   for (var i = 0; i < 5; i++)
   {
      deepEqual (movingAvg[i], correctValues[i], "MA value " + i + " is correct");
   }
});

test ("Exponential moving average test", function ()
{
  var series = [64.75, 63.79, 63.73, 63.73, 63.55, 
                63.19, 63.91, 63.85, 62.95, 63.37, 
                61.33, 61.51, 61.87, 60.25, 59.35, 
                59.95, 58.93, 57.68, 58.82, 58.87];
  var expected = [ 63.682, 63.254, 62.937, 62.743, 62.290,
                   61.755, 61.427, 60.973, 60.374, 60.092,
                   59.870
                 ];
  var result = ema(series, 10);
  for (var i = 0; i < result.length; i++)
  {
    equal (result[i].toFixed(3), expected[i], "Checking EMA index = " + i)
  }
});

test ("Weighted moving average test", function ()
{
  var series = [1, 2, 3, 4, 5, 6];
  var expected = [0.5, 0.83333, 1.16667, 1.5]
  var result = wma (series, [0.6, 0.3, 0.1]);
  for (var i = 0; i < result.length; i++)
  {
    equal (expected[i], result[i].toFixed(5), "Testing WMA value " + i);
  }
});

/**
 * This test checks multiple window of size n and different k values on
 * a sample serie.
 */
test ("Bollinger bands values for a sample serie", function () {
   var serie = [2.1,4.3,4.5,4.8,5.0,5.8,7.1,9.1]
   for (var k = 1; k < 4; k++)
   {  
      for (var n = 1; n < serie.length; n++)
      {
         var bands = bollinger (serie, n, k); // window size n = 3, k = 3
         deepEqual (bands.upperBand.length, serie.length - n + 1, "Upper band length is correct");
         deepEqual (bands.lowerBand.length, serie.length - n + 1, "Lower band length is correct");
         deepEqual (bands.ma.length, serie.length - n + 1, "Moving average band length is correct");
         for (var i = 0; i < serie.length-n+1; i++)
         {
            var stdDev = sd(serie.slice(i,i+n));
            deepEqual (bands.upperBand[i], bands.ma[i] + stdDev * k, "Upper value nº " + i + " correct (n="+n+",k="+k+")");
            deepEqual (bands.lowerBand[i], bands.ma[i] - stdDev * k, "Lower value nº " + i + " correct (n="+n+",k="+k+")");
         }
      }
   }
});

test ("Floor pivot level, supports and resistances", function () {
  var lowList = [5];
  var highList = [18];
  var closeList = [15];
  var values = floorPivots (highList, lowList, closeList);
  deepEqual (values[0].r3, 33.33333333333333, "Resistance R3 ok");
  deepEqual (values[0].r2, 25.666666666666664, "Resistance R2 ok");
  deepEqual (values[0].r1, 20.333333333333332, "Resistance R1 ok");
  deepEqual (values[0].pl, 12.666666666666666, "Pivot level ok");
  deepEqual (values[0].s1, 7.333333333333332, "Support R1 ok");
  deepEqual (values[0].s2, -0.3333333333333339, "Support R2 ok");
  deepEqual (values[0].s3, -5.666666666666668, "Support R3 ok");
});

test ("Tom Demarks's predicted low and high value (support and resistance)", function () {
  var highList = [10, 15, 25];
  var lowList = [5, 8, 10];
  var openList = [6, 10, 17];
  var closeList = [7, 11, 12];
  var values = tomDemarksPoints (highList, lowList, openList, closeList);
  deepEqual (values.length, 3, "Returned values ok");
  // first predicted values
  deepEqual (values[0].low, 6 , "Support for first value ok");
  deepEqual (values[0].high, 11, "Resistance for first value ok");
  // second predicted values
  deepEqual (values[1].low, 9.5, "Support for second value  ok");
  deepEqual (values[1].high, 16.5, "Resistance for second value ok");
  // third predicted values
  deepEqual (values[2].low, 3.5, "Support for third value ok");
  deepEqual (values[2].high, 18.5, "Resistance for third value ok");
});

test ("Woodies predicted points (support and resistance)", function () {
  var highList = [10, 15, 25, 10];
  var lowList = [5, 8, 10, 8];
  var closeList = [7, 11, 12, 9];
  var values = woodiesPoints (highList, lowList, closeList);
  deepEqual (values.length, 4, "Returned values ok");
  // first predicted values
  deepEqual (values[0].pivot, 7.25, "Pivot for first value ok");
  deepEqual (values[0].r1, 9.5, "Resistance for first value ok");
  deepEqual (values[0].r2, 12.25, "Resistance for first value ok");
  deepEqual (values[0].s1, 4.5, "Resistance for first value ok");
  deepEqual (values[0].s2, 2.25, "Resistance for first value ok");
  // second predicted values
  deepEqual (values[1].pivot, 11.25, "Pivot for second value ok");
  deepEqual (values[1].r1, 14.5, "Resistance for second value ok");
  deepEqual (values[1].r2, 18.25, "Resistance for second value ok");
  deepEqual (values[1].s1, 7.5, "Resistance for second value ok");
  deepEqual (values[1].s2, 4.25, "Resistance for second value ok");
  // third predicted values
  deepEqual (values[2].pivot, 14.75, "Pivot for third value ok");
  deepEqual (values[2].r1, 19.5, "Resistance for third value ok");
  deepEqual (values[2].r2, 29.75, "Resistance for third value ok");
  deepEqual (values[2].s1, 4.5, "Resistance for third value ok");
  deepEqual (values[2].s2, -0.25, "Resistance for third value ok");
  // fourth predicted values
  deepEqual (values[3].pivot, 9, "Pivot for fourth value ok");
  deepEqual (values[3].r1, 10, "Resistance for fourth value ok");
  deepEqual (values[3].r2, 11, "Resistance for fourth value ok");
  deepEqual (values[3].s1, 8, "Resistance for fourth value ok");
  deepEqual (values[3].s2, 7, "Resistance for fourth value ok");
});

test ("Camarilla predicted points (supports and resistances)", function () {
  var highList = [10, 15, 25, 10];
  var lowList = [5, 8, 10, 8];
  var closeList = [7, 11, 12, 9];
  var values = camarillaPoints (highList, lowList, closeList);
  deepEqual (values.length, 4, "Returned values ok");
  // first predicted values
  deepEqual (values[0].r1, 7.458333333333333, "Resistance r1 for first value ok");
  deepEqual (values[0].r2, 7.916666666666667, "Resistance r2 for first value ok");
  deepEqual (values[0].r3, 8.375, "Resistance r3 for first value ok");
  deepEqual (values[0].r4, 9.75, "Resistance r4 for first value ok");
  deepEqual (values[0].s1, 6.541666666666667, "Support s1 for first value ok");
  deepEqual (values[0].s2, 6.083333333333333, "Support s2 for first value ok");
  deepEqual (values[0].s3, 5.625, "Support s3 for first value ok");
  deepEqual (values[0].s4, 4.25, "Support s4 for first value ok");
  // second predicted values
  deepEqual (values[1].r1, 11.641666666666667, "Resistance r1 for second value ok");
  deepEqual (values[1].r2, 12.283333333333333, "Resistance r2 for second value ok");
  deepEqual (values[1].r3, 12.925, "Resistance r3 for second value ok");
  deepEqual (values[1].r4, 14.850000000000001, "Resistance r4 for second value ok");
  deepEqual (values[1].s1, 10.358333333333333, "Support s1 for second value ok");
  deepEqual (values[1].s2, 9.716666666666667, "Support s2 for second value ok");
  deepEqual (values[1].s3, 9.075, "Support s3 for second value ok");
  deepEqual (values[1].s4, 7.1499999999999995, "Support s4 for second value ok");
  // third predicted values 
  deepEqual (values[2].r1, 13.375, "Resistance r1 for third value ok");
  deepEqual (values[2].r2, 14.75, "Resistance r2 for third value ok");
  deepEqual (values[2].r3, 16.125, "Resistance r3 for third value ok");
  deepEqual (values[2].r4, 20.25, "Resistance r4 for third value ok");
  deepEqual (values[2].s1, 10.625, "Support s1 for third value ok");
  deepEqual (values[2].s2, 9.25, "Support s2 for third value ok");
  deepEqual (values[2].s3, 7.875, "Support s3 for third value ok");
  deepEqual (values[2].s4, 3.75, "Support s4 for third value ok");
  // fourth predicted values
  deepEqual (values[3].r1, 9.183333333333334, "Resistance r1 for fourth value ok");
  deepEqual (values[3].r2, 9.366666666666667, "Resistance r2 for fourth value ok");
  deepEqual (values[3].r3, 9.55, "Resistance r3 for fourth value ok");
  deepEqual (values[3].r4, 10.1, "Resistance r4 for fourth value ok");
  deepEqual (values[3].s1, 8.816666666666666, "Support s1 for fourth value ok");
  deepEqual (values[3].s2, 8.633333333333333, "Support s2 for fourth value ok");
  deepEqual (values[3].s3, 8.45, "Support s3 for fourth value ok");
  deepEqual (values[3].s4, 7.9, "Support s4 for fourth value ok");
});

test ("Fibonacci retracement uptrend ([5,8,7,6,9], [10,12,9,15,16], 'UPTREND')", function ()
{
  var highList = [10, 12, 9, 15, 16];
  var lowList = [5, 8, 7, 6, 9];
  var values = fibonacciRetrs (lowList, highList, 'UPTREND');
  deepEqual (values.length, 5, "Returned values ok");
  for (var i = 0; i < values.length; i++)
  {
    deepEqual (values[i].length, 6, "Values in pos " + i + " ok");
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
      deepEqual (values[i][j].toFixed(2), solsUptrend[i][j].toFixed(2), "test " + i + " uptrend, " + retracement[j] + "% retracement OK");
    }
  }
});

test ("Fibonacci retracement downtrend ([10,9,5,7,2], [5,6,3,6,1], 'DOWNTREND')", function ()
{
  var highList = [10, 9, 5, 7, 2];
  var lowList = [5, 6, 3, 6, 1];
  var values = fibonacciRetrs (lowList, highList, 'DOWNTREND');
  deepEqual (values.length, 5, "Returned values ok");
  for (var i = 0; i < values.length; i++)
  {
    deepEqual (values[i].length, 6, "Values in pos " + i + " ok");
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
      deepEqual (values[i][j].toFixed(2), solsDownTrend[i][j].toFixed(2), "test " + i + " downtrend, " + retracement[j] + "% retracement OK");
    }
  }
});

test ("MSE mean standard error test", function ()
{
  var s1 = [];
  var s2 = [];
  var mseResult = mse (s1, s2);
  equal (mseResult, 0, "Empty series return MSE = 0")
  s1 = [0,0,0,0,0]
  s2 = [0,0,0,0,0]
  mseResult = mse(s1, s2);
  equal (mseResult, 0, "Zeroed-series return MSE = 0");
  s1 = [1.2, 3.4, -7.8, 2.3, 8.9, 5]
  s2 = [2.2, 8.4, 7.8, -2.3, -8.9, 5.1]
  equal (mse(s1, s1), 0, "Equal vectors return MSE = 0");
  equal (mse(s1, s2), 101.22833333333334, "MSE of two sample vectors");
});

test ("RMSE root-squared mean standard error test", function ()
{
  var s1 = [];
  var s2 = [];
  equal (rmse(s1,s2), 0, "Empty series return RMSE = 0")
  s1 = [0,0,0,0,0]
  s2 = [0,0,0,0,0]
  equal (rmse(s1,s2), 0, "Zeroed-series return RMSE = 0");
  s1 = [1.2, 3.4, -7.8, 2.3, 8.9, 5]
  s2 = [2.2, 8.4, 7.8, -2.3, -8.9, 5.1]
  equal (rmse(s1, s1), 0, "Equal vectors return RMSE = 0");
  equal (rmse(s1, s2).toFixed(7), 10.0612292, "RMSE of two sample vectors");
});

test ("MAE mean absolute error test", function ()
{
  var s1 = [];
  var s2 = [];
  equal (mae(s1,s2), 0, "Empty series return MAE = 0")
  s1 = [0,0,0,0,0]
  s2 = [0,0,0,0,0]
  equal (mae(s1,s2), 0, "Zeroed-series return MAE = 0");
  s1 = [1.2, 3.4, -7.8, 2.3, 8.9, 5]
  s2 = [2.2, 8.4, 7.8, -2.3, -8.9, 5.1]
  equal (mae(s1, s1), 0, "Equal vectors return MAE = 0");
  equal (mae(s1, s2).toFixed(2), 7.35, "MAE of two sample vectors");
});
