WITH some_cte AS (
  {> ./in_sub_missing.sql}
),
some_other_cte AS (
  {> ./in_sub_nested.sql, nested_var}
)
select * from some_cte, some_other_cte
