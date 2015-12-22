var Bluebird  = require("bluebird");
var util      = require("../util");
var operators = require("../operators");
var runner    = require("./runner");
var stack     = require("./stack");

var fs = Bluebird.promisifyAll(
  require("fs")
);


function parseRule(templates, filepath, raw, type, args, ln, opts) {
  var operator = operators[type];
  var operatorArgs = args.split(",")
    .map(util.chomp)
    .map(util.removeQuotes)
    .filter(util.removeEmpty);

  // Operator
  return Bluebird.resolve()
    .then(function() {
      if(operator.parse) {
        return operator.parse.apply({
          templates: templates,
          recurse: function(filepath) {
            return parse(filepath, templates, opts)
              .then(function(data) {
                // As a cache so we don't need to parse twice
                templates[filepath] = data;
                return data;
              });
          },
          path: filepath
        }, operatorArgs)
      }
    })
    .then(function(_args) {
      return {
        sql: raw,
        ln: ln,
        fn: function(ctx) {
          // ctx.indent = indent;
          return operator.run.apply({templates: templates, data: ctx, parseArgs: _args}, operatorArgs);
        }
      };
    });
}

function parse(filepath, templates, opts) {
  return fs.readFileAsync(filepath)
    .then(util.chomp)
    .then(function(sqlRaw) {
      var tasks = [];
      var errors = [];

      var re = /([^}{\n]+)|(\{([>?!]?)([^}]*)\})|([\n])/g;
      var ln = 0;

      var posMap = {
        sql: 1,
        cmd: 2,
        cmdType: 3,
        cmdArgs: 4,
        nl: 5
      };

      while(m = re.exec(sqlRaw)) {
        if(m[posMap.sql]) {
          tasks.push({sql: m[posMap.sql], ln: ln});
        } else if(m[posMap.cmd]) {
          tasks.push(
            parseRule(templates, filepath, m[posMap.cmd], m[posMap.cmdType], m[posMap.cmdArgs], ln, opts)
              .catch(function(err) {
                errors.push({
                  ln: ln,
                  err: err
                });
              })
          );
        } else if(m[posMap.nl]) {
          tasks.push({sql: m[posMap.nl], ln: ln});
          ln++;
        }
      }

      return Bluebird.all(tasks).then(function(parts) {
        if(errors.length > 0) {
          // TODO: Should be tracing all errors here...
          throw errors[0].err + stack.trace(parts, errors[0].ln, 100);
        }

        // Return a template runner
        var ret = runner.bind(null, parts, opts);
        return ret;
      });
    });
}

module.exports = parse;
