module.exports = function(ctx, path, dataKey) {
	if(!ctx.templates.hasOwnProperty(path)) {
		throw "No such template '"+path+"'";
	}

	var templateData;
	if(dataKey) {
		templateData = ctx.data[dataKey];
	} else {
		templateData = ctx.data;
	}

	// Recurse
	var template = ctx.templates[path];
	var out = ctx.self(template, templateData, ctx.templates);
  ctx.args = ctx.args.concat(out.args);
  return out.sql;
};
