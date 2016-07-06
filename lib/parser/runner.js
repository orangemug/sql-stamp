var stack = require("./stack");

/**
 * Compile SQL string from tokens
 * @param {Array} tokens    set of SQL fragment tokens to be compiled
 * @param {Object} opts     options for compilation [prettyErrors]
 * @param {Object} ctx      context to run compilation functions
 * @returns {Object} output sql and arguments
 */
module.exports = function(tokens, opts, ctx) {
  // The arguments which will be passed as `?` in the SQL.
  var args = [];

  // Iterate over the tokens producing SQL output
  var ret = tokens
    .map(function(part, idx) {
      if(part.fn) {
        try {
          var out = part.fn(ctx);
          if(out.args) {
            args  = args.concat(out.args);
          }
          return out.sql;
        } catch(err) {
          if(opts.prettyErrors) {
            err.message += stack.trace(tokens, {idx: idx}, 100);
          }
          throw (err);
        }
      } else {
        return part.sql;
      }
    })
    .join("");


  return {
    args: args,
    sql: ret
  };
};
