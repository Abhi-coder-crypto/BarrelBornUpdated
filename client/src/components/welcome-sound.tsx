import { useEffect, useState } from "react";

interface WelcomeSoundProps {
  onSoundComplete?: () => void;
}

export default function WelcomeSound({ onSoundComplete }: WelcomeSoundProps) {
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("mings-visited");
    
    if (!hasVisited && !hasPlayed) {
      // Check if user has interacted with the page first (required for audio autoplay)
      const playWelcomeSound = () => {
        try {
          // Create audio context for text-to-speech
          const utterance = new SpeechSynthesisUtterance("Welcome to Mings Chinese Cuisine");
          utterance.rate = 0.8;
          utterance.pitch = 1.1;
          utterance.volume = 0.7;
          
          // Set voice to a more pleasant one if available
          const voices = speechSynthesis.getVoices();
          const femaleVoice = voices.find(voice => 
            voice.name.includes('Female') || 
            voice.name.includes('Samantha') ||
            voice.name.includes('Alex') ||
            voice.lang.includes('en')
          );
          if (femaleVoice) {
            utterance.voice = femaleVoice;
          }
          
          utterance.onend = () => {
            setHasPlayed(true);
            localStorage.setItem("mings-visited", "true");
            onSoundComplete?.();
          };
          
          speechSynthesis.speak(utterance);
        } catch (error) {
          console.log("Speech synthesis not supported");
          setHasPlayed(true);
          localStorage.setItem("mings-visited", "true");
          onSoundComplete?.();
        }
      };

      // Add click listener to trigger sound on first user interaction
      const handleFirstClick = () => {
        playWelcomeSound();
        document.removeEventListener('click', handleFirstClick);
        document.removeEventListener('touchstart', handleFirstClick);
      };

      document.addEventListener('click', handleFirstClick);
      document.addEventListener('touchstart', handleFirstClick);

      // Cleanup
      return () => {
        document.removeEventListener('click', handleFirstClick);
        document.removeEventListener('touchstart', handleFirstClick);
      };
    }
  }, [hasPlayed, onSoundComplete]);

  return null; // This component doesn't render anything
}