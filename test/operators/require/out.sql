WITH spread_cte AS (
  select
    *
  from
    account
  where
    id = ?
),
object_cte AS (
  select
    *
  from
    account
  where
    id = ?
),
key_cte AS (
  select
    *
  from
    account
  where
    id = ?
)
/* This is a totally pointless example, but tests what we want */
select * from spread_cte, object_cte, key_cte;
