// next.config.js
import type { NextConfig } from "next";

// A trailing slash in this variable turns every API call into //api/..., which the backend rejects with a 400
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  ...(backendUrl && { env: { NEXT_PUBLIC_BACKEND_URL: backendUrl } }),
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
