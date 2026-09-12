import { getAllMedia } from "@/lib/data/media";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaClient } from "./MediaClient";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  let media: any[] = [];
  let errorNotice: string | null = null;

  try {
    const result = await getAllMedia();
    media = result.media;
  } catch (err: any) {
    errorNotice = err.message || "Could not load media library.";
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Media & Asset Library"
        description="Upload images, security schematics, logos, and badges to Supabase Storage bucket 'cyberforage-media'."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Media Library" },
        ]}
      />

      {errorNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <span>{errorNotice} Ensure Supabase Storage bucket is initialized.</span>
        </div>
      )}

      <MediaClient initialMedia={media} />
    </AdminLayout>
  );
}
