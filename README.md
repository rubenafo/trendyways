trendyways
==========

Small javascrip library containing methods to use in financial technical analysis of time series.
It is intended to be a simple library, for most of the methods the input is just an array of values to get as output 
a list of values.

General purpose functions:
 
* Series min, max, mean and standar deviation.

Averages and intervals:
* Moving Average of n-th order.
* Bollinger Bands (window n, k value).

Support and resistance calculation:
* Floor pivot points (resistances R1, R2 and R3; and supports S1, S2 and S3).
* Tom Demarks Points (low:high values prediction).
* Woodies Points (resistances R1,R2; and supports S1 and S2).
* Camarilla Points (resistances R1,R2,R3 and R4; supports S1,S2,S3 and S4).

For the testing part, fantastic qunit.js testing library is used.
Tests can be run from the file tests.html once you fetch this
repository, https://github.com/figurebelow/trendyways
