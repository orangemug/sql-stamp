select
  *
from
  account
where
      name = {name}
  AND role = {role, "manager"}
  AND fullname = {name}
