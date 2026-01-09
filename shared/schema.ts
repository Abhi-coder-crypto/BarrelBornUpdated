import { z } from "zod";
import { ObjectId } from "mongodb";

// MongoDB Schema Types
export interface MenuItem {
  _id: ObjectId;
  name: string;
  description: string;
  price: number | string;  // String for bar items with multi-price format (e.g., "30ml: ₹200 / NIP: ₹400 / Bottle: ₹2000")
  category: string;
  isVeg: boolean;
  image: string;
  restaurantId: ObjectId;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface CartItem {
  _id: ObjectId;
  menuItemId: ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: ObjectId;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Zod schemas for validation
export const insertMenuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.union([z.number().positive(), z.string().min(1)]),  // Support both number and string prices
  category: z.string().min(1),
  isVeg: z.boolean(),
  image: z.string().url(),
  restaurantId: z.string().optional(),
  isAvailable: z.boolean().default(true),
});

export const insertCartItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().positive().default(1),
});

export const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
