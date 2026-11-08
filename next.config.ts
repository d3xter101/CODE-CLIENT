// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("http://res.cloudinary.com/**"),
      // Cloudinary serves its images over https
      new URL("https://res.cloudinary.com/**"),
      // Placeholder photos for the gallery page
      new URL("https://picsum.photos/**"),
      new URL("https://fastly.picsum.photos/**"),
    ],
  },
};

export default nextConfig;
