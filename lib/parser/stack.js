/**
 *
 */
module.exports = {
  trace: function(parts, idx, linesAround) {
    var tmpIdx, p, lnStr = "";
    var ln = parts[idx].ln;
    var debugPos = 0;

    tmpIdx = idx;
    p = parts[--tmpIdx];
    while(p && p.ln >= ln-linesAround) {
      if(p.ln === ln) {
        debugPos += p.sql.length;
      }

      lnStr = p.sql + lnStr;
      p = parts[--tmpIdx];
    }

    var debugStr = "";
    for(var i=0; i<debugPos; i++) {
      debugStr += "-";
    }
    debugStr += "^";

    lnStr += parts[idx].sql;
    lnStr+="\n"+debugStr;

    tmpIdx = idx;
    p = parts[++tmpIdx];
    while(p && p.ln <= ln+linesAround) {
      lnStr += p.sql;
      p = parts[++tmpIdx];
    }

    return "\n\n"+lnStr+"\n";
  }
};
