module.exports = {
  run: function(key, replaceA, replaceB) {
    if(!this.data.hasOwnProperty(key)) {
      throw "Missing key '"+key+"'";
    }

    var out = "/*feature:"+key+"*/ ";
    if(this.data[key]) {
      out += replaceA || "1";
    } else {
      out += replaceB || "0";
    }
    return {sql: out};
  }
};
