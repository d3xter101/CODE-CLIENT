// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
import { pageMetadata } from "@/lib/seo";
import GallerySection from "@/components/gallery/gallery-section";
import { getGalleryPhotos } from "@/actions/gallery";
import { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Photo Gallery - Code Club FST Settat",
  description:
    "Photos from the hackathons, workshops, talks and trips of the Code Club at FST Settat.",
  path: "/gallery",
  keywords: ["Gallery", "Photos", "Events"],
});

export default async function GalleryPage() {
  const photos = await getGalleryPhotos();

  return (
    <main className="w-full flex-1 container mx-auto">
      <GallerySection photos={photos} />
    </main>
  );
}
