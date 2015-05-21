module.exports = function(ctx, key, dflt) {
	if(!ctx.data.hasOwnProperty(key) && dflt === undefined) {
		throw "Missing key '"+key+"'";
	}

	if(ctx.data.hasOwnProperty(key)) {
		ctx.args.push(ctx.data[key]);
	} else {
		ctx.args.push(dflt);
	}
	return "?";
}
