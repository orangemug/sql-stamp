var lodash   = require("lodash");
var path     = require("path");
var Bluebird = require("bluebird");
var util     = require("./lib/util");
var parser   = require("./lib/parser");
var errors   = require("./lib/errors");

/**
 * Initialize a SQL templater
 * @param {Array} files
 * @param {Object} [opts]
 * @param {Function} [callback]
 * @return {Promise}
 */
module.exports = function(files, opts, callback) {
  opts = lodash.assign({
    prettyErrors: false
  }, opts);

  // Generate the templates
  var templates = {};
  files.forEach(function(filepath) {
    filepath = path.resolve(filepath);
    templates[filepath] = parser(filepath, templates, opts);
  });

  return Bluebird
    .props(templates)
    .then(function(_templates) {
      return function(key, data) {
        if(_templates.hasOwnProperty(key)) {
          return _templates[key](data);
        } else {
          throw new errors.NoSuchTemplate(key);
        }
      }
    })
    .nodeify(callback);
}
