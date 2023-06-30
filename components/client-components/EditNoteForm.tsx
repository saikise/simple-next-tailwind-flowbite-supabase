"use client";

import { updateNote } from "@/lib/data";
import type { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditNoteFormProps {
  id: number;
  title: string;
  content: string;
}

export default function EditNoteForm({
  id,
  title,
  content,
}: EditNoteFormProps) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const [formTitle, setFormTitle] = useState(title);
  const [formNote, setFormNote] = useState(content);
  const [isUpdatingNote, setIsUpdatingNote] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormTitle(event.target.value);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormNote(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsUpdatingNote(true);
      await updateNote({
        supabase,
        title: formTitle,
        content: formNote,
        noteId: id,
      });

      router.refresh();
    } catch (error) {
      alert("Update note failed. Check the console for more details.");
      console.error(error);
    } finally {
      setIsUpdatingNote(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <input
          type="text"
          id="title"
          value={formTitle}
          onChange={handleTitleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="New title"
          required
        />
      </div>
      <div className="mb-6">
        <input
          type="text"
          id="note"
          value={formNote}
          onChange={handleNoteChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="New note..."
          required
        />
      </div>
      <button
        type="submit"
        className={`mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
          isUpdatingNote
            ? "bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-700 cursor-not-allowed"
            : ""
        }`}
        disabled={isUpdatingNote}
      >
        {isUpdatingNote ? "Updating note..." : "Save"}
      </button>
    </form>
  );
}
