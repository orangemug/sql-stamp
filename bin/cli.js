var fs       = require("fs");
var lodash   = require("lodash");
var sqlStamp = require("../");

var argv = require('yargs')
  .usage('Usage: $0 [args] [sql-file] [args-file]')
  .example("$0 --name foo ./path/to.sql ./path/data.json")
  .demand(1)
  .argv;

var dataFilepath = argv._[1];
var sqlFilepath  = argv._[0];
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

function getTemplates(path, done) {
  // TODO
  done(undefined, {});
}

getTemplates("/path", function(err, templates) {
  if(err) {
    throw err;
  }

  var sql = sqlStamp(sqlTemplate, data, templates)
  console.log(
    JSON.stringify(sql, null, "  ")
  );
});
