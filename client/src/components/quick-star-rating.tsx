import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface QuickStarRatingProps {
  className?: string;
}

export default function QuickStarRating({ className = "" }: QuickStarRatingProps) {
  const handleFiveStarRating = () => {
    // Direct Google review link as requested by user
    const googleReviewUrl = "https://share.google/4M6YuMlZc0hDBswBu";
    window.open(googleReviewUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
      className={`text-center ${className}`}
    >
      <motion.div
        className="inline-flex flex-col items-center"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Title */}
        <motion.p
          className="font-cormorant text-lg md:text-xl font-medium mb-4"
          style={{ color: 'var(--mings-white)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Love our food? Rate us with one click!
        </motion.p>

        {/* Interactive 5 Stars */}
        <motion.button
          onClick={handleFiveStarRating}
          className="flex items-center space-x-1 p-4 rounded-2xl border-3 transition-all duration-300 hover:shadow-2xl group"
          style={{ 
            backgroundColor: 'var(--mings-white)',
            borderColor: 'var(--mings-black)'
          }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {[1, 2, 3, 4, 5].map((star, index) => (
            <motion.div
              key={star}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.7 + (index * 0.1),
                type: "spring",
                stiffness: 200
              }}
            >
              <Star 
                className="w-8 h-8 cursor-pointer transition-all duration-300 group-hover:scale-110" 
                style={{ color: '#FFD700' }}
                fill="currentColor"
              />
            </motion.div>
          ))}
        </motion.button>

        {/* Subtitle */}
        <motion.p
          className="text-sm md:text-base mt-3"
          style={{ 
            color: 'var(--mings-white)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontWeight: '400',
            fontStyle: 'normal'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          Tap the stars to give us 5★ on Google!
        </motion.p>
      </motion.div>
    </motion.div>
  );
}