"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import { format, parseISO } from "date-fns";
import { CalendarDays, Expand } from "lucide-react";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import { GalleryPhoto, GalleryTileSize } from "@/lib/gallery";
import { isOptimizableImage } from "@/lib/image";

const sizeClasses: Record<GalleryTileSize, string> = {
  featured: "col-span-2 row-span-2",
  tall: "row-span-2",
  wide: "col-span-2",
  regular: "",
};

const sizeHints: Record<GalleryTileSize, string> = {
  featured: "(min-width: 768px) 50vw, 100vw",
  tall: "(min-width: 768px) 25vw, 50vw",
  wide: "(min-width: 768px) 50vw, 100vw",
  regular: "(min-width: 768px) 25vw, 50vw",
};

export const tileSizeClass = (size: GalleryTileSize) => sizeClasses[size];

interface GalleryTileProps {
  photo: GalleryPhoto;
  onOpen: () => void;
}

export default function GalleryTile({ photo, onOpen }: GalleryTileProps) {
  const isLarge = photo.size === "featured";

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open photo: ${photo.event}`}
      className="group relative block size-full overflow-hidden rounded-xl border bg-muted text-left shadow-sm transition-shadow duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Image
        src={photo.src}
        unoptimized={!isOptimizableImage(photo.src)}
        alt={photo.alt}
        fill
        sizes={sizeHints[photo.size]}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Always-on gradient so the title stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/85 group-hover:via-black/40" />

      <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
        {photo.category}
      </span>
      <span className="pointer-events-none absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <Expand className="size-4" />
      </span>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4 text-white">
        <p
          className={cn(
            "font-semibold leading-tight line-clamp-1",
            isLarge ? "text-lg sm:text-2xl" : "text-sm sm:text-base"
          )}
        >
          {photo.event}
        </p>
        {/* Caption and date slide in on hover (always shown on large tiles) */}
        <div
          className={cn(
            "grid transition-all duration-300 ease-out",
            isLarge
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100"
          )}
        >
          <div className="overflow-hidden">
            <p className="mt-1 text-xs sm:text-sm text-white/80 line-clamp-2">
              {photo.caption}
            </p>
            <p className="mt-1.5 flex items-center gap-1 text-xs text-white/70">
              <CalendarDays className="size-3.5" />
              {format(parseISO(photo.date), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
