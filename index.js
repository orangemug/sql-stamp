var util      = require("./lib/util");
var operators = require("./lib/operators");


function getBody(fn) {
  var regex = /^function[ ]*[^(]*\(([^)]*)\)[ ]*{((?:[\n\r]|.)*)}$/;
  var matches = fn.toString().match(regex);

  return {
    args: matches[1].split(",").map(util.chomp),
    body: matches[2]
  }
}


function runner(template, ctx) {
  return template
    .map(function(part, idx) {
      if(part.fn) {
        return part.fn(ctx);
      } else {
        return part.sql;
      }
    })
    .join("");
}

function genTemplateFn(sqlRaw, templates) {
  var parts = [];
  var out = sqlRaw.replace(/([^}]*)(?:\{([>?!]?)([^}]*)\})([^{]*)/g, function(match, pre, type, args, post, offset) {
    var operatorArgs = args.split(",")
      .map(util.chomp)
      .map(util.removeQuotes);

    parts.push({sql: pre});

    parts.push({
      sql: "{}",
      fn: function(ctx) {
        return operators[type](ctx, operatorArgs);
      }
    });

    parts.push({sql: post});
  })

  var fnBody = getBody(runner)
  var fn = new Function(fnBody.args, fnBody.body).bind(null, parts);
  return fn;
}

function sqlStamp(_templates) {
  var templates = {};
  for(key in _templates) {
    var template = _templates[key];
    var fn = genTemplateFn(util.chomp(template));
    templates[util.chomp(key)] = fn;
  }

  return function hdl(key, data) {
    key  = util.chomp(key);
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
