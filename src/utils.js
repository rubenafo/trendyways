
"use strict";

/**
 * @description This is an internal function and is not supposed to be used directly. This function moves the window of size value along the values, applying the defined function on each chunk.
 * @param {object} objects list
 * @param {attrs} list of attributes to look for
 * @return {value} object attribute
 */
let resolveParam = function (obj, attrs) {
  for (var i = 0; i < attrs.length; i++) {
    var field = attrs[i]
    if (obj[field] != undefined)
      return obj[field]
  }
  throw new Error( "No valid (" + attrs + ") found in obj");
}
module.exports.resolveParam = resolveParam

/**
 * @description returns the given value if the object is undefined
 * @param {obj} object to check
 * @param {val} value to return
 */
let valueIfUndef = function (obj, val) {
  return isUndef(obj) ? val : obj;
}
module.exports.valueIfUndef = valueIfUndef

let isUndef = function (obj) {
  return typeof obj === "undefined";
}
module.exports.isUndef = isUndef;

let reverseAppend = function (refList, addList, field) {
  if (isUndef(field))
    throw new Error ("Unable to append values, no field given")
  addList.forEach (function (add, i) {
    refList[refList.length-addList.length+i][field] = add[field] ? add[field] : add;
  })
  return refList;
}
module.exports.reverseAppend = reverseAppend

let flat = function (list, attr) {
  return list.map (function (i) {
    return isUndef(i[attr]) ? 0 : i[attr];
  });
}
module.exports.flat = flat

let fill = function (list, attr, defaultValue) {
  list.forEach(function(l) {
    if (isUndef(l[attr]))
      l[attr] = defaultValue;
  });
}
module.exports.fill = fill

/**
 * @description This is an internal function and is not supposed to be used directly. This function moves the window of size value along the values, applying the defined function on each chunk.
 * @param {array} values values array
 * @param {value} value size of the window
 * @param {function} fun function to apply on each chunk
 * @return {array} values returned by the given function in each chunck
 */
let windowOp = function (values, value, fun, targetAttr) {
  let result = new Array();
  for (var i = value; i <= values.length; i++)
  {
    var windowVal = fun (values.slice(i-value, i), targetAttr);
    result.push (windowVal);
  }
  return result;
}
module.exports.windowOp = windowOp
