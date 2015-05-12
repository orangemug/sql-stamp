select
  *
from
  account
where
  status = "active"
  AND (
    /*feature:searchDisabled*/ true OR text LIKE "foo%"
  )
