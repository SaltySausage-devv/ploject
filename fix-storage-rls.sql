-- Fix RLS policies for message-files bucket
-- Run this SQL in your Supabase SQL Editor

-- First, let's check the current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Drop existing policies that might be blocking uploads
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to message files" ON storage.objects;

-- Create a simple policy that allows authenticated users to upload to message-files
CREATE POLICY "Allow authenticated uploads to message-files" ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'message-files');

-- Allow authenticated users to read files from message-files bucket
CREATE POLICY "Allow authenticated reads from message-files" ON storage.objects
FOR SELECT 
TO authenticated
USING (bucket_id = 'message-files');

-- Allow authenticated users to update files in message-files bucket
CREATE POLICY "Allow authenticated updates to message-files" ON storage.objects
FOR UPDATE 
TO authenticated
USING (bucket_id = 'message-files');

-- Allow authenticated users to delete files from message-files bucket
CREATE POLICY "Allow authenticated deletes from message-files" ON storage.objects
FOR DELETE 
TO authenticated
USING (bucket_id = 'message-files');

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
