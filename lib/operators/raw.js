module.exports = {
	parse: function(key, dflt) {
	},
	run: function(key, dflt) {
		if(!this.data.hasOwnProperty(key) && dflt === undefined) {
			throw "Missing key '"+key+"'";
		}

		if(this.data.hasOwnProperty(key)) {
			return this.data[key];
		} else {
			return dflt;
		}
	}
};
