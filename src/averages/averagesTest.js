
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
  var expected = [ 0,0,0,0,0,0,0,0,0,
                   63.682,63.254,62.937,62.743,62.290,
                   61.755,61.427,60.973,60.374,60.092,
                   59.870
                 ];
  var result = ema(series, 10);
  equal (result.length, expected.length, "EMA length = " + result.length);
  for (var i = 0; i < 10 - 1; i++)
  {
    equal (result[i], expected[i], "Checking EMA index = " + i)
  }
  for (var i = 10-1; i < result.length; i++)
  {
    equal (result[i].toFixed(3), expected[i], "Checking EMA index = " + i)
  }
  result = ema(series, 1);
  for (var i = 0; i < result.length; i++)
  {
    equal (result[i].toFixed(3), series[i], "EMA = 1, value " + i + " unchanged");
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

