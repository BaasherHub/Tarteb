-- Fix duplicated demonym values (e.g. IndianIndian → Indian).
update public.candidates
set nationality = left(nationality, length(nationality) / 2)
where length(nationality) > 1
  and length(nationality) % 2 = 0
  and lower(left(nationality, length(nationality) / 2))
    = lower(right(nationality, length(nationality) / 2));
