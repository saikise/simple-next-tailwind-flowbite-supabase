import EmptyBucketButton from "@/components/client-components/EmptyBucketButton";
import Gallery from "@/components/server-components/Gallery";
import { PictureProps } from "@/components/server-components/Picture";
import UploadImageForm from "@/components/server-components/UploadImageForm";
import { createSignedUrl, getFilesInBucket } from "@/lib/data";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Storage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/supabase/authentication");
  }

  let pictures: PictureProps[] = [];

  try {
    const files = await getFilesInBucket({
      supabase,
      bucket: user.id,
      folder: "images",
    });

    pictures = await Promise.all(
      files.map(async (file) => {
        const filepath = `images/${file.name}`;
        const { signedUrl } = await createSignedUrl({
          supabase,
          bucket: user.id,
          filepath,
        });
        return {
          src: signedUrl,
          alt: `Uploaded picture with filename ${file.name}`,
          bucket: user.id,
          filepath,
        };
      })
    );
  } catch (error) {
    console.error(error);
    alert("Error getting pictures. Check console for details.");
  }

  return (
    <div className="gap-4 flex flex-col">
      <UploadImageForm user={user} />
      <EmptyBucketButton bucket={user.id} />
      <div>Page is updated in realtime using Next.js router.refresh().</div>
      <Gallery bucket={user.id} pictures={pictures} />
    </div>
  );
}
