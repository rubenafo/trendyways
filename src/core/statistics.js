
/**
 * @description Max value in a series
 * @param{array} values array of numerical values
 * @returns {value} the max element in the series
 */
module.exports.max = function (values) {
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
module.exports.min = function (values) {
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
module.exports.mean = function (values, targetAttr) {
  var mean = 0;
  if (values.length == 0)
    return mean;
  for (var i = 0; i < values.length; i++) {
      mean += isUndef(targetAttr) ? values[i] : values[i][targetAttr]
  }
  return mean/values.length;
}

//////////////////////////////////////////////////////////

/**
 * @description Standar deviation of values in a serie.
 * @param {array} values array of numerical values
 * @return {value} standard deviation of the series values.
 */
module.exports.sd = function (values, targetAttr) {
  var meanVal = mean(values, targetAttr);
  var sqrSum = 0;
  for (var i = 0; i < values.length; i++) {
    var value = isUndef(targetAttr) ? values[i] : values[i][targetAttr]
    sqrSum += Math.pow(value-meanVal, 2);
  }
  return Math.sqrt (sqrSum/values.length);
}
