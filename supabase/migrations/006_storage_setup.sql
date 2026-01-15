-- Note: This migration is for reference. Storage buckets should be created manually in Supabase Dashboard
-- Go to Storage > Create Bucket > Name: 'images' > Public: true

-- Storage policies will be set up automatically, but here's what should be configured:
-- 1. Create bucket named 'images' with public access
-- 2. Allow authenticated users to upload files
-- 3. Allow public read access

-- Example policy (set in Supabase Dashboard > Storage > Policies):
-- Policy: Allow authenticated uploads
-- INSERT: authenticated users can upload
-- UPDATE: authenticated users can update their own files
-- DELETE: authenticated users can delete their own files
-- SELECT: public can read

