"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import { format, parseISO } from "date-fns";
import { ArrowLeft, CalendarDays, Clock, User } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BlogBlock, BlogPost } from "@/lib/blog";
import BlogCard from "./blog-card";
import { isOptimizableImage } from "@/lib/image";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-4 text-2xl font-bold tracking-tight">{block.text}</h2>;
    case "ul":
      return (
        <ul className="list-disc space-y-1.5 pl-6 text-muted-foreground">
          {block.items.map((li) => (
            <li key={li}>{li}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-primary pl-4 text-lg italic text-foreground/90">
          {block.text}
        </blockquote>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm">
          <code>{block.text}</code>
        </pre>
      );
    default:
      return <p className="leading-relaxed text-muted-foreground">{block.text}</p>;
  }
}

interface BlogPostViewProps {
  post: BlogPost;
  related: BlogPost[];
}

export default function BlogPostView({ post, related }: BlogPostViewProps) {
  return (
    <div className="px-4 py-8 md:px-6 md:py-12">
      <motion.article
        initial="hidden"
        animate="show"
        variants={container}
        className="mx-auto flex max-w-3xl flex-col gap-6"
      >
        <motion.div variants={item}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/blog">Blog</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        <motion.div variants={item} className="flex flex-col gap-4">
          <Badge className="w-fit px-3 py-1 text-sm" variant="secondary">
            {post.category}
          </Badge>
          <h1 className="font-serif text-3xl font-bold tracking-tight md:text-5xl">{post.title}</h1>
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="size-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              <time dateTime={post.publishedAt}>
                {format(parseISO(post.publishedAt), "MMMM d, yyyy")}
              </time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {post.readMinutes} min read
            </span>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl border bg-muted">
            <Image
              src={post.image}
              unoptimized={!isOptimizableImage(post.image)}
              alt={post.imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </AspectRatio>
        </motion.div>

        <Separator />

        <motion.div variants={item} className="flex flex-col gap-5">
          {(post.content ?? []).map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </motion.div>

        <Separator />

        <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="outline">
            <Link href="/blog">
              <ArrowLeft />
              All posts
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Want to write for us?{" "}
            <Link href="/blog#contribute-title" className="text-primary underline-offset-4 hover:underline">
              Submit your blog
            </Link>
          </p>
        </motion.div>
      </motion.article>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-6xl" aria-labelledby="related-title">
          <h2 id="related-title" className="mb-6 text-2xl font-bold tracking-tight">
            Keep reading
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <BlogCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
