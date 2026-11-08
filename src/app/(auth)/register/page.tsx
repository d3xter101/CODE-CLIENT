import { redirect } from "next/navigation";
import { isDateRegistration } from "@/actions/is-date-registration";
import RegisterClientPage from "@/components/register/register-client";
import Header from "@/components/layouts/header";
import { Metadata } from "next";
import { noIndex } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Register - Code Club FST Settat",
  description:
    "Create your Code Club FST Settat account to join workshops, hackathons and projects with fellow students.",
  keywords: [
    "Code Club",
    "FST Settat",
    "News",
    "Events",
    "Projects",
    "Student Club",
    "Registration Opened",
  ],
  authors: [{ name: "Code Club FST Settat" }],
  robots: noIndex,
};

export default async function RegisterPage() {
  const allowed = await isDateRegistration();

 
  if (!allowed) {
    redirect("/");  
  } 

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <RegisterClientPage />
      </main>
    </div>
  )
}