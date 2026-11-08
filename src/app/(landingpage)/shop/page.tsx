// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
import { pageMetadata } from "@/lib/seo";
import ShopSection from "@/components/shop/shop-section";
import { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Merch Shop: Hoodies & T-shirts - Code Club FST Settat",
  description:
    "Hoodies, t-shirts, stickers and more from the Code Club at FST Settat. Members book on WhatsApp and pick it up at the club office.",
  path: "/shop",
  keywords: ["Shop", "Merch", "Hoodie"],
});

export default function ShopPage() {
  return (
    <main className="w-full flex-1 container mx-auto">
      <ShopSection />
    </main>
  );
}
