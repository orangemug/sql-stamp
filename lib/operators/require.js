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
	var out = ctx.self(path, templateData);
  ctx.args = ctx.args.concat(out.args);
  return out.sql;
};
