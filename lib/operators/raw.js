module.exports = {
  check: function(ctx, key, dflt) {
    if(!ctx.data.hasOwnProperty(key) && dflt === undefined) {
      throw "Missing key '"+key+"'";
    }
  },
  fn: function(ctx, key, dflt) {
    if(ctx.data.hasOwnProperty(key)) {
      return {
        text: ctx.data[key]
      };
    } else {
      return {
        text: dflt
      };
    }
  }
};
