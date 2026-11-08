import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Privacy Policy - Code Club FST Settat",
  description:
    "The terms of use and privacy policy of the Code Club at FST Settat: what member data we collect and how we use it.",
  path: "/privacy-policy",
  keywords: ["Privacy Policy", "Terms"],
});

export default function PrivacyPolicyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
