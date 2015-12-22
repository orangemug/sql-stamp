var errors = require("../errors");

module.exports = {
  parse: function(key, dflt) {
    if(arguments.length < 1) {
      throw new errors.TooFewArgs();
    } else if (arguments.length > 2) {
      throw new errors.TooManyArgs();
    }
  },
  run: function(key, dflt) {
    var arg;
    if(!this.data.hasOwnProperty(key) && dflt === undefined) {
      throw new errors.MissingKey(key);
    }

    if(this.data.hasOwnProperty(key)) {
      arg = this.data[key];
    } else {
      arg = dflt;
    }

    return {
      args: [arg],
      sql: "?"
    };
  }
}
