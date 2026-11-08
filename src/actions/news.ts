// lib/news.ts
import { News } from "@/types/backendTypes";
import { newsHtml, newsPlainText } from "@/lib/news-text";

function withReadableText(news: News): News {
  if (!news.description) return news;
  return {
    ...news,
    description: newsPlainText(news.description),
    descriptionHtml: newsHtml(news.description),
  };
}

export async function getNews(): Promise<News[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news`, {
    next: { revalidate: 300 }, // 5 min revalidation for ISR
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }

  const news: News[] = await res.json();
  return news.map(withReadableText);
}

export async function getNewsById(id: string): Promise<News | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/news/${id}`, {
    next: { revalidate: 300 },
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return null;
  }

  return withReadableText(await res.json());
}
