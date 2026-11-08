import { pageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import EventsSection from "@/components/events/eventsSection";
import { getEvents, getNumPage } from "@/actions/events";

export const metadata: Metadata = pageMetadata({
  title: "Tech Events, Hackathons & Workshops - Code Club FST Settat",
  description:
    "Upcoming hackathons, competitions, workshops and orientation events organized by the Code Club at FST Settat. Browse and register.",
  path: "/events",
  keywords: ["Events", "Workshops", "Hackathons"],
});

interface EventsPageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
    const params = await searchParams; 

  

    const currentPage = Number(params.page) || 1;
    const events = await getEvents(currentPage);
    const totalPages = await getNumPage();

    return (
        <main className="w-full flex-1 container mx-auto">
            <EventsSection
                events={events}
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </main>
    );
}
