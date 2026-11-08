"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import PageHero from "@/components/ui/page-hero";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import FilterChips from "@/components/ui/filter-chips";
import { Skeleton } from "@/components/ui/skeleton";
import { useShop } from "@/hooks/use-shop";
import { useUser } from "@/hooks/use-user";
import type { MerchItem } from "@/types/backendTypes";
import BookDialog from "./book-dialog";
import MyBookings from "./my-bookings";
import MyTickets from "./my-tickets";
import ProductCard from "./product-card";

const ALL = "All";

export default function ShopSection() {
  const { user } = useUser(false);
  const { items, itemsLoading, itemsError, bookings, tickets, book, cancel } = useShop(!!user);
  const [filter, setFilter] = useState(ALL);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // looked up by id so the dialog shows the latest stock after a reload
  const selected: MerchItem | null = items?.find((i) => i.id === selectedId) ?? null;

  const filters = useMemo(() => {
    const list = items ?? [];
    const categories = Array.from(new Set(list.map((i) => i.category)));
    return [
      { label: ALL, count: list.length },
      ...categories.map((c) => ({ label: c, count: list.filter((i) => i.category === c).length })),
    ];
  }, [items]);

  const visibleItems = (items ?? []).filter((i) => filter === ALL || i.category === filter);

  return (
    <>
      <PageHero
        badge="Official Merch"
        title={<>Code Club <span className="text-primary">Merch</span> Shop</>}
        description="Wear the club. Members book their pieces on WhatsApp, then pay and pick them up at the club office."
      />

      <section className="px-4 md:px-6 py-8 sm:py-12 md:py-16 flex flex-col gap-6 md:gap-8">
        {user && tickets.length > 0 && <MyTickets tickets={tickets} />}
        {user && bookings.length > 0 && <MyBookings bookings={bookings} onCancel={cancel} />}

        {items && items.length > 0 && (
          <FilterChips
            chips={filters}
            value={filter}
            onChange={setFilter}
            label="Filter items by category"
            layoutId="shop-filter-pill"
          />
        )}

        {itemsLoading ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-9 w-full" />
              </li>
            ))}
          </ul>
        ) : itemsError ? (
          <p className="py-12 text-center text-muted-foreground">
            The shop couldn&apos;t be loaded, try again later.
          </p>
        ) : visibleItems.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No merch for now, check back soon.</p>
        ) : (
          <motion.ul layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item) => (
                <ProductCard key={item.id} item={item} onBuy={() => setSelectedId(item.id)} />
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </section>

      <BookDialog
        key={selectedId ?? "closed"}
        item={selected}
        loggedIn={!!user}
        onBook={book}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}
