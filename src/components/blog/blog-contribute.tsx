"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import { PenLine } from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BLOG_SUBMISSION_EMAIL } from "@/lib/blog";

const topics = [
  { title: "Technical Tutorials", example: "Building a Real-time Chat App with Next.js & Socket.io" },
  { title: "Project Showcases", example: "How We Built an AI-powered Waste Sorting System" },
  { title: "Event Recaps", example: "Hackathon 2026: 50+ Students, 12 Innovative Projects" },
  { title: "Learning Guides", example: "A Beginner's Guide to Competitive Programming" },
];

const submitHref = `mailto:${BLOG_SUBMISSION_EMAIL}?subject=${encodeURIComponent(
  "Blog submission: <your title>"
)}&body=${encodeURIComponent(
  "Hi Code Club,\n\nI would like to contribute a blog post.\n\nTitle:\nCategory (Events, Training, Projects, Guides, Tutorials):\nShort summary:\nLink to the draft:\n"
)}`;

export default function BlogContribute() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      aria-labelledby="contribute-title"
    >
      <Card className="mx-auto max-w-3xl items-center gap-6 border-primary/20 p-6 text-center md:p-10">
        <h2 id="contribute-title" className="scroll-mt-24 text-2xl font-bold tracking-tight md:text-3xl">
          Share Your Blog with <span className="text-primary">Code Club</span>
        </h2>
        <p className="max-w-xl text-muted-foreground">
          Submit your blog and become a contributor to the Code Club website after review and
          approval. We welcome technical articles, tutorials, project showcases and event summaries.
        </p>

        <div className="w-full">
          <h3 className="mb-3 font-semibold">Example blog topics we love</h3>
          <ul className="grid gap-3 text-left sm:grid-cols-2">
            {topics.map((topic) => (
              <li key={topic.title} className="rounded-lg border bg-muted/40 p-4">
                <p className="font-medium text-primary">{topic.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">&ldquo;{topic.example}&rdquo;</p>
              </li>
            ))}
          </ul>
        </div>

        <Button asChild size="lg">
          <a href={submitHref}>
            <PenLine />
            Submit for Review
          </a>
        </Button>
        <p className="text-sm text-muted-foreground">
          Your submission is sent to {BLOG_SUBMISSION_EMAIL} for review.
        </p>
      </Card>
    </motion.section>
  );
}
