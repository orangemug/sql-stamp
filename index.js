function sqlStamp(sqlTemplate, data, templates) {
  var args = [];
  data = data || {};
  templates = templates || {};

  var sql = sqlTemplate.replace(/{[^}]+}/g, function(item) {
    var isRaw;
    var k = item.slice(1, -1);

    if(k.match(/^>/)) {
      k = k.slice(1).replace(/^\s*|\s*$/g, "");
      if(!templates.hasOwnProperty(k)) {
        throw "No such template '"+k+"'";
      }

      var tmpl = templates[k].replace(/^\s*|\s*$/g, "");

      // Recurse
      var ret = sqlStamp(tmpl, data, templates);

      // Add args in
      args = args.concat(ret.args);
      return ret.sql;
    }

    if(k.match(/^\?/)) {
      k = k.slice(1);
      if(data[k]) {
        return "true";
      } else {
        return "false";
      }
    }

    if(k.match(/^\!/)) {
      k = k.slice(1);
      isRaw = true;
    }

    if(!data.hasOwnProperty(k)) {
      throw "Missing key '"+k+"'";
    }

    if(isRaw) {
      return data[k];
    } else {
      args.push(data[k]);
      return "?";
    }
  });

  return {
    sql: sql,
    args: args
  };
}

module.exports = sqlStamp;
