
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
  var result = [];
  var prevObv = volumeList[0];
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
  var result = [];
  var vpt = volumeList[0]
  result.push (vpt);
  for (var i = 1; i < closeList.length; i++)
  {
    var newVpt = vpt + volumeList[i] * ((closeList[i] - closeList[i-1])/closeList[i-1])
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
  var typicalMoney = [];
  var moneyFlow = [];
  for (var i = 0; i < values.length; i++)
  {
    var tpMoney = (values[i].h + values[i].l + values[i].c) / 3;
    typicalMoney.push(tpMoney);
    moneyFlow.push (tpMoney * values[i].v);
  }

  var posMoneyFlow = [];
  var negMoneyFlow = [];
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

  var sumPosFlow = utils.windowOp (posMoneyFlow, 14, sumVector);
  var sumNegFlow = utils.windowOp (negMoneyFlow, 14, sumVector);
  var moneyRatio = vectors.divVector (sumPosFlow, sumNegFlow);

  var mfi = [];
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
  slow = 26;
  fast = 12;
  signal = 9;
  slowEMA = averages.ema (closeValues, slow, targetAttr, "slowema");
  fastEMA = averages.ema (closeValues, fast, targetAttr, "fastema");
  macdLine = vectors.combineVectors (slowEMA, fastEMA, function (slow,fast) {
    if (slow.slowema == 0 || utils.isUndef(slow.slowema))
    {
      return ({macd:0}); // avoid div by 0
    };
    return ({macd:100 * ((fast.fastema/slow.slowema) - 1)});
  });
  signalLine = averages.ema (macdLine.slice(25), signal, "macd"); // avoid first 25 (padding)
  for (var i = 0; i < 25; i++)
  {
    signalLine.unshift({macd:0}); // append again 25 zeros
  }
  histLine = vectors.diffVectors(macdLine, signalLine, "macd");
  utils.fill(signalLine, "ema", 0);
  macdItems = [];
  for (var i = 0; i < macdLine.length; i++) {
    macdItems.push({macd:{line:macdLine[i].macd, signal:signalLine[i].ema, hist:histLine[i]}});
  }
  var returnList = closeValues.slice()
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
  momentumN = function (chunk)
  {
    return chunk[chunk.length-1].c - chunk[0].c
  };
  var returnValues = values.slice()
  var newValues = utils.windowOp (values, order+1, momentumN);
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
  rocN = function (chunk)
  {
    return (chunk[chunk.length-1].c - chunk[0].c) / chunk[0].c;
  };
  var returnValues = values.slice()
  var rocValues = utils.windowOp (values, order+1, rocN);
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
  gains = [];
  losses = [];
  for (var i = 0; i < values.length-1; i++)
  {
    diff = values[i+1].c - values[i].c;
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
  result = [];
  avgGain = vectors.avgVector (gains.slice(0, order));
  avgLoss = vectors.avgVector (losses.slice (0, order));
  firstRS = avgGain / avgLoss;
  result.push (100 - (100 / (1 + firstRS)));
  for (var i = order; i < values.length-1; i++)
  {
    partialCurrentGain = ((avgGain * (order-1)) + gains[i]) / order;
    partialCurrentLoss = ((avgLoss * (order-1)) + losses[i]) / order;
    smoothedRS = partialCurrentGain / partialCurrentLoss;
    currentRSI = 100 - (100 / (1 + smoothedRS))
    result.push(currentRSI);
    avgGain = partialCurrentGain;
    avgLoss = partialCurrentLoss;
  }
  var newValues = values.slice()
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
  var results = [];
  for (var i = 0; i < values.length; i++) {
    if (i == 0) {
      results.push({tr:values[i].h - values[i].l, atr:0})
    }
    else {
      var hl = values[i].h - values[i].l;
      var hcp = Math.abs(values[i].h - values[i-1].c);
      var lcp = Math.abs(values[i].l - values[i-1].c);
      var tr = Math.max(hl,hcp,lcp);
      var atr = 0;
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
  var newValues = values.slice()
  return utils.reverseAppend(newValues, results, "at");
}
module.exports.atr = atr;
