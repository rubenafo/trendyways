
/**
 * @description On-Balance Volume (obv).
 * @param {array} closeList list of closing prices
 * @param {array} volumeList list of volumes
 * @return {array} the OBV values list
 */
obv = function (closeList, volumeList)
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
/**
 * @description Returns the VPT (Volume-price Trend)
 * @param {array} closeList list of closing prices
 * @param {array} volumeList list of volume
 * @return {array} vpt values array
 */
vpt = function (closeList, volumeList)
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

/**
 * @description Returns the Money-flow Index
 * @param {array} highPrices list of high prices
 * @param {array} lowPrices list of low prices
 * @param {array} closePrices list of closing prices
 * @param {array} volumes list of volumes
 * @return {value} the money-flow index
 */
mfi = function (values)
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

  var sumPosFlow = windowOp (posMoneyFlow, 14, sumVector);
  var sumNegFlow = windowOp (negMoneyFlow, 14, sumVector);
  var moneyRatio = divVector (sumPosFlow, sumNegFlow);

  var mfi = [];
  moneyRatio.forEach (function (value)
  {
    mfi.push (100 - (100/(1+value)));
  });
  return mfi;
}

////////////////////////////////////////////

/**
 * @description Returns the MACD
 * @param {array} closePrices list of closing prices
 * @return {object} object containing the macd, signal
 *                  and hist series.
 */
macd = function (closeValues, targetAttr)
{
  targetAttr = valueIfUndef(targetAttr, ["c"])
  slow = 26;
  fast = 12;
  signal = 9;
  slowEMA = ema (closeValues, slow, targetAttr);
  fastEMA = ema (closeValues, fast, targetAttr);
  macdLine = combineVectors (slowEMA, fastEMA, function (slow,fast) {
    if (slow == 0)
    {
      return 0; // avoid div by 0
    };
    return (100 * ((fast/slow) - 1));
  });
  signalLine = ema (macdLine.slice(25), signal); // avoid first 25 (padding)
  for (var i = 0; i < 25; i++)
  {
    signalLine.unshift(0); // append again 25 zeros
  }
  histLine = diffVectors(macdLine, signalLine);
  return { macd: macdLine, signal:signalLine, hist: histLine };
}

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
momentum = function(values, order)
{
  momentumN = function (chunk)
  {
    return chunk[chunk.length-1].c - chunk[0].c
  };
  return windowOp (values, order+1, momentumN);
}

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
roc = function(values, order, targetAttr)
{
  rocN = function (chunk)
  {
    return (chunk[chunk.length-1].c - chunk[0].c) / chunk[0].c;
  };
  return windowOp (values, order+1, rocN);
}


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
rsi = function (values, order)
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
  avgGain = avgVector (gains.slice(0, order));
  avgLoss = avgVector (losses.slice (0, order));
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
  return result;
}

//////////////////////////////
/**
 * @description Returns the ATR (Average True Value). ATR is provided after 14th element.
 * @param {array} values containing {high,low,close}
 * @returns {array} list containing {tr,atr} values for each period.
 * @example 
 * var atr = atr ([{high:48.7, low:45.3, close:46}, ...])
 * console.log(atr)  // [{tr:2.4, atr:0}, ... 13 empty atr's, ... ,{atr:_value_, tr:_value_} ]
 */

atr = function (values) {
  var results = [];
  for (var i = 0; i < values.length; i++) {
    if (i == 0) {
      results.push({tr:values[i].high - values[i].low, atr:0})
    }
    else {
      var hl = values[i].high - values[i].low;
      var hcp = Math.abs(values[i].high - values[i-1].close);
      var lcp = Math.abs(values[i].low - values[i-1].close);
      var tr = Math.max(hl,hcp,lcp);
      var atr = 0;
      if (i == 13) {
        atr = tr;
        for (var j = 0; j < results.length; j++) {
          atr += results[j].tr;
        }
        atr = atr / 14.0;
      }
      else if (i > 13) {
        atr = ((results[i-1].atr * 13) + tr) / 14;
      }
      results.push({tr:tr, atr:atr});
    }
  }
  return results;
}
