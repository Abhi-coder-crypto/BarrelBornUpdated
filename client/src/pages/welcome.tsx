import { Utensils, Star } from "lucide-react";
import { SiInstagram, SiFacebook, SiYoutube } from "react-icons/si";
import { useLocation } from "wouter";
import { useWelcomeAudio } from "../hooks/useWelcomeAudio";
import { MediaPreloader } from "../components/media-preloader";
import { useState, useCallback } from "react";
import logoImage from "@assets/Untitled_design_(20)_1765720426678.png";
import bgPattern from "@assets/dark_bg_pattern.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { hasPlayedAudio, audioError, isReady } = useWelcomeAudio();
  const [mediaReady, setMediaReady] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleExploreMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && number) {
      try {
        const response = await fetch("/api/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email: "not-provided@example.com", // Temporary default as form doesn't have email
            phone: number,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to store customer data");
        }

        console.log("Customer Info saved successfully");
        setIsDialogOpen(false);
        setLocation("/menu");
      } catch (error) {
        console.error("Error saving customer info:", error);
        // Still proceed to menu even if saving fails to not block user
        setIsDialogOpen(false);
        setLocation("/menu");
      }
    }
  };

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

        {/* Explore Menu Button with Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button
              className="mt-7 px-10 py-3 font-semibold border-2 rounded-full transition-colors flex items-center gap-2 text-base"
              style={{ borderColor: '#B8986A', color: '#FFFFFF', backgroundColor: '#B8986A' }}
            >
              <Utensils className="w-5 h-5" style={{ color: '#FFFFFF' }} />
              <span>EXPLORE OUR MENU</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] border-[#B8986A] text-[#dcd4c8]">
            <DialogHeader>
              <DialogTitle className="text-[#B8986A] text-xl">Welcome to BarrelBorn</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleExploreMenu} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="flex h-10 w-full rounded-md border border-[#B8986A] bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8986A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="number" className="text-sm font-medium">Mobile Number</label>
                <input
                  id="number"
                  type="tel"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Enter mobile number"
                  required
                  className="flex h-10 w-full rounded-md border border-[#B8986A] bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8986A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 px-4 py-2 font-semibold rounded-md transition-colors"
                style={{ backgroundColor: '#B8986A', color: '#FFFFFF' }}
              >
                PROCEED TO MENU
              </button>
            </form>
          </DialogContent>
        </Dialog>

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
          <div 
            className="leading-snug text-sm cursor-pointer transition-opacity hover:opacity-80" 
            style={{ color: '#E8DFD1' }}
            onClick={() => window.open("https://www.google.com/maps/place/Barrelborn+%7C+Dine+%26+Draft+%7C+Thane/@19.1935267,72.9666575,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7b9b24c556745:0x394d83a5b37880b2!8m2!3d19.1935267!4d72.9666575!16s%2Fg%2F11mf86ybm5?entry=ttu&g_ep=EgoyMDI2MDEwNi4wIKXMDSoASAFQAw%3D%3D", "_blank")}
          >
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
