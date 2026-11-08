// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
const priceFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

// prices are in Moroccan dirhams
export function formatPrice(amount: number): string {
  return `${priceFormat.format(amount)} MAD`;
}

// below this the item shows "only N left"
export const LOW_STOCK = 5;

// the most pieces a member can book at once, the backend allows up to 5
export const MAX_QUANTITY = 5;

// orders are placed over WhatsApp, in international format without "+" or spaces
export const SHOP_WHATSAPP_NUMBER = "212774206014";

interface OrderItem {
  ticket?: boolean;
  name: string;
  category: string;
  description: string | null;
  price: number;
}

/**
 * A wa.me link that opens a chat with the club and pre-fills an order message
 * describing the article, the size, the quantity and the total.
 */
export function buildWhatsAppOrderUrl(item: OrderItem, size: string | null, quantity: number): string {
  if (item.ticket) {
    const lines = [
      `Hello Code Club, I booked my ticket for ${item.name} on the website.`,
      `Price: ${formatPrice(item.price)}`,
      "",
      "How can I pay? Once the payment is confirmed my QR ticket is emailed to me. Thank you!",
    ];
    return `https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }
  const lines = [
    "Hello Code Club, I'd like to order from the club shop:",
    "",
    `Item: ${item.name}`,
    `Category: ${item.category}`,
    ...(item.description ? [`Details: ${item.description}`] : []),
    ...(size ? [`Size: ${size}`] : []),
    `Quantity: ${quantity}`,
    `Price: ${formatPrice(item.price)} each`,
    `Total: ${formatPrice(item.price * quantity)}`,
    "",
    "Is it available, and how can I pay and pick it up at the club office? Thank you!",
  ];
  return `https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
