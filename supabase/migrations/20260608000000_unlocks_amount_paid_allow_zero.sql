-- Free unlocks (20260604800000) insert amount_paid = 0; ensure constraint allows it.
alter table public.unlocks drop constraint if exists unlocks_amount_paid_check;
alter table public.unlocks
  add constraint unlocks_amount_paid_check check (amount_paid >= 0);
