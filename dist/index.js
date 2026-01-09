// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { MongoClient, ObjectId } from "mongodb";
var MongoStorage = class {
  client;
  db;
  categoryCollections;
  cartItemsCollection;
  usersCollection;
  restaurantId;
  categories = [
    "nibbles",
    "soups",
    "titbits",
    "salads",
    "mangalorean-style",
    "wok",
    "charcoal",
    "continental",
    "pasta",
    "artisan-pizzas",
    "mini-burger-sliders",
    "entree-(main-course)",
    "bao-&-dim-sum",
    "indian-mains---curries",
    "biryanis-&-rice",
    "dals",
    "breads",
    "asian-mains",
    "rice-with-curry---thai-&-asian-bowls",
    "rice-&-noodles",
    "desserts",
    "blended-whisky",
    "blended-scotch-whisky",
    "american-irish-whiskey",
    "single-malt-whisky",
    "vodka",
    "gin",
    "rum",
    "tequila",
    "cognac-brandy",
    "liqueurs",
    "sparkling-wine",
    "white-wines",
    "rose-wines",
    "red-wines",
    "dessert-wines",
    "port-wine",
    "signature-mocktails",
    "soft-beverages",
    "craft-beers-on-tap",
    "draught-beer",
    "pint-beers",
    "classic-cocktails",
    "signature-cocktails",
    "wine-cocktails",
    "sangria",
    "signature-shots"
  ];
  constructor(connectionString2) {
    this.client = new MongoClient(connectionString2);
    this.db = this.client.db("barrelborn");
    this.categoryCollections = /* @__PURE__ */ new Map();
    this.categories.forEach((category) => {
      this.categoryCollections.set(category, this.db.collection(category));
    });
    this.cartItemsCollection = this.db.collection("cartitems");
    this.usersCollection = this.db.collection("users");
    this.restaurantId = new ObjectId("6874cff2a880250859286de6");
  }
  async connect() {
    await this.client.connect();
  }
  async getUser(id) {
    const user = await this.usersCollection.findOne({ _id: new ObjectId(id) });
    return user || void 0;
  }
  async getUserByUsername(username) {
    const user = await this.usersCollection.findOne({ username });
    return user || void 0;
  }
  async createUser(insertUser) {
    const now = /* @__PURE__ */ new Date();
    const user = { ...insertUser, createdAt: now, updatedAt: now };
    const result = await this.usersCollection.insertOne(user);
    return { _id: result.insertedId, ...user };
  }
  async getMenuItems() {
    const allMenuItems = [];
    const collections = Array.from(this.categoryCollections.values());
    for (const collection of collections) {
      const items = await collection.find({}).toArray();
      allMenuItems.push(...items);
    }
    return this.sortMenuItems(allMenuItems);
  }
  async getMenuItemsByCategory(category) {
    console.log(`[Storage] Fetching items for category: ${category}`);
    try {
      let collection = this.db.collection(category);
      let items = await collection.find({}).toArray();
      if (items.length > 0) {
        console.log(`[Storage] Found ${items.length} items in barrelborn.${category}`);
        return this.sortMenuItems(items.map((item) => ({ ...item, category })));
      }
      const variations = [
        category,
        category.replace(/-/g, " "),
        category.replace(/-/g, "&"),
        category.replace(/-/g, " & "),
        category.replace(/&/g, "-"),
        category.replace(/ /g, "-")
      ];
      for (const variant of Array.from(new Set(variations))) {
        if (variant === category) continue;
        const variantColl = this.db.collection(variant);
        const variantItems = await variantColl.find({}).toArray();
        if (variantItems.length > 0) {
          console.log(`[Storage] Found ${variantItems.length} items in barrelborn collection variation: ${variant}`);
          return this.sortMenuItems(variantItems.map((item) => ({ ...item, category: variant })));
        }
      }
      const dbCollections = await this.db.listCollections().toArray();
      const allMatches = [];
      for (const collInfo of dbCollections) {
        const coll = this.db.collection(collInfo.name);
        const matches = await coll.find({
          $or: [
            { name: new RegExp(category.replace(/-/g, " "), "i") },
            { description: new RegExp(category.replace(/-/g, " "), "i") }
          ]
        }).toArray();
        if (matches.length > 0) allMatches.push(...matches.map((m) => ({ ...m, category: collInfo.name })));
      }
      if (allMatches.length > 0) return this.sortMenuItems(allMatches);
      return [];
    } catch (error) {
      console.error(`[Storage] Error fetching items for ${category}:`, error);
      return [];
    }
  }
  async getMenuItem(id) {
    const collections = Array.from(this.categoryCollections.values());
    for (const collection of collections) {
      const menuItem = await collection.findOne({ _id: new ObjectId(id) });
      if (menuItem) return menuItem;
    }
    return void 0;
  }
  getCategories() {
    return [...this.categories];
  }
  async addMenuItem(item) {
    const collection = this.db.collection(item.category);
    const now = /* @__PURE__ */ new Date();
    const menuItem = { ...item, restaurantId: this.restaurantId, createdAt: now, updatedAt: now, __v: 0 };
    const result = await collection.insertOne(menuItem);
    return { _id: result.insertedId, ...menuItem };
  }
  async getCartItems() {
    return await this.cartItemsCollection.find({}).toArray();
  }
  async addToCart(item) {
    const menuItemId = new ObjectId(item.menuItemId);
    const existing = await this.cartItemsCollection.findOne({ menuItemId });
    if (existing) {
      const updated = await this.cartItemsCollection.findOneAndUpdate(
        { _id: existing._id },
        { $inc: { quantity: item.quantity || 1 }, $set: { updatedAt: /* @__PURE__ */ new Date() } },
        { returnDocument: "after" }
      );
      return updated;
    }
    const now = /* @__PURE__ */ new Date();
    const cartItem = { menuItemId, quantity: item.quantity || 1, createdAt: now, updatedAt: now };
    const result = await this.cartItemsCollection.insertOne(cartItem);
    return { _id: result.insertedId, ...cartItem };
  }
  async removeFromCart(id) {
    await this.cartItemsCollection.deleteOne({ _id: new ObjectId(id) });
  }
  async clearCart() {
    await this.cartItemsCollection.deleteMany({});
  }
  async clearDatabase() {
    const collections = Array.from(this.categoryCollections.values());
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
  async fixVegNonVegClassification() {
    return { updated: 0, details: [] };
  }
  sortMenuItems(items) {
    return items.sort((a, b) => {
      if (a.isVeg !== b.isVeg) return a.isVeg ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }
};
var connectionString = "mongodb+srv://abarrelborn_db_user:xTl95RKaa9k9MagM@barrelborn.fllyeem.mongodb.net/barrelborn?appName=BarrelBorn";
var storage = new MongoStorage(connectionString);

// shared/schema.ts
import { z } from "zod";
var insertMenuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.union([z.number().positive(), z.string().min(1)]),
  // Support both number and string prices
  category: z.string().min(1),
  isVeg: z.boolean(),
  image: z.string().url(),
  restaurantId: z.string().optional(),
  isAvailable: z.boolean().default(true)
});
var insertCartItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().positive().default(1)
});
var insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/menu-items", async (req, res) => {
    try {
      const categoryQuery = req.query.category || req.params.category;
      console.log(`[API] Fetching menu items for category: ${categoryQuery}`);
      if (categoryQuery) {
        const items2 = await storage.getMenuItemsByCategory(categoryQuery);
        return res.json(items2);
      }
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });
  app2.get("/api/menu-items/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const items = await storage.getMenuItemsByCategory(category);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items by category" });
    }
  });
  app2.get("/api/cart", async (req, res) => {
    try {
      const items = await storage.getCartItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });
  app2.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });
  app2.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await storage.removeFromCart(id);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });
  app2.delete("/api/cart", async (req, res) => {
    try {
      await storage.clearCart();
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories = storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.post("/api/fix-veg-classification", async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  assetsInclude: ["**/*.JPG"],
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await storage.connect();
  log("Connected to MongoDB");
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3003;
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
