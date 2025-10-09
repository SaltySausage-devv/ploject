-- Add reset token columns to users table for password reset functionality
-- Run this in your Supabase SQL editor

-- Add reset_token column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token TEXT;

-- Add reset_token_expires column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP WITH TIME ZONE;

-- Add index for better performance on reset token lookups
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);

-- Add index for expired token cleanup
CREATE INDEX IF NOT EXISTS idx_users_reset_token_expires ON users(reset_token_expires);

-- Optional: Add a function to clean up expired reset tokens
CREATE OR REPLACE FUNCTION cleanup_expired_reset_tokens()
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET reset_token = NULL, reset_token_expires = NULL
  WHERE reset_token_expires < NOW();
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to clean up expired tokens (runs every hour)
-- Note: This requires pg_cron extension to be enabled in Supabase
-- SELECT cron.schedule('cleanup-expired-reset-tokens', '0 * * * *', 'SELECT cleanup_expired_reset_tokens();');
