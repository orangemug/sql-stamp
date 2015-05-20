module.exports = {
  check: function(ctx, key, dflt) {
    if(!ctx.data.hasOwnProperty(key) && dflt === undefined) {
      throw "Missing key '"+key+"'";
    }
  },
  fn: function(ctx, key, replaceA, replaceB) {
    var out = "/*feature:"+key+"*/ ";
    if(ctx.data[key]) {
      out += replaceA || "true";
    } else {
      out += replaceB || "false";
    }
    return {
      text: out
    };
  }
};
