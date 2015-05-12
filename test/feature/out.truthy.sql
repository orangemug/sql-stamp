select
  *
from
  account
where
  status = "active"
  AND (
    false OR text LIKE "foo%"
  )
