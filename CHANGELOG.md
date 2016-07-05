# Change Log
An overview of notable changes in versions


## v0.8.0

 * New require param passing syntax [#11](https://github.com/orangemug/sql-stamp/pull/11)
 * Error parsing Postgres array literals [#15](https://github.com/orangemug/sql-stamp/issues/15)
   * Issue with parsing of multiple braces `{{`


## v0.7.0
A big codebase refactor with the following features added

 * New param syntax `{foo}` - > `{=foo}` so not to clash with PostgreSQL json
 * Requires get indented in output SQL
 * Better parse errors
 * Requires are now relative 
 * Added benchmarks


