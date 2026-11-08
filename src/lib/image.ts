// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
// Hosts next/image is allowed to optimize, the same as images.remotePatterns in next.config.ts
const OPTIMIZED_HOSTS = ["res.cloudinary.com", "picsum.photos", "fastly.picsum.photos"];

/**
 * Whether next/image can optimize this url. Admins can paste any image url in the
 * admin panel, and next/image throws for a host it doesn't know, so those images
 * are shown as they are (`unoptimized`) instead of breaking the page.
 */
export function isOptimizableImage(src: string): boolean {
  try {
    return OPTIMIZED_HOSTS.includes(new URL(src).hostname);
  } catch {
    // a path from /public
    return src.startsWith("/");
  }
}
