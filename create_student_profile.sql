-- SQL script to create a fake student profile
-- Uses the provided UUID for the authenticated user

INSERT INTO public.users (
  id,
  email,
  first_name,
  last_name,
  user_type,
  phone,
  date_of_birth,
  phone_verified,
  credits,
  created_at,
  updated_at
)
VALUES (
  'a3efd8a2-e01d-4aa1-bc0e-89d45dca5dd4'::uuid,
  'student@gmail.com',
  'Student',
  'Jane',
  'student',
  '87641412',
  '2000-01-01'::date,
  true,  -- Mark phone as verified
  0.0,   -- Starting credits
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  user_type = EXCLUDED.user_type,
  phone = EXCLUDED.phone,
  date_of_birth = EXCLUDED.date_of_birth,
  phone_verified = EXCLUDED.phone_verified,
  updated_at = now();

-- Verify the insert
SELECT 
  id,
  email,
  first_name,
  last_name,
  user_type,
  phone,
  date_of_birth,
  phone_verified,
  credits
FROM public.users
WHERE email = 'student@gmail.com';

