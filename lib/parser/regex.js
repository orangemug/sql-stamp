module.exports = {
  re: function () {
    /**
     * Ok so this regexp is a little confusing, so lets break it down
     *
     * Firstly its aim is to walk over a string (using RegExp#exec). The RegExp will always match something and the grouping tells us what that something is
     *
     * It'll be either a
     *
     *  - COMMAND, with a nested:
     *    - COMMAND_TYPE
     *    - COMMAND_ARGS
     *  - NEWLINE
     *  - SQL
     *
     * Which is mapped in 'posMap' below
     *
     * These are commented in the broken apart regexp below
     *
     *     # group but ignore in output
     *     /(?:
     *       # Is the current part a known templating [COMMAND]
     *       (
     *         \{
     *          # Capture the [COMMAND_TYPE]
     *          ([#=?!>])
     *          # Capture the [COMMAND_ARGS], up to the next '{' or '}'
     *          ([^}{]*)
     *         \}
     *       )
     *       # OR is it a [NEWLINE]
     *       |([\n])
     *       # ELSE its some [SQL] match upto the next '{' or '}' this is kind of a hack to allow braces that are not a part of the syntax
     *       |(.[^}{\n]*)
     *     # Global and multiline
     *     )/gm
     *
     */
    return /(?:(\{([#=?!>])([^}{]*)\})|([\n])|(.[^}{\n]*))/gm;
  },
  posMap: {
    cmd: 1, // interpretted command such as {> ../file.sql}
    cmdType: 2, // type of command such as #, =, ?, ! or >
    cmdArgs: 3, // arguments passed to the command such as ../file.sql
    nl: 4, // a new line
    sql: 5, // any ordinary SQL
  }
};
