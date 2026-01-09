import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { type User, type InsertUser, type MenuItem, type InsertMenuItem, type CartItem, type InsertCartItem } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  getCategories(): string[];
  addMenuItem(item: InsertMenuItem): Promise<MenuItem>;

  getCartItems(): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  removeFromCart(id: string): Promise<void>;
  clearCart(): Promise<void>;
  
  clearDatabase(): Promise<void>;
  fixVegNonVegClassification(): Promise<{ updated: number; details: string[] }>;
}

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db;
  private categoryCollections: Map<string, Collection<MenuItem>>;
  private cartItemsCollection: Collection<CartItem>;
  private usersCollection: Collection<User>;
  private restaurantId: ObjectId;

  private readonly categories = [
    "nibbles", "soups", "titbits", "salads", "mangalorean-style", "wok", "charcoal", 
    "continental", "pasta", "artisan-pizzas", "mini-burger-sliders", "entree-(main-course)", 
    "bao-&-dim-sum", "indian-mains---curries", "biryanis-&-rice", "dals", "breads", 
    "asian-mains", "rice-with-curry---thai-&-asian-bowls", "rice-&-noodles", "desserts", 
    "blended-whisky", "blended-scotch-whisky", "american-irish-whiskey", "single-malt-whisky", 
    "vodka", "gin", "rum", "tequila", "cognac-brandy", "liqueurs", "sparkling-wine", 
    "white-wines", "rose-wines", "red-wines", "dessert-wines", "port-wine", 
    "signature-mocktails", "soft-beverages", "craft-beers-on-tap", "draught-beer", 
    "pint-beers", "classic-cocktails", "signature-cocktails", "wine-cocktails", 
    "sangria", "signature-shots"
  ];

  constructor(connectionString: string) {
    this.client = new MongoClient(connectionString);
    this.db = this.client.db("barrelborn");
    this.categoryCollections = new Map();

    this.categories.forEach(category => {
      this.categoryCollections.set(category, this.db.collection(category));
    });

    this.cartItemsCollection = this.db.collection("cartitems");
    this.usersCollection = this.db.collection("users");
    this.restaurantId = new ObjectId("6874cff2a880250859286de6");
  }

  async connect() {
    await this.client.connect();
  }

  async getUser(id: string): Promise<User | undefined> {
    const user = await this.usersCollection.findOne({ _id: new ObjectId(id) });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersCollection.findOne({ username });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    const user = { ...insertUser, createdAt: now, updatedAt: now };
    const result = await this.usersCollection.insertOne(user as any);
    return { _id: result.insertedId, ...user } as any;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    const allMenuItems: MenuItem[] = [];
    const collections = Array.from(this.categoryCollections.values());
    for (const collection of collections) {
      const items = await collection.find({}).toArray();
      allMenuItems.push(...items);
    }
    return this.sortMenuItems(allMenuItems);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    console.log(`[Storage] Fetching items for category: ${category}`);
    try {
      // 1. Check current DB ('barrelborn') for a direct collection match
      let collection = this.db.collection(category) as Collection<MenuItem>;
      let items = await collection.find({}).toArray();
      
      if (items.length > 0) {
        console.log(`[Storage] Found ${items.length} items in barrelborn.${category}`);
        return this.sortMenuItems(items.map(item => ({ ...item, category })));
      }

      // 1.1 Try matching with hyphens replaced by spaces or other common separators
      const variations = [
        category,
        category.replace(/-/g, ' '),
        category.replace(/-/g, '&'),
        category.replace(/-/g, ' & '),
        category.replace(/&/g, '-'),
        category.replace(/ /g, '-')
      ];

      for (const variant of Array.from(new Set(variations))) {
        if (variant === category) continue;
        const variantColl = this.db.collection(variant) as Collection<MenuItem>;
        const variantItems = await variantColl.find({}).toArray();
        if (variantItems.length > 0) {
          console.log(`[Storage] Found ${variantItems.length} items in barrelborn collection variation: ${variant}`);
          return this.sortMenuItems(variantItems.map(item => ({ ...item, category: variant })));
        }
      }

      // 2. Last-ditch search: Look for items with the category in THEIR name or description across barrelborn collections
      const dbCollections = await this.db.listCollections().toArray();
      const allMatches: MenuItem[] = [];
      for (const collInfo of dbCollections) {
        const coll = this.db.collection(collInfo.name) as Collection<MenuItem>;
        const matches = await coll.find({
          $or: [
            { name: new RegExp(category.replace(/-/g, ' '), 'i') },
            { description: new RegExp(category.replace(/-/g, ' '), 'i') }
          ]
        }).toArray();
        if (matches.length > 0) allMatches.push(...matches.map(m => ({ ...m, category: collInfo.name })));
      }
      
      if (allMatches.length > 0) return this.sortMenuItems(allMatches);

      return [];
    } catch (error) {
      console.error(`[Storage] Error fetching items for ${category}:`, error);
      return [];
    }
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const collections = Array.from(this.categoryCollections.values());
    for (const collection of collections) {
      const menuItem = await collection.findOne({ _id: new ObjectId(id) });
      if (menuItem) return menuItem;
    }
    return undefined;
  }

  getCategories(): string[] {
    return [...this.categories];
  }

  async addMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const collection = this.db.collection(item.category);
    const now = new Date();
    const menuItem = { ...item, restaurantId: this.restaurantId, createdAt: now, updatedAt: now, __v: 0 };
    const result = await collection.insertOne(menuItem as any);
    return { _id: result.insertedId, ...menuItem } as any;
  }

  async getCartItems(): Promise<CartItem[]> {
    return await this.cartItemsCollection.find({}).toArray();
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const menuItemId = new ObjectId(item.menuItemId);
    const existing = await this.cartItemsCollection.findOne({ menuItemId });
    if (existing) {
      const updated = await this.cartItemsCollection.findOneAndUpdate(
        { _id: existing._id },
        { $inc: { quantity: item.quantity || 1 }, $set: { updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return updated!;
    }
    const now = new Date();
    const cartItem = { menuItemId, quantity: item.quantity || 1, createdAt: now, updatedAt: now };
    const result = await this.cartItemsCollection.insertOne(cartItem as any);
    return { _id: result.insertedId, ...cartItem } as any;
  }

  async removeFromCart(id: string): Promise<void> {
    await this.cartItemsCollection.deleteOne({ _id: new ObjectId(id) });
  }

  async clearCart(): Promise<void> {
    await this.cartItemsCollection.deleteMany({});
  }

  async clearDatabase(): Promise<void> {
    const collections = Array.from(this.categoryCollections.values());
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }

  async fixVegNonVegClassification(): Promise<{ updated: number; details: string[] }> {
    return { updated: 0, details: [] };
  }

  private sortMenuItems(items: MenuItem[]): MenuItem[] {
    return items.sort((a, b) => {
      if (a.isVeg !== b.isVeg) return a.isVeg ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }
}

const connectionString = "mongodb+srv://abarrelborn_db_user:xTl95RKaa9k9MagM@barrelborn.fllyeem.mongodb.net/barrelborn?appName=BarrelBorn";
export const storage = new MongoStorage(connectionString);
