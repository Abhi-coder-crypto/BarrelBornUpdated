/**
 * Migration script to convert bar section item prices from numbers to strings
 * Format: "30ml: ₹X / NIP: ₹Y / Bottle: ₹Z"
 * 
 * Usage: ts-node server/migrate-bar-prices.ts
 */

import { MongoClient } from "mongodb";

const BAR_COLLECTIONS = [
  "blended-whisky",
  "tequila",
  "liqueurs",
  "cognac-brandy",
  "rum",
  "vodka",
  "gin",
  "blended-scotch-whisky",
  "american-irish-whiskey",
  "white-wines",
  "rose-wines",
  "red-wines",
  "sparkling-wine",
  "dessert-wines",
  "port-wine",
  "signature-mocktails"
];

interface BarItem {
  _id: any;
  name: string;
  price: number | string;
}

export async function migrateBarPrices() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable not set");
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db("barrelborn");

    console.log("Starting migration of bar section prices...\n");

    for (const collectionName of BAR_COLLECTIONS) {
      try {
        const collection = db.collection(collectionName);
        const items = await collection.find({ price: { $type: "int" } }).toArray() as BarItem[];

        if (items.length === 0) {
          console.log(`✓ ${collectionName}: No numeric prices to migrate`);
          continue;
        }

        console.log(`Migrating ${items.length} items in ${collectionName}...`);

        for (const item of items) {
          const numPrice = typeof item.price === "number" ? item.price : parseInt(item.price as string);
          
          // Calculate 30ml, NIP (No Individual Pegs - typically a larger portion), and Bottle prices
          const thirtyMlPrice = Math.round(numPrice * 0.2);  // 30ml is ~20% of bottle
          const nipPrice = Math.round(numPrice * 0.5);      // NIP is ~50% of bottle
          const bottlePrice = numPrice;                       // Full bottle

          const priceString = `30ml: ₹${thirtyMlPrice} / NIP: ₹${nipPrice} / Bottle: ₹${bottlePrice}`;

          await collection.updateOne(
            { _id: item._id },
            { $set: { price: priceString } }
          );
        }

        console.log(`  Updated ${items.length} items with multi-price format\n`);
      } catch (error) {
        console.log(`✗ ${collectionName}: Collection may not exist or other error - skipping\n`);
      }
    }

    console.log("Migration complete!");
  } finally {
    await client.close();
  }
}

// Run migration
migrateBarPrices().catch(console.error);
