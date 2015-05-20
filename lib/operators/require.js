module.exports = {
  check: function(ctx, key) {
    if(!ctx.templates.hasOwnProperty(key)) {
      throw "No such template '"+key+"'";
    }
  },
  fn: function(ctx, path, dataKey) {
    var templateData;
    if(dataKey) {
      templateData = ctx.data[dataKey];
    } else {
      templateData = ctx.data;
    }

    // Recurse
    var template = ctx.templates[path];
    var ret = ctx.self(template, templateData, ctx.templates);

    // Add args in
    return {
      args: ret.args,
      text: ret.sql
    };
  }
};
