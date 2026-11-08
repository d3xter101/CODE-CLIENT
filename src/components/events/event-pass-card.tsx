"use client";
// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026

import { QRCodeSVG } from "qrcode.react";
import { format, parseISO } from "date-fns";
import { BadgeCheck, Ticket } from "lucide-react";
import type { EventPass } from "@/types/backendTypes";

/**
 * The member's pass for an event they joined, drawn like their shop tickets: the name, the event and the QR code
 * the club scans at the event. Once scanned it says the member was present.
 */
export default function EventPassCard({ pass }: { pass: EventPass }) {
  return (
    <section
      aria-label="Your pass for this event"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-700 via-orange-500 to-orange-400 p-5 text-white shadow-lg"
    >
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-100">
        <Ticket className="size-4" /> Your pass
      </p>
      <h3 className="mt-1 text-xl font-extrabold leading-tight">{pass.eventName}</h3>

      <div className="mt-3 rounded-xl bg-black/20 px-3 py-2">
        <p className="text-[10px] uppercase tracking-widest text-orange-100">Name</p>
        <p className="text-lg font-bold leading-tight">
          {pass.firstName} {pass.lastName}
        </p>
      </div>

      <div className="relative mx-auto mt-4 w-fit rounded-2xl bg-white p-3">
        {pass.qrContent ? (
          <QRCodeSVG value={pass.qrContent} size={180} level="M" marginSize={0} />
        ) : (
          <div className="flex size-[180px] items-center justify-center text-center text-sm text-neutral-500">
            The QR code is not available right now
          </div>
        )}
        {pass.present && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl bg-white/90 text-neutral-700">
            <BadgeCheck className="size-10 text-green-600" />
            <p className="font-semibold">Present</p>
            {pass.presentAt && <p className="text-xs">{format(parseISO(pass.presentAt), "d MMM, HH:mm")}</p>}
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-xs tracking-[0.2em] text-orange-100">
        PASS <span className="font-bold text-white">{pass.number}</span>
      </p>
      <p className="mt-1 text-center text-[11px] text-orange-100">
        Show this at the event and turn your screen brightness up. It works once.
      </p>
    </section>
  );
}
