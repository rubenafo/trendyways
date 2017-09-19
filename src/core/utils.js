/**
 * @description This is an internal function and is not supposed to be used directly. This function moves the window of size value along the values, applying the defined function on each chunk.
 * @param {object} objects list
 * @param {attrs} list of attributes to look for
 * @return {value} object attribute
 */
resolveParam = function (obj, attrs) {
  for (var i = 0; i < attrs.length; i++) {
    var field = attrs[i]
    if (obj[field] != undefined)
      return obj[field]
  }
  throw new Error( "No valid (" + attrs + ") found in obj");
}

/**
 * @description returns the given value if the object is undefined
 * @param {obj} object to check
 * @param {val} value to return
 */
valueIfUndef = function (obj, val) {
  return isUndef(obj) ? val : obj;
}

isUndef = function (obj) {
  return typeof obj == "undefined";
}

reverseAppend = function (refList, addList, field) {
  if (isUndef(field))
    throw new Error ("Unable to append values, no field given")
  addList.forEach (function (val, i) {
    refList[refList.length-addList.length+i][field] = val[field];
  })
  return refList;
}
