-- Add minimal columns to bookings table for reschedule request tracking

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS pending_reschedule_start_time timestamp with time zone,
ADD COLUMN IF NOT EXISTS pending_reschedule_end_time timestamp with time zone,
ADD COLUMN IF NOT EXISTS reschedule_requested_by uuid REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS reschedule_requester_type text CHECK (reschedule_requester_type = ANY (ARRAY['tutor'::text, 'student'::text])),
ADD COLUMN IF NOT EXISTS reschedule_reason text,
ADD COLUMN IF NOT EXISTS reschedule_status text DEFAULT NULL CHECK (reschedule_status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, NULL])),
ADD COLUMN IF NOT EXISTS reschedule_requested_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS reschedule_responded_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS reschedule_response_message text;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_reschedule_status ON public.bookings(reschedule_status) WHERE reschedule_status = 'pending';


