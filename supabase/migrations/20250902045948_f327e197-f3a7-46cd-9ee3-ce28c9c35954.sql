-- Add missing columns used by app logic
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS admin_password text;

-- Note: RLS already exists on profiles, so these columns remain protected.
-- We are not adding triggers on auth schema per project guidelines.