var assert  = require("assert");
var genTest = require("../util/gen-test");

genTest(__dirname, ["./in.sql"], ["./out.sql"], function(tmpl, results) {
  describe("param", function() {

    it("should work", function() {

      var out = tmpl("./in.sql", {
        name: "orangemug",
        role: "dev"
      });

      assert.equal(out.args.length, 3);
      assert.equal(out.args[0], "orangemug");
      assert.equal(out.args[1], "dev");
      assert.equal(out.args[2], "orangemug");
      assert.equal(out.sql, results["./out.sql"]);
    });

    it("should throw error on missing key", function() {
      var thrownErr;

      try {
        tmpl("./in.sql", {});
      } catch(err) {
        thrownErr = err;
      }

      assert(thrownErr);
      assert.equal(thrownErr, "Missing key 'name'");
    });
  });
});




