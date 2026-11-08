"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CalendarDays,
    ArrowLeft,
    Clock,
    Users,
    Award,
    Tag,
    Info,
} from "lucide-react";
import { Loader2 } from "lucide-react";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Event } from "@/types/backendTypes";
import { toast } from "sonner";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api-error";
import { useUser } from "@/hooks/use-user";
import { passKey, useEventPass } from "@/hooks/use-event-pass";
import EventPassCard from "./event-pass-card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { remark } from 'remark';
import { mutate } from "swr";
import EventRating from "./event-rating";
import EventComments from "./event-comments";
import { ratingsKey } from "@/hooks/use-event-feedback";
import html from 'remark-html';

const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

interface EventDetailProps {
    event: Event;
}


async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(html)
    .process(markdown);
  return result.toString();
}

export default function EventDetail({ event }: EventDetailProps) {
    const [loading, setLoading] = useState(false);
    const [eventJoined, setEventJoined] = useState(false)
    const [description, setDescription] = useState("")
    const { user, loading: userLoading } = useUser(false);
    const userId = user?.id;
    // the pass the member gets by joining, shown only to a logged-in member who joined this event
    const { pass } = useEventPass(event.id!, !!user && eventJoined);

    useEffect(() => {
        markdownToHtml(event.description).then(setDescription);
    }, [event.description]);

    useEffect(() => {
        if (!userId) {
            setEventJoined(false);
            return;
        }
        let stale = false;
        api.get(`/api/v1/event/check/${event.id}`)
            .then(res => {
                if (!stale) setEventJoined(res.data["check"]);
            })
            .catch(() => {
                // the button keeps its state, joining still gives a clear answer
            });
        return () => {
            stale = true;
        };
    }, [event.id, userId]);

    const handleJoin = async () => {
        try {
            setLoading(true);
            await api.post(`/api/v1/event/register/${event.id}`);
            setEventJoined(true);
            toast.success("You have successfully joined the event!");
            // joining lets the member rate the event
            mutate(ratingsKey(event.id!));
            // the pass is created by the join
            mutate(passKey(event.id!));
        } catch (err: unknown) {
            toast.error(getApiErrorMessage(err, "Couldn't join the event"));
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = async () => {
        try {
            setLoading(true);
            await api.post(`/api/v1/event/remove/${event.id}`);
            setEventJoined(false);
            toast.success("You have successfully left the event!");
            mutate(ratingsKey(event.id!));
            // the pass goes with it
            mutate(passKey(event.id!), undefined, { revalidate: false });
        } catch (err: unknown) {
            toast.error(getApiErrorMessage(err, "Couldn't leave the event"));
        } finally {
            setLoading(false);
        }
    };

    const isRegistrationAvailable =
        event.registrationOpen && new Date(event.registrationDeadline) > new Date();

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div className="container mx-auto  min-h-screen ">
            <div className="container mx-auto px-4 py-8">
        
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link
                            href="/events"
                            className="hover:text-primary transition-colors"
                        >
                            Events
                        </Link>
                        <span>{" > "}</span>
                        <span className="text-foreground font-medium">{event.title}</span>
                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid lg:grid-cols-3 gap-8"
                >
              
                    <motion.div
                        variants={containerVariants}
                        className="lg:col-span-2 space-y-6"
                    >
                     
                        <motion.div
                            variants={itemVariants}
                            className="relative overflow-hidden rounded-2xl shadow-2xl"
                        >
                            <Image
                                src={event.image.uri}
                                alt={event.title}
                                width={2000}
                                height={1200}
                                className="w-full max-h-[600px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary">{event.eventType}</Badge>
                                </div>

                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} whileHover={{ y: -2, scale: 1.02 }}>
                            <Card className="p-5 hover:shadow-md transition-all">
                                <article className="prose prose-gray dark:prose-invert max-w-none">
                                    <h1 className="font-serif">
                                        {event.title}
                                    </h1>
                                </article>
                                <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: description }}>
                                </div>
                            </Card>
                        </motion.div>
                        {event.areaOfInterests.length > 0 && (
                        <motion.div variants={itemVariants} whileHover={{ y: -2, scale: 1.02 }}>
                            <Card className="p-5 hover:shadow-md transition-all">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-primary" />
                                    Areas of interest
                                </h2>
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="flex flex-wrap gap-2"
                                >
                                    {event.areaOfInterests.map((interest) => (
                                        <motion.span
                                            key={interest.id}
                                            variants={itemVariants}
                                            className="text-muted-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm bg-muted"
                                        >
                                            <span className="text-primary">{"/> "}</span> {interest.name}
                                        </motion.span>
                                    ))}
                                </motion.div>
                            </Card>
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants}>
                            <EventComments eventId={event.id!} />
                        </motion.div>
                    </motion.div>

                  
                    <motion.div variants={containerVariants} className="space-y-6">
                      
                        <motion.div variants={itemVariants} whileHover={{ y: -2, scale: 1.02 }}>
                            <Card className="p-5 hover:shadow-md transition-all">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Info className="w-5 h-5 text-primary" />
                                    Key information
                                </h3>
                                <div className="space-y-3">
                                    {event.startDate && (
                                        <div className="flex items-center gap-3">
                                            <CalendarDays className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Starts</p>
                                                <p className="font-medium">
                                                    {new Date(event.startDate).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <CalendarDays className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Published at</p>
                                            <p className="font-medium">{formatDate(event.publishedAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Registration deadline
                                            </p>
                                            <p className="font-medium">
                                                {formatDate(event.registrationDeadline)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Status</p>
                                            <p
                                                className={`font-medium ${isRegistrationAvailable
                                                        ? "text-success"
                                                        : "text-destructive"
                                                    }`}
                                            >
                                                {isRegistrationAvailable
                                                    ? "Registration open"
                                                    : "Registration closed"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                     
                        {isRegistrationAvailable && (
                            <motion.div variants={itemVariants}>
                                <Button
                                    onClick={eventJoined ? handleLeave : handleJoin}
                                    disabled={loading || userLoading || !user}
                                    className={cn(
                                        "group w-full px-6 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl cursor-pointer flex items-center justify-center gap-2",
                                        !user && "cursor-not-allowed"
                                    )}
                                >
                                    {eventJoined ? 
                                        loading ? (
                                            <>
                                                Leaving...
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            </>
                                        ) : 
                                        <>
                                            Leave Event
                                            <motion.div
                                                initial={{ x: 0 }}
                                                whileHover={{ x: 5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                            </motion.div>
                                        </>
                                    : 
                                    
                                    
                                    loading ? (
                                        <>
                                            Joining...
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        </>
                                    ) : (
                                        <>
                                            Join Event
                                            <motion.div
                                                initial={{ x: 0 }}
                                                whileHover={{ x: 5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                            </motion.div>
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        )}

                        {pass && (
                            <motion.div variants={itemVariants}>
                                <EventPassCard pass={pass} />
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants}>
                            <EventRating eventId={event.id!} />
                        </motion.div>

                        {event.sponsors.length > 0 && (
                            <motion.div variants={itemVariants} whileHover={{ y: -2, scale: 1.02 }}>
                                <Card className="p-5 hover:shadow-md transition-all">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Award className="w-5 h-5 text-primary" />
                                        Sponsors
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {event.sponsors.map((sponsor) => (
                                            <div
                                                key={sponsor.id}
                                                className="rounded-xl border bg-muted/60 px-3 py-2 hover:bg-muted transition-colors w-full"
                                            >
                                                <div className="flex items-center gap-2 text-sm font-medium text-foreground whitespace-nowrap">
                                                    <span className="text-primary">{"/> "}</span> {sponsor.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
