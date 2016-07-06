/**
 * Remove whitespace from the start and end of the string
 * @param {String} str  string to chomp
 * @returns {String} chomped string
 */
module.exports = function(str) {
  return str.toString().replace(/^\s*|\s*$/g, "");
};
