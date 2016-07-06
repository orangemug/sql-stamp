/**
 * Remove quotes from string
 * @param {String} str  string to test
 * @returns {string} string with stripped quotes
 */
module.exports = function(str) {
  if(str === undefined) {
    return;
  }
  return str.replace(/^"|"$/g, "");
};
