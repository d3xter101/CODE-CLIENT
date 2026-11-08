"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, MessageCircle, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getApiErrorMessage } from "@/lib/api-error";
import { buildWhatsAppOrderUrl, formatPrice, MAX_QUANTITY } from "@/lib/shop";
import { cn } from "@/lib/utils";
import type { MerchItem } from "@/types/backendTypes";
import { isOptimizableImage } from "@/lib/image";

interface BookDialogProps {
  item: MerchItem | null;
  // only logged-in members can book, a visitor is asked to log in
  loggedIn: boolean;
  onBook: (itemId: string, size: string | null, quantity: number) => Promise<void>;
  onClose: () => void;
}

export default function BookDialog({ item, loggedIn, onBook, onClose }: BookDialogProps) {
  // the dialog is remounted for each item, so this starts over every time
  const [size, setSize] = useState<string | null>(item?.sizes.length === 1 ? item.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(false);

  // an event ticket is one per member, no size and no quantity
  const isTicket = !!item?.ticket;
  const maxQuantity = item ? Math.max(1, Math.min(MAX_QUANTITY, item.stock)) : 1;
  const needsSize = !!item && item.sizes.length > 0 && !size;

  // registers the booking, then opens WhatsApp with the order
  const handleBook = async (event: React.MouseEvent) => {
    if (!item || booking) return;
    event.preventDefault();

    // opened right now, inside the click, because a browser blocks a tab opened after waiting for the server
    const tab = window.open("", "_blank");
    setBooking(true);
    try {
      await onBook(item.id, isTicket ? null : size, isTicket ? 1 : quantity);
      const url = buildWhatsAppOrderUrl(item, size, quantity);
      if (tab) {
        tab.location.href = url;
      } else {
        window.location.href = url;
      }
      toast.success(
        isTicket
          ? `${item.name} booked. Your QR ticket arrives once the club confirms your payment`
          : `${item.name} booked, finish your order on WhatsApp`
      );
      onClose();
    } catch (err) {
      tab?.close();
      toast.error(getApiErrorMessage(err, "Couldn't register your booking, please try again"));
    } finally {
      setBooking(false);
    }
  };

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {item && (
          <>
            <DialogHeader>
              <DialogTitle>{isTicket ? `Ticket: ${item.name}` : `Book ${item.name}`}</DialogTitle>
              <DialogDescription>
                {loggedIn && isTicket
                  ? "Booking reserves your place. Pay the club, and once the payment is confirmed your QR ticket is emailed to you and shown here in your account."
                  : loggedIn
                  ? "Booking registers your order with the club and opens WhatsApp with the details. You pay when you pick it up at the club office."
                  : "Only club members can book. Log in to your member account to book this item."}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt="" fill sizes="80px" className="object-cover" unoptimized={!isOptimizableImage(item.imageUrl)} />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {!isTicket && item.sizes.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span id="size-label" className="text-sm font-medium">Size</span>
                  <div role="radiogroup" aria-labelledby="size-label" className="flex flex-wrap gap-2">
                    {item.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={size === s}
                        onClick={() => setSize(s)}
                        className={cn(
                          "min-w-11 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          size === s
                            ? "border-primary bg-primary text-primary-foreground"
                            : "hover:border-primary/50"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!isTicket && (
              <div className="flex items-center justify-between">
                <span id="quantity-label" className="text-sm font-medium">Quantity</span>
                <div className="flex items-center gap-1" role="group" aria-labelledby="quantity-label">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Fewer"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => q - 1)}
                  >
                    <Minus />
                  </Button>
                  <span className="w-8 text-center font-medium tabular-nums" aria-live="polite">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="More"
                    disabled={quantity >= maxQuantity}
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
              )}

              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm text-muted-foreground">{isTicket ? "Price of your ticket" : "Total, paid at pickup"}</span>
                <span className="text-lg font-semibold">{formatPrice(item.price * quantity)}</span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={booking}>
                Cancel
              </Button>
              {!loggedIn ? (
                <Button asChild>
                  <Link href="/login">Log in to book</Link>
                </Button>
              ) : needsSize && !isTicket ? (
                <Button disabled>Pick a size</Button>
              ) : (
                // a real link, so the browser can open WhatsApp in a new tab without a popup warning.
                // The click registers the booking first (handleBook)
                <Button asChild>
                  <a
                    href={buildWhatsAppOrderUrl(item, size, quantity)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={booking}
                    onClick={handleBook}
                  >
                    {booking ? <Loader2 className="animate-spin" /> : <MessageCircle />}
                    {booking ? "Registering..." : isTicket ? "Book my ticket" : "Book on WhatsApp"}
                  </a>
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
