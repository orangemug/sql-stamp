/**
 *
 */
module.exports = {
  /**
   * From a parse set of {ln: Number, sql: String}
   */
  trace: function(tokens, err, linesAround) {
    var idx = err.idx;
    var tmpIdx, p, lnStr = "";
    var ln = tokens[idx].ln;
    var debugPos = 0;

    var minLineNum = ln-linesAround;
    var maxLineNum = ln+linesAround;

    for(var i=0; i<tokens.length; i++) {
      var part = tokens[i];
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
