-- Sprint 1 security hardening
-- S5: Revoke public execute on add_employer_credits (service role only via Edge Functions)
revoke execute on function public.add_employer_credits(uuid, integer, uuid) from public;

-- S6: Revoke public execute on activate_employer_subscription
revoke execute on function public.activate_employer_subscription(uuid, text) from public;

-- S7: Revoke public execute on increment_candidate_profile_view
revoke execute on function public.increment_candidate_profile_view(uuid) from public;

-- S8: Prevent users from updating their own role.
-- Drop the broad update policy and replace it with one that locks the role column.
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and role = (select role from public.profiles where user_id = auth.uid())
  );

-- S9: Remove direct INSERT on unlocks — employers must go through unlock_candidate().
-- The function is SECURITY DEFINER so it can still insert on the caller's behalf.
drop policy if exists "Employers can create unlocks" on public.unlocks;
