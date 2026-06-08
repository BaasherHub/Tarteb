-- Temporarily allow free unlocks without subscription (re-enable billing when supply grows).
create or replace function public.unlock_candidate(p_candidate_id uuid)
returns public.unlocks
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employer public.employers;
  v_unlock   public.unlocks;
  v_month    date := date_trunc('month', now())::date;
begin
  select * into v_employer
  from public.employers
  where user_id = auth.uid()
  for update;

  if not found then
    raise exception 'Employer profile not found';
  end if;

  select * into v_unlock
  from public.unlocks
  where employer_id = v_employer.id
    and candidate_id = p_candidate_id;

  if found then
    return v_unlock;
  end if;

  insert into public.unlocks (employer_id, candidate_id, amount_paid)
  values (v_employer.id, p_candidate_id, 0)
  returning * into v_unlock;

  insert into public.monthly_unlocks (employer_id, month, count)
  values (v_employer.id, v_month, 1)
  on conflict (employer_id, month)
  do update set count = public.monthly_unlocks.count + 1;

  return v_unlock;
end;
$$;

grant execute on function public.unlock_candidate(uuid) to authenticated;
