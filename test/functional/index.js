var assert     = require("assert");
var sqlStamp   = require("../../");
var util       = require("../util");

var results = util.readSync([
  "./out.sql"
], __dirname);

describe("end-to-end", function() {
  var tmpl;

  before(function() {
    tmpl = sqlStamp.sync([
      __dirname+"/example.sql",
      __dirname+"/friends.sql",
    ]);

  });


  it.only("should work", function() {
    console.log("tmpl", tmpl[__dirname+"/example.sql"])

    var out = tmpl[__dirname+"/example.sql"]({
      accountId: 1,
      filterDisabled: false,
      filterKey: "role",
      filterVal: "dev"
    });

    console.log("out", out);

    assert.equal(out.args.length, 2);
    assert.equal(out.args[0], 1);
    assert.equal(out.args[1], "dev");
    assert.equal(out.sql, results["./out.sql"]);
  });
});
