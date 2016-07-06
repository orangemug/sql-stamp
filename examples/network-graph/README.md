# Network graph
This example shows how to get a list of friends of friends and shows

 * Composing SQL via CTE using includes (`{>./path/to/file.sql}`)
 * Toggling of features via the ternary switch and `CASE` statement

Files to look at

 * [schema.sql](./schema.sql) - the input schema
 * [friends.sql](./queries/_friends.sql) - the main SQL file to run
 * [\_friend-recurse.sql](./queries/_friend-recurse.sql) - The recursive CTE

There is also some input data in [./data](/data/).

To exec these files run

    node index.js [DATA_FILE]

Where `[DATA_FILE]` is one of the files in [./data](/data). So for example to all the friends in the network graph which are inactive run

    node index.js ./data/friends-depth-5.json


