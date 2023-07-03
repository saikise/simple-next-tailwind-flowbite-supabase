// This page has no content yet so just redirect to the first Supabase page
import { redirect } from "next/navigation";
export default function Supabase() {
  redirect("/supabase/authentication");
}
