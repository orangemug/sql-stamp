var util      = require("./lib/util");
var operators = require("./lib/operators");


function sqlStamp(sqlTemplate, data, _templates) {
  var args = [];
  var templates = {};
  data = data || {};

  // Clean our templates
  if(_templates) {
    Object.keys(_templates).forEach(function(key) {
      templates[key] = util.chomp(_templates[key]);
    });
  }

  var ctx = {
    self: sqlStamp,
    templates: templates,
    data: data,
    args: []
  };

  var out = sqlTemplate.replace(/([^}]*)(?:\{([>?!]?)([^}]*)\})([^{]*)/g, function(match, pre, type, args, post, offset) {
    var operatorArgs = args.split(",")
      .map(util.chomp)
      .map(util.removeQuotes);

    pre  = util.escapeString(pre);
    post = util.escapeString(post);

    var out;
    if(offset > 0) {
      out = "+";    
    } else {
      out = "return ";
    }
    out += "\""+pre+"\"";
    
    out += "+operators[\""+type+"\"](ctx, "+operatorArgs.map(util.addQuotes).join(",")+")";
    out += "+\""+post+"\"";
    return out;
  })

  var fn = new Function("operators", "ctx", "data", out);
  var boundFn = fn.bind(null, operators, ctx);
  var ret = boundFn();

  return {
    sql: ret,
    args: ctx.args
  };
}

module.exports = sqlStamp;
