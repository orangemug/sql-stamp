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
