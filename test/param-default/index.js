var assert = require("assert");
var fetchData = require("../util/fetch-data");
var sqlStamp = require("../../");

var data = fetchData({
  in: "/in.sql",
  out: "/out.sql"
}, __dirname);


describe("param-default", function() {
  it("should work", function() {
    var out = sqlStamp(data.in, {
      name: "orangemug",
      role: "dev"
    });

    assert.equal(out.args.length, 3);
    assert.equal(out.args[0], "orangemug");
    assert.equal(out.args[1], "dev");
    assert.equal(out.args[2], "orangemug");
    assert.equal(out.sql, data.out);
  });

  it("should work with defaults", function() {
    var out = sqlStamp(data.in, {
      name: "orangemug"
    });

    assert.equal(out.args.length, 3);
    assert.equal(out.args[0], "orangemug");
    assert.equal(out.args[1], "manager");
    assert.equal(out.args[2], "orangemug");
    assert.equal(out.sql, data.out);
  });

  it("should throw error on missing key", function() {
    var thrownErr;

    try {
      sqlStamp(data.in, {});
    } catch(err) {
      thrownErr = err;
    }

    assert(thrownErr);
    assert.equal(thrownErr, "Missing key 'name'");
  });
});
