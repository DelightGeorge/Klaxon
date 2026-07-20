import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Types ────────────────────────────────────────────────────────────────────
// A cart item is a product (Drug) plus a quantity. Kept as `unknown`-friendly
// via index signature so the shop page's `Drug` type can be stored directly
// without this file needing to import from the page component.
export interface CartItem {
  id: string;
  name: string;
  sellingPrice?: number;
  mockImage?: string;
  qty: number;
  [key: string]: unknown;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  updateQty: (id: string, delta: number) => void;
  clear: () => void;
}

// ── Store ────────────────────────────────────────────────────────────────────
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      // Adds a new item with qty 1, or increments qty if it's already in the cart.
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + (item.qty ?? 1) } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, qty: item.qty ?? 1 } as CartItem] };
        }),

      // Adjusts an item's quantity by `delta` (can be negative). Removes the
      // item once its quantity reaches 0 or below.
      updateQty: (id, delta) =>
        set((state) => {
          const updated = state.items
            .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
            .filter((i) => i.qty > 0);
          return { items: updated };
        }),

      clear: () => set({ items: [] }),
    }),
    {
      name: "klaxon-cart",
    },
  ),
);

// ── Helpers ──────────────────────────────────────────────────────────────────
export const cartTotal = (items: CartItem[]): number =>
  items.reduce((sum, i) => sum + (i.sellingPrice ?? 0) * i.qty, 0);

export const cartCount = (items: CartItem[]): number =>
  items.reduce((sum, i) => sum + i.qty, 0);