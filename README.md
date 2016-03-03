[![Build Status](https://travis-ci.org/figurebelow/trendyways.svg?branch=master)](https://travis-ci.org/figurebelow/trendyways)
[![Coverage Status](https://coveralls.io/repos/github/figurebelow/trendyways/badge.svg?branch=master)](https://coveralls.io/github/figurebelow/trendyways?branch=master)
[![npm version](https://badge.fury.io/js/trendyways.svg)](https://badge.fury.io/js/trendyways)

Trendyways
==========

Small javascript library containing methods to be used in financial technical analysis of stock time series.
It is intended to be a simple library, suitable to be inserted in any visulization workflow to generate results on the fly.

Compatibily: IE[7,8,9,...], Chrome and Firefox.

Installation
-------------
To use trendyways library copying the main file, [trendyways.min.js](https://github.com/figurebelow/trendyways/blob/master/trendyways.min.js) is enough for production environments. A non minified version is available in the same dir,    [trendyways.js](https://github.com/figurebelow/trendyways/blob/master/trendyways.js)

Building from source is also possible if nodejs is installed on your system. In this case after clone this repo, run 
 
  make all

to create the trendyways lib and associated docs.

Documentation
-------------
The full, detailed, HTML documentation is available [here](http://htmlpreview.github.io/?https://github.com/figurebelow/trendyways/blob/master/docs/index.html) once you clone the repo.


The list below includes the (so far) implemented methods.

General purpose functions:
 
* series min.
* series max.
* series mean.
* series standar deviation.

Averages and intervals:
* MA: simple moving average.
* EMA: exponential moving average.
* WMA: weighted moving average.
* Bollinger bands (window n, k value).

Error methods:
* series MSE
* series RMSE
* series MAE

Support and resistance methods:
* Floor pivot points (resistances R1, R2 and R3; and supports S1, S2 and S3).
* Tom Demarks Points (low:high values prediction).
* Woodies Points (resistances R1,R2; and supports S1 and S2).
* Camarilla Points (resistances R1,R2,R3 and R4; supports S1,S2,S3 and S4).
* Fibonacci Retracements (for both uptrend and downtrend series).

Indicators:
* On-Balance Volume (obv)
* Price and Volume Trend (pvt)
* Money Flow Index (mfi)
* MACD indicator (macd)
* Momentum (n-th order momentum)
* Rate of Change (ROC) (n-th order)
* RSI (Relative Strength Index) (n-th order)

The detailed documentation is provided in /docs folder.

Tests
-------------
At the top of this README there is a link to the coverage and test results from Travis and CoverAll.
If you want to run your tests locally, use mocha to run the /tests files:
```
mocha ./tests
```
