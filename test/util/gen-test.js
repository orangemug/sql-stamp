var fs             = require("fs");
var assert         = require("assert");
var fetchTemplates = require("./fetch-templates");
var sqlStamp       = require("../../");
var util           = require("../../lib/util");


module.exports = function(basePath, templates, results, cb) {
  var templates = fetchTemplates(templates, basePath);
	var tmpl = sqlStamp(templates);

  var resultObj = {};
  results = results.forEach(function(filepath) {
    resultObj[filepath] = util.chomp(fs.readFileSync(basePath+"/"+filepath).toString());
  });

  cb(tmpl, resultObj);
}
