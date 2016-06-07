var Benchmark = require("benchmark");
var sqlStamp  = require("../../");

sqlStamp([
  __dirname+"/../functional/example.sql",
  __dirname+"/../functional/friends.sql",
  __dirname+"/../functional/out.sql"
]).then(function(tmpl) {
  var bench = new Benchmark('[sql-stamp] pre-compile', {
    // benchmark test function
    'fn': function() {
      // call resolve() when the deferred test is finished
      tmpl(__dirname+"/../functional/example.sql", {
        accountId: 1,
        filterDisabled: false,
        filterKey: "role",
        filterVal: "dev"
      });
    }
  });

  bench.on('complete', function(event) {
    console.log(String(event.target));
  });

  bench.on('error', function(err) {
    console.error(err);
  });

  // Kick off the benchmark
  bench.run({
    'async': false
  });
});
