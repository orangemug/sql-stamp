module.exports = {
  chomp: function chomp(str) {
    return str
      .replace(/^\s*|\s*$/g, "");
  },
  removeQuotes: function(str) {
    if(str === undefined) {
      return;
    }
    return str.replace(/^"|"$/g, "");
  },
  addQuotes: function(str) {
    return "\""+str+"\"";
  },
	escapeString: function(str) {
		return  str.replace(/"/g, "\\\"").replace(/\n/g, "\\n");
	}
}

