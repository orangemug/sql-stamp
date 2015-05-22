module.exports = {
  chomp: function chomp(str) {
    return str.replace(/^\s*|\s*$/g, "");
  },
  removeQuotes: function(str) {
    if(str === undefined) {
      return;
    }
    return str.replace(/^"|"$/g, "");
  }
}

