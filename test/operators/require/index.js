var assert     = require("assert");
var Bluebird   = require("bluebird");
var sqlStamp   = require("../../../");
var util       = require("../../util");


var results = util.readSync([
	"./out.sql"
], __dirname);

describe("require", function() {
	var tmpl1, tmpl2;

	before(function() {
		var t1 = sqlStamp([__dirname+"/in.sql", __dirname+"/in_sub.sql", __dirname+"/in_sub_nested.sql"])
	 		.then(function(_tmpl) {
				tmpl1 = _tmpl;
			});

		var t2 = sqlStamp([__dirname+"/in.sql"])
	 		.then(function(_tmpl) {
				tmpl2 = _tmpl;
			});

		return Bluebird.all([t1, t2]);
	});

	it("should work", function() {
		var out = tmpl1(__dirname+"/in.sql", {
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
			tmpl2(__dirname+"/in.sql", {});
		} catch(err) {
			thrownErr = err;
		}

		assert(thrownErr);
		assert.equal(thrownErr.message, "No such template './in_sub.sql'");
	});
});
