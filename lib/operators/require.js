module.exports = function(path, dataKey) {
	if(!this.templates.hasOwnProperty(path)) {
		throw "No such template '"+path+"'";
	}

	var templateData;
	if(dataKey) {
		templateData = this.data[dataKey];
	} else {
		templateData = this.data;
	}

	// Recurse
	var out = this.self(path, templateData);
  this.args = this.args.concat(out.args);
  return out.sql;
};
