import { motion } from "framer-motion";
import { Star, ExternalLink, MessageSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoogleReviewProps {
  className?: string;
}

export default function GoogleReview({ className = "" }: GoogleReviewProps) {
  const handleReviewClick = () => {
    window.open("https://share.google/4M6YuMlZc0hDBswBu", "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
      className={`mings-card rounded-3xl p-6 sm:p-8 md:p-12 elegant-shadow border-3 ${className}`}
      style={{ 
        borderColor: 'var(--mings-black)',
        backgroundColor: 'var(--mings-white)'
      }}
    >
      {/* Header Section */}
      <motion.div
        className="text-center mb-6 md:mb-8"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
      >
        <div className="flex justify-center items-center mb-4 flex-wrap">
          <Heart 
            className="text-2xl md:text-3xl mr-2 md:mr-3 flex-shrink-0" 
            style={{ color: 'var(--mings-orange)' }} 
            fill="currentColor"
          />
          <h3 className="font-cinzel text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center flex-1 min-w-0" 
              style={{ color: 'var(--mings-black)' }}>
            Love Our Authentic Experience?
          </h3>
          <Heart 
            className="text-2xl md:text-3xl ml-2 md:ml-3 flex-shrink-0" 
            style={{ color: 'var(--mings-orange)' }} 
            fill="currentColor"
          />
        </div>
        
        <motion.p
          className="font-cormorant text-base md:text-lg lg:text-xl font-medium mb-4 md:mb-6 px-2"
          style={{ color: 'var(--mings-black)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
        >
          Share your authentic dining experience with fellow food enthusiasts and help us serve better!
        </motion.p>
      </motion.div>

      {/* Review Stats */}
      <motion.div
        className="flex justify-center items-center mb-6 md:mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
      >
        <div className="flex items-center bg-white rounded-full px-4 sm:px-6 py-2 sm:py-3 elegant-shadow border-2"
             style={{ borderColor: 'var(--mings-black)' }}>
          <div className="flex items-center mr-3 sm:mr-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className="h-4 w-4 sm:h-5 sm:w-5 mr-1" 
                style={{ color: 'var(--mings-orange)' }}
                fill="currentColor"
              />
            ))}
          </div>
          <span className="font-cinzel text-base sm:text-lg font-bold whitespace-nowrap" style={{ color: 'var(--mings-black)' }}>
            4.8 Rating
          </span>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
      >
        {/* Main Review Button */}
        <motion.div
          className="text-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleReviewClick}
            data-testid="button-google-review"
            className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-cinzel text-sm sm:text-base md:text-lg font-bold transition-all duration-300 elegant-shadow border-2 hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto min-w-0"
            style={{
              backgroundColor: 'var(--mings-orange)',
              borderColor: 'var(--mings-orange)',
              color: 'white'
            }}
          >
            <div className="flex items-center justify-center flex-wrap gap-2">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" fill="currentColor" />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                Rate & Review Us on Go<span style={{ letterSpacing: '0.01em' }}>o</span>gle
              </span>
              <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            </div>
          </Button>
        </motion.div>

        {/* Supporting Text */}
        <motion.div
          className="text-center px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3, ease: "easeOut" }}
        >
          <p className="font-cormorant text-sm sm:text-base md:text-lg italic"
             style={{ color: 'var(--mings-black)' }}>
            Your feedback helps us maintain our authentic standards and reach more food lovers
          </p>
        </motion.div>

        {/* Quick Action Buttons */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleReviewClick}
              variant="outline"
              data-testid="button-quick-rate"
              className="w-full py-2 sm:py-3 rounded-full font-cinzel font-semibold border-2 transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
              style={{
                borderColor: 'var(--mings-orange)',
                color: 'var(--mings-orange)',
                backgroundColor: 'transparent'
              }}
            >
              <Star className="mr-2 h-4 w-4" />
              <span className="whitespace-nowrap">Quick Rate</span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleReviewClick}
              variant="outline"
              data-testid="button-write-review"
              className="w-full py-2 sm:py-3 rounded-full font-cinzel font-semibold border-2 transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
              style={{
                borderColor: 'var(--mings-orange)',
                color: 'var(--mings-orange)',
                backgroundColor: 'transparent'
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              <span className="whitespace-nowrap">Write Review</span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}