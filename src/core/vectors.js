/**
 * Returns the difference of the vector parameters as
 * a new vector
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
 * Returns a vector to the 2nd power
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
 * Returns the sum of all elements in a vector
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
 * Returns the average of the sum of all vector elements
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
 * Returns the vector containing absoulte values of the input
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
 * Returns the values of the first vector divided the second
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
