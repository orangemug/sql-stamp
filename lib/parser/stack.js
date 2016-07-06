/**
 *
 */
module.exports = {
  /**
   * From a parse set of {ln: Number, sql: String}
   *
   * @param   {Array}   tokens       sql fragements
   * @param   {Error}   err          error object thrown
   * @param   {Number}  linesAround  number of lines around the part of SQL throwing the error
   *
   * @returns {String}  output error string
   */
  trace: function(tokens, err, linesAround) {
    var idx = err.idx;
    var lnStr = "";
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
