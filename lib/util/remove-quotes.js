module.exports = function(str) {
  if(str === undefined) {
    return;
  }
  return str.replace(/^"|"$/g, "");
}
