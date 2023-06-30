"use client";

import { createNote } from "@/lib/data";
import type { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  user: User;
};

export default function CreateNoteForm({ user }: Props) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsCreatingNote(true);
      await createNote({
        supabase,
        title,
        content: note,
        userId: user.id,
      });
      setTitle("");
      setNote("");

      router.refresh();
    } catch (error) {
      alert("Create note failed. Check the console for more details.");
      console.error(error);
    } finally {
      setIsCreatingNote(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <input
          type="text"
          id="title"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Title"
          required
          onChange={handleTitleChange}
          value={title}
        />
      </div>
      <div className="mb-6">
        <input
          type="text"
          id="note"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Take a note..."
          required
          onChange={handleNoteChange}
          value={note}
        />
      </div>
      <button
        type="submit"
        className={`mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
          isCreatingNote
            ? "bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-700 cursor-not-allowed"
            : ""
        }`}
        disabled={isCreatingNote}
      >
        {isCreatingNote ? "Creating note..." : "Create Note"}
      </button>
    </form>
  );
}
