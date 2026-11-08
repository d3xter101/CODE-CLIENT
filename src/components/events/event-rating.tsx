"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useEventRatings } from "@/hooks/use-event-feedback";
import { useUser } from "@/hooks/use-user";
import { getApiErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-hidden>
      {[1, 2, 3, 4, 5].map((star) => {
        // part of the star that is filled, for averages like 4.3
        const fill = Math.max(0, Math.min(1, value - star + 1));
        return (
          <span key={star} className="relative inline-block size-4">
            <Star className="absolute inset-0 size-4 text-muted-foreground/40" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="size-4 fill-primary text-primary" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function EventRating({ eventId }: { eventId: string }) {
  const { summary, loading, rate, removeRating } = useEventRatings(eventId);
  const { user } = useUser(false);
  const [hovered, setHovered] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleRate = async (score: number) => {
    setSaving(true);
    try {
      await rate(score);
      toast.success("Thanks for rating this event!");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't save your rating"));
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    try {
      await removeRating();
      toast.success("Your rating was removed");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't remove your rating"));
    } finally {
      setSaving(false);
    }
  };

  const selected = hovered || summary?.myRating || 0;

  return (
    <Card className="p-5 gap-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" />
        Rating
      </h3>

      {loading || !summary ? (
        <div className="flex justify-center py-6">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-4xl font-bold leading-none">
                {summary.count ? summary.average.toFixed(1) : "–"}
              </p>
              <Stars value={summary.average} className="mt-2 justify-center" />
              <p className="text-xs text-muted-foreground mt-1">
                {summary.count} {summary.count === 1 ? "rating" : "ratings"}
              </p>
            </div>
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((score) => {
                const count = summary.distribution[score] ?? 0;
                const percent = summary.count ? (count / summary.count) * 100 : 0;
                return (
                  <div key={score} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-2 tabular-nums">{score}</span>
                    <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="w-5 text-right tabular-nums">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t pt-4">
            {!user ? (
              <p className="text-sm text-muted-foreground">
                <Link href="/login" className="text-primary hover:underline">Log in</Link> to rate this event.
              </p>
            ) : !summary.ratingOpen ? (
              <p className="text-sm text-muted-foreground">Ratings open once the event&apos;s registration has closed.</p>
            ) : !summary.canRate ? (
              <p className="text-sm text-muted-foreground">Only members who joined this event can rate it.</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {summary.myRating ? "Your rating" : "Rate this event"}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating" onMouseLeave={() => setHovered(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={summary.myRating === star}
                        aria-label={`${star} star${star > 1 ? "s" : ""}, ${LABELS[star]}`}
                        disabled={saving}
                        onMouseEnter={() => setHovered(star)}
                        onFocus={() => setHovered(star)}
                        onBlur={() => setHovered(0)}
                        onClick={() => handleRate(star)}
                        className="rounded-sm p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 cursor-pointer"
                      >
                        <Star
                          className={cn(
                            "size-6 transition-colors",
                            star <= selected ? "fill-primary text-primary" : "text-muted-foreground/50"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-sm font-medium min-w-[5rem]">{LABELS[selected]}</span>
                  {saving && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                </div>
                {summary.myRating && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={saving}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  >
                    Remove my rating
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
