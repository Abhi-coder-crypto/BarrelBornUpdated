// Menu category structure with main categories and subcategories
// Images already exist in menu.tsx - we'll import them there

export interface SubCategory {
  id: string;
  displayLabel: string;
  dbCategory: string;
  image?: string;
}

export interface MainCategory {
  id: string;
  displayLabel: string;
  description: string;
  subcategories: SubCategory[];
}

// FOOD subcategories
export const foodSubcategories: SubCategory[] = [
  { id: "nibbles", displayLabel: "Nibbles", dbCategory: "nibbles" },
  { id: "soups", displayLabel: "Soups", dbCategory: "soups" },
  { id: "titbits", displayLabel: "Titbits", dbCategory: "titbits" },
  { id: "salads", displayLabel: "Salads", dbCategory: "salads" },
  { id: "mangalorean-style", displayLabel: "Mangalorean Style", dbCategory: "mangalorean-style" },
  { id: "wok", displayLabel: "Wok", dbCategory: "wok" },
  { id: "charcoal", displayLabel: "Charcoal", dbCategory: "charcoal" },
  { id: "continental", displayLabel: "Continental", dbCategory: "continental" },
  { id: "pasta", displayLabel: "Pasta", dbCategory: "pasta" },
  { id: "artisan-pizzas", displayLabel: "Artisan Pizzas", dbCategory: "artisan-pizzas" },
  { id: "mini-burger-sliders", displayLabel: "Mini Burger Sliders", dbCategory: "mini-burger-sliders" },
  { id: "entree", displayLabel: "Entree (Main Course)", dbCategory: "entree" },
  { id: "bao-dimsum", displayLabel: "Bao & Dim Sum", dbCategory: "bao-dimsum" },
  { id: "indian-mains-curries", displayLabel: "Indian Mains - Curries", dbCategory: "indian-mains-curries" },
  { id: "biryanis-rice", displayLabel: "Biryanis & Rice", dbCategory: "biryanis-rice" },
  { id: "dals", displayLabel: "Dals", dbCategory: "dals" },
  { id: "breads", displayLabel: "Breads", dbCategory: "breads" },
  { id: "asian-mains", displayLabel: "Asian Mains", dbCategory: "asian-mains" },
  { id: "rice-with-curry---thai-asian-bowls", displayLabel: "Rice with Curry - Thai & Asian Bowls", dbCategory: "rice-with-curry---thai-asian-bowls" },
  { id: "rice-noodles", displayLabel: "Rice & Noodles", dbCategory: "rice-noodles" },
];

// BAR subcategories - Whiskey has sub-subcategories, Wine has sub-subcategories
export const barSubcategories: SubCategory[] = [
  // Whiskey types
  {
    id: "blended-whisky",
    displayLabel: "Blended Whisky",
    dbCategory: "blended-whisky",
  },
  {
    id: "blended-scotch-whisky",
    displayLabel: "Blended Scotch Whisky",
    dbCategory: "blended-scotch-whisky",
  },
  {
    id: "american-irish-whiskey",
    displayLabel: "American & Irish Whiskey",
    dbCategory: "american-irish-whiskey",
  },
  {
    id: "single-malt-whisky",
    displayLabel: "Single Malt Whisky",
    dbCategory: "single-malt-whisky",
  },
  // Other spirits
  { id: "vodka", displayLabel: "Vodka", dbCategory: "vodka" },
  { id: "gin", displayLabel: "Gin", dbCategory: "gin" },
  { id: "rum", displayLabel: "Rum", dbCategory: "rum" },
  { id: "tequila", displayLabel: "Tequila", dbCategory: "tequila" },
  {
    id: "cognac-brandy",
    displayLabel: "Cognac & Brandy",
    dbCategory: "cognac-brandy",
  },
  { id: "liqueurs", displayLabel: "Liqueurs", dbCategory: "liqueurs" },
  // Wine types
  {
    id: "sparkling-wine",
    displayLabel: "Sparkling Wine",
    dbCategory: "sparkling-wine",
  },
  { id: "white-wines", displayLabel: "White Wines", dbCategory: "white-wines" },
  { id: "rose-wines", displayLabel: "Rosé Wines", dbCategory: "rose-wines" },
  { id: "red-wines", displayLabel: "Red Wines", dbCategory: "red-wines" },
  {
    id: "dessert-wines",
    displayLabel: "Dessert Wines",
    dbCategory: "dessert-wines",
  },
  { id: "port-wine", displayLabel: "Port Wine", dbCategory: "port-wine" },
];

// DESSERTS subcategories (placeholder - will need actual dessert categories)
export const dessertsSubcategories: SubCategory[] = [
  { id: "desserts", displayLabel: "Desserts", dbCategory: "desserts" },
];

// MOCKTAILS subcategories
export const mocktailsSubcategories: SubCategory[] = [
  {
    id: "signature-mocktails",
    displayLabel: "Signature Mocktails",
    dbCategory: "signature-mocktails",
  },
  {
    id: "soft-beverages",
    displayLabel: "Soft Beverages",
    dbCategory: "soft-beverages",
  },
];

// Main categories with their subcategories
export const mainCategories: MainCategory[] = [
  {
    id: "food",
    displayLabel: "FOOD",
    description: "Delicious cuisines from around the world",
    subcategories: foodSubcategories,
  },
  {
    id: "crafted-beer",
    displayLabel: "CRAFT BEERS",
    description: "Premium brewed beers",
    subcategories: [
      {
        id: "craft-beers-on-tap",
        displayLabel: "Craft Beers On Tap",
        dbCategory: "craft-beers-on-tap",
      },
      {
        id: "draught-beer",
        displayLabel: "Draught Beer",
        dbCategory: "draught-beer",
      },
      {
        id: "pint-beers",
        displayLabel: "Pint Beers",
        dbCategory: "pint-beers",
      },
    ],
  },
  {
    id: "cocktails",
    displayLabel: "COCKTAILS",
    description: "Expertly mixed drinks",
    subcategories: [
      {
        id: "classic-cocktails",
        displayLabel: "Classic Cocktails",
        dbCategory: "classic-cocktails",
      },
      {
        id: "signature-cocktails",
        displayLabel: "Signature Cocktails",
        dbCategory: "signature-cocktails",
      },
      {
        id: "wine-cocktails",
        displayLabel: "Wine Cocktails",
        dbCategory: "wine-cocktails",
      },
      { id: "sangria", displayLabel: "Sangria", dbCategory: "sangria" },
      {
        id: "signature-shots",
        displayLabel: "Signature Shots",
        dbCategory: "signature-shots",
      },
    ],
  },
  {
    id: "bar",
    displayLabel: "BAR",
    description: "Premium spirits and wines",
    subcategories: barSubcategories,
  },
  {
    id: "desserts",
    displayLabel: "DESSERTS",
    description: "Sweet endings to your meal",
    subcategories: dessertsSubcategories,
  },
  {
    id: "mocktails",
    displayLabel: "MOCKTAILS",
    description: "Refreshing non-alcoholic beverages",
    subcategories: mocktailsSubcategories,
  },
];

// Get main category by ID
export function getMainCategory(id: string): MainCategory | undefined {
  return mainCategories.find((cat) => cat.id === id);
}

// Get subcategory by ID
export function getSubcategory(id: string): SubCategory | undefined {
  for (const main of mainCategories) {
    const sub = main.subcategories.find((s) => s.id === id);
    if (sub) return sub;
  }
  return undefined;
}

// Get all subcategory IDs for a main category
export function getSubcategoryIds(mainCategoryId: string): string[] {
  const main = getMainCategory(mainCategoryId);
  if (!main) return [];
  return main.subcategories.map((s) => s.dbCategory);
}
