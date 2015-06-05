var assert     = require("assert");
var sqlStamp   = require("../../../");
var util       = require("../../util");

var results = util.readSync([
  "./out.falsey.sql",
	"./out.truthy.sql"
], __dirname);


describe("feature-default", function() {
	var tmpl;

	before(function() {
		return sqlStamp([__dirname+"/in.sql"], {})
			.then(function(_tmpl) {
				tmpl = _tmpl;
			});
	});

	it("should enable on truthy", function() {
		var out = tmpl(__dirname+"/in.sql", {
			searchDisabled: true
		});

		assert.equal(out.args.length, 0);
		assert.equal(out.sql, results["./out.truthy.sql"]);
	});

	it("should enable on falsey", function() {
		var out = tmpl(__dirname+"/in.sql", {
			searchDisabled: false
		});

		assert.equal(out.args.length, 0);
		assert.equal(out.sql, results["./out.falsey.sql"]);
	});
});
