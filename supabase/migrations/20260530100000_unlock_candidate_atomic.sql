-- Make unlock_candidate() fully atomic (apply if initial migration already ran)
-- Credit deduction + unlock insert are one transaction; FOR UPDATE prevents double-spend.

create or replace function public.unlock_candidate(p_candidate_id uuid)
returns public.unlocks
language plpgsql
security definer
set search_path = public
as $$
declare
  v_employer public.employers;
  v_unlock public.unlocks;
  v_cost constant integer := 50;
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

  update public.employers
  set credits_balance = credits_balance - 1
  where id = v_employer.id
    and credits_balance >= 1;

  if not found then
    raise exception 'Insufficient credits';
  end if;

  insert into public.unlocks (employer_id, candidate_id, amount_paid)
  values (v_employer.id, p_candidate_id, v_cost)
  returning * into v_unlock;

  return v_unlock;
end;
$$;
