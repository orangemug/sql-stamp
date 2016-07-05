var assert     = require("assert");
var sqlStamp   = require("../../../");
var util       = require("../../util");

var results = util.readSync([
  "./out.sql"
], __dirname);


describe("issue #15", function() {
  var tmpl;

  before(function() {
    return sqlStamp([__dirname+"/in.sql"], {})
      .then(function(_tmpl) {
        tmpl = _tmpl;
      });
  });

  it("should work", function() {
    var out = tmpl(__dirname+"/in.sql", {
      ids: [1, 2, 3]
    });

    assert.equal(out.args.length, 1);
    assert.deepEqual(out.args[0], [1, 2, 3]);
    assert.equal(out.sql, results["./out.sql"]);
  });
});
