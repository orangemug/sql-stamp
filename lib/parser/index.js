var Bluebird  = require("bluebird");
var util      = require("../util");
var operators = require("../operators");

var runner = require("./runner");
var stack  = require("./stack");

function parseRule(tasks, errors, m, ln, opts) {
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

  tasks.push(
    Bluebird.resolve({sql: pre, ln: ln})
  );

  var idx = tasks.length;
  var indent = 0;
  if(pre.match(/^[ ]+$/)) {
    indent = pre.length;
  }

  tasks.push(Bluebird.resolve()
    .then(function(parts) {
      return operator.parse.apply(null, operatorArgs);
    })
    .catch(function(message) {
      errors.push({
        idx: idx,
        message: message
      });
    })
    .then(function(_args) {
      return {
        sql: raw,
        ln: ln,
        fn: function(ctx) {
          ctx.indent = indent;
          return operator.run.apply(ctx, operatorArgs, _args);
        }
      };
    })
  );


  tasks.push(
    Bluebird.resolve({sql: post, ln: ln})
  );
}

function parse(sqlRaw, opts) {
  sqlRaw = util.chomp(sqlRaw);

  var m;
  var re = /([^}]*)(\{([>?!]?)([^}]*)\})([^{]*)/g;

  // Split into lines so we can report line numbers in errors
  var sqlLines = sqlRaw.split("\n");
  var tasks = [];
  var errors = [];

  // Parse each line, saving the line number
  sqlLines.forEach(function(sqlLine, ln) {
    // Add back in the new lines...bit lame
    if(ln < sqlLines.length-1) {
      sqlLine += "\n";
    }

    var match = false;
    while(m = re.exec(sqlLine)) {
      match = true;
      parseRule(tasks, errors, m, ln, opts)
    }

    if(!match) {
      tasks.push(Bluebird.resolve({
        sql: sqlLine,
        ln: ln
      }));
    }
  });

  return Bluebird.all(tasks).then(function(out) {
    if(errors.length > 0) {
      // HACK
      var err = errors[0];
      var message = err.message;
      message += stack.trace(out, err.idx, 100);
      throw message;
    }

    return runner.bind(null, out, opts);
  });
}

module.exports = parse;
