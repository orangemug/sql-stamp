var fs       = require("fs");
var path     = require("path");
var Bluebird = require("bluebird");
var util     = require("./lib/util");
var parser   = require("./lib/parser");

/**
 *
 */
module.exports = function(_templates, opts, callback) {
  opts = opts || {};
  opts.prettyErrors = opts.prettyErrors || false;

  var tasks = [];

  // Generate the templates
  var templates = {};
  _templates.forEach(function(filepath) {
    filepath = path.resolve(filepath);

    tasks.push(new Bluebird(function(resolve, reject) {
      fs.readFile(filepath, function(err, data) {
        if(err) {
          reject(err);
        } else {
          try {
          templates[filepath] = parser(data.toString(), opts);
          } catch(err) {
            reject(err);
            return;
          }
          resolve();
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
          templates: templates,
          data: data,
          args: []
        };

        return {
          sql: templates[key](ctx),
          args: ctx.args
        };
      }
    })
    .nodeify(callback);
}
