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
  var result = new Array();
  for (var i = value; i <= values.length; i++)
  {
    var windowVal = fun (values.slice(i-value, i));
    result.push (windowVal);
  }
  return result;
}

