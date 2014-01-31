test ("MSE mean standard error test", function ()
{
  var s1 = [];
  var s2 = [];
  var mseResult = mse (s1, s2);
  equal (mseResult, 0, "Empty series return MSE = 0")
  s1 = [0,0,0,0,0]
  s2 = [0,0,0,0,0]
  mseResult = mse(s1, s2);
  equal (mseResult, 0, "Zeroed-series return MSE = 0");
  s1 = [1.2, 3.4, -7.8, 2.3, 8.9, 5]
  s2 = [2.2, 8.4, 7.8, -2.3, -8.9, 5.1]
  equal (mse(s1, s1), 0, "Equal vectors return MSE = 0");
  equal (mse(s1, s2), 101.22833333333334, "MSE of two sample vectors");
});

test ("RMSE root-squared mean standard error test", function ()
{
  var s1 = [];
  var s2 = [];
  equal (rmse(s1,s2), 0, "Empty series return RMSE = 0")
  s1 = [0,0,0,0,0]
  s2 = [0,0,0,0,0]
  equal (rmse(s1,s2), 0, "Zeroed-series return RMSE = 0");
  s1 = [1.2, 3.4, -7.8, 2.3, 8.9, 5]
  s2 = [2.2, 8.4, 7.8, -2.3, -8.9, 5.1]
  equal (rmse(s1, s1), 0, "Equal vectors return RMSE = 0");
  equal (rmse(s1, s2).toFixed(7), 10.0612292, "RMSE of two sample vectors");
});

test ("MAE mean absolute error test", function ()
{
  var s1 = [];
  var s2 = [];
  equal (mae(s1,s2), 0, "Empty series return MAE = 0")
  s1 = [0,0,0,0,0]
  s2 = [0,0,0,0,0]
  equal (mae(s1,s2), 0, "Zeroed-series return MAE = 0");
  s1 = [1.2, 3.4, -7.8, 2.3, 8.9, 5]
  s2 = [2.2, 8.4, 7.8, -2.3, -8.9, 5.1]
  equal (mae(s1, s1), 0, "Equal vectors return MAE = 0");
  equal (mae(s1, s2).toFixed(2), 7.35, "MAE of two sample vectors");
});

