var assert     = require("assert");
var sqlStamp   = require("../../../");
var util       = require("../../util");

var results = util.readSync([
	"./out.sql"
], __dirname);


describe("raw", function() {
	var tmpl;

	before(function() {
		return sqlStamp([__dirname+"/in.sql"], {})
	 		.then(function(_tmpl) {
				tmpl = _tmpl;
			});
	});

	it("should work", function() {
		var out = tmpl(__dirname+"/in.sql", {
			filter: "foo"
		});

		assert.equal(out.args.length, 0);
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
		assert.equal(thrownErr, "Missing key 'filter'");
	});
});
