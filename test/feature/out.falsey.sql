select
  *
from
  account
where
  status = "active"
  AND (
    /*filter:searchDisabled*/ true OR text LIKE "foo%"
  )
