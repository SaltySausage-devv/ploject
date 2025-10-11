-- Add new message types to the messages table for reschedule feature
-- This updates the CHECK constraint to allow reschedule-related message types

-- Drop the existing constraint
ALTER TABLE public.messages
DROP CONSTRAINT IF EXISTS messages_message_type_check;

-- Add the new constraint with additional message types
ALTER TABLE public.messages
ADD CONSTRAINT messages_message_type_check
CHECK (message_type = ANY (ARRAY[
  'text'::text,
  'image'::text,
  'file'::text,
  'document'::text,
  'booking_offer'::text,
  'booking_proposal'::text,
  'booking_confirmation'::text,
  'reschedule_request'::text,
  'reschedule_accepted'::text,
  'reschedule_rejected'::text
]));

