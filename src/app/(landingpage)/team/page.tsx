import TeamTreePage from "@/components/team/team";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Office Members & Developers - Code Club FST Settat",
  description:
    "Meet the office members and developers behind the Code Club at FST Settat: the students who organise our workshops, events and projects.",
  path: "/team",
  keywords: ["Team", "Office", "Members"],
});

export default async function TeamPage() {
  return <TeamTreePage />;
}
