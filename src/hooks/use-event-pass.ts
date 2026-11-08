"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import useSWR from "swr";
import api from "@/lib/axios";
import type { EventPass } from "@/types/backendTypes";

export const passKey = (eventId: string) => `/api/v1/event/${eventId}/pass`;

const fetcher = async (url: string): Promise<EventPass> => (await api.get<EventPass>(url)).data;

/**
 * The logged-in member's pass for an event they joined. It is looked up again when the tab gets the focus
 * and every minute, so the card shows "Present" soon after the pass was scanned
 */
export function useEventPass(eventId: string, enabled: boolean) {
  const { data, error, isLoading } = useSWR<EventPass>(enabled ? passKey(eventId) : null, fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 60_000,
    shouldRetryOnError: false,
  });
  return { pass: data, error, isLoading };
}
