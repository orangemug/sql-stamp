var fs             = require("fs");
var assert         = require("assert");
var lodash         = require("lodash");
var fetchTemplates = require("./fetch-templates");
var sqlStamp       = require("../../");
var util           = require("../../lib/util");


module.exports = function(basePath, opts, cb) {
  opts = lodash.assign({
    sqlFiles: [],
    resultFiles: []
  }, opts);

  var templates = fetchTemplates(opts.sqlFiles, basePath);
	var tmpl = sqlStamp(templates, opts);

  var resultObj = {};
  opts.resultFiles.forEach(function(filepath) {
    resultObj[filepath] = util.chomp(fs.readFileSync(basePath+"/"+filepath).toString());
  });

  cb(tmpl, resultObj);
}
