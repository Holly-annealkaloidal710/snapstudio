"use client";

import { useState, useCallback } from "react";

export function useImageUpload() {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [customKeywords, setCustomKeywords] = useState<string>("");

  const handleImageSelect = useCallback((file: File, preview: string) => {
    setSelectedImageFile(file);
    setSelectedImagePreview(preview);
  }, []);

  const handleClearImage = useCallback((shouldClearProductName: boolean, setProductName?: (name: string) => void) => {
    setSelectedImageFile(null);
    setSelectedImagePreview(null);
    setCustomKeywords("");
    if (shouldClearProductName && setProductName) {
      setProductName("");
    }
  }, []);

  return {
    selectedImageFile,
    selectedImagePreview,
    customKeywords,
    setCustomKeywords,
    handleImageSelect,
    handleClearImage
  };
}