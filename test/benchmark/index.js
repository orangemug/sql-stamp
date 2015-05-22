var Benchmark = require("benchmark");
var sqlStamp = require("../../");
var fetchData = require("../util/fetch-templates");

var suite = new Benchmark.Suite;

var data = fetchData([
  "./example.sql",
  "./friends.sql",
  "./out.sql"
], __dirname+"/../functional");

var tmpl = sqlStamp(data);

suite.add('functional', function() {
  tmpl("./example.sql", {
    accountId: 1,
    filterDisabled: false,
    filterKey: "role",
    filterVal: "dev"
  });
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.on('error', function(err) {
  console.error(err);
});

// Kick off the benchmark
suite.run({
  'async': true
});

