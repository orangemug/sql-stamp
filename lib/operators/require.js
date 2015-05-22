var errors = require("../errors");

module.exports = {
  parse: function(path, dataKey) {
    // if(!this.templates.hasOwnProperty(path)) {
    //   throw new errors.NoSuchTemplate();
    // }
  },
  run: function(path, dataKey) {
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
