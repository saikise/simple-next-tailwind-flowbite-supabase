"use client";

import { deleteNote } from "@/lib/data";
import type { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import EditNoteForm from "./EditNoteForm";
import ToggleModalButton from "./ToggleModalButton";

export interface NoteProps {
  title: string;
  content: string;
  id: number;
}

export default function Note({ title, content, id }: NoteProps) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const pathname = usePathname();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteNote({
        supabase,
        noteId: id,
      });
      // If we're on the realtime page or the serverless functions page, we don't want to refresh the page because our Supabase Realtime subscription will automatically update the UI.
      if (
        pathname !== "/supabase/realtime" &&
        pathname !== "/vercel/serverless-functions"
      )
        router.refresh();
    } catch (error) {
      alert("Delete failed. Check the console for more details.");
      console.error(error);
    }

    setIsDeleting(false);
  };

  return (
    <div className="max-w-xs p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
      </a>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {content}
      </p>
      <div className="flex flex-wrap gap-4">
        <ToggleModalButton
          buttonName="Edit"
          modalID="editNoteModal"
          key="editNoteModal"
          modalTitle="Edit"
        >
          <EditNoteForm key={id} id={id} title={title} content={content} />
        </ToggleModalButton>
        <button
          className={`block w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 ${
            isDeleting
              ? "bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-700 cursor-not-allowed"
              : ""
          }`}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
