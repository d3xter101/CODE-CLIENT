import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { Banner } from "@/components/ui/banner";
import { isDateRegistration } from "@/actions/is-date-registration";
import Link from "next/link";
import {
  DEFAULT_OG_IMAGE,
  HOME_TITLE,
  SITE_DESCRIPTION,
  SITE_META_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
  jsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: HOME_TITLE,
  description: SITE_META_DESCRIPTION,
  keywords: [
    "Code Club",
    "FST Settat",
    "Student Club",
    "Programming",
    "Workshops",
    "Projects",
    "Collaboration",
  ],
  authors: [{ name: "Code Club FST Settat" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: HOME_TITLE,
    description: SITE_META_DESCRIPTION,
    url: "/",
    locale: "en_US",
    siteName: "Code Club FST Settat",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Code Club FST Settat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: SITE_META_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: [{ rel: "icon", url: "/icons/favicon-dark.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isRegistrationOpen = await isDateRegistration();

  return (
    <html lang="en" translate="no" className="notranslate dark" style={{ colorScheme: "dark" }}>
      <head>
        <meta name="google" content="notranslate" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["Organization", "EducationalOrganization"],
                  "@id": `${SITE_URL}/#organization`,
                  alternateName: ["CODE Club", "Club CODE", "CODE FSTS", "Club CODE FSTS", "Code Club of Development Enthusiasts"],
                  areaServed: "Settat, Morocco",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Settat",
                    addressCountry: "MA",
                  },
                  parentOrganization: {
                    "@type": "CollegeOrUniversity",
                    name: "Faculty of Sciences and Techniques of Settat (FST Settat), Hassan First University",
                  },
                  knowsAbout: [
                    "Programming",
                    "Web development",
                    "Hackathons",
                    "Cybersecurity",
                    "Software engineering workshops",
                  ],
                  name: SITE_NAME,
                  url: SITE_URL,
                  logo: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
                  description: SITE_DESCRIPTION,
                  sameAs: SOCIAL_PROFILES,
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: SITE_NAME,
                  alternateName: ["CODE Club FSTS", "Club CODE FSTS", "CODE FSTS"],
                  inLanguage: "en",
                  publisher: { "@id": `${SITE_URL}/#organization` },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased"
      >
          {isRegistrationOpen && (
            <Banner
              variant="rainbow"
              rainbowColors={[
                "rgba(255,100,0, 0.5)",
                "rgba(255,100,0, 0.5)",
                "transparent",
                "rgba(255,100,0, 0.5)",
                "transparent",
                "rgba(255,100,0, 0.5)",
                "transparent",
              ]}
              className="border-b border-secondary flex flex-wrap  items-center justify-center pb-1 text-center break-all"
            >
              <span className="whitespace-nowrap">
                🎉 Registration is now open! Go to
              </span>
              <Link
                className="mx-1 font-semibold underline whitespace-nowrap"
                href="/register"
                rel="noopener"
              >
                the registration page
              </Link>
              <span className="whitespace-nowrap">to secure your spot.</span>
            </Banner>
          )}

          {children}

          <Analytics />
          <Toaster richColors />
      </body>
    </html>
  );
}
