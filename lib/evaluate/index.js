var rules = require("./rules");

module.exports = function(tokens) {
  var out = "";
  tokens.forEach(function(token) {
    out += rules[token.rule.token](token.args);
  });
  return out;
}
