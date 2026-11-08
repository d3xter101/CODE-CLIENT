// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
import Link from "next/link";
import { Metadata } from "next";
import {
  Image as ImageIcon,
  Newspaper,
  Palette,
  ShieldCheck,
  ShoppingBag,
  Gauge,
  LayoutDashboard,
  Search,
  type LucideIcon,
} from "lucide-react";
import PageHero from "@/components/ui/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Website Refactor - Code Club FST Settat",
  description:
    "What changed in the Code Club website: a new look, a photo gallery, a blog, a shop, a stronger admin panel and better security.",
  path: "/website-refactor",
  keywords: ["Website", "Refactor", "What's new"],
});

const changes: { icon: LucideIcon; title: string; text: string; href?: string }[] = [
  {
    icon: Palette,
    title: "A new look",
    text: "A modern dark design, with the same style and fonts on every page, and a layout that works on phones, tablets and computers.",
  },
  {
    icon: ImageIcon,
    title: "Photo gallery",
    text: "Photos of our events, with filters by category and a full-screen viewer.",
    href: "/gallery",
  },
  {
    icon: Newspaper,
    title: "Blog",
    text: "Articles written by the club, easy to browse and to share.",
    href: "/blog",
  },
  {
    icon: ShoppingBag,
    title: "Club shop",
    text: "Members can see the club items and book them in a few clicks, over WhatsApp.",
    href: "/shop",
  },
  {
    icon: LayoutDashboard,
    title: "Easier administration",
    text: "The team can now manage the shop, bookings, event feedback, the gallery and the blog from the admin panel.",
  },
  {
    icon: ShieldCheck,
    title: "Safer for everyone",
    text: "We reviewed the whole platform and strengthened the protection of accounts, passwords and personal data.",
  },
  {
    icon: Search,
    title: "Easier to find",
    text: "Better results on Google and nicer previews when a page is shared.",
  },
  {
    icon: Gauge,
    title: "Faster",
    text: "Pages and images load quicker, and the team page and event pages are clearer.",
  },
];

export default function WebsiteRefactorPage() {
  return (
    <main className="container mx-auto w-full flex-1 px-4 pb-16 md:px-6">
      <PageHero
        badge="What's New"
        title={
          <>
            Website <span className="text-primary">Refactor</span>
          </>
        }
        description="We rebuilt the Code Club website to make it nicer to use, safer and easier to run. Here is what changed."
      />

      <section className="mx-auto mt-6 grid max-w-5xl gap-4 sm:grid-cols-2">
        {changes.map(({ icon: Icon, title, text, href }) => {
          const card = (
            <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
              <CardContent className="flex gap-4 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </CardContent>
            </Card>
          );
          return href ? (
            <Link key={title} href={href} className="block">
              {card}
            </Link>
          ) : (
            <div key={title}>{card}</div>
          );
        })}
      </section>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Done by{" "}
        <Link href="/team" className="font-medium text-primary hover:underline">
          Abdelhamid SAIDI
        </Link>
        , fullstack developer. Something not working? Tell us and we will fix it.
      </p>
    </main>
  );
}
