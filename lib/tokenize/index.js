var rules = require("./rules");


function lexerRulesToMap(rules) {
  var regexpMap = [];
  var count = 1;
  var regexp = rules
    .map(function(rule) {
      for(var i=0; i<rule.groups; i++) {
        regexpMap[count] = rule;
        count++;
      }
      return rule.regexp;
    })
    .join("|");

  return {
    regexp: new RegExp(regexp, "gm"),
    handler: function(matches) {
      for(var i=1; i<matches.length; i++) {
        if(matches[i] === undefined) {
          continue;
        }
        var rule = regexpMap[i];
        return {
          rule: rule,
          args: matches.slice(i, i+rule.groups)
        };
      }
    }
  }
}

var lexer = lexerRulesToMap(rules);

module.exports = function(files, opts) {
  var promises = [];
  var out = {};
  opts = opts || {};

  function readFile(filepath, fn) {
    if(opts.async) {
      promises.push(
        new Promise(function(resolve, reject) {
          fs.readFile(filepath, function() {
            if(err) {
              reject(err);
            }
            else {
              resolve(data.toString())
            }
          })
        })
      );
    }
    else {
      var str = fs.readFileSync(filepath).toString();
      fn(str);
    }
  }

  function lexerFn(filepath, str) {
    var matches;
    var tokens = [];

    var ctx = {
      addFile: function(filepath) {
        files.push(filepath);
      }
    }


    while(matches = lexer.regexp.exec(str)) {
      console.log(matches);
      tokens.push(
        lexer.handler.call(ctx, matches)
      );
    }

    out[filepath] = tokens;
  }

  files.forEach(function(filepath) {
    readFile(filepath, lexerFn.bind(null, filepath))
  });

  if(opts.async) {
    return Promise.series(promises)
      .then(function() {
        return out;
      })
  }
  else {
    return out;
  }
}
