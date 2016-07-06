var regex      = require("../../lib/parser/regex");
var assert     = require("assert");

describe("parser/regex", function () {

  it("should parse {>foo}", function () {
    var test1 = "{>foo}";
    var results = regex.re().exec(test1);
    assert.equal(results[1], test1);
    assert.equal(results[2], ">");
    assert.equal(results[3], "foo");
  });

  it("should parse {=foo}", function () {
    var test2 = "{=foo}";
    var results = regex.re().exec(test2);
    assert.equal(results[1], test2);
    assert.equal(results[2], "=");
    assert.equal(results[3], "foo");
  });

  it("should parse {!foo}", function () {
    var test4 = "{!foo}";
    var results = regex.re().exec(test4);
    assert.equal(results[1], test4);
    assert.equal(results[2], "!");
    assert.equal(results[3], "foo");
  });

  it("should parse {{=foo}}", function () {
    var test3 = "{=foo}";
    var results = regex.re().exec(test3);
    assert.equal(results[1], test3);
    assert.equal(results[2], "=");
    assert.equal(results[3], "foo");
  });

  it("should handle SQL `WHERE fish = 'false'`", function () {
    var test4 = "WHERE fish = 'false'";
    var results = regex.re().exec(test4);
    assert.equal(results[5], test4);
  });

  it("should handle SQL `WHERE fish = IN({'cod', 'hake'})`", function () {
    var test5 = "WHERE fish = IN({'cod', 'hake'})";
    var re = regex.re();

    // Match in parts
    var result1 = re.exec(test5);
    assert.equal(result1[5], "WHERE fish = IN(");
    var result2 = re.exec(test5);
    assert.equal(result2[5], "{'cod', 'hake'");
    var result3 = re.exec(test5);
    assert.equal(result3[5], "})");
  });
});
