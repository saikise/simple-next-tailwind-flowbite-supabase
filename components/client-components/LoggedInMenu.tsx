"use client";

import LoadingIndicator from "@/components/client-components/LoadingIndicator";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoggedInMenuProps {
  user: User;
}

export default function LoggedInMenu({ user }: LoggedInMenuProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error logging out. Check console for details.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex gap-4">
      <p className="text-white text-sm font-medium">{user?.email}</p>
      <button
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={handleLogout}
      >
        {isLoggingOut ? <LoadingIndicator /> : "Logout"}
      </button>
    </div>
  );
}
