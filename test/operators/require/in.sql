WITH spread_cte AS (
  {> ./in_sub.sql, ...user}
),
object_cte AS (
  {> ./in_sub.sql, user.id}
),
key_cte AS (
  {> ./in_sub.sql, id:user.id}
)
/* This is a totally pointless example, but tests what we want */
select * from spread_cte, object_cte, key_cte;
