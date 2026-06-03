-- Trade license number for employer trust signal.
-- Self-reported — not verified automatically, but creates accountability.
alter table public.employers
  add column if not exists trade_license text;
