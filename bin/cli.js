#!/usr/bin/env node
var fs       = require("fs");
var path     = require("path");
var glob     = require("glob");
var lodash   = require("lodash");
var Bluebird = require("bluebird");
var sqlStamp = require("../");

fs = Bluebird.promisifyAll(fs);
globAsync = Bluebird.promisify(glob);

var argv = require('yargs')
  .usage('Usage: $0 [args] [sql-file] [args-file]')
  .version(function() {
    return require('../package').version
  })
  .example("$0 --name foo ./path/to.sql ./path/data.json")
  .string("template")
  .describe("template", "Template base location (defaults dir of [sql-file])")
  .demand(1)
  .argv;

var dataFilepath = argv._[1];
var sqlFilepath  = argv._[0];
var sqlBasename  = path.dirname(sqlFilepath);
var sqlTemplate  = fs.readFileSync(process.cwd()+"/"+sqlFilepath).toString();

var data = {};
if(dataFilepath) {
  data = fs.readFileSync(process.cwd()+"/"+dataFilepath).toString();
} 

for(var k in argv) {
  if(!k.match(/(\$0|_)/)) {
    data[k] = argv[k];
  }
}

// Fetch the templates
function getTemplates(dirpath) {
  return globAsync(dirpath+"/**/*.sql", {}).then(function(files) {
    var out = {};
    return Bluebird.each(files, function(filepath) {
      var relpath = "./"+path.relative(dirpath, filepath);
      return fs.readFileAsync(filepath).then(function(data) {
        out[relpath] = data.toString();
      });
    }).then(function() {
      return out;
    });
  });
}

getTemplates(sqlBasename)
  .then(function(templates) {
    var sql = sqlStamp(sqlTemplate, data, templates)
    console.log(
      JSON.stringify(sql, null, "  ")
    );
  })
  .catch(function(err) {
    console.error(err);
  });
