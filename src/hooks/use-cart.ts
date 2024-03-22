
import { ImageInterface, ListingInterface } from "@prisma/client";
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ListingAndImage {
  listing: ListingInterface;
  images: ImageInterface[]
}

type CartState = {
  items: ListingAndImage[];
  addItem: (product: ListingAndImage) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          return { items: [...state.items, product] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.listing.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);