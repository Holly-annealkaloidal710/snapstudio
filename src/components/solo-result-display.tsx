"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageGenerator } from '@/lib/image-generator';
import { toast } from 'sonner';
import { createSupabaseBrowserClient } from '@/integrations/supabase/client';
import { Download, Copy, RefreshCw, Heart, Share2, Loader2 } from 'lucide-react';
import SafeImage from './safe-image';

const supabase = createSupabaseBrowserClient();

interface SoloResultDisplayProps {
  imageUrl: string;
  prompt: string;
  onRegenerate: () => void;
}

export function SoloResultDisplay({ imageUrl, prompt, onRegenerate }: SoloResultDisplayProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleDownload = async () => {
    try {
      await ImageGenerator.downloadImage(imageUrl, 'snapstudio-generated-image.png');
    } catch (error) {
      toast.error("Tải ảnh thất bại");
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(prompt);
    toast.success("Đã sao chép prompt!");
  };

  const handleSaveToProject = async () => {
    // This is a placeholder. In a real app, you'd have a project selector.
    setIsSaving(true);
    try {
      // For simplicity, we'll just mark it as a favorite for now.
      // A full implementation would involve selecting a project and creating a new DB entry.
      toast.info("Tính năng lưu vào dự án đang được phát triển.");
    } catch (error) {
      toast.error("Lỗi khi lưu ảnh.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Kết quả của bạn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
          <SafeImage src={imageUrl} alt="Generated image" className="w-full h-full" />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleDownload} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Tải xuống
          </Button>
          <Button onClick={onRegenerate} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tạo lại
          </Button>
          <Button onClick={handleSaveToProject} variant="default" disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Heart className="w-4 h-4 mr-2" />}
            Lưu
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Chia sẻ
          </Button>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Prompt đã sử dụng</h4>
          <div className="relative bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-700 font-mono pr-10">{prompt}</p>
            <Button 
              size="icon" 
              variant="ghost" 
              className="absolute top-2 right-2 h-7 w-7"
              onClick={handleCopyToClipboard}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}