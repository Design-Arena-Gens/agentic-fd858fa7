'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import dayjs from 'dayjs';
import {
  InventoryItem,
  InventorySnapshot,
  Language,
  Sale,
  SaleItem,
  Supplier,
} from '@/types';

interface InventoryState {
  language: Language;
  items: InventoryItem[];
  suppliers: Supplier[];
  sales: Sale[];
  snapshots: InventorySnapshot[];
  isHydrated: boolean;
  setHydrated: (value: boolean) => void;
  setLanguage: (language: Language) => void;
  addItem: (item: Omit<InventoryItem, 'id' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<Omit<InventoryItem, 'id'>>) => void;
  deleteItem: (id: string) => void;
  adjustQuantity: (id: string, quantity: number) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  updateSupplier: (id: string, supplier: Partial<Omit<Supplier, 'id'>>) => void;
  deleteSupplier: (id: string) => void;
  addSale: (
    sale: Omit<Sale, 'id' | 'createdAt' | 'subtotal' | 'total' | 'items'> & {
      items: Omit<SaleItem, 'id'>[];
    }
  ) => void;
  deleteSale: (id: string) => void;
  recordSnapshot: (
    snapshot: Omit<InventorySnapshot, 'id' | 'takenAt'>
  ) => void;
}

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const defaultState: Pick<
  InventoryState,
  'items' | 'sales' | 'suppliers' | 'snapshots' | 'language'
> = {
  items: [],
  suppliers: [],
  sales: [],
  snapshots: [],
  language: 'en',
};

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      ...defaultState,
      isHydrated: false,
      setHydrated: (value) => set({ isHydrated: value }),
      setLanguage: (language) => set({ language }),
      addItem: (item) =>
        set((state) => ({
          items: [
            {
              ...item,
              id: createId(),
              updatedAt: dayjs().toISOString(),
            },
            ...state.items,
          ],
        })),
      updateItem: (id, data) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...data,
                  updatedAt: dayjs().toISOString(),
                }
              : item
          ),
        })),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          sales: state.sales.map((sale) => ({
            ...sale,
            items: sale.items.filter((line) => line.inventoryId !== id),
          })),
        })),
      adjustQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: Math.max(item.quantity + quantity, 0),
                  updatedAt: dayjs().toISOString(),
                }
              : item
          ),
        })),
      addSupplier: (supplier) =>
        set((state) => ({
          suppliers: [
            {
              ...supplier,
              id: createId(),
              createdAt: dayjs().toISOString(),
            },
            ...state.suppliers,
          ],
        })),
      updateSupplier: (id, data) =>
        set((state) => ({
          suppliers: state.suppliers.map((supplier) =>
            supplier.id === id ? { ...supplier, ...data } : supplier
          ),
        })),
      deleteSupplier: (id) =>
        set((state) => ({
          suppliers: state.suppliers.filter((supplier) => supplier.id !== id),
          items: state.items.map((item) =>
            item.supplierId === id ? { ...item, supplierId: undefined } : item
          ),
        })),
      addSale: (sale) =>
        set((state) => {
          const itemsWithIds = sale.items.map((item) => ({
            ...item,
            id: createId(),
          }));

          const subtotal = itemsWithIds.reduce(
            (total, item) =>
              total +
              item.quantity *
                (item.price - (item.discount ?? 0)),
            0
          );
          const total = subtotal + subtotal * sale.taxRate;

          const updatedItems = state.items.map((item) => {
            const line = itemsWithIds.find(
              (entry) => entry.inventoryId === item.id
            );
            if (!line) {
              return item;
            }

            return {
              ...item,
              quantity: Math.max(item.quantity - line.quantity, 0),
              updatedAt: dayjs().toISOString(),
            };
          });

          return {
            items: updatedItems,
            sales: [
              {
                ...sale,
                items: itemsWithIds,
                id: createId(),
                subtotal,
                total,
                createdAt: dayjs().toISOString(),
              },
              ...state.sales,
            ],
          };
        }),
      deleteSale: (id) =>
        set((state) => ({
          sales: state.sales.filter((sale) => sale.id !== id),
        })),
      recordSnapshot: (snapshot) =>
        set((state) => ({
          snapshots: [
            {
              ...snapshot,
              id: createId(),
              takenAt: dayjs().toISOString(),
            },
            ...state.snapshots,
          ],
        })),
    }),
    {
      name: 'auto-parts-inventory',
      storage:
        typeof window === 'undefined'
          ? undefined
          : createJSONStorage(() => window.localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (state) => ({
        language: state.language,
        items: state.items,
        suppliers: state.suppliers,
        sales: state.sales,
        snapshots: state.snapshots,
      }),
    }
  )
);
