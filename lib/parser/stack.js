/**
 *
 */
module.exports = {
  /**
   * From a parse set of {ln: Number, sql: String}
   */
  trace: function(parts, err, linesAround) {
    var idx = err.partIdx;
    var tmpIdx, p, lnStr = "";
    var ln = parts[idx].ln;
    var debugPos = 0;

    var minLineNum = ln-linesAround;
    var maxLineNum = ln+linesAround;

    for(var i=0; i<parts.length; i++) {
      var part = parts[i];
      if(part.ln > minLineNum && part.ln < maxLineNum) {
        if(part.ln === ln+1) {
          var debugStr = "";

          // HACK!
          for(var debugIdx=0; debugIdx<debugPos; debugIdx++) {
            debugStr += "-";
          }
          debugStr += "^\n";

          lnStr += debugStr;
        }

        lnStr += part.sql;

        if(part.ln === ln && part.idx < idx) {
          debugPos += part.sql.length;
        }
      }
    }

    return "\n\n"+lnStr+"\n";
  }
};
