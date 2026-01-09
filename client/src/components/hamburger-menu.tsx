import { motion } from "framer-motion";
import { X, Phone, Clock, MapPin } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { mainCategories } from "@/lib/menu-categories";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryClick: (categoryId: string) => void;
}

export default function HamburgerMenu({
  isOpen,
  onClose,
  onCategoryClick,
}: HamburgerMenuProps) {
  const handleCategoryClick = (categoryId: string) => {
    onCategoryClick(categoryId);
    onClose();
  };

  return isOpen ? (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto"
    >
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2
            className="text-lg sm:text-xl md:text-2xl font-bold"
            style={{
              color: "var(--elegant-gold)",
              fontFamily: "Open Sans, sans-serif",
            }}
          >
            Menu Categories
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-transparent"
            style={{ color: "var(--elegant-gold)" }}
            data-testid="button-close-menu"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {mainCategories.map((category, index) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(category.id)}
              className="p-4 rounded-lg text-sm font-semibold transition-all duration-200 border-2 border-gray-200 bg-white hover:border-yellow-300"
              style={{
                color: "var(--elegant-black)",
                fontFamily: "Open Sans, sans-serif",
              }}
              data-testid={`button-category-${category.id}`}
            >
              {index + 1}. {category.displayLabel}
            </motion.button>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h3
            className="text-lg sm:text-xl font-bold mb-3 sm:mb-4"
            style={{
              color: "var(--elegant-gold)",
              fontFamily: "Open Sans, sans-serif",
            }}
          >
            Restaurant Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-600" />
              <div>
                <p
                  className="font-semibold text-gray-800"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Barrel Born
                </p>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Thane, Maharashtra
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-600" />
              <div>
                <p
                  className="font-semibold text-gray-800"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Contact Us
                </p>
                <p
                  className="text-sm text-blue-600 hover:underline font-medium"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  +91 8278251111
                </p>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  For reservations & orders
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-600" />
              <div>
                <p
                  className="font-semibold text-gray-800"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  11:00 AM - 11:30 PM
                </p>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Open all days
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaInstagram className="h-5 w-5 text-gray-600" />
              <div>
                <button
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/barrelborn_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  className="font-semibold text-blue-600 hover:underline"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  @barrelborn_
                </button>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Follow us for updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  ) : null;
}
