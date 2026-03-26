"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onClick?: () => void;
  loading?: "lazy" | "eager";
}

export function SafeImage({ 
  src, 
  alt, 
  className, 
  fallbackSrc = "/placeholder.svg", 
  onClick,
  loading = "lazy"
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    const safeSrc = (src || "").trim();
    return safeSrc.length > 0 ? safeSrc : fallbackSrc;
  });
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  }, [hasError, currentSrc, fallbackSrc]);

  const handleLoad = useCallback(() => {
    setHasError(false);
  }, []);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={cn("block object-cover", className)}
      onError={handleError}
      onLoad={handleLoad}
      onClick={onClick}
      loading={loading}
    />
  );
}

export default SafeImage;