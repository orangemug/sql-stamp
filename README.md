# sql-stamp
The tiny SQL templater, with the aim to be as simple as possible as to not get in the way of you writing SQL.

It supports the following conditionals:

 * `{key}`  - Turns into `?` with the correct ordering in the returned args (so safe for user input)
 * `{!key}` - Passed raw into the SQL
 * `{>key}` - Require file from the templates hash
 * `{?key}` - Feature switch


## API
The basic API is as follows

    var sqlStamp = require("sql-stamp");
    sqlStamp(sqlString, dataObj, templateObj);

So for example given the following file which selects all friends with a `userId`

    /* ./friends.sql */
    select * from friends where fromId = {userId}

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
        {?filterEnabled} AND {!filterKey} = {filterVal}
      )

The following will be returned

    TODO

## Install

  npm i git://github.com/orangemug/sql-stamp.git --save


## Test

  npm test


## License
MIT
