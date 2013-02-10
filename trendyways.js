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
