var assert     = require("assert");
var Bluebird   = require("bluebird");
var sqlStamp   = require("../../../");
var util       = require("../../util");
var path       = require("path");


var results = util.readSync([
  "./out.sql"
], __dirname);

describe("require", function() {
  var tmpl1, tmpl2;

  before(function() {
    var t1 = sqlStamp([__dirname+"/in.sql"])
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
      user:{
        id: 5,
        role: "admin"
      }
    });

    assert.equal(out.args.length, 5);
    assert.equal(out.args[0], "5");
    assert.equal(out.args[1], "5");
    assert.equal(out.args[2], "5");
    assert.equal(out.args[3], "5");
    assert.equal(out.args[4], "admin");
    assert.equal(out.sql, results["./out.sql"]);
  });

  it("should allow complex paths", function() {
    var out = tmpl1(__dirname+"/../../../test/operators/require/in.sql", {
      user: {
        id: 5
      }
    });

    assert.equal(out.args.length, 3);
    assert.equal(out.args[0], "5");
    assert.equal(out.args[1], "5");
    assert.equal(out.args[2], "5");
    assert.equal(out.sql, results["./out.sql"]);
  });

  it("should throw error on missing template", function() {
    var thrownErr;

    try {
      tmpl2(__dirname+"/in_missing.sql", {});
    } catch(err) {
      thrownErr = err;
    }

    var errorPath = path.resolve(
      path.join(__dirname, "in_missing.sql")
    );

    assert(thrownErr);
    assert.equal(thrownErr.message, "No such template '"+errorPath+"'");
  });
});
