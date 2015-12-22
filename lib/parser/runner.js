var stack = require("./stack");

/**
 *
 */
module.exports = function(parts, opts, ctx) {
  var args = [];
  var ret = parts
    .map(function(part, idx) {
      if(part.fn) {
        try {
          var out = part.fn(ctx);
          if(out.args) {
            args = args.concat(out.args);
          }
          return out.sql;
        } catch(err) {
          if(opts.prettyErrors) {
            err.message += stack.trace(parts, idx, 100);
          }
          throw (err);
        }
      } else {
        return part.sql;
      }
    })
    .join("");


  var ret = {
    args: args,
    sql: ret
  };

  return ret;
};
