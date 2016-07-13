module.exports = [
  "param": function(args, tokens) {
    var arg;
    var key  = args[0];
    var dflt = args[1];

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
  },
  "switch": function(args, tokens) {
    var key      = args[0];
    var replaceA = args[1]
    var replaceB = args[1]

    if(!this.data.hasOwnProperty(key)) {
      throw "Missing key '"+key+"'";
    }

    var out = "/*feature:"+key+"*/ ";
    if(this.data[key]) {
      out += replaceA || "1";
    } else {
      out += replaceB || "0";
    }
    return {sql: out};
  },
  "raw": function(args, tokens) {
    var key  = args[0];
    var dflt = args[1];

    var out;
    if(!this.data.hasOwnProperty(key) && dflt === undefined) {
      throw "Missing key '"+key+"'";
    }

    if(this.data.hasOwnProperty(key)) {
      out = this.data[key];
    } else {
      out = dflt;
    }

    return {
      sql: out
    };
  },
  "require": function(args, tokens) {
    var relFilepath = args[0];

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

      return this.getTemplate(this.parseArgs.template)(out);
    }
    else {
      return this.getTemplate(this.parseArgs.template)(this.data);
    }
  },
  "whitespace": function(args, tokens) {
    return args[0];
    // Do nothing...
  },
  "newline": function(args, tokens) {
    // Do nothing...
    return args[0];
  },
  "sql": function(args, tokens) {
    // Do nothing...
    return args[0];
  }
];
