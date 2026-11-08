"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import Image from "next/image";
import { motion } from "motion/react";
import { CalendarDays, MapPin, ShoppingBag, Ticket } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { formatPrice, LOW_STOCK } from "@/lib/shop";
import { cn } from "@/lib/utils";
import type { MerchItem } from "@/types/backendTypes";
import { isOptimizableImage } from "@/lib/image";

interface ProductCardProps {
  item: MerchItem;
  onBuy: () => void;
}

export default function ProductCard({ item, onBuy }: ProductCardProps) {
  const soldOut = item.stock === 0;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            unoptimized={!isOptimizableImage(item.imageUrl)}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-105",
              soldOut && "grayscale opacity-70"
            )}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ShoppingBag className="size-10" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
          {item.ticket ? "Event ticket" : item.category}
        </span>
        {soldOut ? (
          <span className="absolute right-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-xs font-semibold text-background">
            Sold out
          </span>
        ) : item.stock <= LOW_STOCK ? (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
            Only {item.stock} left
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-tight">{item.name}</h3>
          <span className="shrink-0 font-semibold text-primary">{formatPrice(item.price)}</span>
        </div>
        {item.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        )}
        {item.ticket && (item.eventDate || item.venue) && (
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            {item.eventDate && (
              <p className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5 text-primary" />
                {format(parseISO(item.eventDate), "EEE d MMM yyyy, HH:mm")}
              </p>
            )}
            {item.venue && (
              <p className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                {item.venue}
              </p>
            )}
          </div>
        )}
        {item.sizes.length > 0 && (
          <p className="text-xs text-muted-foreground">Sizes: {item.sizes.join(" · ")}</p>
        )}
        <Button className="mt-auto w-full" onClick={onBuy} disabled={soldOut}>
          {item.ticket ? <Ticket /> : <ShoppingBag />}
          {soldOut ? "Sold out" : item.ticket ? "Book my ticket" : "Book"}
        </Button>
      </div>
    </motion.li>
  );
}
