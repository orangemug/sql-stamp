module.exports = function(ctx, key, replaceA, replaceB) {
	if(!ctx.data.hasOwnProperty(key)) {
		throw "Missing key '"+key+"'";
	}

	var out = "/*feature:"+key+"*/ ";
	if(ctx.data[key]) {
		out += replaceA || "true";
	} else {
		out += replaceB || "false";
	}
	return out;
};
