import { useState } from "react";
import type { MenuItem } from "@shared/schema";

import fallbackImg from "@assets/coming_soon_imagev2_1766811809828.jpg";

interface ProductCardProps {
  item: MenuItem;
}

export default function ProductCard({ item }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const isBrokenImage = imgError || !item.image || 
    item.image.includes("example.com") || 
    item.image.includes("unsplash.com") ||
    item.image.includes("via.placeholder.com") ||
    item.image.includes("placeholder.com");
  const imageUrl = isBrokenImage ? fallbackImg : item.image;

  return (
    <div className="flex flex-col overflow-hidden h-full" style={{ borderRadius: 0 }}>
      <div className="relative aspect-[4/3] w-full overflow-hidden mb-1">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          style={{ borderRadius: 0 }}
          onError={() => setImgError(true)}
        />
        <div
          className={`absolute top-2 right-2 w-3 h-3 rounded-full border border-white shadow-sm ${
            item.isVeg ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      </div>

      <div className="flex flex-col flex-1">
        <h3
          className="text-base sm:text-lg font-bold leading-tight mb-0 line-clamp-2"
          style={{ 
            color: '#C9A55C', 
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: "0.5px",
            minHeight: "2.8em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {item.name}
        </h3>
        <p
          className="text-xs sm:text-sm leading-relaxed mb-1 line-clamp-2"
          style={{ 
            color: '#FFFFFF',
            fontFamily: "'Lato', sans-serif",
            minHeight: "3em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {item.description || "No description available"}
        </p>
        <div className="mt-auto">
          <span
            className="text-sm sm:text-base font-bold block"
            style={{ 
              color: '#FFFFFF',
              fontFamily: "'Lato', sans-serif",
              letterSpacing: "0.5px",
              lineHeight: "1.2",
              minHeight: "1.2em"
            }}
          >
            {typeof item.price === "string" && item.price.includes("|") 
              ? item.price.split("|").map(p => `₹${p.trim()}`).join(" | ")
              : `₹${item.price}`}
          </span>
        </div>
      </div>
    </div>
  );
}