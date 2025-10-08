-- Database improvements for messaging system
-- Run this script in your Supabase SQL editor

-- 1. Add unique constraint to prevent duplicate conversations
ALTER TABLE conversations 
ADD CONSTRAINT unique_participants 
UNIQUE (participant1_id, participant2_id);

-- 2. Add database indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_participant1 
ON conversations(participant1_id);

CREATE INDEX IF NOT EXISTS idx_conversations_participant2 
ON conversations(participant2_id);

CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at 
ON conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id 
ON messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_created_at 
ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id 
ON messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_messages_read_at 
ON messages(read_at);

-- 3. Add message deletion endpoint support
-- Add a soft delete column to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Add index for soft delete queries
CREATE INDEX IF NOT EXISTS idx_messages_deleted_at 
ON messages(deleted_at);

-- 4. Add message archival support
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_messages_archived_at 
ON messages(archived_at);

-- 5. Add conversation status tracking
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' 
CHECK (status IN ('active', 'archived', 'blocked'));

CREATE INDEX IF NOT EXISTS idx_conversations_status 
ON conversations(status);

-- 6. Add message type index for filtering
CREATE INDEX IF NOT EXISTS idx_messages_message_type 
ON messages(message_type);

-- 7. Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created 
ON messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_participant_last_message 
ON conversations(participant1_id, participant2_id, last_message_at DESC);

-- 8. Add trigger to update conversation last_message_at when new message is inserted
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET 
    last_message_at = NEW.created_at,
    last_message_content = NEW.content
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_conversation_last_message ON messages;
CREATE TRIGGER trigger_update_conversation_last_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- 9. Add function to get unread message count
CREATE OR REPLACE FUNCTION get_unread_message_count(user_id UUID, conversation_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM messages
    WHERE conversation_id = $2
      AND sender_id != $1
      AND read_at IS NULL
      AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql;

-- 10. Add function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(user_id UUID, conversation_id UUID)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE messages
  SET read_at = NOW()
  WHERE conversation_id = $2
    AND sender_id != $1
    AND read_at IS NULL
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- 11. Add function to soft delete messages
CREATE OR REPLACE FUNCTION soft_delete_message(user_id UUID, message_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  message_exists BOOLEAN;
BEGIN
  -- Check if user is the sender of the message
  SELECT EXISTS(
    SELECT 1 FROM messages 
    WHERE id = $2 AND sender_id = $1 AND deleted_at IS NULL
  ) INTO message_exists;
  
  IF message_exists THEN
    UPDATE messages 
    SET deleted_at = NOW()
    WHERE id = $2;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 12. Add function to archive conversation
CREATE OR REPLACE FUNCTION archive_conversation(user_id UUID, conversation_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  conversation_exists BOOLEAN;
BEGIN
  -- Check if user is participant in conversation
  SELECT EXISTS(
    SELECT 1 FROM conversations 
    WHERE id = $2 
      AND (participant1_id = $1 OR participant2_id = $1)
      AND status = 'active'
  ) INTO conversation_exists;
  
  IF conversation_exists THEN
    UPDATE conversations 
    SET status = 'archived'
    WHERE id = $2;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 13. Add RLS policies for better security
-- Enable RLS on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see messages from conversations they participate in
CREATE POLICY "Users can view messages from their conversations" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE participant1_id = auth.uid() OR participant2_id = auth.uid()
    )
  );

-- Policy: Users can only insert messages to conversations they participate in
CREATE POLICY "Users can insert messages to their conversations" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE participant1_id = auth.uid() OR participant2_id = auth.uid()
    )
  );

-- Policy: Users can only update their own messages
CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (sender_id = auth.uid());

-- Enable RLS on conversations table
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see conversations they participate in
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (
    participant1_id = auth.uid() OR participant2_id = auth.uid()
  );

-- Policy: Users can create conversations where they are a participant
CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (
    participant1_id = auth.uid() OR participant2_id = auth.uid()
  );

-- Policy: Users can update conversations they participate in
CREATE POLICY "Users can update their conversations" ON conversations
  FOR UPDATE USING (
    participant1_id = auth.uid() OR participant2_id = auth.uid()
  );
