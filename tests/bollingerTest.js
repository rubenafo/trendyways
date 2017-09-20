/**
 * This test checks multiple window of size n and different k values on
 * a sample serie.
 */

var assert = require ("assert");
var Trendyways = require ("../trendyways.js");

describe ("Bollinger", function () {
  it ("Bollinger bands values for a sample serie", function () {
    var serie = [{c:2.1},{c:4.3},{c:4.5},{c:4.8},{c:5.0},{c:5.8},{c:7.1},{c:9.1}]
    for (var k = 1; k < 4; k++)
    {
      for (var n = 1; n < serie.length; n++)
      {
         var bands = bollinger (serie, n, k); // window size n = 3, k = 3
         assert.deepEqual (bands.upperBand.length, serie.length - n + 1, "Upper band length is correct");
         assert.deepEqual (bands.lowerBand.length, serie.length - n + 1, "Lower band length is correct");
         for (var i = 0; i < serie.length-n+1; i++)
         {
            var stdDev = sd(serie.slice(i,i+n), ["c"]);
            assert.deepEqual (bands.upperBand[i], bands.ma[i].ma + stdDev * k, "Upper value nº " + i + " correct (n="+n+",k="+k+")");
            assert.deepEqual (bands.lowerBand[i], bands.ma[i].ma - stdDev * k, "Lower value nº " + i + " correct (n="+n+",k="+k+")");
         }
      }
   }
 });
});
