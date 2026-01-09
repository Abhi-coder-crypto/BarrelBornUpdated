import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const mongoUri = process.env.MONGODB_URI;
  console.log('MongoDB URI exists:', !!mongoUri);
  
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('barrelborn');
    
    // All MongoDB collections from barrelborn database
    const allCollections = [
      'blended-whisky', 'tequila', 'biryani', 'pizza', 'liqueurs', 'cognac-brandy',
      'charcoal', 'thai-bowls', 'rum', 'sizzlers', 'breads', 'white-wines',
      'rose-wines', 'dessert-wines', 'soft-beverages', 'port-wine', 'soups',
      'rice-noodles', 'pasta', 'bao-dimsum', 'starters', 'blended-scotch-whisky',
      'titbits', 'signature-mocktails', 'american-irish-whiskey', 'dals', 'vodka',
      'gin', 'entree', 'single-malt-whisky', 'nibbles', 'salads', 'sparkling-wine',
      'asian-mains', 'red-wines', 'curries', 'rice', 'sliders'
    ];
    
    // Check for category query parameter: /api/menu-items?category=nibbles
    const categoryParam = req.query.category;
    
    if (categoryParam) {
      // Return items from specific category
      const collection = db.collection(categoryParam);
      const items = await collection.find({}).toArray();
      console.log(`[API] Fetched ${items.length} items from category "${categoryParam}"`);
      return res.status(200).json(items);
    }
    
    // No category param, fetch all items from all collections
    const allMenuItems = [];
    for (const cat of allCollections) {
      const collection = db.collection(cat);
      const items = await collection.find({}).toArray();
      allMenuItems.push(...items);
    }
    
    console.log(`[API] Found ${allMenuItems.length} total menu items across all categories`);
    res.status(200).json(allMenuItems);
  } catch (error) {
    console.error('[API] Error fetching menu items:', error);
    res.status(500).json({ 
      error: 'Failed to fetch menu items',
      message: error.message
    });
  }
}
