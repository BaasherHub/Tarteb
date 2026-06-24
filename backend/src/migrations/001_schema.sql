-- Tarteb — Railway Postgres schema
-- Consolidated from all Supabase migrations.
-- auth.users is replaced by the local `users` table.
-- RLS is replaced by Express middleware checks.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- users (replaces Supabase auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  phone           text        NOT NULL UNIQUE,
  created_at      timestamptz NOT NULL DEFAULT now(),
  last_active_at  timestamptz
);

-- ---------------------------------------------------------------------------
-- sessions (JWT revocation)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash           text        NOT NULL UNIQUE,
  refresh_token_hash   text        NOT NULL UNIQUE,
  expires_at           timestamptz NOT NULL,
  created_at           timestamptz NOT NULL DEFAULT now(),
  is_revoked           boolean     NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx      ON sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_refresh_hash_idx ON sessions (refresh_token_hash);

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  role        text        NOT NULL CHECK (role IN ('candidate', 'employer')),
  phone       text,
  push_token  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles (user_id);

-- ---------------------------------------------------------------------------
-- candidates
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS candidates (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name                 text        NOT NULL,
  photo_url            text,
  role                 text        NOT NULL,
  additional_roles     text[]      NOT NULL DEFAULT '{}',
  visa_status          text        NOT NULL CHECK (visa_status IN (
                          'Employment Visa','Visit Visa','Own Visa','Cancelled Visa')),
  nationality          text        NOT NULL,
  salary_expectation   integer     NOT NULL CHECK (salary_expectation >= 0),
  current_salary       integer     CHECK (current_salary IS NULL OR current_salary >= 0),
  available_from       date,
  location             text        NOT NULL,
  phone                text,
  whatsapp             text,
  is_active            boolean     NOT NULL DEFAULT true,
  availability_status  text        NOT NULL DEFAULT 'looking'
                          CHECK (availability_status IN ('looking','hired','paused')),
  years_experience     integer     NOT NULL DEFAULT 0 CHECK (years_experience >= 0),
  languages            text[]      NOT NULL DEFAULT '{}',
  uae_experience       boolean     NOT NULL DEFAULT false,
  previous_employer    text,
  cv_url               text,
  cv_file_name         text,
  last_active_at       timestamptz,
  profile_view_count   integer     NOT NULL DEFAULT 0,
  created_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT candidates_additional_roles_max
    CHECK (coalesce(cardinality(additional_roles), 0) <= 2)
);

CREATE INDEX IF NOT EXISTS candidates_user_id_idx    ON candidates (user_id);
CREATE INDEX IF NOT EXISTS candidates_browse_idx     ON candidates (is_active, location, role)
  WHERE is_active = true;
CREATE INDEX IF NOT EXISTS candidates_last_active_idx ON candidates (last_active_at DESC)
  WHERE is_active = true;

-- ---------------------------------------------------------------------------
-- employers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employers (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name         text        NOT NULL,
  contact_name         text        NOT NULL,
  phone                text        NOT NULL,
  email                text        NOT NULL,
  location             text        NOT NULL,
  credits_balance      integer     NOT NULL DEFAULT 0 CHECK (credits_balance >= 0),
  subscription_ends_at timestamptz,
  subscription_tier    text        DEFAULT 'starter'
                          CHECK (subscription_tier IN ('starter','business','agency')),
  trade_license        text,
  logo_url             text,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS employers_user_id_idx ON employers (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS employers_company_name_unique_idx
  ON employers (lower(trim(company_name)));

-- ---------------------------------------------------------------------------
-- unlocks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS unlocks (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id  uuid        NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  candidate_id uuid        NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  amount_paid  integer     NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
  unlocked_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (employer_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS unlocks_employer_id_idx  ON unlocks (employer_id);
CREATE INDEX IF NOT EXISTS unlocks_candidate_id_idx ON unlocks (candidate_id);

-- ---------------------------------------------------------------------------
-- monthly_unlocks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS monthly_unlocks (
  employer_id uuid  NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  month       date  NOT NULL,
  count       integer NOT NULL DEFAULT 0 CHECK (count >= 0),
  PRIMARY KEY (employer_id, month)
);

-- ---------------------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id       uuid        NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  amount            integer     NOT NULL CHECK (amount > 0),
  stripe_payment_id text,
  credits_purchased integer     NOT NULL CHECK (credits_purchased > 0),
  status            text        NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','completed','failed')),
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_employer_id_idx ON payments (employer_id);
