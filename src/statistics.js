
/**
 * @description Max value in a series
 * @param{array} values array of numerical values
 * @returns {value} the max element in the series
 */
let max = function (values) {
  var ret = Number.MIN_VALUE
  for (var i = 0; i < values.length; i++) {
    if (values[i] > ret) {
      ret = values[i];
    }
  }
  return ret;
}
module.exports.max = max

//////////////////////////////////////////////////////////

/**
 * @description Min value in a series
 * @param {array} values array of numerical values
 * @returns {value} min value in the series
 */
let min = function (values) {
  var ret = Number.MAX_VALUE
  for (var i = 0; i < values.length; i++) {
    if (values[i] < ret) {
      ret = values[i];
    }
  }
  return ret;
}
module.exports.min = min

//////////////////////////////////////////////////////////

/**
 * @description Mean of values in a serie
 * @param {array} values array of numerical values
 * @return {value} mean of the series
 */
let mean = function (values, targetAttr) {
  var mean = 0;
  if (values.length == 0)
    return mean;
  for (var i = 0; i < values.length; i++) {
      mean += isUndef(targetAttr) ? values[i] : values[i][targetAttr]
  }
  return mean/values.length;
}
module.exports.mean = mean

//////////////////////////////////////////////////////////

/**
 * @description Standar deviation of values in a serie.
 * @param {array} values array of numerical values
 * @return {value} standard deviation of the series values.
 */
let sd = function (values, targetAttr) {
  var meanVal = mean(values, targetAttr);
  var sqrSum = 0;
  for (var i = 0; i < values.length; i++) {
    var value = isUndef(targetAttr) ? values[i] : values[i][targetAttr]
    sqrSum += Math.pow(value-meanVal, 2);
  }
  return Math.sqrt (sqrSum/values.length);
}
module.exports.sd = sd

////////////////////////////////////////////////////////

/**
 * @description Returns the MSE error of two series
 * @param{array} series1 values array
 * @param{array} series2 values array
 * @return{value} the mse error
 */
let mse = function (series1, series2)
{
  return avgVector (powVector (diffVectors(series1, series2)));
}
module.exports.mse = mse;

////////////////////////////////////////////////////////

/**
 * @description Returns the RMSE error (squared MSE)
 * @param{array} series1 values array
 * @param{array} series2 values array
 * @return{value} the RMSE error
 */
let rmse = function (series1, series2)
{
  return Math.sqrt (mse(series1, series2));
}
module.exports.rmse = rmse;

////////////////////////////////////////////////////////

/**
 * @description Returns the MAE erro (mean absolute error)
 * @param{array} series1 values array
 * @param{array} series2 values array
 * @return{value} the mae error
 */
let mae = function (series1, series2)
{
  return avgVector(absVector(diffVectors(series1, series2)));
}
module.exports.mae = mae;
