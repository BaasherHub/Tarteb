-- Available-from date is optional (notice period / settling with employer).

alter table public.candidates
  alter column available_from drop not null;

comment on column public.candidates.available_from is
  'Optional start date when candidate can begin work; null means immediately or not specified.';
