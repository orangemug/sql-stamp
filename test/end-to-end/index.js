var assert  = require("assert");
var genTest = require("../util/gen-test");

var opts = {
	sqlFiles: [
		"./example.sql",
		"./friends.sql",
	],
	resultFiles: [
		"./out.sql"
	]
}

genTest(__dirname, opts, function(tmpl, results) {
	describe("end-to-end", function() {
		it("should work", function() {
			var out = tmpl("./example.sql", {
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
