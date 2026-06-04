-- Company logo for employer trust (optional, self-uploaded).
alter table public.employers
  add column if not exists logo_url text;

insert into storage.buckets (id, name, public)
values ('employer-logos', 'employer-logos', true)
on conflict (id) do nothing;

create policy "Employer logos: upload own"
  on storage.objects for insert
  with check (
    bucket_id = 'employer-logos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Employer logos: public read"
  on storage.objects for select
  using (bucket_id = 'employer-logos');

create policy "Employer logos: update own"
  on storage.objects for update
  using (
    bucket_id = 'employer-logos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Employer logos: delete own"
  on storage.objects for delete
  using (
    bucket_id = 'employer-logos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
