var fs      = require('fs')
var sqlite3 = require('sqlite3').verbose();
var db      = new sqlite3.Database(':memory:');
var sqlStamp = require("../../");

var argv = require('minimist')(process.argv.slice(2));

var args = require(process.cwd()+"/"+argv._[0]);

var schemaSQL = fs.readFileSync(__dirname+"/schema.sql").toString();
var seedSQL   = fs.readFileSync(__dirname+"/seed.sql").toString();

function handleErr(err) {
  if(err) {
    console.error(err);
  }
}

sqlStamp([
  __dirname+"/queries/friends.sql",
], {}, function(err, _tmpl) {
  console.log("sql-stamp[err]:", err);

  db.serialize(function() {
    db.exec(schemaSQL, handleErr);
    db.exec(seedSQL,   handleErr);

    var out = _tmpl(__dirname+"/queries/friends.sql", args)

    db.each(out.sql, out.args, function(err, row) {
      if(err) {
        console.error(err);
      }
      else {
        console.log(row);
      }
    })
  })
  db.close();
});
