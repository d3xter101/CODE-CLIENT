"use client";

import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import api from "@/lib/axios";
import type { CommentPage, EventComment, RatingSummary } from "@/types/backendTypes";

export const ratingsKey = (eventId: string) => `/api/v1/event/${eventId}/ratings`;

const commentsUrl = (eventId: string) => `/api/v1/event/${eventId}/comments`;

const fetcher = async <T,>(url: string): Promise<T> => (await api.get<T>(url)).data;

/**
 * Rating summary of an event, with the logged-in member's own rating
 */
export function useEventRatings(eventId: string) {
  const { data, error, isLoading, mutate } = useSWR<RatingSummary>(ratingsKey(eventId), fetcher, {
    revalidateOnFocus: false,
  });

  const rate = async (score: number) => {
    const res = await api.put<RatingSummary>(`/api/v1/event/${eventId}/rating`, { score });
    await mutate(res.data, false);
  };

  const removeRating = async () => {
    const res = await api.delete<RatingSummary>(`/api/v1/event/${eventId}/rating`);
    await mutate(res.data, false);
  };

  return { summary: data, loading: isLoading, error, rate, removeRating };
}

/**
 * Comments of an event, newest first, loaded one page at a time
 */
export function useEventComments(eventId: string) {
  const { data, error, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite<CommentPage>(
    (index, previous: CommentPage | null) => {
      if (previous && previous.page >= previous.totalPages) return null;
      return `${commentsUrl(eventId)}?page=${index + 1}`;
    },
    fetcher,
    { revalidateOnFocus: false, revalidateFirstPage: false }
  );

  const comments: EventComment[] = data?.flatMap((page) => page.comments) ?? [];
  const last = data?.[data.length - 1];

  const addComment = async (content: string) => {
    await api.post<EventComment>(commentsUrl(eventId), { content });
    // the new comment is on the first page, reload what's shown
    await mutate();
  };

  const deleteComment = async (commentId: string) => {
    await api.delete(`${commentsUrl(eventId)}/${commentId}`);
    await mutate();
  };

  return {
    comments,
    total: data?.[0]?.totalElements ?? 0,
    loading: isLoading,
    loadingMore: isValidating && size > (data?.length ?? 0),
    hasMore: !!last && last.page < last.totalPages,
    loadMore: () => setSize(size + 1),
    error,
    addComment,
    deleteComment,
  };
}
