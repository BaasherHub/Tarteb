-- Backfill demo contact fields on active candidates missing phone/WhatsApp.
-- Helps employer unlock E2E and local QA (browse → profile → Call/WhatsApp).
-- Only updates rows with no contact on file; skips candidates that already have one.

update public.candidates
set
  phone = '+971501234567',
  whatsapp = '+971501234567'
where is_active = true
  and coalesce(trim(phone), '') = ''
  and coalesce(trim(whatsapp), '') = '';
