module.exports = function(key, replaceA, replaceB) {
	if(!this.data.hasOwnProperty(key)) {
		throw "Missing key '"+key+"'";
	}

	var out = "/*feature:"+key+"*/ ";
	if(this.data[key]) {
		out += replaceA || "true";
	} else {
		out += replaceB || "false";
	}
	return out;
};
