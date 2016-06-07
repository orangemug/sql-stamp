var Bluebird = require("bluebird");
var path     = require("path");
var errors   = require("../errors");

module.exports = {
  parse: function(relFilepath, dataKey) {
    var filepath = path.resolve(path.dirname(this.path), relFilepath);

    if(!this.templates.hasOwnProperty(filepath)) {
      return Bluebird.props({
        template: this.recurse(filepath)
      });
    } else {
      return Bluebird.props({
        template: this.templates[filepath]
      });
    }
  },
  run: function(relFilepath, dataKey) {
    return this.parseArgs.template(
      dataKey ? this.data[dataKey] : this.data
    );
  }
};
