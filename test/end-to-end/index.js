var assert = require("assert");
var fetchData = require("../util/fetch-data");
var sqlStamp = require("../../");

var data = fetchData({
  example: "/example.sql",
  friends: "/friends.sql",
  result:  "/result.sql"
}, __dirname);


describe("end-to-end", function() {
  it("should work", function() {
    var out = sqlStamp(data.example, {
      accountId: 1,
      filterEnabled: true,
      filterKey: "role",
      filterVal: "dev"
    }, {
      "./friends.sql": data.friends
    });

    assert.equal(out.args.length, 2);
    assert.equal(out.args[0], 1);
    assert.equal(out.args[1], "dev");
    assert.equal(out.sql, data.result);
  });
});
