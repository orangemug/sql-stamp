var assert         = require("assert");
var sqlStamp       = require("../../");
var fetchTemplates = require("./../util/fetch-templates");

var opts = {
  prettyErrors: true
};

describe("pretty-errors", function() {

  it("throw too-many-args", function() {
    var thrownErr;
    var files   = fetchTemplates(["./sql/too-many-args.sql"],  __dirname);
    var results = fetchTemplates(["./errs/too-many-args.txt"], __dirname);

    try {
      sqlStamp(files, opts);
    } catch(err) {
      thrownErr = err;
    }

    assert(thrownErr);
    assert.equal(thrownErr.toString(), results["./errs/too-many-args.txt"]);
  });

  it("throw too-few-args", function() {
    var thrownErr;
    var files   = fetchTemplates(["./sql/too-few-args.sql"],  __dirname);
    var results = fetchTemplates(["./errs/too-few-args.txt"], __dirname);

    try {
      sqlStamp(files, opts);
    } catch(err) {
      thrownErr = err;
    }

    assert(thrownErr);
    assert.equal(thrownErr.toString(), results["./errs/too-few-args.txt"]);
  });

  it("throw no-such-template", function() {
    var thrownErr;
    var files   = fetchTemplates(["./sql/no-such-template.sql"],  __dirname);
    var results = fetchTemplates(["./errs/no-such-template.txt"], __dirname);

    try {
      var tmpl = sqlStamp(files, opts);
      tmpl("./sql/no-such-template.sql", {});
    } catch(err) {
      thrownErr = err;
    }

    assert(thrownErr);
    assert.equal(thrownErr.toString(), results["./errs/no-such-template.txt"]);
  });

  it("throw missing-key", function() {
    var thrownErr;
    var files   = fetchTemplates(["./sql/missing-key.sql"],  __dirname);
    var results = fetchTemplates(["./errs/missing-key.txt"], __dirname);

    try {
      var tmpl = sqlStamp(files, opts);
      tmpl("./sql/missing-key.sql", {});
    } catch(err) {
      thrownErr = err;
    }

    assert(thrownErr);
    assert.equal(thrownErr.toString(), results["./errs/missing-key.txt"]);
  });

});
