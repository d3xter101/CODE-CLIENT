// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
import { GalleryPhoto } from "@/lib/gallery";

// The photos the admin panel published, newest event first. An unreachable backend gives an empty gallery.
export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/gallery`, {
      next: { revalidate: 300 },
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch the gallery:", error);
    return [];
  }
}
