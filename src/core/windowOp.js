/**
 * @description This is an internal function and is not supposed to be used directly. This function moves the window of size value along the values, applying the defined function on each chunk.
 * @param {array} values values array
 * @param {value} value size of the window
 * @param {function} fun function to apply on each chunk
 * @return {array} values returned by the given function in each chunck
 */
module.exports.windowOp = function (values, value, fun, targetAttr) {
  var result = new Array();
  for (var i = value; i <= values.length; i++)
  {
    var windowVal = fun (values.slice(i-value, i), targetAttr);
    result.push (windowVal);
  }
  return result;
}
