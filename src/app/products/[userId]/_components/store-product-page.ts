import { db } from '@/libs/db';
import { auth } from '@clerk/nextjs';
import { Listing } from '@prisma/client';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
export type menuItemType = 'Products' | 'Create New' | 'Media' | 'Files' | 'Orders';
type productPageState = {
  active: menuItemType;
  setActive: (item: menuItemType) => void;
};

export const productPageStore = create<productPageState>()(
  persist(
    set => ({
      active: 'Create New',
      setActive: (item: menuItemType) => set(state => ({ active: item })),
    }),
    {
      name: 'product-page-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
