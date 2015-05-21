var util      = require("./lib/util");
var operators = require("./lib/operators");


function genTemplateFn(sqlRaw, templates) {
  var out = sqlRaw.replace(/([^}]*)(?:\{([>?!]?)([^}]*)\})([^{]*)/g, function(match, pre, type, args, post, offset) {
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
  return fn.bind(null, operators);
}

function sqlStamp(_templates) {
  var templates = {};
  for(key in _templates) {
    var template = _templates[key];
    var fn = genTemplateFn(template);
    templates[util.chomp(key)] = fn;
  }

  return function hdl(key, data) {
    key = util.chomp(key);
    data = data || {};

    var ctx = {
      self: hdl,
      templates: templates,
      data: data,
      args: []
    };

    return {
      sql: templates[key](ctx),
      args: ctx.args
    };
  }
}


module.exports = sqlStamp;
