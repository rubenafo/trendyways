
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

