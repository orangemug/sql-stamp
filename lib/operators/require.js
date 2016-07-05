var path     = require("path");
var errors   = require("../errors");

module.exports = {
  parse: function(relFilepath, dataKey) {
    var filepath = path.resolve(path.dirname(this.path), relFilepath);

    if(!this.templates.hasOwnProperty(filepath)) {
      return {
        template: this.recurse(filepath)
      };
    } else {
      return {
        template: this.templates[filepath]
      };
    }
  },
  run: function(relFilepath, dataKey) {
    return this.parseArgs.template(
      dataKey ? this.data[dataKey] : this.data
    );
  }
};
