var fs = require("fs");

// Fetch some data
module.exports = function(files, base) {
  var out = {};
  files.forEach(function(filepath) {
    out[filepath] = fs.readFileSync(base+"/"+filepath).toString();
  });
  return out;
}
