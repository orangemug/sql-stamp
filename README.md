# sql-stamp
The tiny SQL templating library, with the aim to be as simple as possible so to not get in the way of you writing SQL.

[![Build Status](https://circleci.com/gh/orangemug/sql-stamp.png?style=shield)][circleci]
[![Test Coverage](https://codeclimate.com/github/orangemug/sql-stamp/badges/coverage.svg)][codeclimate]
[![Dependency Status](https://david-dm.org/orangemug/sql-stamp.svg)][dm-prod]
[![Dev Dependency Status](https://david-dm.org/orangemug/sql-stamp/dev-status.svg)][dm-dev]

[circleci]:    https://circleci.com/gh/orangemug/sql-stamp
[codeclimate]: https://codeclimate.com/github/orangemug/sql-stamp/coverage
[dm-prod]:     https://david-dm.org/orangemug/sql-stamp
[dm-dev]:      https://david-dm.org/orangemug/sql-stamp#info=devDependencies


It supports the following conditionals:

 * `{=key, optionalDefault}`  - Turns args into `?` with an optional default
 * `{!key, optionalDefault}` - Passed raw into the SQL
 * `{?key, replaceTruthy, replaceFalsey}` - Ternary switch, the defaults are replaceTruthy/replaceFalsey === true/false
 * `{>path, optionalDataKeys*}` - Require file from the templates, the data keys can take on the format
   * `{>path id:user.id}` - pass `user.id` as `id`
   * `{>path user.id}` - pass `user.id` as `id`
   * `{>path ...user}` - object spread, in the same way as javascript [ES6 spread operator](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator)


## Why?
I guess the best way to answer that is why not a HTML templating language like mustache? Basically these support loops and conditionals sql-stamp doesn't because I want the SQL to be kept clean and readable. It does however support a limited ternary switch for feature switches. Also it'll add in `?` as params so you can use your SQL libraries injection protection.


## Install

```sh
npm install sql-stamp --save
```

## API
The API is as follows

```js
var sqlStamp = require("sql-stamp");
var tmpl = sqlStamp([
  /* Pass a list of SQL templates */
  __dirname+"/friends.sql",
  __dirname+"/example.sql"
]).then(function(sql) {
  // 'sql' call with 'sql(pathToFile, args)' to exec the template
});

var files = glob.sync("./sql/**/*.sql")
sqlStamp(files).then(function(sql) {
  sql(__dirname+"../lib/sql/foo.sql", {foo: "bar"});
  // => {sql: "select...", args: ["bar"]}
});
```

So for example given the following SQL file which selects all friend requests you've accepted

```sql
/* ./friends.sql */
select * from friends where status = "accepted"
```

The following file can **require** this as a CTE (<http://www.postgresql.org/docs/9.1/static/queries-with.html>) via a require directive `{> ./file/path.sql}`

```sql
/* ./example.sql */
WITH friend AS (
  {> ./friends.sql}
)
select
  *
from
  account
where
  account.id = friend.toId
  AND friend.fromId = {accountId}
  AND (
    {?filterDisabled} OR {!filterKey} = {filterVal}
  )
```

When we run the following

```js
var out = tmpl(__dirname+"/example.sql", {
  accountId: 1,
  filterDisabled: false,
  filterKey: "role",
  filterVal: "dev"
});
```

The following will be returned

```js
{
  args: [1, "dev"],
  sql: SQL
}
```

Where `SQL` is

```sql
WITH friend AS (
  select * from friends where status = "active"
)
select
  *
from
  account
where
  account.id = friend.toId
  AND friend.fromId = ?
  AND (
    /*feature:filterDisabled*/ false AND role = ?
  )
```

## Errors
You'll get more descriptive errors about where the error happened in your source SQL. This can be disabled with `{prettyErrors: false}`

```
SQLError: Too many args

select
  *
from
  account
where
  foo = {too, many, args}
--------^
```

You can see some more examples in the tests here [here](test/errors/index.js)


## Test
Run the unit tests

```
npm test
```

Unit tests with code coverage

```
npm run coverage
```

And some really simple benchmarks

```
npm run benchmark
```

## Thanks
Thanks to [Pearlshare](http://www.pearlshare.com) for supporting development and [Oliver Brooks](https://github.com/oliverbrooks/) for help with design.


## License
[MIT](LICENSE)
