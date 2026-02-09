import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertCustomerSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Menu items routes
  app.get("/api/menu-items", async (req, res) => {
    try {
      const categoryQuery = (req.query.category as string) || (req.params as any).category;
      console.log(`[API] Fetching menu items for category: ${categoryQuery}`);

      if (categoryQuery) {
        const items = await storage.getMenuItemsByCategory(categoryQuery);
        return res.json(items);
      }

      // No category param, return all items
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu-items/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const items = await storage.getMenuItemsByCategory(category);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items by category" });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      const items = await storage.getCartItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await storage.removeFromCart(id);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      await storage.clearCart();
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Get categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Auth routes
  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    if (username === "CUSTOMERS@BARRELBORN.IN" && password === "BarrelBorn@132231") {
      // Create user if not exists (to ensure collection exists and follows the schema)
      const existingUser = await storage.getUserByUsername(username);
      if (!existingUser) {
        await storage.createUser({ username, password });
      }
      return res.json({ message: "Login successful" });
    }
    res.status(401).json({ message: "Invalid credentials" });
  });

  // Customer routes
  app.get("/api/customers", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const month = req.query.month ? parseInt(req.query.month as string) : undefined;
      const day = req.query.day ? parseInt(req.query.day as string) : undefined;

      const result = await storage.getCustomers({ page, limit, year, month, day });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.get("/api/customers/export", async (req, res) => {
    try {
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const month = req.query.month ? parseInt(req.query.month as string) : undefined;
      const day = req.query.day ? parseInt(req.query.day as string) : undefined;

      // Get all matching records for export (no pagination)
      const { customers } = await storage.getCustomers({ year, month, day });
      
      const data = customers.map(c => ({
        Name: c.name,
        Phone: c.phone,
        "Created At": new Date(c.createdAt).toLocaleString()
      }));

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to export customers" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      
      // Check if customer already exists by phone
      const existingCustomer = await storage.getCustomerByPhone(validatedData.phone);
      if (existingCustomer) {
        // Return existing customer instead of creating a duplicate
        return res.json(existingCustomer);
      }

      const customer = await storage.createCustomer(validatedData);
      res.json(customer);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid customer data" });
    }
  });

  // Fix veg/non-veg classification
  app.post("/api/fix-veg-classification", async (req, res) => {
    try {
      const result = await storage.fixVegNonVegClassification();
      res.json({
        message: `Fixed ${result.updated} items`,
        updated: result.updated,
        details: result.details
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fix veg classification" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
