"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import { format, parseISO } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, PanInfo } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GalleryPhoto } from "@/lib/gallery";
import { isOptimizableImage } from "@/lib/image";

const slide = {
  enter: (direction: number) => ({ x: direction * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -60, opacity: 0 }),
};

// Horizontal drag distance (px) that counts as a swipe on touch screens
const SWIPE_THRESHOLD = 60;

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
}

export default function GalleryLightbox({
  photos,
  index,
  onIndexChange,
}: GalleryLightboxProps) {
  const [direction, setDirection] = useState(0);
  const photo = index !== null ? photos[index] : null;

  const go = (step: number) => {
    if (index === null) return;
    setDirection(step);
    onIndexChange((index + step + photos.length) % photos.length);
  };

  // Escape is handled by the Dialog itself
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x <= -SWIPE_THRESHOLD) go(1);
    else if (info.offset.x >= SWIPE_THRESHOLD) go(-1);
  };

  return (
    <Dialog
      open={photo !== null}
      onOpenChange={(open) => {
        if (!open) {
          setDirection(0);
          onIndexChange(null);
        }
      }}
    >
      <DialogContent
        onKeyDown={handleKeyDown}
        className="max-w-[calc(100%-2rem)] sm:max-w-5xl gap-0 overflow-hidden p-0 [&>[data-slot=dialog-close]]:top-3 [&>[data-slot=dialog-close]]:right-3 [&>[data-slot=dialog-close]]:rounded-full [&>[data-slot=dialog-close]]:bg-background/80 [&>[data-slot=dialog-close]]:p-1.5 [&>[data-slot=dialog-close]]:opacity-100 [&>[data-slot=dialog-close]]:backdrop-blur-sm"
      >
        {photo && (
          <>
            <div className="relative h-[55vh] sm:h-[72vh] w-full overflow-hidden bg-muted">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={photo.id}
                  custom={direction}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src={photo.src}
                    unoptimized={!isOptimizableImage(photo.src)}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 640px) 1024px, 100vw"
                    className="object-contain pointer-events-none select-none"
                    draggable={false}
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Desktop arrows over the image */}
              <Button
                variant="secondary"
                size="icon"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm shadow-md hidden sm:inline-flex"
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => go(1)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm shadow-md hidden sm:inline-flex"
              >
                <ChevronRight />
              </Button>

              <span className="absolute top-3 left-3 rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
                {(index ?? 0) + 1} / {photos.length}
              </span>
            </div>

            <div className="flex items-center gap-3 border-t p-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className="rounded-full sm:hidden"
              >
                <ChevronLeft />
              </Button>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
                  <DialogTitle className="truncate">{photo.event}</DialogTitle>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {photo.category}
                  </span>
                </div>
                <DialogDescription className="mt-1">
                  {photo.caption}
                </DialogDescription>
                <p className="mt-1 flex items-center justify-center sm:justify-start gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {format(parseISO(photo.date), "MMMM d, yyyy")}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => go(1)}
                aria-label="Next photo"
                className="rounded-full sm:hidden"
              >
                <ChevronRight />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
