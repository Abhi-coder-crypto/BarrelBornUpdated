import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompactGoogleReviewProps {
  className?: string;
}

export default function CompactGoogleReview({ className = "" }: CompactGoogleReviewProps) {
  const handleReviewClick = () => {
    window.open("https://g.co/kgs/7e6k6y2", "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center ${className}`}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleReviewClick}
          variant="outline"
          data-testid="button-header-review"
          className="px-4 py-2 rounded-full font-cinzel font-semibold border-2 transition-all duration-300 hover:shadow-md flex items-center gap-2"
          style={{
            borderColor: 'var(--elegant-gold)',
            color: 'var(--elegant-gold)',
            backgroundColor: 'white'
          }}
        >
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1" fill="currentColor" />
            <span className="hidden sm:inline">Rate Us</span>
            <span className="sm:hidden">Review</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </div>
        </Button>
      </motion.div>
    </motion.div>
  );
}