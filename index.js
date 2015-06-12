var fs       = require("fs");
var path     = require("path");
var Bluebird = require("bluebird");
var util     = require("./lib/util");
var parser   = require("./lib/parser");

fs = Bluebird.promisifyAll(fs);

/**
 * Initialize a SQL templater
 * @param {Array} files
 * @param {Object} [opts]
 * @param {Function} [callback]
 * @return {Promise}
 */
module.exports = function(files, opts, callback) {
  opts = opts || {};
  opts.prettyErrors = opts.prettyErrors || false;

  var tasks = [];

  // Generate the templates
  var templatesToProcess = {};
  files.forEach(function(filepath) {
    filepath = path.resolve(filepath);

    templatesToProcess[filepath] = fs.readFileAsync(filepath)
      .then(function(data) {
        return parser(data.toString(), opts);
      });
  });

  return Bluebird
    .props(templatesToProcess)
    .then(function(_templates) {
      // Return a template runner
      return function hdl(key, data) {
        key  = path.resolve(util.chomp(key));
        data = data || {};

        var ctx = {
          path: key,
          self: hdl,
          templates: _templates,
          data: data,
          args: []
        };

        return {
          sql: _templates[key](ctx),
          args: ctx.args
        };
      }
    })
    .nodeify(callback);
}
