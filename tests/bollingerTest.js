/**
 * This test checks multiple window of size n and different k values on
 * a sample serie.
 */

"use strict";

var assert = require ("assert");
var tw = require ("../dist/trendyways.js");

describe ("Bollinger", function () {
  it ("Bollinger bands values for a sample serie", function () {
    var serie = [{c:2.1},{c:4.3},{c:4.5},{c:4.8},{c:5.0},{c:5.8},{c:7.1},{c:9.1}]
    for (var k = 1; k < 4; k++)
    {
      for (var n = 1; n < serie.length; n++)
      {
         var bands = tw.bollinger (serie, n, k); // window size n = 3, k = 3
         for (var i = n; i < serie.length-n+1; i++)
         {
            var stdDev = tw.sd(serie.slice(i,i+n), ["c"]);
            assert.deepEqual (bands[i].ub, bands[i].ma + stdDev * k, "Upper value nº " + i + " correct (n="+n+",k="+k+")");
            assert.deepEqual (bands[i].lb, bands[i].ma - stdDev * k, "Lower value nº " + i + " correct (n="+n+",k="+k+")");
         }
      }
   }
 });
});
