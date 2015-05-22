module.exports = function(key, dflt) {
	if(!this.data.hasOwnProperty(key) && dflt === undefined) {
		throw "Missing key '"+key+"'";
	}

	if(this.data.hasOwnProperty(key)) {
		this.args.push(this.data[key]);
	} else {
		this.args.push(dflt);
	}
	return "?";
}
