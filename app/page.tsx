// No content in home page. Redirect to first page.
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/supabase/authentication");
}
