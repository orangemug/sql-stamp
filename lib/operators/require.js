var path   = require("path");
var errors = require("../errors");

function getIndent(num) {
  var out = "";
  for(var i=0; i<num; i++) {
    out += " ";
  }
  return out;
}

module.exports = {
  parse: function(path, dataKey) {
  },
  run: function(relFilepath, dataKey) {
    var filepath = path.resolve(path.dirname(this.path), relFilepath);

    // TODO: This should be a parse error
    if(!this.templates.hasOwnProperty(filepath)) {
      throw new errors.NoSuchTemplate(relFilepath);
    }

    var templateData;
    if(dataKey) {
      templateData = this.data[dataKey];
    } else {
      templateData = this.data;
    }

    // Recurse
    var out = this.self(filepath, templateData);
    out.sql = out.sql.replace(/^/, getIndent(this.indent));
    this.args = this.args.concat(out.args);
    return out.sql;
  }
};
