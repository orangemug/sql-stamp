select
  *
from
  account
where
  status = "active"
  AND (
    {?searchDisabled} OR text LIKE "foo%"
  )
