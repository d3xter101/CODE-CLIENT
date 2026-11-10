"use client";

import PageHero from "@/components/ui/page-hero";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "motion/react";
import { CalendarDays, Newspaper } from "lucide-react";
import { Event } from "@/types/backendTypes";
import Pagination from "./pagination";
import Image from "next/image";

interface EventProps {
  events: Event[];
  currentPage: number;
  totalPages: number;
}

export default function EventsSection({
  events,
  currentPage,
  totalPages,
}: EventProps) {
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  const subtitle = "Discover what's happening at CODE Club";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTypedText(subtitle.slice(0, i));
      if (i >= subtitle.length) {
        clearInterval(interval); 
        setTypingDone(true);
      }
    }, 25);
    return () => clearInterval(interval);
  }, []);

  const buttonVariant = "secondary";
  const sortedEvents = [...events].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="container mx-auto p-4">
      <PageHero
        badge="Workshops &amp; Competitions"
        title={<>FSTS <span className="text-primary">Events</span> &amp; Workshops</>}
        description={typedText}
        descriptionClassName="min-h-7"
      />

      {sortedEvents.length > 0 ? (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {sortedEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{
                  opacity: typingDone ? 1 : 0,
                  y: typingDone ? 0 : 50,
                  scale: typingDone ? 1 : 0.9,
                }}
                transition={{
                  duration: 0.6,
                  delay: typingDone ? i * 0.2 : 0,
                  ease: "easeOut",
                }}
              >
                <Link href={`/events/${event.id}`}>
                  <Card className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 cursor-pointer p-0">
                    <div className="h-48 w-full overflow-hidden relative rounded-t-2xl">
                      <Image
                        src={event.image.uri}
                        alt={event.title}
                        width={2000}
                        height={1200}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute top-3 left-3 bg-accent text-white px-2 py-1 rounded-full text-xs dark:bg-primary">
                        {event.eventType}
                      </div>

                      <div className="absolute bottom-3 left-3 z-10 opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                        <Button size="sm" variant={buttonVariant}>
                          Learn More
                        </Button>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors text-lg leading-tight line-clamp-3">
                        {truncateTitle(event.title, 60)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        {formatDate(event.publishedAt)}
                      </div>
                      <div className="flex items-center gap-2 my-4">
                        <Newspaper className="w-4 h-4 text-primary" />
                        <span
                          className={
                            event.registrationOpen
                              ? "text-success"
                              : "text-destructive"
                          }
                        >
                          {event.registrationOpen
                            ? "Registration Open"
                            : "Registration Closed"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center text-center py-12 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/empty.svg" // image à placer dans /public
            alt="No events"
            width={220}
            height={220}
            className="object-contain"
          />
          <div className="space-y-2">
            <p className="text-muted-foreground text-lg">
              No events available at the moment.
            </p>
            <p className="text-muted-foreground text-sm">
              Please check back later for upcoming tech events.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function truncateTitle(title: string, maxLength: number) {
  if (title.length <= maxLength) return title;
  return title.slice(0, maxLength) + "...";
}

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
