var assert  = require("assert");
var genTest = require("../../util/gen-test");

var opts1 = {
	sqlFiles: [
		"./in.sql",
		"./in_sub.sql",
		"./in_sub_nested.sql",
	],
	resultFiles: [
		"./out.sql"
	]
};

var opts2 = {
	sqlFiles: ["./in.sql"],
}

describe("require", function() {
	genTest(__dirname, opts1, function(tmpl, results) {
		it("should work", function() {
			var out = tmpl("./in.sql", {
				name: "orangemug",
				nested_var: {
					foo: "bar"
				}
			});

			assert.equal(out.args.length, 1);
			assert.equal(out.args[0], "orangemug");
			assert.equal(out.sql, results["./out.sql"]);
		});
	});

	genTest(__dirname, opts2, function(tmpl, results) {
		it("should throw error on missing template", function() {
			var thrownErr;

			try {
				tmpl("./in.sql", {});
			} catch(err) {
				thrownErr = err;
			}

			assert(thrownErr);
			assert.equal(thrownErr, "No such template './in_sub.sql'");
		});
	});
});
