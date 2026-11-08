"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import { motion } from "motion/react";
import React, { useMemo, useState } from "react";
import PageHero from "@/components/ui/page-hero";
import FilterChips from "@/components/ui/filter-chips";
import { BlogCategory, BlogPost, blogCategories } from "@/lib/blog";
import BlogCard from "./blog-card";
import BlogContribute from "./blog-contribute";

type Filter = BlogCategory | "All";

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const [filter, setFilter] = useState<Filter>("All");

  const visible = useMemo(
    () => (filter === "All" ? posts : posts.filter((p) => p.category === filter)),
    [posts, filter]
  );

  const chips = [
    { label: "All" as Filter, count: posts.length },
    ...blogCategories
      .map((category) => ({
        label: category as Filter,
        count: posts.filter((p) => p.category === category).length,
      }))
      .filter((chip) => chip.count > 0),
  ];

  return (
    <>
      <PageHero
        badge="Stories &amp; Updates"
        title={<>Code Club <span className="text-primary">Blog</span></>}
        description="Discover our latest events, technical articles, success stories and insights from the Code Club community at FST Settat."
      />

      <section className="flex flex-col gap-8 px-4 pb-12 md:px-6 md:pb-16">
        <FilterChips
          chips={chips}
          value={filter}
          onChange={setFilter}
          label="Filter blog posts by category"
          layoutId="blog-filter-pill"
        />

        {posts.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No articles have been published yet. Please check back soon.
          </p>
        )}

        <motion.ul
          key={filter}
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((post, i) => (
            <motion.li
              key={post.slug}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            >
              <BlogCard post={post} priority={i < 3} />
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <div className="px-4 pb-16 md:px-6 md:pb-24">
        <BlogContribute />
      </div>
    </>
  );
}
