WITH friend AS (
  select * from friends where fromId = ?
)
select
  *
from
  account
where
  account.id = friend.toId
  AND account.status = "active"
  AND (
    /*filter:filterDisabled*/ false OR role = ?
  )
