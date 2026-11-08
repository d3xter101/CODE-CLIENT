"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import PageHero from "@/components/ui/page-hero";
import { AnimatePresence, motion } from "motion/react";
import React, { useMemo, useState } from "react";
import {
  GalleryCategory,
  GalleryPhoto,
  galleryCategories,
} from "@/lib/gallery";
import GalleryLightbox from "./gallery-lightbox";
import GalleryTile, { tileSizeClass } from "./gallery-tile";
import FilterChips from "@/components/ui/filter-chips";

type Filter = GalleryCategory | "All";

interface GallerySectionProps {
  photos: GalleryPhoto[];
}

export default function GallerySection({ photos }: GallerySectionProps) {
  const [filter, setFilter] = useState<Filter>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visiblePhotos = useMemo(
    () =>
      filter === "All" ? photos : photos.filter((p) => p.category === filter),
    [photos, filter]
  );

  const eventCount = useMemo(
    () => new Set(photos.map((p) => p.event)).size,
    [photos]
  );

  const filters: { label: Filter; count: number }[] = [
    { label: "All", count: photos.length },
    ...galleryCategories.map((category) => ({
      label: category,
      count: photos.filter((p) => p.category === category).length,
    })),
  ];

  return (
    <>
      <PageHero
        badge="Moments &amp; Memories"
        title={<>Code Club Photo <span className="text-primary">Gallery</span></>}
        description={`${photos.length} photos from ${eventCount} events: hackathons, workshops, talks and everything in between, captured by our members at FST Settat.`}
      />

      <section className="px-4 md:px-6 py-8 sm:py-12 md:py-16 flex flex-col gap-6 md:gap-8">
        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <FilterChips
            chips={filters}
            value={filter}
            onChange={setFilter}
            label="Filter photos by category"
            layoutId="gallery-filter-pill"
          />
        </motion.div>

        {photos.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No photos have been added yet. Please check back soon.
          </p>
        )}

        {/* Bento grid */}
        <motion.ul
          layout
          className="grid grid-cols-2 md:grid-cols-4 auto-rows-[150px] sm:auto-rows-[190px] lg:auto-rows-[220px] grid-flow-dense gap-3 md:gap-4"
        >
          <AnimatePresence mode="popLayout">
            {visiblePhotos.map((photo, idx) => (
              <motion.li
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(idx * 0.04, 0.4),
                  layout: { type: "spring", bounce: 0.15, duration: 0.5 },
                }}
                className={tileSizeClass(photo.size)}
              >
                <GalleryTile photo={photo} onOpen={() => setActiveIndex(idx)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </section>

      <GalleryLightbox
        photos={visiblePhotos}
        index={activeIndex}
        onIndexChange={setActiveIndex}
      />
    </>
  );
}
