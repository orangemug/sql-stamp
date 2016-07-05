select
  *
from
  account
where
  "account"."id" = ANY('{ ? }'::int[])
