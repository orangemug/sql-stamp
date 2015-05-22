var assert  = require("assert");
var genTest = require("../../util/gen-test");

var opts = {
	sqlFiles: ["./in.sql"],
	resultFiles: ["./out.falsey.sql", "./out.truthy.sql"]
}

genTest(__dirname, opts, function(tmpl, results) {
	describe("feature", function() {
		it("should enable on truthy", function() {
			var out = tmpl("./in.sql", {
				searchDisabled: false
			});

			assert.equal(out.args.length, 0);
			assert.equal(out.sql, results["./out.truthy.sql"]);
		});

		it("should enable on falsey", function() {
			var out = tmpl("./in.sql", {
				searchDisabled: true
			});

			assert.equal(out.args.length, 0);
			assert.equal(out.sql, results["./out.falsey.sql"]);
		});
	});
});
