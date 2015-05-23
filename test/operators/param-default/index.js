var assert  = require("assert");
var genTest = require("../../util/gen-test");

var opts = {
	sqlFiles: ["./in.sql"],
	resultFiles: ["./out.sql"]
}

genTest(__dirname, opts, function(tmpl, results) {
	describe("param-default", function() {

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

		it("should work with defaults", function() {
			var out = tmpl("./in.sql", {
				name: "orangemug"
			});

			assert.equal(out.args.length, 3);
			assert.equal(out.args[0], "orangemug");
			assert.equal(out.args[1], "manager");
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
			assert.equal(thrownErr.message, "Missing key 'name'");
		});
	});
});
