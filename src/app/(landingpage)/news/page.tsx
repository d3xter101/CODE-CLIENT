import { pageMetadata } from "@/lib/seo";
import { getNews } from "@/actions/news";
import NewsSection from "@/components/news/news-section";
import { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "News & Announcements - Code Club FST Settat",
  description:
    "Latest news, announcements and project updates from the Code Club at FST Settat: what our students build, learn and win.",
  path: "/news",
  keywords: ["News", "Events", "Projects"],
});

export default async function NewsPage() {
  const news = await getNews();

  return (
    <main className="w-full flex-1 container mx-auto">
      <NewsSection news={news} />
    </main>
  );
}
