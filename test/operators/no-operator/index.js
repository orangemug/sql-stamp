var assert     = require("assert");
var sqlStamp   = require("../../../");
var util       = require("../../util");

var results = util.readSync([
  "./out.sql"
], __dirname);


describe("no-operator", function() {
  var tmpl;

  before(function() {
    return sqlStamp([__dirname+"/in.sql"], {})
      .then(function(_tmpl) {
        tmpl = _tmpl;
      });
  });

  it("should work", function() {
    var out = tmpl(__dirname+"/in.sql", {});
    assert.equal(out.sql, results["./out.sql"]);
  });
});
