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

export default function Realtime() {
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

  // On page load, fetch notes from Vercel serverless function instead of directly from Supabase.
  useEffect(() => {
    async function fetchNotes() {
      if (!user) return;
      const endpoint = "/vercel/serverless-functions/api/notes";
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

  // Attaches a listener to the "table-db-changes" channel to listen for changes to the "notes" table and update the notes state accordingly. The same with /supabase/realtime/page.tsx.
  useEffect(() => {
    // References: https://supabase.com/docs/guides/realtime/postgres-changes#table-changes
    const channel = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notes" },
        (payload) =>
          setNotes((notes) => {
            if (payload.eventType === "INSERT") {
              const newPayload =
                payload.new as Database["public"]["Tables"]["notes"]["Row"];

              const newNote = {
                id: newPayload.id,
                title: newPayload.title,
                content: newPayload.content,
              };

              return [...notes, newNote];
            } else if (payload.eventType === "UPDATE") {
              const updatedPayload =
                payload.new as Database["public"]["Tables"]["notes"]["Row"];
              const updatedNote = {
                id: updatedPayload.id,
                title: updatedPayload.title,
                content: updatedPayload.content,
              };

              return notes.map((note) => {
                if (note.id === updatedNote.id) {
                  return updatedNote;
                }
                return note;
              });
            } else if (payload.eventType === "DELETE") {
              const deletedPayload =
                payload.old as Database["public"]["Tables"]["notes"]["Row"];

              return notes.filter((note) => note.id !== deletedPayload.id);
            } else {
              return [...notes];
            }
          })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setNotes, notes]);

  return user ? (
    <div className="gap-4 flex flex-col">
      <CreateNoteForm user={user} />
      <div>
        Page is updated in realtime using Supabase Realtime Postgres Changes.
      </div>
      <Pinboard notes={notes} />
    </div>
  ) : (
    <div>{message}</div>
  );
}
