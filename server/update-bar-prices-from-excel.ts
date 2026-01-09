import { MongoClient } from 'mongodb';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const MONGODB_URI = process.env.MONGODB_URI || '';

interface ExcelItem {
  name: string;
  priceString: string;
  collection: string;
  priceFormat: string;
}

function parseBarMenu(data: any[][]): ExcelItem[] {
  const items: ExcelItem[] = [];
  let currentCategory = '';
  let priceFormat = '';
  
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
    
    // Check if it's a category header
    const cleanText = text.replace(/^\s*/, '');
    for (const [catName, collName] of Object.entries(categoryToCollection)) {
      if (cleanText.toUpperCase().includes(catName.toUpperCase())) {
        currentCategory = collName;
        priceFormat = '';
        break;
      }
    }
    
    // Check if it's a price format line
    if (text.includes('30ml') || text.includes('By Glass') || text.includes('ml /') || text.includes('Nip')) {
      priceFormat = text.trim();
      continue;
    }
    
    // Check if it's an item with prices (contains "–" and price numbers)
    if (currentCategory && text.includes('–')) {
      const parts = text.split('–');
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const pricesPart = parts.slice(1).join('–').trim();
        
        // Check if prices part contains actual numbers
        if (/\d/.test(pricesPart)) {
          items.push({
            name,
            priceString: pricesPart,
            collection: currentCategory,
            priceFormat
          });
        }
      }
    }
  }
  
  return items;
}

function formatPriceString(priceString: string, priceFormat: string): string {
  const prices = priceString.split('|').map(p => p.trim());
  
  // Just return the prices with rupee symbol, no labels (labels are in subtext)
  const formattedParts: string[] = [];
  for (const price of prices) {
    formattedParts.push(`₹${price}`);
  }
  
  return formattedParts.join(' / ');
}

async function updatePrices() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('barrelborn');
    
    // Read Excel file
    const workbook = XLSX.readFile('attached_assets/CRAFT_&_COCKTAIL_MENU_1765952330102.xlsx');
    const barSheet = workbook.Sheets['Bar Menu'];
    const barData = XLSX.utils.sheet_to_json(barSheet, { header: 1 }) as any[][];
    
    // Parse items from Excel
    const items = parseBarMenu(barData);
    console.log(`Found ${items.length} items in Excel`);
    
    let updatedCount = 0;
    let notFoundItems: string[] = [];
    
    for (const item of items) {
      const collection = db.collection(item.collection);
      
      // Format the price string
      const formattedPrice = formatPriceString(item.priceString, item.priceFormat);
      
      // Try to find and update the item by name (case-insensitive partial match)
      const searchName = item.name.replace(/[^\w\s]/g, '').trim();
      const regex = new RegExp(searchName.split(/\s+/).join('.*'), 'i');
      
      const result = await collection.updateOne(
        { name: { $regex: regex } },
        { $set: { price: formattedPrice, updatedAt: new Date() } }
      );
      
      if (result.matchedCount > 0) {
        console.log(`Updated "${item.name}" in ${item.collection}: ${formattedPrice}`);
        updatedCount++;
      } else {
        notFoundItems.push(`${item.name} (${item.collection})`);
      }
    }
    
    console.log(`\n=== Summary ===`);
    console.log(`Updated: ${updatedCount} items`);
    console.log(`Not found: ${notFoundItems.length} items`);
    if (notFoundItems.length > 0) {
      console.log('\nItems not found in MongoDB:');
      notFoundItems.forEach(item => console.log(`  - ${item}`));
    }
    
  } catch (error) {
    console.error('Error updating prices:', error);
  } finally {
    await client.close();
  }
}

updatePrices();
