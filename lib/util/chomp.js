/**
 * Remove whitespace from the start and end of the string
 * @param {String} str
 * @return {String}
 */
module.exports = function(str) {
  return str.toString().replace(/^\s*|\s*$/g, "");
};
