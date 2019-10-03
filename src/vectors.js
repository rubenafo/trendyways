
var utils = require ("./utils");
var stats = require ("./statistics");
/**
 * @description Alternative forEach for all those browsers like IE8 and below
 * @param {function} function to apply to each element
 * @param {scope} scope
 */
if ( !Array.prototype.forEach ) {
  Array.prototype.forEach = function(fn, scope)
  {
    for(var i = 0, len = this.length; i < len; ++i)
    {
      if (i in this)
      {
        fn.call(scope, this[i], i, this);
      }
    }
  };
}

////////////////////////////////////////////////////////

/**
 * @description Returns a vector containing the difference of the parameters.
 * @param {array} series1 first values array
 * @param {array} series2 second values array
 * @return {array} series1 - series2
 */
let diffVectors = function (series1, series2, targetAttr)
{
  let size = stats.max([series1.length, series2.length])
  let result = [];
  let s1Size = series1.length;
  let s2Size = series2.length;
  for (var i = 0; i < size; i++)
  {
    let itemS1 = 0;
    let itemS2 = 0;
    if (s1Size > i)
    {
      itemS1 = utils.isUndef(targetAttr) ? series1[i] : series1[i][targetAttr];
    }
    if (s2Size > i)
    {
      itemS2 = utils.isUndef(targetAttr) ? series2[i] : series2[i][targetAttr];
    }
    result.push (itemS1 - itemS2);
  }
  return result;
}
module.exports.diffVectors = diffVectors

////////////////////////////////////////////////////////

/**
 * @description Returns a vector to the 2nd power
 * @param {array} serie values array
 * @return {array} values array ^ 2
 */
let powVector = function (serie)
{
  var result = [];
  let pow = function (x) {
    result.push (Math.pow(x, 2));
  };
  serie.forEach (pow);
  return result;
}
module.exports.powVector = powVector

////////////////////////////////////////////////////////

/**
 * @description Returns the sum of all elements in a vector
 * @param {array} vector values array
 * @returns {value} the sum of all elements
 */
let sumVector = function (values, targetAttr)
{
  var result = 0;
  let sum = function (x) {
    if (utils.isUndef(x[targetAttr]))
      result += x
    else
      result += x[targetAttr]
  }
  values.forEach (sum);
  return result;
}
module.exports.sumVector = sumVector;
////////////////////////////////////////////////////////

/**
 * @description Returns the average of the sum of all vector elements
 * @param {array} vector values array
 * @returns {value} the average of the all elements
 */
let avgVector = function (vector, targetAttr)
{
  let result = module.exports.sumVector (vector, targetAttr);
  if (!vector.length)
    return 0;
  else
    return result / vector.length;
}
module.exports.avgVector = avgVector
////////////////////////////////////////////////////////

/**
 * @description Returns the vector containing absolutes values of the input
 * @param {array} vector values array
 * @return {array} the absolute values of the given array
 */
let absVector = function (vector)
{
  let result = [];
  vector.forEach (function ab(x)
  {
    result.push(Math.abs(x));
  });
  return result;
}
module.exports.absVector = absVector
////////////////////////////////////////////////////////

/**
 * @description Returns the values of the first vector divided by the second
 * @param {array} v1 values array
 * @param {array} v2 values array
 * @return {array} v1 / v2
 */
let divVector = function (v1, v2)
{
  let result = [];
  for (var i = 0; i < v1.length; i++)
  {
    result.push (v1[i] / v2[i]);
  }
  return result;
}
module.exports.divVector = divVector
////////////////////////////////////////////////////////

/**
 * @description Combine two vectors using the provided function.
 * Both series must have the same length.
 * @param {array} serie1
 * @param {array} serie2
 * @param {function} fun
 * @return {array} values fun(serie1, serie2)
 */
let combineVectors = function (serie1, serie2, fun)
{
  if (serie1.length != serie2.length || serie1.length + serie2.length < 2)
  {
    return [-1];
  }
  else
  {
    let result = [];
    for (var i = 0; i < serie1.length; i++)
    {
      result.push (fun(serie1[i], serie2[i]));
    }
    return result;
  }
}
module.exports.combineVectors = combineVectors
