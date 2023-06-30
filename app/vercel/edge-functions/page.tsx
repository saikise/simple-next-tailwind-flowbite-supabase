"use client";

import CreateNoteForm from "@/components/client-components/CreateNoteForm";
import { NoteProps } from "@/components/client-components/Note";
import Pinboard from "@/components/client-components/Pinboard";
import type { Database } from "@/lib/database.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EdgeFunctions() {
  const [notes, setNotes] = useState<NoteProps[]>([]);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    async function fetchUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/supabase/authentication");
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error(error);
        setMessage("Error fetching user. Check console for details.");
      }
    }
    fetchUser();
  }, [supabase, router]);

  // Fetch notes from Vercel edge function instead of directly from Supabase.
  useEffect(() => {
    async function fetchNotes() {
      if (!user) return;
      const endpoint = "/vercel/edge-functions/api/notes";
      try {
        const res = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { notes } = await res.json();
        setNotes(notes || []);
      } catch (error) {
        console.log(error);
        setMessage("Error fetching notes. Check console for details.");
      }
    }
    fetchNotes();
  }, [supabase, user]);

  return user ? (
    <div className="gap-4 flex flex-col">
      <CreateNoteForm user={user} />
      <div>
        Page is not updated in realtime. Requires a page refresh to call Vercel
        serverless function again and see changes. Because router.refresh() only
        works for data that are fetched server side. Notes here are fetched
        client-side inside a useEffect.
      </div>
      <Pinboard notes={notes} />
    </div>
  ) : (
    <div>{message}</div>
  );
}
