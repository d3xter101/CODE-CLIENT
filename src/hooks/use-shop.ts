"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import useSWR from "swr";
import api from "@/lib/axios";
import type { MerchBooking, MerchItem, Ticket } from "@/types/backendTypes";

const ITEMS_KEY = "/api/v1/shop/items";
const BOOKINGS_KEY = "/api/v1/shop/bookings";
const TICKETS_KEY = "/api/v1/shop/tickets";

const fetcher = async <T,>(url: string): Promise<T> => (await api.get<T>(url)).data;

/**
 * The shop's items and, for a logged-in member, their bookings.
 * Booking and cancelling change the stock, so both lists are reloaded after them
 */
export function useShop(loggedIn: boolean) {
  const items = useSWR<MerchItem[]>(ITEMS_KEY, fetcher, { revalidateOnFocus: false });
  const bookings = useSWR<MerchBooking[]>(loggedIn ? BOOKINGS_KEY : null, fetcher, {
    revalidateOnFocus: false,
  });

  // the tickets are created when the club confirms the payment, so they are looked up again from time to time
  const tickets = useSWR<Ticket[]>(loggedIn ? TICKETS_KEY : null, fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 60_000,
  });

  // registers the booking in the club's list (the admin panel's "Shop Bookings") and takes the pieces from the stock
  const book = async (itemId: string, size: string | null, quantity: number) => {
    await api.post(`${ITEMS_KEY}/${itemId}/bookings`, { size, quantity });
    await Promise.all([items.mutate(), bookings.mutate(), tickets.mutate()]);
  };

  const cancel = async (bookingId: string) => {
    await api.delete(`${BOOKINGS_KEY}/${bookingId}`);
    await Promise.all([items.mutate(), bookings.mutate()]);
  };

  return {
    items: items.data,
    itemsLoading: items.isLoading,
    itemsError: items.error,
    bookings: bookings.data ?? [],
    tickets: tickets.data ?? [],
    book,
    cancel,
  };
}
