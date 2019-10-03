
"use strict";

var utils = require ("./utils")
var vectors = require ("./vectors")

/*
 * Moving Average: 
 * also known as simple moving average, rolling average, moving mean
 * and a million of similar combinations
 */
let ma = function (values, order, targetAttr, outputAttr) {
  targetAttr = utils.valueIfUndef(targetAttr, ["c"]);
  outputAttr = utils.valueIfUndef(outputAttr, "ma");
  // Sums the content of a window
  let sumWindow = function (serie) {
    var sum = 0;
    for (var init = 0; init < serie.length; init++) {
      sum += utils.resolveParam(serie[init], targetAttr);
    }
    return (sum/serie.length);
  }
  let newVal = utils.windowOp (values, order, sumWindow);
  return utils.reverseAppend(values, newVal, outputAttr)
}
module.exports.ma = ma;

///////////////////////////////////////////////////////

/**
 * Exponential moving average
 */
let ema = function (serie, period, targetAttr, newAttr) 
{
  if (typeof serie[0] == "object" && !targetAttr)
    throw new Error("targetAttr not provided")
  newAttr = utils.valueIfUndef (newAttr, "ema")
  let emaValues = new Array();
  let k = (2/(period+1));
  let initSlice = serie.slice (0, period);
  let previousDay = vectors.avgVector (initSlice, targetAttr);
  emaValues.push(previousDay)
  let emaSlice = serie.slice (period);
  emaSlice.forEach (function (elem)
  {
    let value = utils.isUndef(targetAttr) ? elem : elem[targetAttr]
    previousDay = value * k + previousDay * (1-k)
    emaValues.push (previousDay);
  });
  let newSerie = serie.slice()
  return utils.reverseAppend(newSerie, emaValues, newAttr)
}
module.exports.ema = ema;

///////////////////////////////////////////////////////

/**
 * Weighted moving average.
 * The order of the mean (the number of elements to sum) 
 * is based on the weight's length.
 * The sum of weights should be 1.
 */
let wma = function (series, weights, targetAttr)
{
  targetAttr = utils.valueIfUndef(targetAttr, ["c"])
  let sumWindow = function (elems) {
    let sum = 0;
    elems.forEach(function(elem,i) {
      sum = sum + (elem[targetAttr] * weights[i]);
    });
    return (sum/elems.length);
  }
  let wmaValues = utils.windowOp (series, weights.length, sumWindow);
  return utils.reverseAppend(series, wmaValues, "wma")
}
module.exports.wma = wma;


