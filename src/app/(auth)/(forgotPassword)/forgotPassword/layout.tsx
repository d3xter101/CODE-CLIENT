import { Metadata } from "next";
import { noIndex } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Forgot password - Code Club FST Settat",
  description:
    "Recover access to your Code Club FST Settat account: enter your email and we will send you a code to reset your password.",
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
