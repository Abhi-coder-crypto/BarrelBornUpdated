import { Utensils, Star } from "lucide-react";
import { SiInstagram, SiFacebook, SiYoutube } from "react-icons/si";
import { useLocation } from "wouter";
import { useWelcomeAudio } from "../hooks/useWelcomeAudio";
import { MediaPreloader } from "../components/media-preloader";
import { useState, useCallback } from "react";
import logoImage from "@assets/Untitled_design_(20)_1765720426678.png";
import bgPattern from "@assets/dark_bg_pattern.png";

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { hasPlayedAudio, audioError, isReady } = useWelcomeAudio();
  const [mediaReady, setMediaReady] = useState(false);

  const handleSocialClick = useCallback((url: string) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) {
      (document.activeElement as HTMLElement)?.blur();
    }
  }, []);

  const handleReviewClick = useCallback(() => {
    const reviewUrl = "https://g.page/r/CbKAeLOlg005EBM/review";
    window.open(reviewUrl, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div 
      className="min-h-screen w-full overflow-auto" 
      style={{ 
        backgroundImage: `url(${bgPattern})`, 
        backgroundRepeat: 'no-repeat', 
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <MediaPreloader onComplete={() => setMediaReady(true)} />

      {/* Main content container - compact spacing, minimal top padding */}
      <div className="flex flex-col items-center w-full px-4 pt-0 pb-2">

        {/* Logo Image - big and at top, negative margin to pull up */}
        <div className="flex flex-col items-center w-full -mt-12">
          <img
            src={logoImage}
            alt="Barrelborn Dine & Draft"
            className="w-[380px] h-auto"
          />
        </div>

        {/* Social Media Icons - directly under logo, negative margin to compensate for logo whitespace */}
        <div className="flex gap-3 -mt-14">
          <button
            onClick={() => handleSocialClick("https://www.instagram.com/barrelborn_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==")}
            className="w-11 h-11 border rounded-md flex items-center justify-center transition-opacity hover:opacity-80"
            style={{ borderColor: '#dcd4c8', backgroundColor: 'transparent' }}
          >
            <SiInstagram className="w-5 h-5" style={{ color: '#dcd4c8' }} />
          </button>
          <button
            onClick={() => handleSocialClick("https://facebook.com")}
            className="w-11 h-11 border rounded-md flex items-center justify-center transition-opacity hover:opacity-80"
            style={{ borderColor: '#dcd4c8', backgroundColor: 'transparent' }}
          >
            <SiFacebook className="w-5 h-5" style={{ color: '#dcd4c8' }} />
          </button>
          <button
            onClick={() => handleSocialClick("https://youtube.com")}
            className="w-11 h-11 border rounded-md flex items-center justify-center transition-opacity hover:opacity-80"
            style={{ borderColor: '#dcd4c8', backgroundColor: 'transparent' }}
          >
            <SiYoutube className="w-5 h-5" style={{ color: '#dcd4c8' }} />
          </button>
        </div>

        {/* Explore Menu Button */}
        <button
          onClick={() => setLocation("/menu")}
          className="mt-7 px-10 py-3 font-semibold border-2 rounded-full transition-colors flex items-center gap-2 text-base"
          style={{ borderColor: '#B8986A', color: '#FFFFFF', backgroundColor: '#B8986A' }}
        >
          <Utensils className="w-5 h-5" style={{ color: '#FFFFFF' }} />
          <span>EXPLORE OUR MENU</span>
        </button>

        {/* Rating Section */}
        <div className="text-center mt-5">
          <p className="font-medium text-base mb-2" style={{ color: '#dcd4c8' }}>
            Click to Rate us on Google
          </p>
          <div
            className="flex justify-center cursor-pointer gap-1"
            onClick={handleReviewClick}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-8 h-8" style={{ color: '#B8986A', fill: '#B8986A' }} />
            ))}
          </div>
        </div>

        {/* Address Section */}
        <div className="text-center mt-5">
          <div
            className="border-2 rounded-full inline-block px-5 py-1 mb-2"
            style={{ borderColor: '#B8986A' }}
          >
            <span className="font-semibold text-sm" style={{ color: '#dcd4c8' }}>ADDRESS</span>
          </div>
          <div className="leading-snug text-sm" style={{ color: '#E8DFD1' }}>
            <p>Shop No: 3, Madanlal Dhingra Rd,</p>
            <p>beside Satranj Wafers, Bhakti Mandir,</p>
            <p>Panch Pakhdi, Thane West</p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-4">
          <div
            className="border-2 rounded-full inline-block px-5 py-1 mb-2"
            style={{ borderColor: '#B8986A' }}
          >
            <span className="font-semibold text-sm" style={{ color: '#dcd4c8' }}>CONTACT</span>
          </div>
          <div className="text-sm" style={{ color: '#E8DFD1' }}>
            <p>+91 8278251111</p>
            <p>info@barrelborn.in</p>
          </div>
        </div>

        {/* Website URL */}
        <p
          className="mt-4 cursor-pointer text-sm"
          style={{ color: '#B8986A' }}
          onClick={() => window.open("https://www.barrelborn.in", "_blank")}
        >
          www.barrelborn.in
        </p>

        {/* Developer Credit */}
        <div className="text-center mt-3 mb-4 text-xs" style={{ color: '#E8DFD1' }}>
          <p>Developed By</p>
          <p
            className="font-medium cursor-pointer"
            onClick={() => window.open("http://www.airavatatechnologies.com", "_blank")}
            style={{ color: '#B8986A' }}
          >
            AIRAVATA TECHNOLOGIES
          </p>
        </div>

      </div>
    </div>
  );
}
