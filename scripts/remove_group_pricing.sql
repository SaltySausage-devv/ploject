BEGIN;

DROP VIEW IF EXISTS public.tutor_search_view;

ALTER TABLE public.tutor_profiles
  DROP COLUMN IF EXISTS group_rate,
  DROP COLUMN IF EXISTS preferred_group_size;

CREATE VIEW public.tutor_search_view AS
SELECT
  tp.id,
  tp.user_id,
  tp.headline,
  tp.bio,
  tp.subjects,
  tp.levels,
  tp.hourly_rate,
  tp.monthly_package,
  tp.weekly_package,
  tp.bulk_package,
  tp.location,
  tp.preferred_locations,
  tp.experience_years,
  tp.average_rating,
  tp.total_reviews,
  tp.teaching_mode,
  tp.languages,
  tp.specialties,
  tp.preferred_student_levels,
  tp.profile_image_url,
  tp.is_verified,
  tp.search_tags,
  u.first_name,
  u.last_name,
  u.email,
  u.phone
FROM public.tutor_profiles tp
JOIN public.users u ON u.id = tp.user_id;

COMMIT;
