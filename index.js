function chomp(str) {
  return str
    .replace(/^\s*|\s*$/g, "");
}

function removeQuotes(str) {
  if(str === undefined) {
    return;
  }
  return str.replace(/^"|"$/g, "");
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
  function assertData(k, dflt) {
    if(!data.hasOwnProperty(k)) {
      if(dflt !== undefined) {
        data[k] = removeQuotes(dflt)
      } else {
        throw "Missing key '"+k+"'";
      }
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
    ">": function(path, dataKey) {
      var templateData;
      if(dataKey) {
        templateData = data[dataKey];
      } else {
        templateData = data;
      }

      // Recurse
      var template = templates[path];
      var ret = sqlStamp(template, templateData, templates);

      // Add args in
      args.push.apply(args, ret.args);
      return ret.sql;
    },
    "?": function(key, replaceA, replaceB) {
      var out = "/*feature:"+key+"*/ ";
      if(data[key]) {
        out += removeQuotes(replaceA) || "true";
      } else {
        out += removeQuotes(replaceB) || "false";
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
    var fnArgs = RegExp.$2.split(",").map(chomp);

    if(operators[type]) {
      if(checks[type]) {
        checks[type].apply(null, fnArgs);
      }
      return operators[type].apply(null, fnArgs);
    }
  });

  return {
    sql: sql,
    args: args
  };
}

module.exports = sqlStamp;
