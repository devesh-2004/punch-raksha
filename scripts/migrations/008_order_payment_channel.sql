-- =============================================================================
-- Migration 008: order payment channel (upi/card/cod) + order_items.mrp
--
-- 1. `orders.payment_method` only distinguishes COD vs Prepaid (a settlement
--    concept used by shipping/COD-collection logic). It cannot tell a UPI
--    order from a Card order, so neither admin nor the customer-facing
--    order-success page can show which online channel was actually used, and
--    the two-layer discount (base + additional online-payment discount) has
--    no durable record of which base rate applied. Adds `payment_channel` as
--    an additive column alongside the existing `payment_method` — it does
--    not replace it.
--
-- 2. `order_items` never stored the product's MRP (only the sold price), so
--    the "Item total" / "Item Discount" lines on the order-success page could
--    only be computed from client-side cart state, not from the persisted
--    order. Adds `mrp` so that page can be served entirely from the DB.
--
-- Safe on an empty database and idempotent: ADD COLUMN IF NOT EXISTS, and the
-- backfill only touches rows still at the column default.
--
-- Apply with:  npx tsx scripts/apply-migration.ts 008_order_payment_channel.sql
-- =============================================================================

BEGIN;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_channel TEXT NOT NULL DEFAULT 'cod'
    CHECK (payment_channel IN ('upi', 'card', 'cod'));

-- Backfill existing rows: infer channel from the current binary payment_method
-- as a best-effort (COD -> cod, Prepaid -> upi, since upi was previously the
-- only "Prepaid" path exercised in production before this migration).
UPDATE orders SET payment_channel = 'cod' WHERE payment_method = 'COD' AND payment_channel = 'cod';
UPDATE orders SET payment_channel = 'upi' WHERE payment_method = 'Prepaid' AND payment_channel = 'cod';

ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS mrp NUMERIC NOT NULL DEFAULT 0;

-- Backfill: for existing rows with no recorded mrp, treat price as the mrp
-- (best-effort — the real historical MRP wasn't captured before this migration).
UPDATE order_items SET mrp = price WHERE mrp = 0;

COMMIT;
