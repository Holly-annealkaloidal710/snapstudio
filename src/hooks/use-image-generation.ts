"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ImageGenerator, GeneratedImage } from "@/lib/image-generator";
import { EdgeFunctionClient } from "@/lib/edge-function-client";
import type { User } from "@supabase/supabase-js";
import type { IndustryId } from "@/components/industry-selector";

const supabase = createSupabaseBrowserClient();

type ImageType = 'display' | 'model' | 'social' | 'seeding';

interface Profile {
  points_balance: number;
}

export function useImageGeneration(user: User | null, profile: Profile | null, refreshProfile: () => Promise<void>) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState(0);
  const [soloResult, setSoloResult] = useState<{ imageUrl: string; prompt: string } | null>(null);

  // Real-time subscription for project updates
  const subscribeToProject = useCallback((projectId: string) => {
    if (!user) return () => {};

    let progressTimer: NodeJS.Timeout;

    const channel = supabase.channel(`project-updates-${projectId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'projects',
        filter: `id=eq.${projectId}`
      }, async (payload: any) => {
        try {
          const newStatus = payload.new?.status;
          
          if (newStatus === 'processing') {
            setIsProcessing(true);
            setProgress(20);
            
            progressTimer = setInterval(() => {
              setProgress(prev => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 10;
              });
            }, 2000);
          }
          
          if (newStatus === 'completed') {
            clearInterval(progressTimer);
            setIsProcessing(false);
            setProgress(100);
            await refreshProfile();
            
            toast.success('🎉 Bộ ảnh của bạn đã sẵn sàng!');
            
            const { data: images, error: imagesError } = await supabase
              .from('generated_images')
              .select('*')
              .eq('project_id', projectId)
              .eq('user_id', user.id)
              .order('created_at', { ascending: false });
              
            if (imagesError) {
              console.error('Error loading generated images:', imagesError);
              toast.error('Lỗi khi tải ảnh đã tạo');
            } else {
              setGeneratedImages(images as GeneratedImage[] || []);
            }
          }
          
          if (newStatus === 'failed') {
            clearInterval(progressTimer);
            setIsProcessing(false);
            setProgress(0);
            toast.error('Quá trình tạo ảnh thất bại. Vui lòng thử lại.');
          }
        } catch (error) {
          console.error('Error handling project update:', error);
        }
      })
      .subscribe();

    return () => {
      clearInterval(progressTimer);
      supabase.removeChannel(channel);
    };
  }, [user, refreshProfile]);

  const loadExistingImages = useCallback(async (projectId: string) => {
    if (!projectId || isProcessing || !user) return;
    
    try {
      const { data: images, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error loading existing images:', error);
        return;
      }
      
      if (images && images.length > 0) {
        setGeneratedImages(images as GeneratedImage[]);
      }
    } catch (error) {
      console.error('Error in loadExistingImages:', error);
    }
  }, [isProcessing, user]);

  const generateBatchImages = useCallback(async (params: {
    productName: string;
    selectedImageFile: File;
    selectedIndustry: IndustryId;
    projectId: string;
    customKeywords: string;
    isPublic: boolean;
    batchConfig: Record<ImageType, number>;
  }) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để tạo ảnh");
      return;
    }

    if ((profile?.points_balance ?? 0) < 120) {
      toast.error("Không đủ điểm. Cần 120 điểm để tạo bộ ảnh.");
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setGeneratedImages([]);

    try {
      const base64Data = await ImageGenerator.fileToBase64(params.selectedImageFile);
      
      const { data, error } = await EdgeFunctionClient.invokeGeneration('generate-images', 120, {
        productName: params.productName.trim(),
        originalImageBase64: base64Data,
        originalImageMimeType: params.selectedImageFile.type,
        projectId: params.projectId,
        customKeywords: params.customKeywords.trim(),
        industry: params.selectedIndustry,
        isPublic: params.isPublic,
        batchConfig: params.batchConfig,
      });

      if (error) {
        throw error;
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to start generation');
      }

      toast.success("Đã bắt đầu tạo ảnh! Quá trình sẽ hoàn thành trong 30-60 giây.");
      setProgress(25);
      
    } catch (error: any) {
      console.error('Error starting generation:', error);
      toast.error(error.message || 'Lỗi khi bắt đầu tạo ảnh');
      setIsProcessing(false);
      setProgress(0);
    }
  }, [user, profile?.points_balance]);

  const handleSoloImageGenerated = useCallback((imageUrl: string, prompt: string) => {
    setSoloResult({ imageUrl, prompt });
    refreshProfile();
  }, [refreshProfile]);

  const handleToggleFavorite = useCallback(async (imageId: string, currentFavorite: boolean) => {
    try {
      await ImageGenerator.toggleFavorite(imageId, currentFavorite);
      
      setGeneratedImages(prev => 
        prev.map(img => 
          img.id === imageId 
            ? { ...img, is_favorite: !currentFavorite }
            : img
        )
      );
      
      toast.success(currentFavorite ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích");
    } catch (error) {
      toast.error("Lỗi khi cập nhật yêu thích");
    }
  }, []);

  const resetGeneration = useCallback((mode: 'batch' | 'solo', clearProject: () => void) => {
    if (mode === 'batch') {
      setGeneratedImages([]);
      clearProject();
      setProgress(0);
      setIsProcessing(false);
    } else {
      setSoloResult(null);
    }
  }, []);

  return {
    isProcessing,
    generatedImages,
    progress,
    soloResult,
    subscribeToProject,
    loadExistingImages,
    generateBatchImages,
    handleSoloImageGenerated,
    handleToggleFavorite,
    resetGeneration
  };
}