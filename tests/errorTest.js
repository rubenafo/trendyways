var assert = require ("assert");
var tw = require ("../trendyways.js");

describe ("Error measurements", function () {

  it ("MSE mean standard error test", function ()
  {
    var s1 = [];
    var s2 = [];
    var mseResult = tw.mse (s1, s2);
    assert.equal (mseResult, 0, "Empty series return MSE = 0")
    s1 = [0,0,0,0,0]
    s2 = [0,0,0,0,0]
    mseResult = tw.mse(s1, s2);
    assert.equal (mseResult, 0, "Zeroed-series return MSE = 0");
    s1 = [1.2, 3.4, -7.8, 2.3, 8.9, 5]
    s2 = [2.2, 8.4, 7.8, -2.3, -8.9, 5.1]
    assert.equal (tw.mse(s1, s1), 0, "Equal vectors return MSE = 0");
    assert.equal (tw.mse(s1, s2), 101.22833333333334, "MSE of two sample vectors");
  });

  it ("RMSE root-squared mean standard error test", function ()
  {
    var s1 = [];
    var s2 = [];
    assert.equal (tw.rmse(s1,s2), 0, "Empty series return RMSE = 0")
    s1 = [0,0,0,0,0]
    s2 = [0,0,0,0,0]
    assert.equal (tw.rmse(s1,s2), 0, "Zeroed-series return RMSE = 0");
    s1 = [1.2, 3.4, -7.8, 2.3, 8.9, 5]
    s2 = [2.2, 8.4, 7.8, -2.3, -8.9, 5.1]
    assert.equal (tw.rmse(s1, s1), 0, "Equal vectors return RMSE = 0");
    assert.equal (tw.rmse(s1, s2).toFixed(7), 10.0612292, "RMSE of two sample vectors");
  });

  it ("MAE mean absolute error test", function ()
  {
    var s1 = [];
    var s2 = [];
    assert.equal (tw.mae(s1,s2), 0, "Empty series return MAE = 0")
    s1 = [0,0,0,0,0]
    s2 = [0,0,0,0,0]
    assert.equal (tw.mae(s1,s2), 0, "Zeroed-series return MAE = 0");
    s1 = [1.2, 3.4, -7.8, 2.3, 8.9, 5]
    s2 = [2.2, 8.4, 7.8, -2.3, -8.9, 5.1]
    assert.equal (tw.mae(s1, s1), 0, "Equal vectors return MAE = 0");
    assert.equal (tw.mae(s1, s2).toFixed(2), 7.35, "MAE of two sample vectors");
  });
});
