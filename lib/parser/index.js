var util      = require("../util");
var operators = require("../operators");

var runner = require("./runner");
var stack  = require("./stack");

function parseRule(parts, m, ln, opts) {
  var pre  = m[1];
  var raw  = m[2];
  var type = m[3];
  var args = m[4];
  var post = m[5];

  var operator = operators[type];
  var operatorArgs = args.split(",")
    .map(util.chomp)
    .map(util.removeQuotes);

  // Remove nulls
  operatorArgs = operatorArgs.filter(function(item) {
    return item !== "";
  });

  parts.push({sql: pre, ln: ln});

  parts.push({
    sql: raw,
    ln: ln,
    fn: function(ctx) {
      return operator.run.apply(ctx, operatorArgs);
    }
  });

  // Check the argument
  try {
    operator.parse.apply(null, operatorArgs);
  } catch(err) {
    if(opts.prettyErrors) {
      err.message += stack.trace(parts, parts.length-1, 100);
    }
    throw err;
  }

  parts.push({sql: post, ln: ln});
}

function parse(sqlRaw, opts) {
	sqlRaw = util.chomp(sqlRaw);

  var m, parts = [];
  var re = /([^}]*)(\{([>?!]?)([^}]*)\})([^{]*)/g;

  var sqlLines = sqlRaw.split("\n");
  sqlLines.forEach(function(sqlLine, idx) {
    if(idx < sqlLines.length-1) {
      sqlLine += "\n";
    }
    var match;
    while(m = re.exec(sqlLine)) {
      match = true;
      parseRule(parts, m, idx, opts);
    }
    if(!match) {
      parts.push({
        sql: sqlLine,
        ln: idx
      });
    }
  });

  return runner.bind(null, parts, opts);
}

module.exports = parse;
