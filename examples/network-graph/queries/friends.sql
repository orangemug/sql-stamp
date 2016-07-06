WITH recursive "friends_recurse"("id", "fromId", "toId", "_friendsDepth") AS (
  {> ./_friends-recurse.sql, userId:user.id, maxDepth:maxDepth}
)

SELECT
  "users".*
FROM
  "users"
INNER JOIN
  "friends_recurse" ON ("users"."id" = "friends_recurse"."toId")
WHERE
  -- Use SQL case statements and the ternary switch to toggle features
  -- 1. status filter
  CASE
    WHEN {?enableStatusFilter} THEN (users.status = 'active')
    ELSE 1
  END
  -- 2. role filter
  AND CASE
    WHEN {?enableRoleFilter} THEN (users.role = {=roleFilter})
    ELSE 1
  END
