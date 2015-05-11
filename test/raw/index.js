var assert = require("assert");
var fetchData = require("../util/fetch-data");
var sqlStamp = require("../../");

var data = fetchData({
  in: "/in.sql",
  out: "/out.sql"
}, __dirname);


describe("raw", function() {
  it("should work", function() {
    var out = sqlStamp(data.in, {
      filter: "foo"
    });

    assert.equal(out.args.length, 0);
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
    assert.equal(thrownErr, "Missing key 'filter'");
  });
});
