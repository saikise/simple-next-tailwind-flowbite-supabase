import type { Database } from "@/lib/database.types";
import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export const createNote = async ({
  supabase,
  title,
  content,
  userId,
}: {
  supabase: SupabaseClient<Database>;
  title: string;
  content: string;
  userId: string;
}) => {
  const { data, error } = await supabase
    .from("notes")
    .insert({
      title,
      content,
      user_id: userId,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const deleteNote = async ({
  supabase,
  noteId,
}: {
  supabase: SupabaseClient<Database>;
  noteId: number;
}) => {
  const { data, error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId);

  if (error) {
    throw error;
  }
  return data;
};

export const getNotes = async ({
  supabase,
  userId,
}: {
  supabase: SupabaseClient<Database>;
  userId: string;
}) => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
  return data;
};

export const updateNote = async ({
  supabase,
  noteId,
  title,
  content,
}: {
  supabase: SupabaseClient<Database>;
  noteId: number;
  title: string;
  content: string;
}) => {
  const { data, error } = await supabase
    .from("notes")
    .update({
      title,
      content,
    })
    .eq("id", noteId);

  if (error) {
    throw error;
  }
  return data;
};

export const login = async ({
  supabase,
  email,
  password,
}: {
  supabase: SupabaseClient<Database>;
  email: string;
  password: string;
}) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
};

export const logout = async ({
  supabase,
}: {
  supabase: SupabaseClient<Database>;
}) => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const register = async ({
  supabase,
  email,
  password,
  emailRedirectTo,
}: {
  supabase: SupabaseClient<Database>;
  email: string;
  password: string;
  emailRedirectTo: string;
}) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });
  if (error) throw error;
};

export const createSignedUrl = async ({
  supabase,
  bucket,
  filepath,
  expiresIn = 60,
}: {
  supabase: SupabaseClient<Database>;
  bucket: string;
  filepath: string;
  expiresIn?: number;
}) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filepath, expiresIn);

  if (error) {
    throw error;
  }
  return data;
};

export const downloadFile = async ({
  supabase,
  bucket,
  filepath,
}: {
  supabase: SupabaseClient<Database>;
  bucket: string;
  filepath: string;
}) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(filepath);

  if (error) {
    throw error;
  }
  return data;
};

export const getFilesInBucket = async ({
  supabase,
  bucket,
  folder,
  limit = 100,
  offset = 0,
  sortBy = { column: "created_at", order: "desc" },
}: {
  supabase: SupabaseClient<Database>;
  bucket: string;
  folder: string;
  limit?: number;
  offset?: number;
  sortBy?: { column: string; order: string };
}) => {
  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    limit,
    offset,
    sortBy,
  });

  if (error) {
    throw error;
  }
  return data;
};

export const deleteFiles = async ({
  supabase,
  bucket,
  filepath,
}: {
  supabase: SupabaseClient<Database>;
  bucket: string;
  filepath: string[];
}) => {
  const { data, error } = await supabase.storage.from(bucket).remove(filepath);

  if (error) {
    throw error;
  }
  return data;
};

export const emptyBucket = async ({
  supabase,
  bucket,
}: {
  supabase: SupabaseClient<Database>;
  bucket: string;
}) => {
  const { data, error } = await supabase.storage.emptyBucket(bucket);

  if (error) {
    throw error;
  }
  return data;
};

export const uploadFile = async ({
  supabase,
  userId,
  bucket,
  filepath,
  file,
  options = {
    cacheControl: "3600",
    upsert: false,
  },
}: {
  supabase: SupabaseClient<Database>;
  userId: string;
  bucket: string;
  filepath: string;
  file: File;
  options?: {
    cacheControl?: string;
    upsert?: boolean;
  };
}) => {
  const time = new Date().getTime();

  const { data, error } = await supabase.storage
    .from(bucket)
    // Make sure to use a unique filepath for every file so there will be no duplicates under storage.objects table.
    // Example `${filepath}_${userId}_${time}`: minecraft.png_c6684a95-9b6f-4a1a-8a01-5c3c70c74b13_1687848386693
    .upload(`${filepath}_${userId}_${time}`, file, options);

  if (error) {
    throw error;
  }
  return data;
};
