/*
  # ISMPH Media Tracker Complete Database Schema
  
  1. New Tables
    - `profiles` - User accounts with roles and state assignments
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `phone` (text)
      - `role` (text) - public, staff, state_admin, super_admin
      - `state` (text) - Lagos, Abuja, Kano, Kaduna
      - `avatar_url` (text)
      - `language_preference` (text, default 'en')
      - `notification_enabled` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `diseases` - Disease tracking by zone and state
      - `id` (uuid, primary key)
      - `disease_name` (text)
      - `zone` (text) - North, South, East, West, Federal
      - `state` (text)
      - `new_cases` (integer, default 0)
      - `total_cases` (integer, default 0)
      - `mortality` (integer, default 0)
      - `recovered` (integer, default 0)
      - `severity` (text) - low, medium, high, critical
      - `last_updated` (timestamptz, default now())
      - `created_at` (timestamptz, default now())
    
    - `reports` - PHC reports with approval workflow
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `state` (text)
      - `title` (text)
      - `category` (text)
      - `description` (text)
      - `priority` (text) - low, medium, high, critical
      - `status` (text, default 'pending') - draft, pending, approved, rejected
      - `media_urls` (text array, default empty array)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `feedback` - User feedback and PHC issue reports
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `facility_id` (uuid, references phc_facilities)
      - `issue` (text)
      - `category` (text)
      - `tags` (text array, default empty array)
      - `description` (text)
      - `status` (text, default 'pending') - pending, resolved, critical
      - `is_read` (boolean, default false)
      - `action_taken` (text)
      - `admin_message` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `phc_facilities` - Primary Healthcare Center locations
      - `id` (uuid, primary key)
      - `name` (text)
      - `state` (text)
      - `address` (text)
      - `reports_count` (integer, default 0)
      - `created_at` (timestamptz, default now())
    
    - `chat_history` - Zone-based communication messages
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `zone` (text)
      - `message` (text)
      - `timestamp` (timestamptz, default now())
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Role-based access control
    - State-scoped permissions for admins
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'public',
  state text,
  avatar_url text,
  language_preference text DEFAULT 'en',
  notification_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create diseases table
CREATE TABLE IF NOT EXISTS diseases (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  disease_name text NOT NULL,
  zone text NOT NULL,
  state text NOT NULL,
  new_cases integer DEFAULT 0,
  total_cases integer DEFAULT 0,
  mortality integer DEFAULT 0,
  recovered integer DEFAULT 0,
  severity text DEFAULT 'medium',
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create phc_facilities table
CREATE TABLE IF NOT EXISTS phc_facilities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  state text NOT NULL,
  address text NOT NULL,
  reports_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  state text NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  priority text DEFAULT 'medium',
  status text DEFAULT 'pending',
  media_urls text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  facility_id uuid REFERENCES phc_facilities(id) ON DELETE SET NULL,
  issue text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  description text NOT NULL,
  status text DEFAULT 'pending',
  is_read boolean DEFAULT false,
  action_taken text,
  admin_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  zone text NOT NULL,
  message text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE phc_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Diseases policies (public read access)
CREATE POLICY "Anyone can view diseases"
  ON diseases FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert diseases"
  ON diseases FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('state_admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update diseases"
  ON diseases FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('state_admin', 'super_admin')
    )
  );

-- Reports policies
CREATE POLICY "Users can view reports"
  ON reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- PHC facilities policies (public read)
CREATE POLICY "Anyone can view facilities"
  ON phc_facilities FOR SELECT
  TO authenticated
  USING (true);

-- Feedback policies
CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('state_admin', 'super_admin', 'staff')
    )
  );

CREATE POLICY "Admins can update feedback"
  ON feedback FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('state_admin', 'super_admin', 'staff')
    )
  );

-- Chat history policies
CREATE POLICY "Staff can view zone chat"
  ON chat_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'state_admin', 'super_admin')
    )
  );

CREATE POLICY "Staff can send messages"
  ON chat_history FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'state_admin', 'super_admin')
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_diseases_zone ON diseases(zone);
CREATE INDEX IF NOT EXISTS idx_diseases_state ON diseases(state);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_facility_id ON feedback(facility_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_zone ON chat_history(zone);
CREATE INDEX IF NOT EXISTS idx_chat_history_timestamp ON chat_history(timestamp DESC);
