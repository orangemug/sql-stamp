var assert = require("assert");
var fetchData = require("../util/fetch-data");
var sqlStamp = require("../../");

var data = fetchData({
  in: "/in.sql",
  outFalsey: "/out.falsey.sql",
  outTruthy: "/out.truthy.sql"
}, __dirname);


describe("feature", function() {
  it("should enable on truthy", function() {
    var out = sqlStamp(data.in, {
      searchDisabled: false
    });

    assert.equal(out.args.length, 0);
    assert.equal(out.sql, data.outTruthy);
  });

  it("should enable on falsey", function() {
    var out = sqlStamp(data.in, {
      searchDisabled: true
    });

    assert.equal(out.args.length, 0);
    assert.equal(out.sql, data.outFalsey);
  });
});
