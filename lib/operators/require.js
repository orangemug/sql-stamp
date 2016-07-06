var assign    = require("lodash.assign");
var Bluebird  = require("bluebird");
var objByPath = require("obj-by-path");
var path      = require("path");

module.exports = {
  parse: function(relFilepath) {
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
  run: function(relFilepath) {
    // This command accepts multiple args
    if(arguments.length > 1) {
      var out = {};

      for(var i = 1; i<arguments.length; i++) {
        var part = arguments[i];
        /*
         * {>./template userPost:post}
         *
         * `post` gets passed as `userPost`
         */
        if(part.match(/^\s*([\S\.]+)\s*:\s*([\S\.]+)\s*$/)) {
          var keyRename = RegExp.$1;
          var keyOrig   = RegExp.$2;

          out[keyRename] = objByPath(this.data, keyOrig.split("."));
        }
        /*
         * {>./template post}
         *
         * Spread operator `post` values get passed through
         */
        else if(part.match(/^\.\.\.([\S\.]+)$/)) {
          var key = RegExp.$1;
          out = assign({}, out, this.data[key]);
        }
        /*
         * {>./template post}
         *
         * `post`gets passed as `post`
         */
        else {
          var keyPath = part.split(".");
          out[keyPath[keyPath.length-1]] = objByPath(this.data, keyPath);
        }
      }

      return this.parseArgs.template(out);
    }
    else {
      return this.parseArgs.template(this.data);
    }
  }
};
