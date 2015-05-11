select
  *
from
  account
where
  status = "active"
  AND (
    true AND text LIKE "foo%"
  )
