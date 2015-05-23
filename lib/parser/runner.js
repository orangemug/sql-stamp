var stack = require("./stack");

/**
 *
 */
module.exports = function(parts, opts, ctx) {
  return parts
    .map(function(part, idx) {
      if(part.fn) {
        try {
          return part.fn(ctx);
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
};
