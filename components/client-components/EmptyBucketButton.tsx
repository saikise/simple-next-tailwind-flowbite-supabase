"use client";

import { emptyBucket } from "@/lib/data";
import type { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EmptyBucketButtonProps {
  bucket: string;
}

export default function EmptyBucketButton({ bucket }: EmptyBucketButtonProps) {
  const supabase = createClientComponentClient<Database>();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleEmptyBucket = async () => {
    setIsDeleting(true);
    try {
      await emptyBucket({ supabase, bucket });
      alert("Bucket emptied successfully.");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error emptying bucket. Check console for details.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className={`focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 ${
          isDeleting
            ? "bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-700 cursor-not-allowed"
            : ""
        }`}
        onClick={handleEmptyBucket}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Empty bucket"}
      </button>
      <p className="text-sm text-gray-500 mt-2">
        This will delete all files under a Supabase bucket
      </p>
    </div>
  );
}
