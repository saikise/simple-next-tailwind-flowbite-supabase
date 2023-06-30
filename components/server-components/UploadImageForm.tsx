"use client";

import { uploadFile } from "@/lib/data";
import type { Database } from "@/lib/database.types";
import type { User } from "@supabase/auth-helpers-nextjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UploadImageFormProps {
  user: User;
}

export default function UploadImageForm({ user }: UploadImageFormProps) {
  const supabase = createClientComponentClient<Database>();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false); // added state variable for upload status
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      setFile(fileList[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected.");
      return;
    }

    setIsUploading(true);

    try {
      await uploadFile({
        supabase,
        userId: user.id,
        bucket: user.id,
        filepath: "images/" + file.name,
        file,
        options: {
          cacheControl: "3600",
          upsert: false,
        },
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error uploading file. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        htmlFor="file_input"
      >
        Upload file
      </label>
      <input
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        accept=".jpg,.png"
        max="10000000" // added max attribute to limit file size to 10MB
        onChange={handleFileChange}
      />
      <p
        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
        id="file_input_help"
      >
        PNG or JPG. Max 10MB.
      </p>

      <button
        type="button"
        className={`mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ${
          isUploading
            ? "bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-700 cursor-not-allowed"
            : ""
        }`}
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload"}{" "}
      </button>
    </div>
  );
}
