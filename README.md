# sql-stamp
[![Build Status](https://travis-ci.org/orangemug/sql-stamp.svg?branch=master)](https://travis-ci.org/orangemug/sql-stamp) [![Coverage Status](https://coveralls.io/repos/orangemug/sql-stamp/badge.svg)](https://coveralls.io/r/orangemug/sql-stamp) [![Code Climate](https://codeclimate.com/github/orangemug/sql-stamp/badges/gpa.svg)](https://codeclimate.com/github/orangemug/sql-stamp)

The tiny SQL templater, with the aim to be as simple as possible as to not get in the way of you writing SQL.

It supports the following conditionals:

 * `{key, default}`  - Turns into `?` with the correct ordering in the returned args (so safe for user input)
 * `{!key, default}` - Passed raw into the SQL
 * `{>path, optionalDataObject}` - Require file from the templates hash
 * `{?key, replaceA, replaceB}` - Feature switch


## Install

    npm i git://github.com/orangemug/sql-stamp.git --save


## API
The basic API is as follows

    var sqlStamp = require("sql-stamp");
    sqlStamp(sqlString, dataObj, templateObj);

So for example given the following file which selects all friends with a `userId`

    /* ./friends.sql */
    select * from friends where fromId = {userId}

And the following uses this as a CTE (<http://www.postgresql.org/docs/9.1/static/queries-with.html>) via a "require"

    /* ./example.sql */
    WITH friend AS (
      {> ./friends.sql}
    )
    select
      *
    from
      user
    where
      user.id = friend.toId
      AND user.status = "active"
      AND (
        {?filterDisabled} OR {!filterKey} = {filterVal}
      )

When we run the following

    var out = sqlStamp(/* example.sql as string */, {
      userId: 1,
      filterDisabled: false,
      filterKey: "role",
      filterVal: "dev"
    }, {
      "./friends.sql": /* friends.sql as string */
    });

The following will be returned

    {
      args: [1, "dev"],
      sql: /* SQL in comment below */
      /**
       * WITH friend AS (
       *   select * from friends where fromId = ?
       * )
       * select
       *   *
       * from
       *   user
       * where
       *   user.id = friend.toId
       *   AND user.status = "active"
       *   AND (
       *     /*feature:filterDisabled*/ false AND role = ?
       *   )
       */
    }


## CLI
You also have a CLI available to you to render templates from the command line

    $ sql-stamp ./test/require/in.sql --name orangemug
    {
      "sql": "WITH some_cte AS (select * from account where name = ?)\nselect * from some_cte\n",
      "args": [
        "orangemug"
      ]
    }


## Test

    npm test


## License
MIT
