/**
 * @description Returns a vector containing the difference of the parameters.
 * @param {array} series1 first values array
 * @param {array} series2 second values array
 * @return {array} series1 - series2
 */
diffVectors = function (series1, series2)
{
  var size = max([series1.length, series2.length])
  var result = [];
  var s1Size = series1.length;
  var s2Size = series2.length;
  for (var i = 0; i < size; i++)
  {
    var itemS1 = 0;
    var itemS2 = 0;
    if (s1Size > i)
    {
      itemS1 = series1[i];
    }
    if (s2Size > i)
    {
      itemS2 = series2[i];
    }
    result.push (itemS1 - itemS2);
  }
  return result;
}

////////////////////////////////////////////////////////

/**
 * @description Returns a vector to the 2nd power
 * @param {array} serie values array
 * @return {array} values array ^ 2
 */
powVector = function (serie) 
{
  var result = [];
  pow = function (x) { 
    result.push (Math.pow(x, 2)); 
  };
  serie.forEach (pow);
  return result;
}

////////////////////////////////////////////////////////

/**
 * @description Returns the sum of all elements in a vector
 * @param {array} vector values array
 * @returns {value} the sum of all elements
 */
sumVector = function (vector)
{
  var result = 0;
  sum = function (x) { result += x; }
  vector.forEach (sum);
  return result;
}

////////////////////////////////////////////////////////

/**
 * @description Returns the average of the sum of all vector elements
 * @param {array} vector values array
 * @returns {value} the average of the all elements
 */
avgVector = function (vector)
{
  var result = sumVector (vector);
  if (!vector.length)
    return 0;
  else
    return result / vector.length;
}

////////////////////////////////////////////////////////

/**
 * @description Returns the vector containing absolutes values of the input
 * @param {array} vector values array
 * @return {array} the absolute values of the given array
 */
absVector = function (vector)
{
  var result = [];
  vector.forEach (function ab(x) 
  {
    result.push(Math.abs(x));
  });
  return result;
}

////////////////////////////////////////////////////////

/**
 * @description Returns the values of the first vector divided by the second
 * @param {array} v1 values array
 * @param {array} v2 values array
 * @return {array} v1 / v2
 */
divVector = function (v1, v2)
{
  var result = [];
  for (var i = 0; i < v1.length; i++)
  {
    result.push (v1[i] / v2[i]);
  }
  return result;
}

////////////////////////////////////////////////////////

/**
 * @description Combine two vectors using the provided function.
 * Both series must have the same length.
 * @param {array} serie1
 * @param {array} serie2
 * @param {function} fun
 * @return {array} values fun(serie1, serie2)
 */
combineVectors = function (serie1, serie2, fun)
{
  if (serie1.length != serie2.length || serie1.length + serie2.length < 2)
  {
    return [-1];
  }
  else
  {
    var result = [];
    for (var i = 0; i < serie1.length; i++)
    {
      result.push (fun(serie1[i], serie2[i]));
    }
    return result;
  }
}

/**
 * @description Max value in a series
 * @param{array} values array of numerical values
 * @returns {value} the max element in the series
 */
max = function (values) {
  var ret = Number.MIN_VALUE
  for (var i = 0; i < values.length; i++) {
    if (values[i] > ret) {
      ret = values[i];
    }
  }
  return ret;
}

//////////////////////////////////////////////////////////

/**
 * @description Min value in a series
 * @param {array} values array of numerical values
 * @returns {value} min value in the series
 */
min = function (values) {
  var ret = Number.MAX_VALUE
  for (var i = 0; i < values.length; i++) {
    if (values[i] < ret) {
      ret = values[i];
    }
  }
  return ret;
}

//////////////////////////////////////////////////////////

/**
 * @description Mean of values in a serie
 * @param {array} values array of numerical values
 * @return {value} mean of the series
 */
mean = function (values) {
  var mean = 0;
  if (values.length == 0)
    return mean;
  for (var i = 0; i < values.length; i++)
  {
    mean += values[i];
  }
  return mean/values.length;
}

//////////////////////////////////////////////////////////

/**
 * @description Standar deviation of values in a serie.
 * @param {array} values array of numerical values
 * @return {value} standard deviation of the series values.
 */
sd = function (values) {
  var meanVal = mean(values);
  var sqrSum = 0;
  for (var i = 0; i < values.length; i++) {
    sqrSum += Math.pow(values[i]-meanVal, 2);
  }
  return Math.sqrt (sqrSum/values.length);
}

/**
 * @description This is an internal function and is not supposed to be used directly. This function moves the window of size value along the values, applying the defined function on each chunk.
 * @param {array} values values array
 * @param {value} value size of the window
 * @param {function} fun function to apply on each chunk
 * @return {array} values returned by the given function in each chunck
 */
windowOp = function (values, value, fun) {
  var result = new Array();
  for (var i = value; i <= values.length; i++)
  {
    var windowVal = fun (values.slice(i-value, i));
    result.push (windowVal);
  }
  return result;
}

/**
 * @description Returns the MSE error of two series
 * @param{array} series1 values array
 * @param{array} series2 values array
 * @return{value} the mse error
 */
mse = function (series1, series2)
{
  return avgVector (powVector (diffVectors(series1, series2)));
}

////////////////////////////////////////////////////////

/**
 * @description Returns the RMSE error (squared MSE)
 * @param{array} series1 values array
 * @param{array} series2 values array
 * @return{value} the RMSE error
 */
rmse = function (series1, series2)
{
  return Math.sqrt (mse(series1, series2));
}

////////////////////////////////////////////////////////

/**
 * @description Returns the MAE erro (mean absolute error)
 * @param{array} series1 values array
 * @param{array} series2 values array
 * @return{value} the mae error
 */
mae = function (series1, series2)
{
  return avgVector(absVector(diffVectors(series1, series2)));
}

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
bollinger = function (list, n, k) {
  var movingAvg = ma (list, n);
  var movingSd = windowOp (list, n, sd);
  var upperBand = new Array();
  var lowerBand = new Array();
  var movingAvgElem = 0;
  var movingSdElem = 0;
  for (var index = 0; index < movingSd.length; index++) {
    movingAvgElem = movingAvg[index];
    movingSdElem = movingSd[index] * k;
    upperBand.push (movingAvgElem + movingSdElem);
    lowerBand.push (movingAvgElem - movingSdElem);
  }
  return {
      upperBand: upperBand,
      ma: movingAvg,
      lowerBand: lowerBand
  };
}

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
mfi = function (highPrices, lowPrices, closePrices, volumes)
{
  var typicalMoney = [];
  var moneyFlow = [];
  for (var i = 0; i < highPrices.length; i++)
  {
    var tpMoney = (highPrices[i] + lowPrices[i] + closePrices[i]) / 3;
    typicalMoney.push(tpMoney);
    moneyFlow.push (tpMoney * volumes[i]);
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
macd = function (closeValues)
{
  slow = 26;
  fast = 12;
  signal = 9;
  slowEMA = ema (closeValues, slow);
  fastEMA = ema (closeValues, fast);
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
momentum = function(closePrices, order)
{
  momentumN = function (chunk)
  {
    return chunk[chunk.length-1] - chunk[0]
  };
  return windowOp (closePrices, order+1, momentumN);
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
roc = function(closePrices, order)
{
  rocN = function (chunk)
  {
    return (chunk[chunk.length-1] - chunk[0]) / chunk[0];
  };
  return windowOp (closePrices, order+1, rocN);
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
rsi = function (closePrices, order)
{
  if (closePrices.length < order+1)
  {
    return [-1]; // not enough params
  }
  gains = [];
  losses = [];
  for (var i = 0; i < closePrices.length; i++)
  {
    diff = closePrices[i+1] - closePrices[i];
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
  for (var i = order; i < closePrices.length-1; i++)
  {
    partialCurrentGain = ((avgGain * (order-1)) + gains[i]) / order;
    partialCurrentLoss = ((avgLoss * (order-1)) + losses[i]) / order;
    smoothedRS = partialCurrentGain / partialCurrentLoss;
    rsi = 100 - (100 / (1 + smoothedRS))
    result.push(rsi);
    avgGain = partialCurrentGain;
    avgLoss = partialCurrentLoss;
  }
  return result;
}
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
floorPivots = function (highList, lowList, closeList) {
  var result = new Array();
  for (var i = 0; i < highList.length; i++)
  {
    pivotLevel = (highList[i] + lowList[i] + closeList[i]) / 3;
    r1 = 2 * pivotLevel - lowList[i];
    r2 = pivotLevel + highList[i] - lowList[i];
    r3 = r1 + highList[i] - lowList[i];
    s1 = 2 * pivotLevel - highList[i];
    s2 = pivotLevel - highList[i] + lowList[i];
    s3 = s1 - highList[i] + lowList[i];
    elem = {r3:r3, r2:r2, r1:r1, pl: pivotLevel, s1:s1, s2:s2, s3:s3};
    result.push(elem);
  }
  return result;
}

////////////////////////////////////////////////////////

/**
 * Returns the Tom Demark points, the predicted low and highs
 * of the period.
 * These values for a given day are calculated based on the day before
 * so expect n values as output for a given list of n days.
 * Note that three lists must have the same length.
 * Params: - higList: list of high values
 *         - lowList: list of low values
 *         - cliseList: list of closing values
 * The result is a list of elements with fields:
 *         - low: predicted low value.
 *         - high: predicted high value.
 */
tomDemarksPoints = function (highList, lowList, openList, closeList) {
  var result = new Array();
  for (var i = 0; i < highList.length; i++)
  {
    var x = 0;
    if (closeList[i] < openList[i])
    {
      x = highList[i] + (2 * (lowList[i]) + closeList[i]);
    }
    if (closeList[i] > openList[i])
    {
      x = (2 * highList[i]) +  lowList[i] + closeList[i];
    }
    if (closeList[i] == openList[i])
    {
      x = highList[i] + lowList[i] + (2 * closeList[i]);
    }
    newHigh = (x/2) - lowList[i];
    newLow = (x/2) - highList[i];
    elem = {low: newLow, high: newHigh};
    result.push(elem);
  }
  return result;
}

////////////////////////////////////////////////////////

/**
 * Returns the Woodies points: pivot, supports (s1 and s2) and
 * resistance values (r1 and r2).
 * These values for a given day are calculated based on the day before
 * so expect n values as output for a given list of n days.
 * Note that the three lists must have the same length.
 * Params: - higList: list of high values
 *         - lowList: list of low values
 *         - closeList: list of closing values
 * The result is a list of elements with fields:
 *         - pivot: predicted pivot value.
 *         - s1: predicted support (s1).
 *         - r1: predicted resistance (r1).
 *         - r2: predicted secondary resistance (r2).
 *         - s2: predicted secondary support (s2).
 */
woodiesPoints = function (highList, lowList, closeList) {
  var result = new Array();
  for (var i = 0; i < highList.length; i++)
  {
    var x = 0;
    var pivot = (highList[i] + lowList[i] + 2 * closeList[i]) / 4;
    var r1 = (2 * pivot) - lowList[i];
    var r2 = pivot + highList[i] - lowList[i];
    var s1 = (2 * pivot) - highList[i];
    var s2 = pivot - highList[i] + lowList[i]; 
    elem = {pivot: pivot, r1: r1, 
            s1: s1, s2: s2, r2: r2};
    result.push(elem);
  }
  return result;
}

////////////////////////////////////////////////////////

/**
 * Returns the Camarilla points: supports (s1,s2,3 and s4)) and
 * resistance values (r1, r2, r3 and r4).
 * These values for a given day are calculated based on the day before
 * so expect n values as output for a given list of n days.
 * Note that the three lists must have the same length.
 * Params: - higList: list of high values
 *         - lowList: list of low values
 *         - closeList: list of closing values
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
camarillaPoints = function (highList, lowList, closeList) {
  var result = new Array();
  for (var i = 0; i < highList.length; i++)
  {
    var diff = highList[i] - lowList[i];
    var r4 = (diff * 1.1) / 2 + closeList[i];
    var r3 = (diff *1.1) / 4 + closeList[i];
    var r2 = (diff * 1.1) / 6 + closeList[i];
    var r1 = (diff * 1.1) / 12 + closeList[i];
    var s1 = closeList[i] - (diff * 1.1 / 12);
    var s2 = closeList[i] - (diff *1.1 /6);
    var s3 = closeList[i] - (diff * 1.1 / 4);
    var s4 = closeList[i] - (diff *1.1 / 2);
    elem = {r4: r4, r3: r3, r2: r2, r1: r1, s1: s1, s2: s2, s3: s3,
            s4: s4};
    result.push(elem);
  }
  return result;
}


////////////////////////////////////////////////////////

fibonacciRetrs = function (lowList, highList, trend)
{
  var result = new Array();
  var retracements = [1, 0.618, 0.5, 0.382, 0.236, 0];
  if (trend == 'DOWNTREND') 
  {
    for (var i = 0; i < highList.length; i++)
    {
      var diff = highList[i] - lowList[i];
      var elem = new Array();
      for (var r = 0; r < retracements.length; r++)
      {
        var level = highList[i] - diff * retracements[r];
        elem.push(level);
      }
      result.push(elem);
    }
  }
  else  // UPTREND
  {
    for (var i = 0; i < lowList.length; i++)
    {
      var diff = highList[i] - lowList[i];
      var elem = new Array();
      for (var r = 0; r < retracements.length; r++)
      {
        var level = lowList[i] + diff * retracements[r];
        elem.push (level);
      }
      result.push(elem);
    }
  }
  return result;
}
