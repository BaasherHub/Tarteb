-- Reverse the QA backfill that set phone/whatsapp to a test number.
-- Only nulls rows that still carry the exact test value; real data is untouched.
update public.candidates
set
  phone    = null,
  whatsapp = null
where phone    = '+971501234567'
  and whatsapp = '+971501234567';
