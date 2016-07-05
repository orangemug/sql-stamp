var assert     = require("assert");
var sqlStampSync   = require("../../sync");
var util       = require("../util");

var results = util.readSync([
  "./out.sql"
], __dirname);

describe("end-to-end", function() {

  describe("sync", function () {
    var tmpl;

    before(function() {
      tmpl = sqlStampSync([
        __dirname+"/example.sql",
        __dirname+"/friends.sql",
      ]);
    });


    it("should work", function() {
      var out = tmpl(__dirname+"/example.sql", {
        accountId: 1,
        filterDisabled: false,
        filterKey: "role",
        filterVal: "dev"
      });

      assert.equal(out.args.length, 2);
      assert.equal(out.args[0], 1);
      assert.equal(out.args[1], "dev");
      assert.equal(out.sql, results["./out.sql"]);
    });
  });
});
