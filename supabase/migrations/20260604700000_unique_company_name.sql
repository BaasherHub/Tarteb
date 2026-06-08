-- One company name per platform (case-insensitive, trimmed) to reduce duplicate/spam accounts.

create unique index if not exists employers_company_name_unique_idx
  on public.employers (lower(trim(company_name)));

create or replace function public.is_company_name_available(
  p_company_name text,
  p_user_id uuid default auth.uid()
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select not exists (
    select 1
    from public.employers e
    where lower(trim(e.company_name)) = lower(trim(p_company_name))
      and trim(p_company_name) <> ''
      and e.user_id is distinct from p_user_id
  );
$$;

revoke all on function public.is_company_name_available(text, uuid) from public;
grant execute on function public.is_company_name_available(text, uuid) to authenticated;
