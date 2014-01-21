
/*
 * Moving Average: 
 * also known as simple moving average, rolling average, moving mean
 * and a million of similar combinations
 */
ma = function (values, order) {

  // Sums the content of a window
  sumWindow = function (serie) {
    var sum = 0;
    for (var init = 0; init < serie.length; init++)
      sum += serie[init];
    return (sum/serie.length);
  }
  return windowOp (values, order, sumWindow);
}

///////////////////////////////////////////////////////

/**
 * Exponential moving average
 */
ema = function (serie, period) 
{
  var result = new Array();
  for (var i = 0; i < period-1; i++)
  {
    result.push(0);
  }
  var k = (2/(period+1));
  var initSlice = serie.slice (0, period);
  var previousDay = avgVector (initSlice);
  result.push (previousDay);
  var emaSlice = serie.slice (period);
  emaSlice.forEach (function getEma(i)
  {
    previousDay = i * k + previousDay * (1-k)
    result.push (previousDay);
  });
  return result;
}

///////////////////////////////////////////////////////

/**
 * Weighted moving average.
 * The order of the mean (the number of elements to sum) 
 * is based on the weight's length.
 * The sum of weights should be 1.
 */
wma = function (series, weights)
{
  // Sums the content of a window
  sumWindow = function (serie) {
    var sum = 0;
    for (var init = 0; init < serie.length; init++)
      sum = sum + (serie[init] * weights[init]);
    return (sum/serie.length);
  }
  return windowOp (series, weights.length, sumWindow);
}

///////////////////////////////////////////////////////

