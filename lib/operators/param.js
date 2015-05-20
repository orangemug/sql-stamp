module.exports = {
  check: function(ctx, key, dflt) {
    if(!ctx.data.hasOwnProperty(key) && dflt === undefined) {
      throw "Missing key '"+key+"'";
    }
  },
  fn: function(ctx, key, dflt) {
    var args;
    if(ctx.data.hasOwnProperty(key)) {
      args = ctx.data[key];
    } else {
      args = dflt;
    }

    return {
      text: "?",
      args: args
    };
  }
}
