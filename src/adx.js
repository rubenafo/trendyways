
var utils = require ("./utils")
var vectors = require ("./vectors")

"use strict";

/**
 * @description Average Directional Index (ADX)
 * @param {array} list of _ohlc_ values
 * @return {array} the afx values list
 *
 * Source: http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:average_directional_index_adx
 */
let adx = function (values) {
	let dmWindow = function (serie) {
		let sum = 0
		let todayMax = serie[1].h - serie[0].h
		let todayMin = serie[0].l - serie[1].l
    let dmPos = 0, dmNeg = 0
		if (todayMax > 0 || todayMin > 0) {
			dmPos = todayMax > todayMin ? Math.abs(todayMax) : 0
			dmNeg = todayMax < todayMin ? Math.abs(todayMin) : 0
		}
		else {
			dmPos = 0;
			dmNeg = 0;
		}
		let tr = Math.max(Math.abs(serie[1].h - serie[1].l), 
			Math.abs(serie[1].h - serie[0].c), 
			Math.abs(serie[1].l - serie[0].c));
		return {dmp:dmPos, dmn:dmNeg, tr:tr}
	}
	let result = Utils.windowOp(values, 2, dmWindow);
	result.unshift({dmp:0, dmn:0, tr:0});

	let firstTr14 = vectors.sumVector(result.slice(0, 15), "tr"),
	    firstDM14Pos = vectors.sumVector(result.slice(0,15), "dmp"),
	    firstDM14Neg = vectors.sumVector(result.slice(0,15), "dmn");
	result[14].tr14 = firstTr14;
	result[14].dmp14 = firstDM14Pos;
	result[14].dmn14 = firstDM14Neg;
	result[14].di14p = 100 * (result[14].dmp14 / result[14].tr14);
	result[14].di14n = 100 * (result[14].dmn14 / result[14].tr14);
	result[14].diff = Math.abs(result[14].di14p - result[14].di14n);
	result[14].sum = result[14].di14p + result[14].di14n;
	result[14].dx = 100 * (result[14].diff / result[14].sum);
	for (var i = 15; i < result.length; i++) {
		result[i].tr14 = result[i-1].tr14 - (result[i-1].tr14/14) + result[i].tr;
		result[i].dmp14 = result[i-1].dmp14 - (result[i-1].dmp14/14) + result[i].dmp;
		result[i].dmn14 = result[i-1].dmn14 - (result[i-1].dmn14/14) + result[i].dmn;

		result[i].di14p = 100 * (result[i].dmp14 / result[i].tr14);
		result[i].di14n = 100 * (result[i].dmn14 / result[i].tr14);
		result[i].diff = Math.abs(result[i].di14p - result[i].di14n);
		result[i].sum = result[i].di14p + result[i].di14n;
		result[i].dx = 100 * (result[i].diff / result[i].sum);
		if (i >= 28) {
			if (i == 28)
				adx = vectors.avgVector(result.slice(i-14, i), "dx")
			else {
				adx = ((result[i-1].adx * 13 ) + result[i].dx)/14
			}
			result[i].adx = adx;
		}
	}
	return result;
}
module.exports.adx = adx;
