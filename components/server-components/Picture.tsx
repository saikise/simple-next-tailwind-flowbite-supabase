"use client";

import { grayBlurDataUrl } from "@/constants/colors";
import { deleteFiles } from "@/lib/data";
import type { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface PictureProps {
  bucket: string;
  src: string;
  alt: string;
  filepath: string;
}

export default function Picture({ src, alt, bucket, filepath }: PictureProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFiles({ supabase, bucket: bucket, filepath: [filepath] });
      setIsDeleting(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error deleting file. Check console for details.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="h-auto max-w-full rounded-lg relative">
      {isDeleting && (
        <div
          className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
          style={{ zIndex: 1 }}
        >
          <span className="text-white font-bold text-lg">Deleting...</span>
        </div>
      )}
      <button
        className="absolute top-0 right-0 p-2 text-gray-400 hover:text-red-500 focus:outline-none"
        onClick={handleDelete}
        disabled={isDeleting}
        style={{ zIndex: 2 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L10 8.586l-2.293-2.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <Image
        src={src}
        alt={alt}
        width={500}
        height={500}
        placeholder="blur"
        blurDataURL={grayBlurDataUrl}
      />
    </div>
  );
}
