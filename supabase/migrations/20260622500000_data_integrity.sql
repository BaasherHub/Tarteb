-- D2 + D10: Rewrite candidate_browse view
--   D2: Replace 5 repeated EXISTS subqueries with a single LEFT JOIN
--   D10: Restore availability_status column (dropped in earlier view recreations)

drop view if exists public.candidate_browse;

create view public.candidate_browse
with (security_invoker = true)
as
select
  c.id,
  c.name,
  c.photo_url,
  c.role,
  c.additional_roles,
  c.availability_status,
  c.visa_status,
  c.nationality,
  (u.candidate_id is not null)                                             as is_unlocked,
  case when u.candidate_id is not null then c.current_salary else null end as current_salary,
  c.salary_expectation,
  c.available_from,
  c.location,
  c.is_active,
  c.created_at,
  c.last_active_at,
  c.years_experience,
  c.languages,
  c.uae_experience,
  c.previous_employer,
  (c.cv_url is not null)                                                   as has_cv,
  case when u.candidate_id is not null then c.phone     else null end      as phone,
  case when u.candidate_id is not null then c.whatsapp  else null end      as whatsapp,
  case when u.candidate_id is not null then c.cv_url    else null end      as cv_url,
  case when u.candidate_id is not null then c.cv_file_name else null end   as cv_file_name
from public.candidates c
left join (
  select u.candidate_id
  from public.unlocks u
  join public.employers e on e.id = u.employer_id
  where e.user_id = (select auth.uid())
) u on u.candidate_id = c.id
where c.is_active = true
   or u.candidate_id is not null;

grant select on public.candidate_browse to authenticated;

-- D3: Server-side role count aggregation (replaces client-side full table scan)
-- Counts both primary role and entries in additional_roles (text[]).
create or replace function public.get_active_role_counts()
returns table (role text, cnt bigint)
language sql
security invoker
stable
set search_path = public
as $$
  select r as role, count(*) as cnt
  from (
    select role as r
    from public.candidates
    where is_active = true and role is not null and role <> ''
    union all
    select unnest(additional_roles) as r
    from public.candidates
    where is_active = true
  ) t
  where r is not null and r <> ''
  group by r;
$$;

grant execute on function public.get_active_role_counts() to authenticated;
