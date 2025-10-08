-- Clean up duplicate conversations
-- Run this in Supabase SQL editor to remove duplicates

-- First, let's see what duplicates exist
SELECT 
  participant1_id, 
  participant2_id, 
  COUNT(*) as count
FROM conversations 
GROUP BY participant1_id, participant2_id
HAVING COUNT(*) > 1;

-- Also check for reverse duplicates (A->B and B->A)
SELECT 
  LEAST(participant1_id, participant2_id) as user1,
  GREATEST(participant1_id, participant2_id) as user2,
  COUNT(*) as count
FROM conversations 
GROUP BY LEAST(participant1_id, participant2_id), GREATEST(participant1_id, participant2_id)
HAVING COUNT(*) > 1;

-- Remove duplicate conversations, keeping the oldest one
WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY LEAST(participant1_id, participant2_id), GREATEST(participant1_id, participant2_id)
      ORDER BY created_at ASC
    ) as rn
  FROM conversations
)
DELETE FROM conversations 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Verify cleanup
SELECT 
  LEAST(participant1_id, participant2_id) as user1,
  GREATEST(participant1_id, participant2_id) as user2,
  COUNT(*) as count
FROM conversations 
GROUP BY LEAST(participant1_id, participant2_id), GREATEST(participant1_id, participant2_id)
HAVING COUNT(*) > 1;
