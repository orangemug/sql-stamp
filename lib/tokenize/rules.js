function ruleRegExp(cmd) {
  return "\\{(["+cmd+"])([^}{]*)\\}";
}

/**
 * Note: Order is important here as the regexp will be created in this way
 */
module.exports = [
  {
    // Import
    regexp: ruleRegExp("#"),
    groups: 2,
    token: "import"
  },
  {
    // Param
    regexp: ruleRegExp("="),
    groups: 2,
    token: "param"
  },
  {
    // Swtich
    regexp: ruleRegExp("?"),
    groups: 2,
    token: "switch"
  },
  {
    // Raw
    regexp: ruleRegExp("!"),
    groups: 2,
    token: "raw"
  },
  {
    // Require
    regexp: ruleRegExp(">"),
    groups: 2,
    token: "require"
  },
  {
    // Whitespace
    regexp: "([ \t]+)",
    groups: 1,
    token: "whitespace"
  },
  {
    // Whitespace
    regexp: "([\\n])",
    groups: 1,
    token: "newline"
  },
  {
    // SQL
    regexp: "(.[^}{\\n]*)",
    groups: 1,
    token: "sql"
  },
];
