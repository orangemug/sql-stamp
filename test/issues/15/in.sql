select
  *
from
  account
where
  "account"."id" = ANY('{ {=ids} }'::int[])
