"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import { QRCodeSVG } from "qrcode.react";
import { format, parseISO } from "date-fns";
import { CalendarDays, CheckCircle2, MapPin, Ticket as TicketIcon } from "lucide-react";
import type { Ticket } from "@/types/backendTypes";

/**
 * The member's tickets, drawn like a wallet pass: the name, the event and the QR code that the club scans at the entrance.
 */
export default function MyTickets({ tickets }: { tickets: Ticket[] }) {
  return (
    <section aria-labelledby="my-tickets" className="rounded-xl border bg-card p-4 md:p-6">
      <h2 id="my-tickets" className="mb-1 flex items-center gap-2 text-lg font-semibold">
        <TicketIcon className="size-5 text-primary" />
        My tickets
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Show the QR code at the entrance and turn your screen brightness up. A ticket works once.
      </p>

      <ul className="flex flex-wrap justify-center gap-5 sm:justify-start">
        {tickets.map((ticket) => {
          const used = ticket.status === "USED";
          return (
            <li
              key={ticket.id}
              className="relative w-[320px] max-w-full overflow-hidden rounded-3xl bg-gradient-to-br from-orange-700 via-orange-500 to-orange-400 p-5 text-white shadow-lg"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-100">
                CODE Club FST Settat
              </p>
              <h3 className="mt-1 text-2xl font-extrabold leading-tight">{ticket.eventName}</h3>

              <div className="mt-4 flex flex-col gap-2">
                <div className="rounded-xl bg-black/20 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-widest text-orange-100">Name</p>
                  <p className="text-lg font-bold leading-tight">
                    {ticket.firstName} {ticket.lastName}
                  </p>
                </div>
                {(ticket.eventDate || ticket.venue) && (
                  <div className="flex flex-col gap-1 rounded-xl bg-black/20 px-3 py-2 text-sm font-medium">
                    {ticket.eventDate && (
                      <p className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-orange-100" />
                        {format(parseISO(ticket.eventDate), "EEEE d MMMM yyyy, HH:mm")}
                      </p>
                    )}
                    {ticket.venue && (
                      <p className="flex items-center gap-2">
                        <MapPin className="size-4 text-orange-100" />
                        {ticket.venue}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="relative mx-auto mt-4 w-fit rounded-2xl bg-white p-3">
                {ticket.qrContent ? (
                  <QRCodeSVG value={ticket.qrContent} size={190} level="M" marginSize={0} />
                ) : (
                  <div className="flex size-[190px] items-center justify-center text-center text-sm text-neutral-500">
                    The QR code is not available right now
                  </div>
                )}
                {used && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl bg-white/90 text-neutral-700">
                    <CheckCircle2 className="size-10" />
                    <p className="font-semibold">Already used</p>
                    {ticket.usedAt && (
                      <p className="text-xs">{format(parseISO(ticket.usedAt), "d MMM, HH:mm")}</p>
                    )}
                  </div>
                )}
              </div>

              <p className="mt-3 text-center text-xs tracking-[0.2em] text-orange-100">
                TICKET <span className="font-bold text-white">{ticket.number}</span>
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
