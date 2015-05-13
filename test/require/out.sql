WITH some_cte AS (select * from account where name = ?),
some_other_cte AS (select * from nested where foo = "bar")
select * from some_cte, some_other_cte
