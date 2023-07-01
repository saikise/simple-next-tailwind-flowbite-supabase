BEGIN;

CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
);

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
-- Table definitions of storage.buckets and storage.objects can be found in Supabase web app's Table Editor.
CREATE POLICY "Users can CRUD their own buckets" ON storage.buckets FOR ALL USING (
  id = auth.uid() :: text
  AND name = auth.uid() :: text
  AND owner = auth.uid()
);

ALTER TABLE
  profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own objects" ON storage.objects FOR ALL USING (
  bucket_id = auth.uid() :: text
  AND owner = auth.uid()
);

-- Allow users to SELECT, INSERT, UPDATE, and DELETE their own notes
CREATE POLICY "Users can CRUD their own notes" ON notes FOR ALL USING (user_id = auth.uid());

-- Allow users to SELECT, INSERT, UPDATE, and DELETE their own profiles
CREATE POLICY "Users can CRUD their own profiles" ON profiles FOR ALL USING (id = auth.uid());

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
-- Automatically creates a profile and bucket for each new user
CREATE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO storage.buckets (id, name, owner)
  VALUES (NEW.id::text, NEW.id::text, NEW.id);

  INSERT INTO public.profiles (id, username, email)
  VALUES (NEW.id, split_part(NEW.email, '@', 1), NEW.email);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER
INSERT
  ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- References: https://supabase.com/docs/guides/realtime/postgres-changes#replication-setup
-- Add the notes table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime
ADD
  TABLE notes;

-- Commit the transaction
COMMIT;