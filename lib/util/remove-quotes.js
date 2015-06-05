/**
 * Remove quotes from string
 * @param {String} str
 * @return {string}
 */
module.exports = function(str) {
  if(str === undefined) {
    return;
  }
  return str.replace(/^"|"$/g, "");
};
