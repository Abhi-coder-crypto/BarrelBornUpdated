import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const mongoUri = process.env.MONGODB_URI;
  console.log('[API] MongoDB URI exists:', !!mongoUri);
  
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
    const { category } = req.query;
    console.log('[API] Fetching category:', category);

    if (!category) {
      return res.status(400).json({ error: 'Category parameter is required' });
    }

    const client = await connectToDatabase();
    const db = client.db('barrelborn');
    const collection = db.collection(category);

    const items = await collection.find({}).toArray();
    console.log(`[API] Found ${items.length} items in category "${category}"`);

    res.status(200).json(items);
  } catch (error) {
    console.error('[API] Error fetching items by category:', error);
    res.status(500).json({ 
      error: 'Failed to fetch menu items',
      message: error.message
    });
  }
}
