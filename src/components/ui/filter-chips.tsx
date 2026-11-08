"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface FilterChip<T extends string> {
  label: T;
  count: number;
}

interface FilterChipsProps<T extends string> {
  chips: FilterChip<T>[];
  value: T;
  onChange: (value: T) => void;
  // accessible name of the group, e.g. "Filter photos by category"
  label: string;
  // unique per page, it animates the active pill between chips
  layoutId: string;
  className?: string;
}

/**
 * A row of pill buttons to filter a list by category, with the number of items in each
 */
export default function FilterChips<T extends string>({
  chips,
  value,
  onChange,
  label,
  layoutId,
  className,
}: FilterChipsProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "-mx-4 px-4 md:mx-0 md:px-0 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:flex-wrap md:justify-center",
        className
      )}
    >
      {chips.map(({ label: chip, count }) => {
        const active = value === chip;
        return (
          <button
            key={chip}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(chip)}
            className={cn(
              "relative shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              active
                ? "border-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:text-foreground hover:border-primary/50"
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">
              {chip}
              <span
                className={cn(
                  "ml-1.5 text-xs",
                  active ? "text-primary-foreground/80" : "text-muted-foreground/70"
                )}
              >
                {count}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
