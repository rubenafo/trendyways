"use strict";

var utils = require ("./utils")
var vectors = require ("./vectors")
var averages = require ("./averages")

/**
 * @description On-Balance Volume (obv).
 * @param {array} closeList list of closing prices
 * @param {array} volumeList list of volumes
 * @return {array} the OBV values list
 */
let obv = function (closeList, volumeList)
{
  let result = [];
  let prevObv = volumeList[0];
  result.push (prevObv);
  for (var i = 1; i < closeList.length; i++)
  {
    if (closeList[i] > closeList[i-1])
    {
      // bullish
      result.push (prevObv + volumeList[i]);
      prevObv += volumeList[i];
    }
    else if (closeList[i] < closeList[i-1])
    {
      // bearish
      result.push (prevObv - volumeList[i]);
      prevObv -= volumeList[i];
    }
    else 
    {
      result.push (prevObv);
    }
  }
  return result;
}
module.exports.obv = obv;

/**
 * @description Returns the VPT (Volume-price Trend)
 * @param {array} closeList list of closing prices
 * @param {array} volumeList list of volume
 * @return {array} vpt values array
 */
let vpt = function (closeList, volumeList)
{
  let result = [];
  let vpt = volumeList[0]
  result.push (vpt);
  for (var i = 1; i < closeList.length; i++)
  {
    let newVpt = vpt + volumeList[i] * ((closeList[i] - closeList[i-1])/closeList[i-1])
    result.push (newVpt);
    vpt = newVpt;
  }
  return result;
}
module.exports.vpt = vpt;

/**
 * @description Returns the Money-flow Index
 * @param {array} highPrices list of high prices
 * @param {array} lowPrices list of low prices
 * @param {array} closePrices list of closing prices
 * @param {array} volumes list of volumes
 * @return {value} the money-flow index
 */
let mfi = function (values)
{
  let typicalMoney = [];
  let moneyFlow = [];
  for (var i = 0; i < values.length; i++)
  {
    let tpMoney = (values[i].h + values[i].l + values[i].c) / 3;
    typicalMoney.push(tpMoney);
    moneyFlow.push (tpMoney * values[i].v);
  }

  let posMoneyFlow = [];
  let negMoneyFlow = [];
  for (var i = 0; i < typicalMoney.length-1; i++)
  {
    if (typicalMoney[i] <= typicalMoney[i+1])
    {
      posMoneyFlow.push (moneyFlow[i+1]);
      negMoneyFlow.push(0);
    }
    else if (typicalMoney[i] > typicalMoney[i+1])
    {
      posMoneyFlow.push (0);
      negMoneyFlow.push (moneyFlow[i+1]);
    }
    else // typical money unchanged implies day is discharged
    {
    	posMoneyFlow.push(0);
    	negMoneyFlow.push(0);
    }
  }

  let sumPosFlow = utils.windowOp (posMoneyFlow, 14, sumVector);
  let sumNegFlow = utils.windowOp (negMoneyFlow, 14, sumVector);
  let moneyRatio = vectors.divVector (sumPosFlow, sumNegFlow);

  let mfi = [];
  moneyRatio.forEach (function (value)
  {
    mfi.push (100 - (100/(1+value)));
  });
  return utils.reverseAppend (values, mfi, "mfi");
}
module.exports.mfi = mfi;

////////////////////////////////////////////

/**
 * @description Returns the MACD
 * @param {array} closePrices list of closing prices
 * @return {object} object containing the macd, signal
 *                  and hist series.
 */
let macd = function (closeValues, targetAttr)
{
  targetAttr = utils.valueIfUndef(targetAttr, ["c"])
  let slow = 26;
  let fast = 12;
  let signal = 9;
  let slowEMA = averages.ema (closeValues, slow, targetAttr, "slowema");
  let fastEMA = averages.ema (closeValues, fast, targetAttr, "fastema");
  let macdLine = vectors.combineVectors (slowEMA, fastEMA, function (slow,fast) {
    if (slow.slowema == 0 || utils.isUndef(slow.slowema))
    {
      return ({macd:0}); // avoid div by 0
    };
    return ({macd:100 * ((fast.fastema/slow.slowema) - 1)});
  });
  let signalLine = averages.ema (macdLine.slice(25), signal, "macd"); // avoid first 25 (padding)
  for (var i = 0; i < 25; i++)
  {
    signalLine.unshift({macd:0}); // append again 25 zeros
  }
  let histLine = vectors.diffVectors(macdLine, signalLine, "macd");
  utils.fill(signalLine, "ema", 0);
  let macdItems = [];
  for (var i = 0; i < macdLine.length; i++) {
    macdItems.push({macd:{line:macdLine[i].macd, signal:signalLine[i].ema, hist:histLine[i]}});
  }
  let returnList = closeValues.slice()
  return utils.reverseAppend (returnList, macdItems, "macd");
}
module.exports.macd = macd;

////////////////////////////////////////////

/**
 * @description Returns the Momentum
 * @param {array} closePrices list of closing prices
 * @param {value} order order of the momentum 
 * @returns {array} list containing the momentum series
 * @example 
 * var m = momemtum ([12,34,23, 81], 1) 
 * console.log(m)  // [22, -11, 58]
 */
let momentum = function(values, order)
{
  let momentumN = function (chunk)
  {
    return chunk[chunk.length-1].c - chunk[0].c
  };
  let returnValues = values.slice()
  let newValues = utils.windowOp (values, order+1, momentumN);
  return utils.reverseAppend(returnValues, newValues, "mom")
}
module.exports.momentum = momentum;

////////////////////////////////////////////

/**
 * @description Returns the Rate of Change value (ROC)
 * @param {array} closePrices list of closing prices
 * @param {value} order order of the ROC
 * @returns {array} list containing the ROC series
 * @example 
 * var roc = roc ([12, 11, 15, 10], 1) 
 * console.log(roc)  // [-0.09, 0.36, -0.33]
 */
let roc = function(values, order, targetAttr)
{
  let rocN = function (chunk)
  {
    return (chunk[chunk.length-1].c - chunk[0].c) / chunk[0].c;
  };
  let returnValues = values.slice()
  let rocValues = utils.windowOp (values, order+1, rocN);
  return utils.reverseAppend(returnValues, rocValues, "roc");
}
module.exports.roc = roc;

////////////////////////////////////////////
/**
 * @description Returns the RSI (Relative Strength Index)
 * @param {array} closePrices list of closing prices
 * @param {value} order RSI order (typically 14)
 * @returns {array} list containing the RSI for each period
 * @example 
 * var rsi = rsi ([45.34, 44, ..., 42,9, 45.23], 14) 
 * console.log(rsi)  // [70.53, 66.32, ..., 56.05]
 */
let rsi = function (values, order)
{
  if (values.length < order+1)
  {
    return [-1]; // not enough params
  }
  let gains = [];
  let losses = [];
  for (var i = 0; i < values.length-1; i++)
  {
    let diff = values[i+1].c - values[i].c;
    if (diff > 0) 
    {
      gains.push(diff);
      losses.push(0);
    }
    else if (diff < 0)
    {
      gains.push(0);
      losses.push(Math.abs(diff));
    }
    else
    {
      gains.push(0);
      losses.push(0);
    }
  }
  let result = [];
  let avgGain = vectors.avgVector (gains.slice(0, order));
  let avgLoss = vectors.avgVector (losses.slice (0, order));
  let firstRS = avgGain / avgLoss;
  result.push (100 - (100 / (1 + firstRS)));
  for (var i = order; i < values.length-1; i++)
  {
    let partialCurrentGain = ((avgGain * (order-1)) + gains[i]) / order;
    let partialCurrentLoss = ((avgLoss * (order-1)) + losses[i]) / order;
    let smoothedRS = partialCurrentGain / partialCurrentLoss;
    let currentRSI = 100 - (100 / (1 + smoothedRS))
    result.push(currentRSI);
    avgGain = partialCurrentGain;
    avgLoss = partialCurrentLoss;
  }
  let newValues = values.slice()
  return utils.reverseAppend(newValues, result, "rsi");
}
module.exports.rsi = rsi;

//////////////////////////////
/**
 * @description Returns the ATR (Average True Value). ATR is provided after 14th element.
 * @param {array} values containing {high,low,close}
 * @param {number} period, default to 14
 * @returns {array} list containing {tr,atr} values for each period.
 * @example 
 * var atr = atr ([{high:48.7, low:45.3, close:46}, ...])
 * console.log(atr)  // [{tr:2.4, atr:0}, ... 13 empty atr's, ... ,{atr:_value_, tr:_value_} ]
 */

let atr = function (values, p) {
  p = valueIfUndef(p, 14);
  let results = [];
  for (var i = 0; i < values.length; i++) {
    if (i == 0) {
      results.push({tr:values[i].h - values[i].l, atr:0})
    }
    else {
      let hl = values[i].h - values[i].l;
      let hcp = Math.abs(values[i].h - values[i-1].c);
      let lcp = Math.abs(values[i].l - values[i-1].c);
      let tr = Math.max(hl,hcp,lcp);
      let atr = 0;
      if (i == p-1) {
        atr = tr;
        for (var j = 0; j < results.length; j++) {
          atr += results[j].tr;
        }
        atr = atr / p;
      }
      else if (i > (p-1)) {
        atr = ((results[i-1].atr * (p-1) + tr) / p);
      }
      results.push({tr:tr, atr:atr});
    }
  }
  let newValues = values.slice()
  return utils.reverseAppend(newValues, results, "at");
}
module.exports.atr = atr;
