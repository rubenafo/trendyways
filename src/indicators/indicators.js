
/**
 * On-Balance Volume (obv).
 * Input:  - list of close prices
 *         - volume list
 * Returns: - obv list
 */
obv = function (closeList, volumeList)
{
  var result = [];
  var prevObv = volumeList[0];
  result.push (prevObv);
  for (var i = 1; i < closeList.length; i++)
  {
    if (closeList[i] > closeList[i-1])
    {
      // bullish
      result.push (prevObv + volumeList[i]);
      prevObv += volumeList[i];
    }
    else if (closeList[i] < closeList[i-1])
    {
      // bearish
      result.push (prevObv - volumeList[i]);
      prevObv -= volumeList[i];
    }
    else 
    {
      result.push (prevObv);
    }
  }
  return result;
}
/**
 * Volume-price trend
 * Input:  - list of close prices
 *         - volume list
 * Returns: - vpt list
 */
vpt = function (closeList, volumeList)
{
  var result = [];
  var vpt = volumeList[0]
  result.push (vpt);
  for (var i = 1; i < closeList.length; i++)
  {
    var newVpt = vpt + volumeList[i] * ((closeList[i] - closeList[i-1])/closeList[i-1])
    result.push (newVpt);
    vpt = newVpt;
  }
  return result;
}

/**
 * Money-flow index
 * Input: - list of high prices
 *        - list of low prices
 *        - list of close prices
 *        - list of volume
 * Returns: - money-flow index
 */
mfi = function (highPrices, lowPrices, closePrices, volumes)
{
  var typicalMoney = [];
  var moneyFlow = [];
  for (var i = 0; i < highPrices.length; i++)
  {
    var tpMoney = (highPrices[i] + lowPrices[i] + closePrices[i]) / 3;
    typicalMoney.push(tpMoney);
    moneyFlow.push (tpMoney * volumes[i]);
  }

  var posMoneyFlow = [];
  var negMoneyFlow = [];
  for (var i = 0; i < typicalMoney.length-1; i++)
  {
    if (typicalMoney[i] <= typicalMoney[i+1])
    {
      posMoneyFlow.push (moneyFlow[i+1]);
      negMoneyFlow.push(0);
    }
    else if (typicalMoney[i] > typicalMoney[i+1])
    {
      posMoneyFlow.push (0);
      negMoneyFlow.push (moneyFlow[i+1]);
    }
    else // typical money unchanged implies day is discharged
    {
    	posMoneyFlow.push(0);
    	negMoneyFlow.push(0);
    }
  }

  var sumPosFlow = windowOp (posMoneyFlow, 14, sumVector);
  var sumNegFlow = windowOp (negMoneyFlow, 14, sumVector);
  var moneyRatio = divVector (sumPosFlow, sumNegFlow);

  var mfi = [];
  moneyRatio.forEach (function (value)
  {
    mfi.push (100 - (100/(1+value)));
  });
  return mfi;
}
