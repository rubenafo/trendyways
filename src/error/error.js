

/**
 * MSE error
 */
mse = function (series1, series2)
{
  return avgVector (powVector (diffVectors(series1, series2)));
}

////////////////////////////////////////////////////////

/**
 * RMSE error, the squared MSE
 */
rmse = function (series1, series2)
{
  return Math.sqrt (mse(series1, series2));
}

////////////////////////////////////////////////////////

/**
 * MAE error, mean absolute error
 */
mae = function (series1, series2)
{
  return avgVector(absVector(diffVectors(series1, series2)));
}
