/**
 * Remove whitespace from the start and end of the string
 * @param {String} str
 * @return {String}
 */
module.exports = function(str) {
  return str.replace(/^\s*|\s*$/g, "");
};
