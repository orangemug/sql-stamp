var util = require("./lib/util");
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
    data: data
  };

  var sql = sqlTemplate.replace(/{([>?!]?)([^}]+)}/g, function() {
    // Check for operator
    var type   = RegExp.$1;
    var operatorArgs = RegExp.$2.split(",")
      .map(util.chomp)
      .map(util.removeQuotes);

    var fnArgs = [ctx].concat(operatorArgs);
    var operator = operators[type];

    if(operator) {
      operator.check.apply(null, fnArgs);

      var out = operator.fn.apply(null, fnArgs);
      if(out.args) {
        if(Array.isArray(out.args)) {
          args.push.apply(args, out.args);
        } else {
          args.push(out.args);
        }
      }
      return out.text;
    } else {
      throw "Invalid operator";
    }
  });

  return {
    sql: sql,
    args: args
  };
}

module.exports = sqlStamp;
