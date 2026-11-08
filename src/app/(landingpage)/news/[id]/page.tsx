
import { getNews } from "@/actions/news";
import NewsDetail from "@/components/news/news-detail";
import RelatedNews from "@/components/news/related-news";
import React from "react";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL, isoDate, jsonLd } from "@/lib/seo";

interface NewsIdPageProps {
  params: Promise<{ id: string }>; 
}



export default async function NewsIdPage({ params }: NewsIdPageProps) {
  const { id } = await params;
  const news = await getNews();

  const newsItem = news.find((item) => item.id === id);

  if (!newsItem) notFound();

  const relatedNews = news.filter(
    (item) => item.type === newsItem.type && item.id !== newsItem.id
  );

  const recentNews = news
    .slice() 
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .filter((item) => item.id !== newsItem.id)
    .slice(0, 5);

  return (
    <main className="container py-8 md:py-12 px-4 md:px-6 md:mx-auto grid gap-5 md:grid-cols-3">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: newsItem.title,
            description: newsItem.description,
            image: newsItem.image?.uri ? [newsItem.image.uri] : undefined,
            datePublished: isoDate(newsItem.publishedAt),
            mainEntityOfPage: `${SITE_URL}/news/${newsItem.id}`,
            author: { "@type": "Organization", name: SITE_NAME },
            publisher: { "@id": `${SITE_URL}/#organization` },
          }),
        }}
      />
      <NewsDetail news={newsItem} />
      <RelatedNews relatedNews={relatedNews} recentNews={recentNews} />
    </main>
  );
}
