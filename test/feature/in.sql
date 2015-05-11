select
  *
from
  account
where
  status = "active"
  AND (
    {?enableSearch} AND text LIKE "foo%"
  )
