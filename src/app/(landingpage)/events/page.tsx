import { pageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import EventsSection from "@/components/events/eventsSection";
import { getEvents, getNumPage } from "@/actions/events";

export const metadata: Metadata = pageMetadata({
  title: "FSTS Events: Hackathons & Workshops - Code Club FST Settat",
  description:
    "FSTS events by the CODE club: hackathons, competitions, workshops and orientation days at FST Settat. Browse upcoming events and register.",
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
