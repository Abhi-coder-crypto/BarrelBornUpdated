import { useEffect, useState } from "react";

interface MediaPreloaderProps {
  onComplete?: () => void;
}

export function MediaPreloader({ onComplete }: MediaPreloaderProps) {
  const [completed, setCompleted] = useState(false);
  
  useEffect(() => {
    // Mark as complete immediately - video preloading is optional
    setCompleted(true);
    onComplete?.();
  }, [onComplete]);

  return null; // Silent preloader
}