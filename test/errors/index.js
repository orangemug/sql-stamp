var assert   = require("assert");
var sqlStamp = require("../../");
var util     = require("./../util");

var opts = {
  prettyErrors: true
};

describe("pretty-errors", function() {

  it("throw too-many-args", function(done) {
    var results = util.readSync(["./errs/too-many-args.txt"], __dirname);

		sqlStamp([__dirname+"/sql/too-many-args.sql"], opts, function(err) {
			assert(err);
			assert.equal(util.chomp(err.toString()), results["./errs/too-many-args.txt"]);
			done();
		});
  });

  it("throw too-few-args", function(done) {
    var results = util.readSync(["./errs/too-few-args.txt"], __dirname);

		sqlStamp([__dirname+"/sql/too-few-args.sql"], opts, function(err) {
			assert(err);
			assert.equal(util.chomp(err.toString()), results["./errs/too-few-args.txt"]);
			done();
		});
  });

  it("throw no-such-template", function(done) {
    var results = util.readSync(["./errs/no-such-template.txt"], __dirname);

		sqlStamp([__dirname+"/sql/no-such-template.sql"], opts, function(err, tmpl) {
			var thrownErr;
			try {
				tmpl(__dirname+"/sql/no-such-template.sql", {});
			} catch(err) {
				thrownErr = err;
			}

			assert(thrownErr);
			assert.equal(util.chomp(thrownErr.toString()), results["./errs/no-such-template.txt"]);
			done();
		});
  });

  it("throw missing-key", function(done) {
    var results = util.readSync(["./errs/missing-key.txt"], __dirname);

		sqlStamp([__dirname+"/sql/missing-key.sql"], opts, function(err, tmpl) {
			var thrownErr;
			try {
				tmpl(__dirname+"/sql/missing-key.sql", {});
			} catch(err) {
				thrownErr = err;
			}

			assert(thrownErr);
			assert.equal(util.chomp(thrownErr.toString()), results["./errs/missing-key.txt"]);
			done();
		});
  });

});
