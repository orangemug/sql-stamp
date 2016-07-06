select
  *
from
  account
where
  status = "active"
  AND (
    /*feature:searchDisabled*/ 1 OR text LIKE "foo%"
  )
