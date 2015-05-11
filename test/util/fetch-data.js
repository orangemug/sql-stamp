var fs = require("fs");

// Fetch some data
module.exports = function(obj, base) {
  var out = {}
  for(var k in obj) {
    var path = obj[k];
    out[k] = fs.readFileSync(base+path).toString();
  }
  return out;
}
