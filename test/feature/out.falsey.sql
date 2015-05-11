select
  *
from
  account
where
  status = "active"
  AND (
    false AND text LIKE "foo%"
  )
