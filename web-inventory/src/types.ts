"use client";

export type Language = "en" | "ar";

export interface Pricing {
  purchase: number;
  wholesale: number;
  retail: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  partNumber: string;
  compatibleModels: string;
  barcode: string;
  supplierId?: string;
  location: string;
  quantity: number;
  reorderLevel: number;
  pricing: Pricing;
  notes?: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  paymentTerms?: string;
  notes?: string;
  createdAt: string;
}

export type SaleStatus = "paid" | "unpaid" | "pending";

export interface SaleItem {
  id: string;
  inventoryId: string;
  quantity: number;
  price: number;
  discount?: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod: string;
  status: SaleStatus;
  items: SaleItem[];
  subtotal: number;
  taxRate: number;
  total: number;
  notes?: string;
  createdAt: string;
  dueDate?: string;
}

export interface InventorySnapshot {
  id: string;
  takenAt: string;
  notes?: string;
  items: {
    inventoryId: string;
    recordedQuantity: number;
    actualQuantity: number;
  }[];
}

