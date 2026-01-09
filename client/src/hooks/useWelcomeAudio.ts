import { useEffect, useRef, useState } from "react";
import barrelbornWelcomeAudio from "@assets/Barrelbornwelcome_1766651854689.mp3";

// Global audio instance to prevent multiple setups
let globalAudio: HTMLAudioElement | null = null;
let globalAudioReady = false;
let globalSetupComplete = false;

export function useWelcomeAudio() {
  const [hasPlayedAudio, setHasPlayedAudio] = useState(() => {
    try {
      return sessionStorage.getItem('welcomeAudioPlayed') === 'true';
    } catch {
      return false;
    }
  });
  const [audioError, setAudioError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (hasPlayedAudio || audioError) return;

    let hasPlayedSuccessfully = false;
    let interactionListenersAdded = false;

    const audioSources = [
      barrelbornWelcomeAudio,
      '/Welcome.mp3',
      './Welcome.mp3', 
      '/assets/Welcome.mp3'
    ];

    const removeInteractionListeners = () => {
      if (interactionListenersAdded) {
        document.removeEventListener('click', playAudioOnInteraction);
        document.removeEventListener('touchstart', playAudioOnInteraction);
        document.removeEventListener('touchend', playAudioOnInteraction);
        document.removeEventListener('keydown', playAudioOnInteraction);
        interactionListenersAdded = false;
      }
    };

    const playAudioOnInteraction = async (event: Event) => {
      if (hasPlayedSuccessfully || hasPlayedAudio || audioError) {
        return;
      }

      // Wait a moment for audio to be fully ready
      let attempts = 0;
      const maxAttempts = 10;
      
      while ((!globalAudio || !globalAudioReady) && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!globalAudio || !globalAudioReady) {
        console.log('Audio not ready after waiting');
        return;
      }

      try {
        // Ensure we're starting from the beginning
        globalAudio.currentTime = 0;
        
        // Create a new promise to handle play more reliably
        const playPromise = globalAudio.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          hasPlayedSuccessfully = true;
          setHasPlayedAudio(true);
          
          try {
            sessionStorage.setItem('welcomeAudioPlayed', 'true');
          } catch (error) {
            console.warn('Could not save to sessionStorage:', error);
          }
          
          console.log('Welcome audio played successfully');
          removeInteractionListeners();
        }
        
      } catch (error) {
        // If it's just an autoplay restriction, that's normal - don't log as error
        if (error instanceof Error && error.name === 'NotAllowedError') {
          console.log('Autoplay blocked - audio will play on next interaction');
          // Don't remove listeners, let user try again
        } else {
          console.error('Audio playback failed:', error);
          removeInteractionListeners();
        }
      }
    };

    const setupAudioGlobal = async () => {
      if (globalSetupComplete) {
        if (globalAudio && globalAudioReady) {
          setIsReady(true);
          audioRef.current = globalAudio;
        }
        return;
      }

      globalSetupComplete = true;
      
      // Try sources one by one
      for (const source of audioSources) {
        try {
          const audio = new Audio();
          audio.preload = 'auto';
          audio.volume = 0.6;
          audio.loop = false;
          
          // Use a more reliable loading approach
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Load timeout')), 3000);
            
            const onCanPlay = () => {
              clearTimeout(timeout);
              audio.removeEventListener('canplaythrough', onCanPlay);
              audio.removeEventListener('error', onError);
              resolve();
            };
            
            const onError = (e: any) => {
              clearTimeout(timeout);
              audio.removeEventListener('canplaythrough', onCanPlay);
              audio.removeEventListener('error', onError);
              reject(e);
            };
            
            audio.addEventListener('canplaythrough', onCanPlay, { once: true });
            audio.addEventListener('error', onError, { once: true });
            
            audio.src = source;
            audio.load();
          });

          // If we get here, loading was successful
          globalAudio = audio;
          globalAudioReady = true;
          audioRef.current = audio;
          setIsReady(true);
          console.log(`Audio ready from source: ${source}`);
          break;
          
        } catch (error) {
          console.warn(`Failed to load audio from ${source}:`, error);
        }
      }

      if (!globalAudio || !globalAudioReady) {
        console.error('All audio sources failed to load');
        setAudioError(true);
        return;
      }
    };

    // Setup audio
    setupAudioGlobal().then(() => {
      if (globalAudio && globalAudioReady && !hasPlayedSuccessfully) {
        // Add interaction listeners
        document.addEventListener('click', playAudioOnInteraction, { passive: true });
        document.addEventListener('touchstart', playAudioOnInteraction, { passive: true });
        document.addEventListener('touchend', playAudioOnInteraction, { passive: true });
        document.addEventListener('keydown', playAudioOnInteraction, { passive: true });
        interactionListenersAdded = true;
        console.log('Audio ready, waiting for user interaction...');
      }
    });

    return () => {
      removeInteractionListeners();
    };
  }, [hasPlayedAudio, audioError]);

  return { hasPlayedAudio, audioError, isReady };
}