"use client";

import PageHero from "@/components/ui/page-hero";
import { motion } from "motion/react";
import React from "react";
import { News } from "@/types/backendTypes";
import NewsCard from "./news-card";
import Image from "next/image";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemMotion = {
  hidden: { opacity: 0, x: -15 },
  show: { opacity: 1, x: 0 },
};

interface NewsSectionProps {
  news: News[];
}

export default function NewsSection({ news }: NewsSectionProps) {
  return (
    <>
      <PageHero
        badge="Latest Updates"
        title={<>Code Club <span className="text-primary">News</span></>}
        description="Check out the latest events, competitions and announcements from the Code Club at FST Settat."
      />
      <motion.div
        initial="hidden"
        whileInView="show"
        variants={container}
        viewport={{ once: true }}
        className="px-4 md:px-6 grid py-8 sm:py-12 md:py-16 gap-6 md:gap-8"
      >
        {news && news.length > 0 ? (
          news.map((item: News, idx: number) => (
            <motion.div key={item.id || idx} variants={itemMotion}>
              <NewsCard news={item} />
            </motion.div>
          ))
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center text-center py-12 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/empty.svg"
              alt="No news"
              width={220} // taille augmentée
              height={220}
              className="object-contain"
            />
            <div className="space-y-2">
              <p className="text-muted-foreground text-lg">
                No news available at the moment.
              </p>
              <p className="text-muted-foreground text-sm">
                Please check back later for the latest updates and
                announcements.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
