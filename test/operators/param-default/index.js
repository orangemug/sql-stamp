var assert     = require("assert");
var sqlStamp   = require("../../../");
var util       = require("../../util");

var results = util.readSync([
  "./out.sql",
], __dirname);

describe("param-default", function() {
	var tmpl;

	before(function() {
		return sqlStamp([__dirname+"/in.sql"], {})
			.then(function(_tmpl) {
				tmpl = _tmpl;
			});
	});

	it("should work", function() {
		var out = tmpl(__dirname+"/in.sql", {
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
		var out = tmpl(__dirname+"/in.sql", {
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
			tmpl(__dirname+"/in.sql", {});
		} catch(err) {
			thrownErr = err;
		}

		assert(thrownErr);
		assert.equal(thrownErr.message, "Missing key 'name'");
	});
});
