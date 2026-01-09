import { MongoClient } from 'mongodb';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const MONGODB_URI = process.env.MONGODB_URI || '';

interface ItemPriceMap {
  collection: string;
  name: string;
  prices: string;
}

function parseAllBarMenu(data: any[][]): Map<string, ItemPriceMap> {
  const itemMap = new Map<string, ItemPriceMap>();
  let currentCategory = '';
  
  const categoryToCollection: Record<string, string> = {
    'BLENDED WHISKY': 'blended-whisky',
    'BLENDED SCOTCH WHISKY': 'blended-scotch-whisky',
    'AMERICAN & IRISH WHISKEY': 'american-irish-whiskey',
    'SINGLE MALT WHISKY': 'single-malt-whisky',
    'VODKA': 'vodka',
    'GIN': 'gin',
    'RUM': 'rum',
    'TEQUILA': 'tequila',
    'COGNAC & BRANDY': 'cognac-brandy',
    'LIQUEURS': 'liqueurs',
    'SPARKLING WINE': 'sparkling-wine',
    'White Wines': 'white-wines',
    'Rosé Wines': 'rose-wines',
    'Red Wines': 'red-wines',
  };
  
  for (const row of data) {
    if (!row[0] || typeof row[0] !== 'string') continue;
    
    const text = row[0].trim();
    const cleanText = text.replace(/^\s*/, '');
    
    // Check category
    for (const [catName, collName] of Object.entries(categoryToCollection)) {
      if (cleanText.toUpperCase().includes(catName.toUpperCase())) {
        currentCategory = collName;
        break;
      }
    }
    
    // Skip format lines
    if (text.includes('30ml') || text.includes('By Glass') || text.includes('ml /') || text.includes('Nip')) {
      continue;
    }
    
    // Parse item with prices
    if (currentCategory && text.includes('–')) {
      const parts = text.split('–');
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const pricesPart = parts.slice(1).join('–').trim();
        
        if (/\d/.test(pricesPart)) {
          // Format: just rupee signs and prices
          const prices = pricesPart.split('|').map(p => p.trim());
          const formatted = prices.map(p => `₹${p}`).join(' / ');
          
          itemMap.set(name.toLowerCase(), {
            collection: currentCategory,
            name,
            prices: formatted
          });
        }
      }
    }
  }
  
  return itemMap;
}

async function updateRemainingPrices() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('barrelborn');
    
    // Read Excel
    const workbook = XLSX.readFile('attached_assets/CRAFT_&_COCKTAIL_MENU_1765952950426.xlsx');
    const barSheet = workbook.Sheets['Bar Menu'];
    const barData = XLSX.utils.sheet_to_json(barSheet, { header: 1 }) as any[][];
    
    const priceMap = parseAllBarMenu(barData);
    console.log(`Loaded ${priceMap.size} items from Excel`);
    
    // Items to update - these are the ones still in old format
    const itemsToFind = [
      { name: "Patrón Silver", collection: 'tequila' },
      { name: "Gordon's", collection: 'gin' },
      { name: "Ballantine's Finest", collection: 'blended-scotch-whisky' },
      { name: "Ballantine's 12Y", collection: 'blended-scotch-whisky' },
      { name: "Dewar's White Label", collection: 'blended-scotch-whisky' },
      { name: "Teacher's Highland Reserve", collection: 'blended-scotch-whisky' },
      { name: "Teacher's 50Y", collection: 'blended-scotch-whisky' },
      { name: "Jack Daniel's No. 7", collection: 'american-irish-whiskey' },
      { name: "Jack Daniel's Honey", collection: 'american-irish-whiskey' },
      { name: "Jack Daniel's Single Barrel", collection: 'american-irish-whiskey' },
    ];
    
    let updatedCount = 0;
    for (const item of itemsToFind) {
      const excelItem = priceMap.get(item.name.toLowerCase());
      if (!excelItem) {
        console.log(`⚠️  Not found in Excel: ${item.name}`);
        continue;
      }
      
      const collection = db.collection(item.collection);
      const result = await collection.updateOne(
        { name: item.name },
        { $set: { price: excelItem.prices, updatedAt: new Date() } }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✓ Updated "${item.name}": ${excelItem.prices}`);
        updatedCount++;
      } else {
        console.log(`✗ Not found in DB: ${item.name}`);
      }
    }
    
    console.log(`\n=== Summary ===`);
    console.log(`Updated: ${updatedCount} items`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateRemainingPrices();
