var assert  = require("assert");
var genTest = require("../util/gen-test");

genTest(__dirname, ["./in.sql"], ["./out.falsey.sql", "./out.truthy.sql"], function(tmpl, results) {
	describe("feature-default", function() {
		it("should enable on truthy", function() {
			var out = tmpl("./in.sql", {
				searchDisabled: true
			});

			assert.equal(out.args.length, 0);
			assert.equal(out.sql, results["./out.truthy.sql"]);
		});

		it("should enable on falsey", function() {
			var out = tmpl("./in.sql", {
				searchDisabled: false
			});

			assert.equal(out.args.length, 0);
			assert.equal(out.sql, results["./out.falsey.sql"]);
		});
	});
});
