# sql-stamp
The tiny SQL templater, with the aim to be as simple as possible so to not get in the way of you writing SQL.

[![Build Status](https://travis-ci.org/orangemug/sql-stamp.svg?branch=master)](https://travis-ci.org/orangemug/sql-stamp) 
[![Test Coverage](https://codeclimate.com/github/orangemug/sql-stamp/badges/coverage.svg)](https://codeclimate.com/github/orangemug/sql-stamp/coverage) 
[![Code Climate](https://codeclimate.com/github/orangemug/sql-stamp/badges/gpa.svg)](https://codeclimate.com/github/orangemug/sql-stamp) 

It supports the following conditionals:

 * `{key, optionalDefault}`  - Turns args into `?` with an optional default
 * `{!key, optionalDefault}` - Passed raw into the SQL
 * `{>path, optionalDataKey}` - Require file from the templates
 * `{?key, replaceTruthy, replaceFalsey}` - Ternary switch, the defaults are replaceTruthy/replaceFalsey === true/false


## Install

    npm i sql-stamp --save


## API
The API is as follows

    var sqlStamp = require("sql-stamp");
    var tmpl = sqlStamp({
      /* Pass a list of templates... (key=path, value=sql-string) */
      "./friends.sql": "SQL_STRING",
      "./example.sql": "SQL_STRING"
    });

So for example given the following SQL file which selects all friend requests you've accepted

    /* ./friends.sql */
    select * from friends where status = "accepted"

The following file can **require** this as a CTE (<http://www.postgresql.org/docs/9.1/static/queries-with.html>) via a require directive `{> ./file/path.sql}`

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

When we run the following

    var out = tmpl("./example.sql", {
      accountId: 1,
      filterDisabled: false,
      filterKey: "role",
      filterVal: "dev"
    });

The following will be returned

    {
      args: [1, "dev"],
      sql: /* SQL in comment below */
      /**
       * WITH friend AS (
       *   select * from friends where status = "active"
       * )
       * select
       *   *
       * from
       *   account
       * where
       *   account.id = friend.toId
       *   AND friend.fromId = ?
       *   AND (
       *     /*feature:filterDisabled*/ false AND role = ?
       *   )
       */
    }


## Pretty errors
There is also experimental support for more descriptive errors and can be enabled with `{prettyErrors: true}`

    var tmpl = sqlStamp(templates, {prettyErrors: true});

Then you'll get more descriptive errors about where the error happened in your source SQL

    SQLError: Too many args

    select
      *
    from
      account
    where
      foo = {too, many, args}
    --------^

You can see some more examples in the tests here [here](test/errors/index.js)


## Test

    npm test


## License
[MIT](LICENSE)
