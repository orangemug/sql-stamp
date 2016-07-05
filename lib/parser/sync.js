var errors      = require("../errors");
var fs          = require("fs");
var operators   = require("../operators");
var parserRegex = require("./regex");
var runner      = require("./runner");
var stack       = require("./stack");
var util        = require("../util");

function parseRuleSync(templates, filepath, raw, type, args, indent, ln, opts) {
  var operator = operators[type];
  var operatorArgs = args.split(",")
    .map(util.chomp)
    .map(util.removeQuotes)
    .filter(util.removeEmpty);

  var _args;
  // Operator
  if(operator.parse) {
    _args = operator.parse.apply({
      templates: templates,
      recurse: function(filepath) {
        var data = parseSync(filepath, templates, opts);
        // As a cache so we don't need to parse twice
        templates[filepath] = data;
        return data;
      },
      path: filepath
    }, operatorArgs);
  }

  return {
    sql: raw,
    ln: ln,
    fn: function(ctx) {
      var out = operator.run.apply({templates: templates, data: ctx, parseArgs: _args}, operatorArgs);

      // TODO: Nasty
      out.sql = out.sql.split("\n").map(function(line, idx) {
        if(idx > 0) {
          return indent + line;
        } else {
          return line;
        }
      }).join("\n");
      return out;
    }
  };
}

function parseSync(filepath, templates, opts) {
  try {
    var sqlRaw = util.chomp(
      fs.readFileSync(filepath)
    );

    var tokens = [];
    var errStack = [];
    var indent = "";
    var foundChar = false;

    var ln = 0;

    var re = parserRegex.re();
    var posMap = parserRegex.posMap;

    var idx = -1;
    var m;

    while(m = re.exec(sqlRaw)) {
      idx++;
      if(!foundChar && m[0].match(/^\s*$/m)) {
        indent += m[0];
      } else {
        foundChar = true;
      }

      if(m[posMap.sql]) {
        tokens.push({
          sql: m[posMap.sql],
          ln: ln,
          idx: idx
        });
      } else if(m[posMap.cmd]) {
        var _m = m;
        var _ln = ln;
        var _idx = idx;

        if(m[posMap.cmdType].match(/^[=!>?]/)) {

          try {
            var token = parseRuleSync(templates, filepath, m[posMap.cmd], m[posMap.cmdType], m[posMap.cmdArgs], indent, ln, opts)
            tokens.push(token);
          } catch (err) {
            errStack.push({
              indent: indent,
              idx: _idx,
              err: err
            });

            tokens.push({
              ln: _ln,
              sql: _m[0],
              idx: _idx
            });
          }
        } else {
          tokens.push({
            sql: m[posMap.cmd],
            ln: ln,
            idx: idx
          });
        }

      } else if(m[posMap.nl]) {
        tokens.push({
          sql: m[posMap.nl],
          ln: ln,
          idx: idx
        });
        indent = "";
        foundChar = false;
        ln++;
      }
    }

    if(errStack.length > 0) {
      // TODO: Should be tracing all errStack here...
      throw errStack[0].err + stack.trace(tokens, errStack[0], 100);
    }

    // Return a template runner
    var ret = runner.bind(null, tokens, opts);
    return ret;

  } catch (err) {
    if(err.code === "ENOENT") {
     throw new errors.SQLError("No such template '"+filepath+"'");
    }
    throw err;
  }
}

module.exports = parseSync;
