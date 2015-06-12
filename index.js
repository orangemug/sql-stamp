var fs       = require("fs");
var path     = require("path");
var Bluebird = require("bluebird");
var util     = require("./lib/util");
var parser   = require("./lib/parser");

/**
 * Initialize a SQL templater
 * @param {Array} templates
 * @param {Object} [opts]
 * @param {Function} [callback]
 * @return {Promise}
 */
module.exports = function(templates, opts, callback) {
  opts = opts || {};
  opts.prettyErrors = opts.prettyErrors || false;

  var tasks = [];

  // Generate the templates
  var parsedTemplates = {};
  templates.forEach(function(filepath) {
    filepath = path.resolve(filepath);

    tasks.push(new Bluebird(function(resolve, reject) {
      fs.readFile(filepath, function(err, data) {
        if(err) {
          reject(err);
        } else {
          parser(data.toString(), opts)
            .then(function(out) {
              parsedTemplates[filepath] = out
              resolve();
            })
            .catch(function(err) {
              reject("SQLError: "+err);
            });
        }
      });
    }));
  });

  return Bluebird
    .all(tasks)
    .then(function() {
      // Return a template runner
      return function hdl(key, data) {
        key  = path.resolve(util.chomp(key));
        data = data || {};

        var ctx = {
          path: key,
          self: hdl,
          templates: parsedTemplates,
          data: data,
          args: []
        };

        return {
          sql: parsedTemplates[key](ctx),
          args: ctx.args
        };
      }
    })
    .nodeify(callback);
}
