import { Metadata } from "next";
import { noIndex } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Validate email - Code Club FST Settat",
  description:
    "Access your account to stay updated with the latest news, events, and projects from the Code Club at FST Settat. Login to explore student projects and activities.",
  keywords: [
    "Code Club",
    "FST Settat",
    "Student Club",
    "News",
    "Events",
    "Projects",
  ],
  authors: [{ name: "Code Club FST Settat" }],
  robots: noIndex,
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[80vh] flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>
    </div>
  );
}
