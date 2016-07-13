var tokenize = require("./lib/tokenize");
var parse    = require("./lib/parse");
var evaluate = require("./lib/evaluate");


// TODO: Add done callback
function compile(files) {
  return tokenize(files, {async: true})
    .then(function(tokenizedFiles){
      var parsedFiles = parse(tokenizedFiles);
      return function(filepath, args) {
        return evaluate(parsedFiles[filepath])(args);
      }
    });
}

compile.sync = function(files) {
  var tokenizedFiles = tokenize(files, {async: false});
  var parsedFiles = parse(tokenizedFiles);
  return function(filepath, args) {
    return evaluate(parsedFiles[filepath])(args);
  }
}

module.exports = compile;
