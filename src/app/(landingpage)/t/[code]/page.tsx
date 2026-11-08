// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
import Link from "next/link";
import type { Metadata } from "next";
import { QrCode } from "lucide-react";
import { noIndex } from "@/lib/seo";

// the page a phone camera opens when it scans a ticket's QR code. It says nothing about the ticket:
// whether a code is valid is only known to the club's scanner
export const metadata: Metadata = {
  title: "Club ticket - Code Club FST Settat",
  robots: noIndex,
};

export default function TicketCodePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-4 px-6 py-20 text-center">
      <QrCode className="size-12 text-primary" />
      <h1 className="text-2xl font-bold">This is a Code Club ticket</h1>
      <p className="text-muted-foreground">
        Show this QR code to the club staff at the entrance, they scan it with the club scanner. Your tickets are in
        your account, on the shop page.
      </p>
      <Link href="/shop" className="font-medium text-primary hover:underline">
        Open my tickets
      </Link>
    </main>
  );
}
