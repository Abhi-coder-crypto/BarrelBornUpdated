import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, ChevronLeft, ChevronRight, Mic, MicOff } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import DishCard from "@/components/dish-card";
import { getMainCategory, getSubcategoryIds } from "@/lib/menu-categories";
import type { MenuItem } from "@shared/schema";

import nibblesImg from "@assets/image_1765861653339.png";
import titbitsImg from "@assets/image_1765861734899.png";
import soupsImg from "@assets/image_1765861784186.png";
import saladsImg from "@assets/image_1765861993529.png";
import startersImg from "@assets/image_1765862083770.png";
import charcoalImg from "@assets/image_1765862103291.png";
import pastaImg from "@assets/image_1765862151515.png";
import pizzaImg from "@assets/image_1765862533698.png";
import slidersImg from "@assets/image_1765862611064.png";
import entreeImg from "@assets/image_1765862689473.png";
import baoDimsumImg from "@assets/image_1765862739110.png";
import curriesImg from "@assets/image_1765862783811.png";
import biryaniImg from "@assets/image_1765862804295.png";
import riceImg from "@assets/image_1765862832303.png";
import dalsImg from "@assets/image_1765862864030.png";
import breadsImg from "@assets/image_1765862911256.png";
import asianMainsImg from "@assets/image_1765862935848.png";
import thaiBowlsImg from "@assets/image_1765862959084.png";
import riceNoodlesImg from "@assets/image_1765862986138.png";
import sizzlersImg from "@assets/image_1765863042831.png";
import blendedWhiskyImg from "@assets/image_1765863859085.png";
import blendedScotchWhiskyImg from "@assets/image_1765863885349.png";
import americanIrishWhiskeyImg from "@assets/image_1765863999733.png";
import singleMaltWhiskyImg from "@assets/image_1765864037279.png";
import vodkaImg from "@assets/image_1765864071875.png";
import ginImg from "@assets/image_1765864086244.png";
import rumImg from "@assets/image_1765864174592.png";
import tequilaImg from "@assets/image_1765864191436.png";
import cognacBrandyImg from "@assets/image_1765864219488.png";
import liqueursImg from "@assets/image_1765864273630.png";
import sparklingWineImg from "@assets/image_1765864313974.png";
import whiteWinesImg from "@assets/image_1765864338087.png";
import roseWinesImg from "@assets/image_1765864363438.png";
import redWinesImg from "@assets/image_1765864393053.png";
import dessertWinesImg from "@assets/image_1765864417149.png";
import portWineImg from "@assets/image_1765864441224.png";
import signatureMocktailsImg from "@assets/image_1765865243299.png";
import softBeveragesImg from "@assets/image_1765865174044.png";
import fallbackImg from "@assets/coming_soon_imagev2_1766811809828.jpg";

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

const subcategoryImages: Record<string, string> = {
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
  "thai-bowls": thaiBowlsImg,
  "rice-noodles": riceNoodlesImg,
  "rice-&-noodles": riceNoodlesImg,
  sizzlers: sizzlersImg,
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
  "signature-mocktails": signatureMocktailsImg,
  "soft-beverages": softBeveragesImg,
  desserts: signatureMocktailsImg,
};

export default function CategoryDetail() {
  const [, setLocation] = useLocation();
  const params = useParams<{ category: string }>();
  const categoryId = params.category || "food";
  
  const mainCategory = getMainCategory(categoryId);
  const subcategories = mainCategory?.subcategories || [];
  const validSubcategoryIds = getSubcategoryIds(categoryId);

  const [activeSubcategory, setActiveSubcategory] = useState(
    subcategories.length > 0 ? subcategories[0].id : ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<ISpeechRecognition | null>(null);
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

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
        setSearchQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      setSpeechRecognition(recognition);
      setVoiceSearchSupported(true);
    }
  }, []);

  useEffect(() => {
    if (subcategories.length > 0 && !subcategories.find(s => s.id === activeSubcategory)) {
      setActiveSubcategory(subcategories[0].id);
    }
  }, [categoryId, subcategories, activeSubcategory]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (!item.isAvailable) return false;
      
      if (searchQuery.trim()) {
        const matchesSearch = 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = validSubcategoryIds.includes(item.category);
        return matchesSearch && matchesCategory;
      }
      
      const activeSubcat = subcategories.find(s => s.id === activeSubcategory);
      return item.category === activeSubcat?.dbCategory;
    });
  }, [menuItems, activeSubcategory, searchQuery, subcategories, validSubcategoryIds]);

  const startVoiceSearch = () => {
    if (speechRecognition && voiceSearchSupported) {
      try {
        speechRecognition.start();
      } catch (error) {
        console.error("Error starting voice recognition:", error);
      }
    }
  };

  const scrollSubcategories = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!mainCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--elegant-cream)" }}>
        <p>Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--elegant-cream)" }}>
      <header className="sticky top-0 z-30 bg-white elegant-shadow">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/menu")}
              className="hover:bg-transparent flex-shrink-0"
              style={{ color: "var(--elegant-gold)" }}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>

            <h1
              className="font-bold text-center flex-1"
              style={{
                fontSize: "clamp(16px, 4vw, 24px)",
                color: "#D97706",
                fontFamily: "'Playfair Display', serif",
                letterSpacing: "1px",
              }}
            >
              {mainCategory.displayLabel}
            </h1>

            <div className="w-9" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={`Search ${mainCategory.displayLabel.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 h-11 rounded-full border-2 border-gray-200 focus-visible:ring-2 focus-visible:ring-yellow-400/50"
            data-testid="input-search"
          />
          {voiceSearchSupported && (
            <Button
              variant="ghost"
              size="icon"
              onClick={isListening ? undefined : startVoiceSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 w-9"
              data-testid="button-voice-search"
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-red-500 animate-pulse" />
              ) : (
                <Mic className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          )}
        </div>

        <div className="relative mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollSubcategories("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 shadow-md rounded-full h-8 w-8"
            data-testid="button-scroll-left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-3 px-8 py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {subcategories.map((subcat) => (
              <motion.button
                key={subcat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveSubcategory(subcat.id);
                  setSearchQuery("");
                }}
                className={`flex-shrink-0 flex flex-col items-center p-2 rounded-xl transition-all duration-200 min-w-[80px] ${
                  activeSubcategory === subcat.id
                    ? "bg-yellow-100 border-2 border-yellow-400"
                    : "bg-white border-2 border-gray-100 hover:border-yellow-200"
                }`}
                data-testid={`subcategory-${subcat.id}`}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden mb-1">
                  <img
                    src={failedImages.has(subcat.id) ? fallbackImg : (subcategoryImages[subcat.id] || nibblesImg)}
                    alt={subcat.displayLabel}
                    className="w-full h-full object-cover"
                    onError={() => {
                      setFailedImages(prev => new Set(prev).add(subcat.id));
                    }}
                  />
                </div>
                <span
                  className={`text-xs font-medium text-center leading-tight ${
                    activeSubcategory === subcat.id ? "text-yellow-700" : "text-gray-700"
                  }`}
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  {subcat.displayLabel}
                </span>
              </motion.button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollSubcategories("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 shadow-md rounded-full h-8 w-8"
            data-testid="button-scroll-right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <DotLottieReact
              src="https://lottie.host/85ae0d93-19f4-4b9f-a95c-f8db37d4cb5f/3vYJPJphYl.lottie"
              loop
              autoplay
              style={{ width: 120, height: 120 }}
            />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center px-4">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "No items available in this category"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id?.toString() || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <DishCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
