
/*
 * Moving Average: 
 * also known as simple moving average, rolling average, moving mean
 * and a million of similar combinations
 */
module.exports.ma = function (values, order, targetAttr, outputAttr) {
  targetAttr = valueIfUndef(targetAttr, ["c"]);
  outputAttr = valueIfUndef(outputAttr, "ma");
  // Sums the content of a window
  sumWindow = function (serie) {
    var sum = 0;
    for (var init = 0; init < serie.length; init++) {
      sum += resolveParam(serie[init], targetAttr);
    }
    return (sum/serie.length);
  }
  newVal = windowOp (values, order, sumWindow);
  return reverseAppend(values, newVal, outputAttr)
}

///////////////////////////////////////////////////////

/**
 * Exponential moving average
 */
module.exports.ema = function (serie, period, targetAttr, newAttr) 
{
  if (typeof serie[0] == "object" && !targetAttr)
    throw new Error("targetAttr not provided")
  newAttr = valueIfUndef (newAttr, "ema")
  var emaValues = new Array();
  var k = (2/(period+1));
  var initSlice = serie.slice (0, period);
  var previousDay = avgVector (initSlice, targetAttr);
  emaValues.push(previousDay)
  var emaSlice = serie.slice (period);
  emaSlice.forEach (function (elem)
  {
    var value = isUndef(targetAttr) ? elem : elem[targetAttr]
    previousDay = value * k + previousDay * (1-k)
    emaValues.push (previousDay);
  });
  var newSerie = serie.slice()
  return reverseAppend(newSerie, emaValues, newAttr)
}

///////////////////////////////////////////////////////

/**
 * Weighted moving average.
 * The order of the mean (the number of elements to sum) 
 * is based on the weight's length.
 * The sum of weights should be 1.
 */
module.exports.wma = function (series, weights, targetAttr)
{
  targetAttr = valueIfUndef(targetAttr, ["c"])
  sumWindow = function (elems) {
    var sum = 0;
    elems.forEach(function(elem,i) {
      sum = sum + (elem[targetAttr] * weights[i]);
    });
    return (sum/elems.length);
  }
  var wmaValues = windowOp (series, weights.length, sumWindow);
  return reverseAppend(series, wmaValues, "wma")
}

///////////////////////////////////////////////////////

