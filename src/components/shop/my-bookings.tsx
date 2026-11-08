"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Loader2, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatPrice } from "@/lib/shop";
import type { MerchBooking } from "@/types/backendTypes";
import { isOptimizableImage } from "@/lib/image";

interface MyBookingsProps {
  bookings: MerchBooking[];
  onCancel: (bookingId: string) => Promise<void>;
}

export default function MyBookings({ bookings, onCancel }: MyBookingsProps) {
  const [confirming, setConfirming] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  // what is still to pay: the bookings the club did not confirm as paid
  const total = bookings.filter((b) => !b.paid).reduce((sum, b) => sum + b.total, 0);

  const handleCancel = async (booking: MerchBooking) => {
    setCancelling(booking.id);
    try {
      await onCancel(booking.id);
      toast.success(`Your ${booking.itemName} booking was cancelled`);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't cancel this booking"));
    } finally {
      setCancelling(null);
      setConfirming(null);
    }
  };

  return (
    <section aria-labelledby="my-bookings" className="rounded-xl border bg-card p-4 md:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="my-bookings" className="flex items-center gap-2 text-lg font-semibold">
            <PackageCheck className="size-5 text-primary" />
            My bookings
          </h2>
          <p className="text-sm text-muted-foreground">
            Pay and pick them up at the club office.
          </p>
        </div>
        <p className="text-sm">
          To pay: <span className="font-semibold">{formatPrice(total)}</span>
        </p>
      </div>

      <ul className="divide-y">
        {bookings.map((booking) => (
          <li key={booking.id} className="flex flex-wrap items-center gap-3 py-3 sm:flex-nowrap">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
              {booking.imageUrl && (
                <Image src={booking.imageUrl} alt="" fill sizes="48px" className="object-cover" unoptimized={!isOptimizableImage(booking.imageUrl)} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{booking.itemName}</p>
              <p className="text-xs text-muted-foreground">
                {booking.size && <>Size {booking.size} · </>}
                {booking.ticket
                  ? booking.paid
                    ? "Paid · your ticket is below"
                    : "Waiting for the club to confirm your payment"
                  : <>{booking.quantity} × {formatPrice(booking.unitPrice)}</>}
                {booking.createdAt && (
                  <> · booked {formatDistanceToNow(parseISO(booking.createdAt), { addSuffix: true })}</>
                )}
              </p>
            </div>
            <span className="font-semibold">{formatPrice(booking.total)}</span>
            {booking.paid ? (
              <span className="text-xs font-medium text-primary">Paid</span>
            ) : confirming === booking.id ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={cancelling === booking.id}
                  onClick={() => handleCancel(booking)}
                >
                  {cancelling === booking.id && <Loader2 className="animate-spin" />}
                  Cancel booking
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirming(null)}>
                  Keep
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => setConfirming(booking.id)}>
                Cancel
              </Button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
