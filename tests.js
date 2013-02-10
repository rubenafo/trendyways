/*
* Copyright 2013, Ruben Afonso - http://www.figurebelow.com
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/**
 * This tests checks most of the TrendyWays.js functionality.
 */

test ("Max value in a simple serie", function () {
   var serie = [0,6,2,7,8,9]
   deepEqual (max (serie), 9, "Correct max value of a simple serie");
});

test ("Min value in a simple serie", function () {
   var serie = [0,6,2,7,8,9]
   deepEqual (min (serie), 0, "Correct min value of a simple serie");
});

test ("Mean of zero is zero", function () {
   var serie = [];
   deepEqual (mean(serie), 0, "Mean of zeor values is zero");
});

test ("Mean of a simple serie", function () {
   var serie = [2,6,5,7,10,9,12,5]
   deepEqual (mean(serie), 7, "Mean value of a simple serie");
});

// Values from the wikipedia for an example of Standard Deviation:
// http://en.wikipedia.org/wiki/Standard_deviation 
test ("Standard deviation of a serie", function () {
   var serie = [2,4,4,4,5,5,7,9]
   deepEqual (sd(serie), 2, "Correct standard deviation of a simple serie");
});

test ("Moving Average of a sample serie", function () {
   var serie = [2,6,5,7,10,9,12,5];
   var correctValues = [5,7,7.75,9.5,9];
   var movingAvg = ma(serie,4);
   deepEqual (movingAvg.length, 5, "Moving Average result's length is correct");
   for (var i = 0; i < 5; i++)
   {
      deepEqual (movingAvg[i], correctValues[i], "MA value " + i + " is correct");
   }
});

/**
 * This test checks multiple window of size n and different k values on
 * a sample serie.
 */
test ("Bollinger bands values for a sample serie", function () {
   var serie = [2.1,4.3,4.5,4.8,5.0,5.8,7.1,9.1]
   for (var k = 1; k < 4; k++)
   {  
      for (var n = 1; n < serie.length; n++)
      {
         var bands = bollinger (serie, n, k); // window size n = 3, k = 3
         deepEqual (bands.upperBand.length, serie.length - n + 1, "Upper band length is correct");
         deepEqual (bands.lowerBand.length, serie.length - n + 1, "Lower band length is correct");
         deepEqual (bands.ma.length, serie.length - n + 1, "Moving average band length is correct");
         for (var i = 0; i < serie.length-n+1; i++)
         {
            var stdDev = sd(serie.slice(i,i+n));
            deepEqual (bands.upperBand[i], bands.ma[i] + stdDev * k, "Upper value nº " + i + " correct (n="+n+",k="+k+")");
            deepEqual (bands.lowerBand[i], bands.ma[i] - stdDev * k, "Lower value nº " + i + " correct (n="+n+",k="+k+")");
         }
      }
   }
});

