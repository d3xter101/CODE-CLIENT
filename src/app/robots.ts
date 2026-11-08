// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** Crawlers of AI search and assistants, allowed on purpose so the club can be cited in AI answers. */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
];

const PRIVATE_PATHS = [
  "/api/",
  "/login",
  "/register",
  "/profile",
  "/forgotPassword",
  "/validateEmail",
  "/changePassword",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: AI_CRAWLERS, allow: ["/", "/llms.txt"], disallow: PRIVATE_PATHS },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
