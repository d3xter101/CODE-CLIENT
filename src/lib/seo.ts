// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
import type { Metadata } from "next";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://clubcode.online"
).replace(/\/$/, "");
export const SITE_NAME = "Code Club FST Settat";
export const SITE_DESCRIPTION =
  "Code Club is a student-led initiative at FST Settat, created by engineering students passionate about turning theory into practice. Our mission is to share knowledge, build skills, and collaborate through projects, workshops, and events.";
/** Short (<160 chars) description for <meta> and social cards; the long one feeds JSON-LD. */
export const SITE_META_DESCRIPTION =
  "CODE is the student programming club of FSTS (FST Settat). Join our hackathons, workshops and FSTS events, and turn theory into practice.";
export const HOME_TITLE = "CODE Club FSTS | Programming Club of FST Settat";
export const DEFAULT_OG_IMAGE = "/og-image.webp";
export const SOCIAL_PROFILES = [
  "https://www.instagram.com/code.club12/",
  "https://www.linkedin.com/company/code-club-of-development-enthusiasts/",
];

/** Pages that must stay out of search results (accounts, recovery flows). */
export const noIndex: Metadata["robots"] = { index: false, follow: false };

interface PageMetadataOptions {
  title: string;
  description: string;
  /** Path of the page, e.g. "/news/abc". Used for the canonical and og:url. */
  path: string;
  keywords?: string[];
  /** Absolute or site-relative image URL; defaults to the site OG image. */
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
}

/**
 * Metadata for a public page. A child page's `openGraph` replaces the root
 * one entirely, so every page has to carry its own image and url, plus a
 * canonical that points at itself rather than at the home page.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  publishedTime,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    keywords: ["Code Club", "FST Settat", "Student Club", ...(keywords ?? [])],
    authors: [{ name: SITE_NAME }],
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/** Serialises JSON-LD for a <script> tag, escaping "<" so content can't close it. */
export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** The date, or undefined when the backend sent none or an invalid one (an invalid Date throws on toISOString). */
export function validDate(value: string | number | Date | null | undefined): Date | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** ISO string of a date that may be missing or invalid, undefined otherwise. */
export function isoDate(value: string | number | Date | null | undefined): string | undefined {
  return validDate(value)?.toISOString();
}

/** Markdown text as a plain meta description: syntax removed, cut at a word near `max` characters. */
export function plainDescription(markdown: string | null | undefined, max = 155): string {
  const text = (markdown ?? "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s*[-+]\s+/gm, "")
    .replace(/[#*_`>~]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}
