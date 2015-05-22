/**
 *
 */
module.exports = function(parts, ctx) {
  return parts
    .map(function(part, idx) {
      if(part.fn) {
        try {
          return part.fn(ctx);
        } catch(err) {
          // err.message += errors.generateTrace(parts, idx, 100);
          throw (err);
        }
      } else {
        return part.sql;
      }
    })
    .join("");
};
