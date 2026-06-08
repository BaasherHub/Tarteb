-- Optional local seed (run via `supabase db reset` when linked to a local project).
-- Remote/production: apply migration 20260605000000_qa_candidate_contact_backfill.sql instead.

-- Example: ensure a browse-friendly AC Technician has contact details for unlock QA.
update public.candidates
set
  phone = '+971501234567',
  whatsapp = '+971501234567'
where role = 'AC Technician'
  and is_active = true
  and coalesce(trim(phone), '') = ''
  and coalesce(trim(whatsapp), '') = '';
