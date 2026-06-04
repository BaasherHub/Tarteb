-- Current salary is private until employer unlocks the candidate (same as phone/whatsapp).

drop view if exists public.candidate_browse;

create or replace view public.candidate_browse
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
  case
    when exists (
      select 1 from public.unlocks u
      join public.employers e on e.id = u.employer_id
      where u.candidate_id = c.id and e.user_id = auth.uid()
    ) then c.current_salary
    else null
  end as current_salary,
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
  case
    when exists (
      select 1 from public.unlocks u
      join public.employers e on e.id = u.employer_id
      where u.candidate_id = c.id and e.user_id = auth.uid()
    ) then c.phone
    else null
  end as phone,
  case
    when exists (
      select 1 from public.unlocks u
      join public.employers e on e.id = u.employer_id
      where u.candidate_id = c.id and e.user_id = auth.uid()
    ) then c.whatsapp
    else null
  end as whatsapp
from public.candidates c
where c.is_active = true;

grant select on public.candidate_browse to authenticated;
