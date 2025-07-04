-- Add download_count column to resumes table
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS download_count integer DEFAULT 0;

-- Create function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(resume_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE resumes 
  SET download_count = COALESCE(download_count, 0) + 1,
      updated_at = now()
  WHERE id = resume_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;