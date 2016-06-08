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
    if(dataKey) {
      var parts = dataKey.split(/\s*,\s*/);
      var out = {};

      parts.forEach(function(part) {
        /*
         * {>./template userPost:post}
         *
         * `post` gets passed as `userPost`
         */
        if(part.match(/^(\S+):(\S+)$/)) {
          var keyRename = RegExp.$1;
          var key       = RegExp.$2;
          out[keyRename] = this.data[key];
        }
        /*
         * {>./template post}
         *
         * Spread operator `post` values get passed through
         */
        else if(part.match(/^\.\.\.(\S+)$/)) {
          var key = RegExp.$1;
          out = Object.assign({}, out, this.data[key]);
        }
        /*
         * {>./template post}
         *
         * `post`gets passed as `post`
         */
        else {
          out[part] = this.data[part];
        }
      }, this);

      return this.parseArgs.template(out);
    }
    else {
      return this.parseArgs.template(this.data);
    }
  }
};
