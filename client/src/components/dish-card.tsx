import { useState } from "react";
import { motion } from "framer-motion";
import type { MenuItem } from "@shared/schema";
import fallbackImg from "@assets/coming_soon_imagev2_1766811809828.jpg";

interface DishCardProps {
  item: MenuItem;
}

export default function DishCard({ item }: DishCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = imgError || !item.image || 
    item.image.includes("example.com") || 
    item.image.includes("unsplash.com") ||
    item.image.includes("placeholder.com") ||
    item.image.includes("via.placeholder.com")
    ? fallbackImg : item.image;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="dish-card bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 elegant-shadow h-full flex flex-col"
    >
      <div className="flex flex-col h-full">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          <div
            className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 border-white shadow-sm ${
              item.isVeg ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
        </div>

        {/* Content Section */}
        <div className="p-2 md:p-3 flex-1 flex flex-col">
          <div className="flex-1 space-y-1">
            <h3
              className="text-sm md:text-base font-bold leading-tight line-clamp-2"
              style={{ color: 'var(--mings-orange)', fontFamily: 'Open Sans, sans-serif' }}
            >
              {item.name}
            </h3>
            <p
              className="font-sans text-xs md:text-sm leading-tight line-clamp-2"
              style={{ color: 'var(--mings-black)' }}
            >
              {item.description}
            </p>
          </div>

          {/* Price Section */}
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex justify-center">
              <span
                className="font-serif font-bold text-sm md:text-base"
                style={{ color: 'var(--mings-orange)' }}
              >
                {typeof item.price === "string" && item.price.includes("|") 
                  ? item.price.split("|").map(p => `₹${p.trim()}`).join(" | ")
                  : `₹${item.price}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}