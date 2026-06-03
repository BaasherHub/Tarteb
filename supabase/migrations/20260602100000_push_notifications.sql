-- Add push token storage to profiles for Expo push notifications.
alter table public.profiles
  add column if not exists push_token text;
