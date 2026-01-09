import { motion } from "framer-motion";
import { ArrowLeft, Menu as MenuIcon, X, Search, Mic, MicOff, Loader2 } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product-card";
import HamburgerMenu from "@/components/hamburger-menu";
import { getMainCategory, mainCategories } from "@/lib/menu-categories";
import type { MenuItem } from "@shared/schema";

interface ISpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

import logoImg from "@assets/Untitled_design_(20)_1765720426678.png";
import sangriaImg from "@assets/image_1767545808245.png";
import classicCocktailsImg from "@assets/image_1767545845465.png";
import signatureCocktailsImg from "@assets/image_1767546048894.png";
import wineCocktailsImg from "@assets/image_1767545904457.png";
import signatureShotsImg from "@assets/image_1767545936498.png";
import mangaloreanImg from "@assets/image_1767538398708.png";
import signatureMocktailsImg from "@assets/image_1765865243299.png";
import softBeveragesImg from "@assets/image_1765865174044.png";
import fallbackImg from "@assets/coming_soon_imagev2_1766811809828.jpg";

import blendedWhiskyImg from "@assets/image_1765863859085.png";
import blendedScotchWhiskyImg from "@assets/image_1765863885349.png";
import americanIrishWhiskeyImg from "@assets/image_1765863999733.png";
import singleMaltWhiskyImg from "@assets/image_1766842777903.png";
import vodkaImg from "@assets/Vodka_1766842473904.jpeg";
import ginImg from "@assets/Gin_1766842473903.jpeg";
import rumImg from "@assets/Rum_1766842473903.jpeg";
import tequilaImg from "@assets/Tequila_1766842473903.jpeg";
import cognacBrandyImg from "@assets/conac_and_brandy_1766849551597.jpeg";
import liqueursImg from "@assets/Liqueurs_1766842473904.jpeg";
import sparklingWineImg from "@assets/image_1765864313974.png";
import whiteWinesImg from "@assets/image_1765864338087.png";
import roseWinesImg from "@assets/image_1765864363438.png";
import redWinesImg from "@assets/image_1765864393053.png";
import dessertWinesImg from "@assets/image_1765864417149.png";
import portWineImg from "@assets/image_1765864441224.png";

import nibblesImg from "@assets/image_1767537969124.png";
import titbitsImg from "@assets/image_1767538122517.png";
import soupsImg from "@assets/image_1765861784186.png";
import saladsImg from "@assets/image_1767538266582.png";
import startersImg from "@assets/image_1765862083770.png";
import charcoalImg from "@assets/image_1767539363565.png";
import pastaImg from "@assets/image_1767539686923.png";
import pizzaImg from "@assets/image_1767539726872.png";
import slidersImg from "@assets/image_1767539763570.png";
import entreeImg from "@assets/image_1767540494821.png";
import baoDimsumImg from "@assets/image_1767540547633.png";
import curriesImg from "@assets/image_1767544842804.png";
import biryaniImg from "@assets/image_1767540755506.png";
import riceImg from "@assets/image_1765862832303.png";
import dalsImg from "@assets/image_1767540786968.png";
import breadsImg from "@assets/image_1767540967353.png";
import asianMainsImg from "@assets/image_1767544426904.png";
import thaiBowlsImg from "@assets/image_1767544482541.png";
import riceNoodlesImg from "@assets/image_1767544566928.png";
import continentalImg from "@assets/image_1767539626901.png";
import sizzlersImg from "@assets/image_1765863042831.png";

import pintBeerImg from "@assets/pint_beer_1766834179092.png";
import craftBeerOnTapImg from "@assets/Craftbeerontap_1766834179093.png";
import draughtBeerImg from "@assets/Draught_beer-min_1766834686357.png";

const subcategoryImages: Record<string, string> = {
  "signature-mocktails": signatureMocktailsImg,
  "soft-beverages": softBeveragesImg,
  "blended-whisky": blendedWhiskyImg,
  "blended-scotch-whisky": blendedScotchWhiskyImg,
  "american-irish-whiskey": americanIrishWhiskeyImg,
  "single-malt-whisky": singleMaltWhiskyImg,
  vodka: vodkaImg,
  gin: ginImg,
  rum: rumImg,
  tequila: tequilaImg,
  "cognac-brandy": cognacBrandyImg,
  liqueurs: liqueursImg,
  "sparkling-wine": fallbackImg,
  "white-wines": fallbackImg,
  "rose-wines": fallbackImg,
  "red-wines": fallbackImg,
  "dessert-wines": fallbackImg,
  "port-wine": fallbackImg,
  nibbles: nibblesImg,
  titbits: titbitsImg,
  soups: soupsImg,
  salads: saladsImg,
  starters: startersImg,
  charcoal: charcoalImg,
  pasta: pastaImg,
  pizza: pizzaImg,
  sliders: slidersImg,
  entree: entreeImg,
  "bao-dimsum": baoDimsumImg,
  curries: curriesImg,
  biryani: biryaniImg,
  rice: riceImg,
  dals: dalsImg,
  breads: breadsImg,
  "asian-mains": asianMainsImg,
  "mangalorean-style": mangaloreanImg,
  wok: asianMainsImg,
  continental: continentalImg,
  "artisan-pizzas": pizzaImg,
  "mini-burger-sliders": slidersImg,
  "indian-mains-curries": curriesImg,
  "biryanis-rice": biryaniImg,
  "rice-with-curry---thai-asian-bowls": thaiBowlsImg,
  "thai-bowls": thaiBowlsImg,
  "rice-noodles": riceNoodlesImg,
  sizzlers: sizzlersImg,
  "pint-beers": pintBeerImg,
  "craft-beers-on-tap": craftBeerOnTapImg,
  "draught-beer": draughtBeerImg,
  "sangria": sangriaImg,
  "classic-cocktails": classicCocktailsImg,
  "signature-cocktails": signatureCocktailsImg,
  "wine-cocktails": wineCocktailsImg,
  "signature-shots": signatureShotsImg,
  "classic-shots": signatureShotsImg,
};

export default function CategorySelection() {
  const [, setLocation] = useLocation();
  const params = useParams<{ category: string }>();
  const categoryId = params.category || "mocktails";
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<ISpeechRecognition | null>(null);
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const mainCategory = getMainCategory(categoryId);
  const subcategories = mainCategory?.subcategories || [];

  const getInitialVegFilter = () => {
    try {
      const saved = localStorage.getItem("foodVegFilter");
      return (saved as "all" | "veg" | "non-veg") || "all";
    } catch {
      return "all";
    }
  };

  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "non-veg">(getInitialVegFilter);

  const { data: allMenuItems = [], isLoading: isLoadingItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
    enabled: categoryId === "food" || categoryId === "bar"
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId, foodSearchQuery]);

  useEffect(() => {
    try {
      localStorage.setItem("foodVegFilter", vegFilter);
    } catch {
      // Ignore localStorage errors
    }
  }, [vegFilter]);

  const filteredItems = useMemo(() => {
    if ((categoryId !== "food" && categoryId !== "bar") || !foodSearchQuery.trim()) {
      return [];
    }
    const query = foodSearchQuery.toLowerCase();
    return allMenuItems.filter(item => {
      // Get category ID in lowercase for matching
      const itemCategory = item.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
      
      const isCorrectCategory = categoryId === "food" 
        ? ["nibbles", "titbits", "soups", "salads", "starters", "charcoal", "pasta", "pizza", "sliders", "entree", "bao-dimsum", "curries", "biryani", "rice", "dals", "breads", "asian-mains", "thai-bowls", "rice-noodles", "sizzlers", "desserts", "tandoor-starters", "oriental-starters", "rice-with-curry---thai-asian-bowls", "biryanis-rice", "rice-&-noodles"].includes(itemCategory)
        : ["blended-whisky", "blended-scotch-whisky", "american-irish-whiskey", "single-malt-whisky", "vodka", "gin", "rum", "tequila", "cognac-brandy", "liqueurs", "sparkling-wine", "white-wines", "rose-wines", "red-wines", "dessert-wines", "port-wine", "signature-mocktails", "soft-beverages"].includes(itemCategory);
      
      const matchesSearch = item.name.toLowerCase().includes(query) || 
                          item.description.toLowerCase().includes(query);
      
      const matchesVeg = vegFilter === "all" || 
                        (vegFilter === "veg" && item.isVeg) || 
                        (vegFilter === "non-veg" && !item.isVeg);

      return isCorrectCategory && matchesSearch && matchesVeg && item.isAvailable;
    });
  }, [allMenuItems, foodSearchQuery, categoryId, vegFilter]);

  const filteredSubcategories = useMemo(() => {
    return subcategories;
  }, [subcategories]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setFoodSearchQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      setSpeechRecognition(recognition);
      setVoiceSearchSupported(true);
    }
  }, []);

  const startVoiceSearch = () => {
    if (speechRecognition && voiceSearchSupported) {
      try {
        speechRecognition.start();
      } catch (error) {
        console.error("Error starting voice recognition:", error);
      }
    }
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    setLocation(`/menu/${categoryId}/${subcategoryId}`);
  };

  const handleCategoryClick = (catId: string) => {
    setLocation(`/menu/${catId}`);
  };

  if (!mainCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#151515" }}>
        <p className="text-white">Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#151515" }}>
      <header className="sticky top-0 z-30 elegant-shadow" style={{ backgroundColor: "#151515" }}>
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/menu")}
                className="hover:bg-transparent flex-shrink-0"
                style={{ color: "#DCD4C8" }}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img 
                src={logoImg} 
                alt="Barrel Born Logo" 
                className="h-32 sm:h-36 md:h-40 w-auto object-contain"
                data-testid="img-logo"
              />
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                className="hover:bg-transparent"
                style={{ color: "#DCD4C8" }}
                data-testid="button-menu-toggle"
              >
                {showHamburgerMenu ? (
                  <X className="h-7 w-7 sm:h-8 sm:w-8 md:h-6 md:w-6" />
                ) : (
                  <MenuIcon className="h-7 w-7 sm:h-8 sm:w-8 md:h-6 md:w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <HamburgerMenu
          isOpen={showHamburgerMenu}
          onClose={() => setShowHamburgerMenu(false)}
          onCategoryClick={handleCategoryClick}
        />
      </header>

      <div className="container mx-auto px-4 py-4">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-wider text-center mb-2"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#C9A55C",
            letterSpacing: "3px",
          }}
        >
          {mainCategory.displayLabel}
        </h1>

        {(categoryId === "food" || categoryId === "bar") && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={`Search ${categoryId} items...`}
              value={foodSearchQuery}
              onChange={(e) => setFoodSearchQuery(e.target.value)}
              className="pl-10 pr-32 sm:pr-40 h-11 rounded-full border-2 text-white placeholder:text-white/60 focus-visible:ring-2 focus-visible:ring-[#C9A55C]/50"
              style={{ 
                borderColor: '#C9A55C', 
                backgroundColor: 'transparent'
              }}
              data-testid={`input-${categoryId}-search`}
            />
            
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-0">
              {categoryId === "food" && (
                <div 
                  className="inline-flex rounded-full p-0.5 items-center gap-0"
                  style={{
                    backgroundColor: vegFilter === "all" ? "rgba(255, 255, 255, 0.1)" : vegFilter === "veg" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)"
                  }}
                >
                  <button
                    onClick={() => setVegFilter("all")}
                    className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                    data-testid="filter-all"
                    style={
                      vegFilter === "all"
                        ? { backgroundColor: "white", color: "black", lineHeight: "1.2" }
                        : { color: "#C9A55C", lineHeight: "1.2" }
                    }
                  >
                    All
                  </button>
                  <button
                    onClick={() => setVegFilter("veg")}
                    className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                    data-testid="filter-veg"
                    style={
                      vegFilter === "veg"
                        ? { backgroundColor: "#22C55E", color: "white", lineHeight: "1.2" }
                        : { color: "#C9A55C", lineHeight: "1.2" }
                    }
                  >
                    Veg
                  </button>
                  <button
                    onClick={() => setVegFilter("non-veg")}
                    className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                    data-testid="filter-non-veg"
                    style={
                      vegFilter === "non-veg"
                        ? { backgroundColor: "#EF4444", color: "white", lineHeight: "1.2" }
                        : { color: "#C9A55C", lineHeight: "1.2" }
                    }
                  >
                    Non-Veg
                  </button>
                </div>
              )}

              {voiceSearchSupported && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={isListening ? undefined : startVoiceSearch}
                  className="h-9 w-9 hover:bg-transparent"
                  data-testid={`button-${categoryId}-voice-search`}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 text-red-500 animate-pulse" />
                  ) : (
                    <Mic className="h-4 w-4 text-white" />
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {(categoryId === "food" || categoryId === "bar") && foodSearchQuery.trim() ? (
          <div className="flex flex-col gap-6">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                <Search className="h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  No items found
                </h3>
                <p className="text-sm text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>
                  No results for "{foodSearchQuery}"
                </p>
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item._id?.toString() || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard item={item} />
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {filteredSubcategories.map((subcat, index) => (
              <motion.button
                key={subcat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSubcategoryClick(subcat.id)}
                className="relative rounded-xl overflow-hidden group"
                style={{ aspectRatio: "1/1.1" }}
                data-testid={`tile-${subcat.id}`}
              >
                <img
                  src={failedImages.has(subcat.id) ? fallbackImg : (subcategoryImages[subcat.id] || signatureMocktailsImg)}
                  alt={subcat.displayLabel}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={() => {
                    setFailedImages(prev => new Set(prev).add(subcat.id));
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-2 pb-3 sm:pb-4">
                  <h3
                    className="text-base sm:text-lg font-bold tracking-wider uppercase text-center leading-tight"
                    style={{ 
                      fontFamily: "'Cormorant Garamond', serif", 
                      color: "#FFFFFF", 
                      textShadow: "0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9)",
                      letterSpacing: "1px"
                    }}
                  >
                    {subcat.displayLabel}
                  </h3>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}