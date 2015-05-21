var assert  = require("assert");
var genTest = require("../util/gen-test");

var templateDef = [
  "./in.sql",
  "./in_sub.sql",
  "./in_sub_nested.sql",
];

var resultDef = [
  "./out.sql"
]

genTest(__dirname, templateDef, resultDef, function(tmpl, results) {
	describe("require", function() {
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
