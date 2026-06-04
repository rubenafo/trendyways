"use strict";

var utils = require("./utils");
var statistics = require("./statistics");
var averages = require("./averages");

/**
 * @description Stochastic Oscillator (%K and %D lines)
 * @param {array} highPrices list of high prices
 * @param {array} lowPrices list of low prices
 * @param {array} closePrices list of closing prices
 * @param {number} period lookback period (default 14)
 * @param {number} smoothPeriod period for %D smoothing (default 3)
 * @return {array} array of objects with k and d values
 */
let stochastic = function(highPrices, lowPrices, closePrices, period, smoothPeriod) {
  period = utils.valueIfUndef(period, 14);
  smoothPeriod = utils.valueIfUndef(smoothPeriod, 3);

  if (!highPrices || !lowPrices || !closePrices ||
      highPrices.length !== lowPrices.length ||
      highPrices.length !== closePrices.length) {
    throw new Error("Invalid input: all price arrays must have the same length");
  }

  let kValues = [];

  for (let i = 0; i < closePrices.length; i++) {
    let windowStart = Math.max(0, i - period + 1);
    let windowEnd = i + 1;

    let highWindow = highPrices.slice(windowStart, windowEnd);
    let lowWindow = lowPrices.slice(windowStart, windowEnd);

    let highestHigh = statistics.max(highWindow);
    let lowestLow = statistics.min(lowWindow);

    let range = highestHigh - lowestLow;
    let close = closePrices[i];

    let k = range === 0 ? 0 : ((close - lowestLow) / range) * 100;
    kValues.push(k);
  }

  let dValues = [];
  for (let i = 0; i < kValues.length; i++) {
    if (i < smoothPeriod - 1) {
      dValues.push(null);
    } else {
      let window = kValues.slice(i - smoothPeriod + 1, i + 1);
      let d = window.reduce((sum, val) => sum + val, 0) / smoothPeriod;
      dValues.push(d);
    }
  }

  let result = [];
  for (let i = 0; i < kValues.length; i++) {
    result.push({ k: kValues[i], d: dValues[i] });
  }

  return result;
};

module.exports.stochastic = stochastic;
