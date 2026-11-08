// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
export const galleryCategories = [
  "Hackathons",
  "Workshops",
  "Talks",
  "Community",
] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

// How much room a photo takes in the bento grid
export type GalleryTileSize = "featured" | "tall" | "wide" | "regular";

// A photo as the backend sends it (GET /api/v1/gallery), the photos are managed in the admin panel
export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  event: string;
  caption: string;
  category: GalleryCategory;
  date: string; // ISO date of the event
  size: GalleryTileSize;
}
