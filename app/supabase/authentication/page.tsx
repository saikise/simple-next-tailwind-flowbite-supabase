import LoggedInMenu from "@/components/client-components/LoggedInMenu";
import LoggedOutMenu from "@/components/client-components/LoggedOutMenu";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Authentication() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <>{user ? <LoggedInMenu user={user} /> : <LoggedOutMenu />}</>;
}
