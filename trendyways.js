/*
  Copyright 2013 Ruben Afonso, http://www.figurebelow.com
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

// TrendyWays: technical analysis methods for time series.

/* 
 * A quick list of available functions, for more details navigate to 
 * each definition.
 *
 *  max (list) - returns the max value on the list
 *  min (list) - returns the min value on the list
 *  mean(list) - returns the mean of the param values
 *  sd (list) -  returns the standard deviation of the param values
 *  ma (list, n) - returns a list containing the Moving Average of order n-th
 *               - of the param list.
 *  bollinger (list, n, k) - returns the Bollinger Bands of the list, given
 *                         - window size = n, k value.
 */

/**
 * Max value in a serie
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
 * Min value in a serie
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
 * Mean of values in a serie
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
 * Standar deviation of values in a serie
 */
sd = function (values) {
  var meanVal = mean(values);
  var sqrSum = 0;
  for (var i = 0; i < values.length; i++) {
    sqrSum += Math.pow(values[i]-meanVal, 2);
  }
  return Math.sqrt (sqrSum/values.length);
}

//////////////////////////////////////////////////////////

/*
 * This is an internal function and is not supposed to 
 * be used directly. Invoke carefully.
 * This function moves the window of size value along the values,
 * applying the defined function on each chunk.
 *   params: values - list of values.
 *           value - size of the window
 *           fun - function to apply on each chunk
 */
windowOp = function (values, value, fun) {
  //var index = values.length-1;
  var result = new Array();
  for (var i = value; i <= values.length; i++)
  {
    var windowVal = fun (values.slice(i-value, i));
    result.push (windowVal);
  }
  return result;
}

//////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////

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
