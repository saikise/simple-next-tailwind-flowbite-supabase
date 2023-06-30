import CreateNoteForm from "@/components/client-components/CreateNoteForm";
import Pinboard from "@/components/client-components/Pinboard";
import { getNotes } from "@/lib/data";
import type { Database } from "@/lib/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Database() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/supabase/authentication");
  }

  let notes: Database["public"]["Tables"]["notes"]["Row"][] = [];
  try {
    notes = await getNotes({ supabase, userId: user.id });
  } catch (error) {
    console.error(error);
    alert("Error getting notes. Check console for details.");
  }

  return (
    <div className="gap-4 flex flex-col">
      <CreateNoteForm user={user} />
      <div>Page is updated in realtime using Next.js router.refresh().</div>
      <Pinboard notes={notes} />
    </div>
  );
}
