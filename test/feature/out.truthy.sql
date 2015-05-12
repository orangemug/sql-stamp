select
  *
from
  account
where
  status = "active"
  AND (
    /*feature:searchDisabled*/ false OR text LIKE "foo%"
  )
