var Bluebird    = require("bluebird");
var errors      = require("../errors");
var operators   = require("../operators");
var parserRegex = require("./regex");
var runner      = require("./runner");
var stack       = require("./stack");
var util        = require("../util");

var fs = Bluebird.promisifyAll(
  require("fs")
);


function parseRule(templates, filepath, raw, type, args, indent, ln, opts) {
  var operator = operators[type];
  var operatorArgs = args.split(",")
    .map(util.chomp)
    .map(util.removeQuotes)
    .filter(util.removeEmpty);

  // Operator
  return Bluebird.resolve()
    .then(function() {
      if(operator.parse) {
        var obj = operator.parse.apply({
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
        }, operatorArgs);

        if (obj) {
          return Bluebird.props(obj);
        }
      }
    })
    .then(function(_args) {
      return {
        sql: raw,
        ln: ln,
        fn: function(ctx) {
          var out = operator.run.apply({templates: templates, data: ctx, parseArgs: _args}, operatorArgs);

          // TODO: Nasty
          out.sql = String(out.sql).split("\n").map(function(line, idx) {
            if(idx > 0) {
              return indent + line;
            } else {
              return line;
            }
          }).join("\n");
          return out;
        }
      };
    });
}

function parse(filepath, templates, opts) {
  return fs.readFileAsync(filepath)
    .catch(function(err) {
      if(err.code === "ENOENT") {
       throw new errors.SQLError("No such template '"+filepath+"'");
      }
    })
    .then(util.chomp)
    .then(function(sqlRaw) {
      var tasks = [];
      var errStack = [];
      var indent = "";
      var foundChar = false;

      var re = parserRegex.re();
      var ln = 0;

      var posMap = parserRegex.posMap;

      var idx = -1;
      var m;

      /**
       * The regexp will always match something and RegExp#exec allow us to find successive matches
       *
       * See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#Finding_successive_matches>
       */
      while(m = re.exec(sqlRaw)) {
        idx++;
        if(!foundChar && m[0].match(/^\s*$/m)) {
          indent += m[0];
        } else {
          foundChar = true;
        }

        if(m[posMap.sql]) {
          tasks.push({
            sql: m[posMap.sql],
            ln: ln,
            idx: idx
          });
        } else if(m[posMap.cmd]) {
          var _m = m;
          var _ln = ln;
          var _idx = idx;

          tasks.push(
            parseRule(templates, filepath, m[posMap.cmd], m[posMap.cmdType], m[posMap.cmdArgs], indent, ln, opts)
              .catch(function(err) {
                errStack.push({
                  indent: indent,
                  idx: _idx,
                  err: err
                });

                return {
                  ln: _ln,
                  sql: _m[0],
                  idx: _idx
                };
              })

          );

        } else if(m[posMap.nl]) {
          tasks.push({
            sql: m[posMap.nl], ln: ln, idx: idx
          });
          indent = "";
          foundChar = false;
          ln++;
        }
      }

      return Bluebird.all(tasks).then(function(tokens) {
        if(errStack.length > 0) {
          // TODO: Should be tracing all errStack here...
          throw errStack[0].err + stack.trace(tokens, errStack[0], 100);
        }

        // Return a template runner
        var ret = runner.bind(null, tokens, opts);
        return ret;
      });
    });
}

module.exports = parse;
