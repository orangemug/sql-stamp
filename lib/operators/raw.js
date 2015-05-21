module.exports = function(ctx, key, dflt) {
	if(!ctx.data.hasOwnProperty(key) && dflt === undefined) {
		throw "Missing key '"+key+"'";
	}

	if(ctx.data.hasOwnProperty(key)) {
		return ctx.data[key];
	} else {
		return dflt;
	}
};
