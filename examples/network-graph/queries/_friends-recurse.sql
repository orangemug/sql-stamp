SELECT
  "friends"."id",

  case when "friends"."toId" = {=userId}
  then "friends"."toId"
  else "friends"."fromId"
  end AS "fromId",

  case when "friends"."toId" = {=userId}
  then "friends"."fromId"
  else "friends"."toId"
  end AS "toId",

  {=userId} AS "_friendsDepth"
FROM
  "friends"
WHERE
    ("friends"."fromId" = {=userId} OR "friends"."toId" = {=userId})
UNION ALL
SELECT
  "friends"."id",
  "friends_recurse"."toId" AS "fromId",

  case when "friends"."toId" = "friends_recurse"."toId"
  then "friends"."fromId"
  else "friends"."toId"
  end AS "toId",

  "friends_recurse"."_friendsDepth" + 1 AS "_friendsDepth"
FROM
  "friends", "friends_recurse"
WHERE
    ("friends"."fromId" = "friends_recurse"."toId" OR "friends"."toId" = "friends_recurse"."toId")
  AND
    ("friends"."id" != "friends_recurse"."id")
  AND
    ("friends_recurse"."_friendsDepth" < {=maxDepth})
