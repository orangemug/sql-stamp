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
    var test4 = "{!foo}"
    var results = regex.re().exec(test4);
    assert.equal(results[1], test4);
    assert.equal(results[2], "!");
    assert.equal(results[3], "foo");
  });

  it("should parse {{=foo}}", function () {
    var test3 = "{=foo}"
    var results = regex.re().exec(test3);
    assert.equal(results[1], test3);
    assert.equal(results[2], "=");
    assert.equal(results[3], "foo");
  });

});
