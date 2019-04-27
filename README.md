[![Build Status](https://travis-ci.org/rubenafo/trendyways.svg?branch=master)](https://travis-ci.org/rubenafo/trendyways)
[![Coverage Status](https://coveralls.io/repos/github/rubenafo/trendyways/badge.svg?branch=master)](https://coveralls.io/github/rubenafo/trendyways?branch=master)
[![npm version](https://badge.fury.io/js/trendyways.svg)](https://badge.fury.io/js/trendyways)

Trendyways
==========

Small javascript library containing methods to be used in financial technical analysis of stock time series.
It is intended to be a simple library, suitable to be inserted in any visulization workflow to generate results on the fly.

Compatibily: IE[7,8,9,...], Chrome and Firefox.

Install
-------

   npm install trendyways

How to use it
-------------
The minified version of trendyways ([trendyways.min.js]) (https://github.com/rubenafo/trendyways/blob/master/trendyways.min.js) is enough to use it in a production environment.   
A non minified version is available in the same dir ([trendyways.js])(https://github.com/rubenafo/trendyways/blob/master/trendyways.js)

Building from source is also possible if nodejs is installed on your system. In this case after clone this repo, run 
 
   make all

to create the trendyways.js lib.
The 


Documentation
-------------
Please refer to the wiki of the project to access the latest documentation: https://github.com/rubenafo/trendyways/wiki

__General purpose functions:__
 
* series min.
* series max.
* series mean.
* series standar deviation.

__Averages and Intervals:__
* MA: simple moving average.
* EMA: exponential moving average.
* WMA: weighted moving average.
* Bollinger bands (window n, k value).

__Error methods:__
* series MSE
* series RMSE
* series MAE

__Support and Resistance methods:__
* Floor pivot points (resistances R1, R2 and R3; and supports S1, S2 and S3).
* Tom Demarks Points (low:high values prediction).
* Woodies Points (resistances R1,R2; and supports S1 and S2).
* Camarilla Points (resistances R1,R2,R3 and R4; supports S1,S2,S3 and S4).
* Fibonacci Retracements (for both uptrend and downtrend series).

__Technical Indicators:__
* On-Balance Volume (obv)
* Price and Volume Trend (pvt)
* Money Flow Index (mfi)
* MACD indicator (macd)
* Momentum (n-th order momentum)
* Rate of Change (ROC) (n-th order)
* RSI (Relative Strength Index) (n-th order)
* Average True Range (ATR)
* Average Directional Index (ADV)

Tests
-------------
At the top of this README there is a link to the coverage and test results from Travis and CoverAll.
If you want to run your tests locally, use mocha to run the /tests files:
```
mocha ./tests
```
