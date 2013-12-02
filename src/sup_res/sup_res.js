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
