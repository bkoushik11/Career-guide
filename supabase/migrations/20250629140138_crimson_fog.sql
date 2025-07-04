/*
  # Resume Builder Database Schema

  1. New Tables
    - `resumes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `template_id` (text)
      - `personal_info` (jsonb)
      - `summary` (text)
      - `experience` (jsonb)
      - `education` (jsonb)
      - `skills` (jsonb)
      - `certifications` (jsonb)
      - `projects` (jsonb)
      - `additional_sections` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `resume_templates`
      - `id` (text, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `preview_image` (text)
      - `config` (jsonb)
      - `is_premium` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Resume',
  template_id text NOT NULL DEFAULT 'modern-professional',
  personal_info jsonb DEFAULT '{}',
  summary text DEFAULT '',
  experience jsonb DEFAULT '[]',
  education jsonb DEFAULT '[]',
  skills jsonb DEFAULT '[]',
  certifications jsonb DEFAULT '[]',
  projects jsonb DEFAULT '[]',
  additional_sections jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resume templates table
CREATE TABLE IF NOT EXISTS resume_templates (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  preview_image text,
  config jsonb DEFAULT '{}',
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_templates ENABLE ROW LEVEL SECURITY;

-- Policies for resumes
CREATE POLICY "Users can view own resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own resumes"
  ON resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for templates (public read access)
CREATE POLICY "Anyone can view templates"
  ON resume_templates
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default templates
INSERT INTO resume_templates (id, name, description, category, preview_image, config, is_premium) VALUES
('modern-professional', 'Modern Professional', 'Clean, contemporary design perfect for tech and creative industries', 'Modern', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', '{"colors": {"primary": "#3B82F6", "secondary": "#64748B"}, "fonts": {"heading": "Inter", "body": "Inter"}}', false),
('classic-executive', 'Classic Executive', 'Traditional format ideal for corporate and executive positions', 'Classic', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', '{"colors": {"primary": "#1F2937", "secondary": "#6B7280"}, "fonts": {"heading": "Times New Roman", "body": "Times New Roman"}}', false),
('creative-designer', 'Creative Designer', 'Bold and artistic template for designers and creative professionals', 'Creative', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', '{"colors": {"primary": "#8B5CF6", "secondary": "#A78BFA"}, "fonts": {"heading": "Poppins", "body": "Open Sans"}}', true),
('minimalist-clean', 'Minimalist Clean', 'Simple, elegant design that focuses on content over decoration', 'Minimalist', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', '{"colors": {"primary": "#000000", "secondary": "#666666"}, "fonts": {"heading": "Helvetica", "body": "Helvetica"}}', false),
('tech-developer', 'Tech Developer', 'Optimized for software developers and technical professionals', 'Technical', 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', '{"colors": {"primary": "#10B981", "secondary": "#059669"}, "fonts": {"heading": "Fira Code", "body": "Source Code Pro"}}', true),
('academic-researcher', 'Academic Researcher', 'Comprehensive format for academic and research positions', 'Academic', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', '{"colors": {"primary": "#DC2626", "secondary": "#B91C1C"}, "fonts": {"heading": "Georgia", "body": "Georgia"}}', false);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for resumes table
CREATE TRIGGER update_resumes_updated_at
    BEFORE UPDATE ON resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();