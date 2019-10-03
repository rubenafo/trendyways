"use strict";

var Utils = require ("./utils")

/**
 * Returns the Floor pivot level, three support levels (s1,s2 and s3)
 * and three resistance levels (r1, r2 and r3) of the
 * given data series.
 * These values for a given day are calculated based on the day before
 * so expect n values as output for a given list of n days.
 * Note that all three must have the same length.
 * Params: - higList: list of high values
 *         - lowList: list of low values
 *         - cliseList: list of closing values
 * The result is a list of elements with fields:
 *         - r3: resistence third level
 *         - r2: resistance second level
 *         - r1: resistance first level
 *         - pl: pivot level
 *         - s3: support third level
 *         - s2: support second level
 *         - s1: support first level
 */
let floorPivots = function (values) {
  var result = new Array();
  for (var i = 0; i < values.length; i++)
  {
    let pivotLevel = (values[i].h + values[i].l + values[i].c) / 3;
    let r1 = 2 * pivotLevel - values[i].l;
    let r2 = pivotLevel + values[i].h - values[i].l;
    let r3 = r1 + values[i].h - values[i].l;
    let s1 = 2 * pivotLevel - values[i].h;
    let s2 = pivotLevel - values[i].h + values[i].l;
    let s3 = s1 - values[i].h + values[i].l;
    let elem = {r3:r3, r2:r2, r1:r1, pl: pivotLevel, s1:s1, s2:s2, s3:s3};
    result.push(elem);
  }
  return Utils.reverseAppend(values, result, "floor");
}
module.exports.floorPivots = floorPivots;

////////////////////////////////////////////////////////

/**
 * Returns the Tom Demark points, the predicted low and highs
 * of the period.
 * These values for a given day are calculated based on the day before
 * so expect n values as output for a given list of n days.
 * The result is a list of elements with fields:
 *         - low: predicted low value.
 *         - high: predicted high value.
 */
let tomDemarksPoints = function (values) {
  var result = new Array();
  for (var i = 0; i < values.length; i++)
  {
    let x = 0;
    if (values[i].c < values[i].o)
    {
      x = values[i].h + (2 * (values[i].l) + values[i].c);
    }
    if (values[i].c > values[i].o)
    {
      x = (2 * values[i].h) +  values[i].l + values[i].c;
    }
    if (values[i].c == values[i].o)
    {
      x = values[i].h + values[i].l + (2 * values[i].c);
    }
    let newHigh = (x/2) - values[i].l;
    let newLow = (x/2) - values[i].h;
    let elem = {l: newLow, h: newHigh};
    result.push(elem);
  }
  return utils.reverseAppend(values, result, "tom");
}
module.exports.tomDemarksPoints = tomDemarksPoints;

////////////////////////////////////////////////////////

/**
 * Returns the Woodies points: pivot, supports (s1 and s2) and
 * resistance values (r1 and r2).
 * These values for a given day are calculated based on the day before
 * so expect n values as output for a given list of n days.
 * The result is a list of elements with fields:
 *         - pivot: predicted pivot value.
 *         - s1: predicted support (s1).
 *         - r1: predicted resistance (r1).
 *         - r2: predicted secondary resistance (r2).
 *         - s2: predicted secondary support (s2).
 */
let woodiesPoints = function (values) {
  var result = new Array();
  for (var i = 0; i < values.length; i++)
  {
    let x = 0;
    let pivot = (values[i].h + values[i].l + 2 * values[i].c) / 4;
    let r1 = (2 * pivot) - values[i].l;
    let r2 = pivot + values[i].h - values[i].l;
    let s1 = (2 * pivot) - values[i].h;
    let s2 = pivot - values[i].h + values[i].l;
    let elem = {pivot: pivot, r1: r1, s1: s1, s2: s2, r2: r2};
    result.push(elem);
  }
  return utils.reverseAppend (values, result, "wood");
}
module.exports.woodiesPoints = woodiesPoints;

////////////////////////////////////////////////////////

/**
 * Returns the Camarilla points: supports (s1,s2,3 and s4)) and
 * resistance values (r1, r2, r3 and r4).
 * The result is a list of elements with fields:
 *         - s1: predicted s1 support.
 *         - s2: predicted s2 support.
 *         - s3: predicted s3 support.
 *         - s4: predicted s4 support.
 *         - r1: predicted r1 resistance.
 *         - r2: predicted r2 resistance.
 *         - r3: predicted r3 resistance.
 *         - r4: predicted r4 resistance.
 */
let camarillaPoints = function (values) {
  let result = new Array();
  for (var i = 0; i < values.length; i++)
  {
    let diff = values[i].h - values[i].l;
    let r4 = (diff * 1.1) / 2 + values[i].c;
    let r3 = (diff *1.1) / 4 + values[i].c;
    let r2 = (diff * 1.1) / 6 + values[i].c;
    let r1 = (diff * 1.1) / 12 + values[i].c;
    let s1 = values[i].c - (diff * 1.1 / 12);
    let s2 = values[i].c - (diff *1.1 /6);
    let s3 = values[i].c - (diff * 1.1 / 4);
    let s4 = values[i].c - (diff *1.1 / 2);
    let elem = {r4: r4, r3: r3, r2: r2, r1: r1, s1: s1, s2: s2, s3: s3, s4: s4};
    result.push(elem);
  }
  return reverseAppend(values, result, "cam");
}
module.exports.camarillaPoints = camarillaPoints;

////////////////////////////////////////////////////////

let fibonacciRetrs = function (values, trend)
{
  let result = new Array();
  let retracements = [1, 0.618, 0.5, 0.382, 0.236, 0];
    for (var i = 0; i < values.length; i++) {
      let diff = values[i].h - values[i].l;
      let elem = new Array();
      for (var r = 0; r < retracements.length; r++)
      {
        let level = 0;
        if (trend == 'DOWNTREND')
          level = values[i].h - diff * retracements[r];
        else
          level = values[i].l + diff * retracements[r];
        elem.push(level);
      }
      result.push(elem);
    }
  return result
}
module.exports.fibonacciRetrs = fibonacciRetrs;
