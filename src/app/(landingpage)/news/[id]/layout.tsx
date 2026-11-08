import type { Metadata } from "next";
import { getNews } from "@/actions/news";
import { isoDate, noIndex, pageMetadata } from "@/lib/seo";

interface NewsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NewsLayoutProps): Promise<Metadata> {
  const news = await getNews();
  const { id } = await params;
  const newsItem = news.find((item) => item.id === id);

  if (!newsItem) {
    return {
      title: "News not found - Code Club FST Settat",
      description: "The article you are looking for doesn’t exist.",
      robots: noIndex,
    };
  }

  return pageMetadata({
    title: `${newsItem.title} - Code Club FST Settat`,
    description: newsItem.description ?? newsItem.title,
    path: `/news/${newsItem.id}`,
    keywords: ["News", newsItem.type],
    image: newsItem.image?.uri,
    type: "article",
    publishedTime: isoDate(newsItem.publishedAt),
  });
}

export default function NewsLayout({ children }: NewsLayoutProps) {
  return <>{children}</>;
}
