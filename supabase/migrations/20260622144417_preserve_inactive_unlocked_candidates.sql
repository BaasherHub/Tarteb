-- Keep an employer's paid/unlocked history available after a candidate pauses
-- their public profile or marks themselves hired.

drop policy if exists "Employers can view unlocked candidates"
  on public.candidates;

create policy "Employers can view unlocked candidates"
  on public.candidates for select
  to authenticated
  using (
    exists (
      select 1
      from public.unlocks u
      join public.employers e on e.id = u.employer_id
      where u.candidate_id = candidates.id
        and e.user_id = (select auth.uid())
    )
  );

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
  c.visa_status,
  c.nationality,
  exists (
    select 1
    from public.unlocks u
    join public.employers e on e.id = u.employer_id
    where u.candidate_id = c.id
      and e.user_id = (select auth.uid())
  ) as is_unlocked,
  case when exists (
    select 1
    from public.unlocks u
    join public.employers e on e.id = u.employer_id
    where u.candidate_id = c.id
      and e.user_id = (select auth.uid())
  ) then c.current_salary else null end as current_salary,
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
  (c.cv_url is not null) as has_cv,
  case when exists (
    select 1
    from public.unlocks u
    join public.employers e on e.id = u.employer_id
    where u.candidate_id = c.id
      and e.user_id = (select auth.uid())
  ) then c.phone else null end as phone,
  case when exists (
    select 1
    from public.unlocks u
    join public.employers e on e.id = u.employer_id
    where u.candidate_id = c.id
      and e.user_id = (select auth.uid())
  ) then c.whatsapp else null end as whatsapp,
  case when exists (
    select 1
    from public.unlocks u
    join public.employers e on e.id = u.employer_id
    where u.candidate_id = c.id
      and e.user_id = (select auth.uid())
  ) then c.cv_url else null end as cv_url,
  case when exists (
    select 1
    from public.unlocks u
    join public.employers e on e.id = u.employer_id
    where u.candidate_id = c.id
      and e.user_id = (select auth.uid())
  ) then c.cv_file_name else null end as cv_file_name
from public.candidates c
where c.is_active = true
   or exists (
     select 1
     from public.unlocks u
     join public.employers e on e.id = u.employer_id
     where u.candidate_id = c.id
       and e.user_id = (select auth.uid())
   );

grant select on public.candidate_browse to authenticated;
