var Benchmark = require("benchmark");
var sqlStamp  = require("../../");

var bench = new Benchmark("[sql-stamp] no-pre-compile", {
  // a flag to indicate the benchmark is deferred
  "defer": true,

  // benchmark test function
  "fn": function(deferred) {
    sqlStamp([
      __dirname+"/../functional/example.sql",
      __dirname+"/../functional/friends.sql",
      __dirname+"/../functional/out.sql"
    ]).then(function(tmpl) {
      // call resolve() when the deferred test is finished
      tmpl(__dirname+"/../functional/example.sql", {
        accountId: 1,
        filterDisabled: false,
        filterKey: "role",
        filterVal: "dev"
      });
      deferred.resolve();
    });
  }
});

bench.on("complete", function(event) {
  console.log(String(event.target));
});

bench.on("error", function(err) {
  console.error(err);
});

// Kick off the benchmark
bench.run({
  "async": false
});
