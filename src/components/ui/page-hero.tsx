"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import { motion } from "motion/react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  /** Short label in the pill above the title, e.g. "Stories & Updates" */
  badge: string;
  /** The page's <h1>. Wrap the accent word in <span className="text-primary"> */
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  descriptionClassName?: string;
}

/**
 * The title section shared by the site's pages: a badge, a large gradient
 * title with one accent word, and a short centered description.
 */
export default function PageHero({
  badge,
  title,
  description,
  className,
  descriptionClassName,
}: PageHeroProps) {
  return (
    <header className={cn("px-4 pt-12 pb-8 text-center md:px-6 md:pt-16", className)}>
      <motion.div
        // opacity is not animated: the title must be visible in the server-rendered HTML
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-3xl flex-col items-center gap-4"
      >
        <Badge className="rounded-full px-4 py-1.5 text-sm font-medium shadow-sm" variant="secondary">
          <span className="mr-1 text-primary">✦</span> {badge}
        </Badge>
        <h1 className="from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text font-serif text-4xl font-bold tracking-tight text-transparent md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className={cn("max-w-2xl text-muted-foreground md:text-lg", descriptionClassName)}>
            {description}
          </p>
        )}
      </motion.div>
    </header>
  );
}
