function chomp(str) {
  return str.replace(/^\s*|\s*$/g, "");
}

function sqlStamp(sqlTemplate, data, _templates) {
  var args = [];
  var templates = {};
  data = data || {};

  // Clean our templates
  if(_templates) {
    Object.keys(_templates).forEach(function(key) {
      templates[key] = chomp(_templates[key]);
    });
  }

  // Helper assertions
  function assertData(k) {
    if(!data.hasOwnProperty(k)) {
      throw "Missing key '"+k+"'";
    }
  }

  function assertTemplate(key) {
    if(!templates.hasOwnProperty(key)) {
      throw "No such template '"+key+"'";
    }
  }

  // Validations
  var checks = {
    "?": assertData,
    "!": assertData,
    ">": assertTemplate,
    "default": assertData
  };

  // Operations
  var operators = {
    ">": function(key) {
      // Recurse
      var template = templates[key];
      var ret = sqlStamp(template, data, templates);

      // Add args in
      args.push.apply(args, ret.args);
      return ret.sql;
    },
    "?": function(key) {
      var out = "/*filter:"+key+"*/ "
      if(data[key]) {
        out += "true";
      } else {
        out += "false";
      }
      return out;
    },
    "!": function(key) {
      return data[key];
    },
    "default": function(key) {
      args.push(data[key]);
      return "?";
    }
  };

  var sql = sqlTemplate.replace(/{([>?!]?)([^}]+)}/g, function() {
    // Check for operator
    var type = RegExp.$1 || "default";
    var key  = chomp(RegExp.$2);

    if(operators[type]) {
      if(checks[type]) {
        checks[type](key);
      }
      return operators[type](key);
    }
  });

  return {
    sql: sql,
    args: args
  };
}

module.exports = sqlStamp;
