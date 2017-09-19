
/*
 * Moving Average: 
 * also known as simple moving average, rolling average, moving mean
 * and a million of similar combinations
 */
ma = function (values, order, targetAttr) {
  targetAttr = valueIfUndef(targetAttr, ["c"])
  // Sums the content of a window
  sumWindow = function (serie) {
    var sum = 0;
    for (var init = 0; init < serie.length; init++) {
      sum += resolveParam(serie[init], targetAttr);
    }
    return (sum/serie.length);
  }
  newVal =  windowOp (values, order, sumWindow);
  console.log(values.length, newVal.length)
  newVal.forEach(function(val,i) {
    values[i].ma = val;
  });
  console.log(values)
  return newVal;
}

///////////////////////////////////////////////////////

/**
 * Exponential moving average
 */
ema = function (serie, period, targetAttr) 
{
  if (typeof serie[0] == "object" && !targetAttr)
    throw new Error("targetAttr not provided")
  var result = new Array();
  for (var i = 0; i < period-1; i++)
  {
    result.push(0);
  }
  var k = (2/(period+1));
  var initSlice = serie.slice (0, period);
  var previousDay = avgVector (initSlice, targetAttr);
  result.push(previousDay)
  var emaSlice = serie.slice (period);
  emaSlice.forEach (function (elem)
  {
    var value = isUndef(targetAttr) ? elem : elem[targetAttr]
    previousDay = value * k + previousDay * (1-k)
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
wma = function (series, weights, targetAttr)
{
  targetAttr = valueIfUndef(targetAttr, ["c"])
  sumWindow = function (elems) {
    var sum = 0;
    elems.forEach(function(elem,i) {
      sum = sum + (elem[targetAttr] * weights[i]);
    });
    return (sum/elems.length);
  }
  return windowOp (series, weights.length, sumWindow);
}

///////////////////////////////////////////////////////

