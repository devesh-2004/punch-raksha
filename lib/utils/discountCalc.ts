interface DiscountItem {
  price: number;
  quantity: number;
  upiDiscountPercent?: number;
  upiMaxDiscount?: number;
  cardDiscountPercent?: number;
  cardMaxDiscount?: number;
}

export interface DiscountBreakdown {
  /** Per-product-configured discount layer (10% UPI / 5% Card by default, capped per-product). */
  baseLayer: number;
  /** Flat platform-level "additional online payment discount" layer — 10% capped at ₹60, same for UPI and Card. */
  additionalLayer: number;
  total: number;
}

export const PLATFORM_ADDITIONAL_DISCOUNT_PERCENT = 10;
export const PLATFORM_ADDITIONAL_DISCOUNT_MAX = 60;

export function calculatePaymentDiscountBreakdown(
  items: DiscountItem[],
  paymentMethod: "upi" | "card" | "cod",
): DiscountBreakdown {
  if (paymentMethod === "cod" || items.length === 0) {
    return { baseLayer: 0, additionalLayer: 0, total: 0 };
  }

  // Use first item's config — "upto ₹X" is a per-order cap, not per-unit
  const first = items[0];
  const basePct = paymentMethod === "upi" ? (first.upiDiscountPercent ?? 10) : (first.cardDiscountPercent ?? 5);
  const baseMax = paymentMethod === "upi" ? (first.upiMaxDiscount ?? 60) : (first.cardMaxDiscount ?? 25);

  const orderSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const baseLayer = Math.min((orderSubtotal * basePct) / 100, baseMax);
  const additionalLayer = Math.min(
    (orderSubtotal * PLATFORM_ADDITIONAL_DISCOUNT_PERCENT) / 100,
    PLATFORM_ADDITIONAL_DISCOUNT_MAX,
  );

  return { baseLayer, additionalLayer, total: baseLayer + additionalLayer };
}

export function calculatePaymentDiscount(
  items: DiscountItem[],
  paymentMethod: "upi" | "card" | "cod",
): number {
  return calculatePaymentDiscountBreakdown(items, paymentMethod).total;
}
