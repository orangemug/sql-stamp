var errors = require("../errors");

module.exports = {
  parse: function(path, dataKey) {
  },
  run: function(path, dataKey) {
    // TODO: This should be a parse error
    if(!this.templates.hasOwnProperty(path)) {
      throw new errors.NoSuchTemplate(path);
    }

    var templateData;
    if(dataKey) {
      templateData = this.data[dataKey];
    } else {
      templateData = this.data;
    }

    // Recurse
    var out = this.self(path, templateData);
    this.args = this.args.concat(out.args);
    return out.sql;
  }
};
