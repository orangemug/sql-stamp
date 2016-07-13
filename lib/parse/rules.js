module.exports = [
  "param": function(args, tokens) {
    if(args.length < 1) {
      throw new errors.TooFewArgs();
    } else if (args.length > 2) {
      throw new errors.TooManyArgs();
    }
  },
  "switch": function(args, tokens) {
    // Do nothing...
  },
  "raw": function(args, tokens) {
    // Do nothing...
  },
  "require": function(args, tokens) {
    var relFilepath = args[0];
    var filepath = path.resolve(path.dirname(this.path), relFilepath);
    this.addFile(filepath);
    return {
      filepath: filepath
    };
  },
  "whitespace": function(args, tokens) {
    // Do nothing...
  },
  "newline": function(args, tokens) {
    // Do nothing...
  },
  "sql": function(args, tokens) {
    // Do nothing...
  }
];
