module.exports = {
  re: function () {
    return /(?:(\{([#=?!>])([^}{]*)\})|([\n])|(.[^}{\n]*))/gm;
  },
  posMap: {
    cmd: 1,
    cmdType: 2,
    cmdArgs: 3,
    nl: 4,
    sql: 5,
  }
};
