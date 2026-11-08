import { Metadata } from "next";
import ProfilePage from "@/components/profile/profile-page";

export const metadata: Metadata = {
  title: "My profile - Code Club FST Settat",
  description: "Manage your Code Club account: personal details, areas of interest and password.",
  robots: { index: false, follow: false },
};

export default function Profile() {
  return (
    <main className="w-full flex-1 container mx-auto px-4 py-10">
      <ProfilePage />
    </main>
  );
}
