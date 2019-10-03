"use strict";

var Utils = require ("./utils") 
var Avg = require ("./averages")

/*
 * Returns the Bollinger Band values as an object
 * containing three arrays:
 *         - the upper values (upperBand),
 *         - central moving average values (ma),
 *         - lower band values (lowerBand).
 *         
 * Params: list - values
 *         n - size of the sample window
 *         k - height of the band (sd multiplier)
 * Usual values are n = 20 and k = 2 (i.e. the base
 * moving average is calculated on the previous 20 
 * elems for a elem and upper and lower bands are
 * located +2*sd and -2*sd from the central moving average.
 */
let bollinger = function (list, n, k, targetAttr) {
  targetAttr = Utils.valueIfUndef(targetAttr, ["c"])
  let movingAvg = Avg.ma (list, n, targetAttr);
  let movingSd = Utils.windowOp (list, n, sd, targetAttr);
  let upperBand = new Array();
  let lowerBand = new Array();
  let movingAvgElem = 0;
  let movingSdElem = 0;
  let result = new Array();
  for (var index = 0; index < movingSd.length; index++) {
    movingAvgElem = movingAvg[index].ma;
    movingSdElem = movingSd[index] * k;
    upperBand.push (movingAvgElem + movingSdElem);
    lowerBand.push (movingAvgElem - movingSdElem);
    result.push({ma: movingAvg[index].ma, ub: movingAvgElem + movingSdElem, lb: movingAvgElem - movingSdElem});
  }
  return result;
}
module.exports.bollinger = bollinger;
