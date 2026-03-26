"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { IndustryId } from "@/components/industry-selector";

const supabase = createSupabaseBrowserClient();

type ImageType = 'display' | 'model' | 'social' | 'seeding';

export function useBatchConfig(selectedIndustry: IndustryId) {
  const [batchConfig, setBatchConfig] = useState<Record<ImageType, number>>({
    display: 3,
    model: 3,
    social: 3,
    seeding: 3,
  });
  
  const [configExampleImages, setConfigExampleImages] = useState<Record<ImageType, string | null>>({
    display: null, 
    model: null, 
    social: null, 
    seeding: null
  });

  const totalSelectedInBatch = useMemo(() => {
    return Object.values(batchConfig).reduce((sum, count) => sum + count, 0);
  }, [batchConfig]);

  // Load example images for configurator
  useEffect(() => {
    const fetchExampleImages = async () => {
      try {
        const categories: ImageType[] = ['display', 'model', 'social', 'seeding'];
        const promises = categories.map(category => 
          supabase
            .from('generated_images')
            .select('image_url')
            .eq('is_sample', true)
            .eq('image_type', category)
            .eq('industry', selectedIndustry)
            .limit(1)
            .maybeSingle()
        );
        
        const results = await Promise.all(promises);
        
        const newImages: Record<ImageType, string | null> = { 
          display: null, 
          model: null, 
          social: null, 
          seeding: null 
        };
        
        results.forEach((result: any, index: number) => {
          if (result.data?.image_url) {
            newImages[categories[index]] = result.data.image_url;
          }
        });
        
        setConfigExampleImages(newImages);
      } catch (error) {
        console.error("Error fetching example images for config:", error);
      }
    };
    
    fetchExampleImages();
  }, [selectedIndustry]);

  const handleBatchConfigChange = useCallback((type: ImageType, delta: number) => {
    setBatchConfig(prev => {
      const currentCount = prev[type];
      const newCount = Math.max(0, currentCount + delta);
      const currentTotal = Object.values(prev).reduce((sum, count) => sum + count, 0);
      
      if (delta > 0 && currentTotal >= 12) {
        toast.error("Tổng số ảnh không được vượt quá 12");
        return prev;
      }
      
      return { ...prev, [type]: newCount };
    });
  }, []);

  return {
    batchConfig,
    configExampleImages,
    totalSelectedInBatch,
    handleBatchConfigChange
  };
}