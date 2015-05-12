select
  *
from
  account
where
  status = "active"
  AND (
    true OR text LIKE "foo%"
  )
