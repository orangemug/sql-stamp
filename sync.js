var assign   = require("lodash.assign");
var path     = require("path");
var parser   = require("./lib/parser/sync");
var errors   = require("./lib/errors");

/**
 * Initialize a SQL templater synchronously
 * @param {Array} files
 * @param {Object} [opts]
 * @param {Function} [callback]
 * @return {Promise}
 */
module.exports = function(files, opts) {
  opts = assign({
    prettyErrors: false
  }, opts);

  // Generate the templates
  var templates = {};
  files.forEach(function(filepath) {
    filepath = path.resolve(filepath);
    templates[filepath] = parser(filepath, templates, opts);
  });

  return function(key, data) {
    key = path.normalize(key);

    if(templates.hasOwnProperty(key)) {
      return templates[key](data);
    } else {
      throw new errors.NoSuchTemplate(key);
    }
  }
}
