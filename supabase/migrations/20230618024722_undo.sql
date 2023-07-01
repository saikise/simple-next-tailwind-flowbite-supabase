BEGIN;

DROP TRIGGER on_auth_user_created ON auth.users;

DROP FUNCTION public.handle_new_user();

DROP POLICY "Users can CRUD their own buckets" ON storage.buckets;

DROP POLICY "Users can CRUD their own objects" ON storage.objects;

DROP POLICY "Users can CRUD their own notes" ON notes;

DROP POLICY "Users can CRUD their own profiles" ON profiles;

DROP TABLE notes;

DROP TABLE profiles;

DELETE FROM
  storage.objects;

DELETE FROM
  storage.buckets;

-- References: https://supabase.com/docs/guides/realtime/postgres-changes#replication-setup
-- Remove the supabase_realtime publication if it exists
DROP PUBLICATION IF EXISTS supabase_realtime;

-- Re-create the supabase_realtime publication with no tables
CREATE PUBLICATION supabase_realtime;

-- Commit the transaction
COMMIT;