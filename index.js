var util   = require("./lib/util");
var parser = require("./lib/parser");

/**
 *
 */
module.exports = function(_templates, opts) {
  opts = opts || {};
  opts.prettyErrors = opts.prettyErrors || false;

	// Generate the templates
  var templates = {};
  for(key in _templates) {
    templates[util.chomp(key)] = parser(_templates[key], opts);
  }

	// Return a template runner
  return function hdl(key, data) {
    key  = util.chomp(key);
    data = data || {};

    var ctx = {
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
}
