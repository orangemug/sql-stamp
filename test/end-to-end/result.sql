WITH friend AS (
  select * from friends where fromId = ?
)
select
  *
from
  user
where
  user.id = friend.toId
  AND user.status = "active"
  AND (
    true AND role = ?
  )
