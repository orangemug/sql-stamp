var assert  = require("assert");
var genTest = require("../util/gen-test");

genTest(__dirname, ["./in.sql"], ["./out.sql"], function(tmpl, results) {
	describe("raw", function() {
		it("should work", function() {
			var out = tmpl("./in.sql", {
				filter: "foo"
			});

			assert.equal(out.args.length, 0);
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
			assert.equal(thrownErr, "Missing key 'filter'");
		});
	});
});
