var rules = require("./rules");


module.exports = function(tokens) {
  return tokens
    .map(function(token) {
      rules[token.token](token.args, tokens);
    })
}
