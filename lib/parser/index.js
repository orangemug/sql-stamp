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

  // Split into lines so we can report line numbers in errors
  var sqlLines = sqlRaw.split("\n");

  // Parse each line, saving the line number
  sqlLines.forEach(function(sqlLine, ln) {
    // Add back in the new lines...bit lame
    if(ln < sqlLines.length-1) {
      sqlLine += "\n";
    }

    var match;
    while(m = re.exec(sqlLine)) {
      match = true;
      parseRule(parts, m, ln, opts);
    }

    // If we didn't match just append the line
    if(!match) {
      parts.push({
        sql: sqlLine,
        ln: ln
      });
    }
  });

  return runner.bind(null, parts, opts);
}

module.exports = parse;
