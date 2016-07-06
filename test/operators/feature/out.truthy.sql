select
  *
from
  account
where
  status = "active"
  AND (
    /*feature:searchDisabled*/ 0 OR text LIKE "foo%"
  )
