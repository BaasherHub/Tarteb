-- Optional candidate CV (PDF/DOC) — private until employer unlocks.

alter table public.candidates
  add column if not exists cv_url text,
  add column if not exists cv_file_name text;

comment on column public.candidates.cv_url is
  'Storage path in candidate-cvs bucket (not a public URL).';
comment on column public.candidates.cv_file_name is
  'Original filename for display (e.g. resume.pdf).';

insert into storage.buckets (id, name, public)
values ('candidate-cvs', 'candidate-cvs', false)
on conflict (id) do update set public = false;

create policy "Candidates upload own CV"
  on storage.objects for insert
  with check (
    bucket_id = 'candidate-cvs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Candidates read own CV"
  on storage.objects for select
  using (
    bucket_id = 'candidate-cvs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Candidates update own CV"
  on storage.objects for update
  using (
    bucket_id = 'candidate-cvs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Candidates delete own CV"
  on storage.objects for delete
  using (
    bucket_id = 'candidate-cvs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Employers read unlocked candidate CV"
  on storage.objects for select
  using (
    bucket_id = 'candidate-cvs'
    and exists (
      select 1
      from public.unlocks u
      join public.employers e on e.id = u.employer_id
      join public.candidates c on c.id = u.candidate_id
      where e.user_id = auth.uid()
        and c.cv_url = storage.objects.name
    )
  );

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
  (c.cv_url is not null) as has_cv,
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
  end as whatsapp,
  case
    when exists (
      select 1 from public.unlocks u
      join public.employers e on e.id = u.employer_id
      where u.candidate_id = c.id and e.user_id = auth.uid()
    ) then c.cv_url
    else null
  end as cv_url,
  case
    when exists (
      select 1 from public.unlocks u
      join public.employers e on e.id = u.employer_id
      where u.candidate_id = c.id and e.user_id = auth.uid()
    ) then c.cv_file_name
    else null
  end as cv_file_name
from public.candidates c
where c.is_active = true;

grant select on public.candidate_browse to authenticated;
