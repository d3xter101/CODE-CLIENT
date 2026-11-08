"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import { format, parseISO } from "date-fns";
import { CalendarDays, Clock, User } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BlogPost } from "@/lib/blog";
import { isOptimizableImage } from "@/lib/image";

interface BlogCardProps {
  post: BlogPost;
  /** The first cards of a page load eagerly */
  priority?: boolean;
}

export default function BlogCard({ post, priority = false }: BlogCardProps) {
  return (
    <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }} className="h-full">
      <Card className="group relative h-full gap-0 overflow-hidden p-0 shadow-xs transition-shadow duration-300 hover:shadow-lg">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <Image
            src={post.image}
            unoptimized={!isOptimizableImage(post.image)}
            alt={post.imageAlt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <Badge className="absolute top-3 right-3 shadow-sm">{post.category}</Badge>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <h2 className="text-xl font-bold leading-snug transition-colors group-hover:text-primary">
            {/* the whole card is clickable through this link's pseudo-element */}
            <Link
              href={`/blog/${post.slug}`}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {post.title}
            </Link>
          </h2>
          <p className="line-clamp-3 text-muted-foreground">{post.excerpt}</p>

          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="size-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              <time dateTime={post.publishedAt}>
                {format(parseISO(post.publishedAt), "MMM d, yyyy")}
              </time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {post.readMinutes} min read
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
