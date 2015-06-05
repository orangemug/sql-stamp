var fs   = require("fs");
var util = require("../../lib/util");

module.exports = function(files, baseDir) {
	var out = {};
  files.forEach(function(filepath) {
    out[filepath] = util.chomp(
			fs.readFileSync(baseDir+"/"+filepath).toString()
		);
  });
	return out;
};
