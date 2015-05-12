select
  *
from
  account
where
  status = "active"
  AND (
    /*filter:searchDisabled*/ false OR text LIKE "foo%"
  )
