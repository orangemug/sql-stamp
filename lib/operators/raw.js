module.exports = {
  run: function(key, dflt) {
    var out;
    if(!this.data.hasOwnProperty(key) && dflt === undefined) {
      throw "Missing key '"+key+"'";
    }

    if(this.data.hasOwnProperty(key)) {
      out = this.data[key];
    } else {
      out = dflt;
    }

    return {
      sql: out
    };
  }
};
