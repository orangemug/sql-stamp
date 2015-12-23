WITH friend AS (
  {> ./friends.sql}
)
select
  *
from
  account
where
  account.id = friend.toId
  AND account.status = "active"
  AND (
    {?filterDisabled} OR {!filterKey} = {=filterVal}
  )
