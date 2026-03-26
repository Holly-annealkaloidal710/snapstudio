"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrivacyToggleProps {
  isPublic: boolean;
  onToggle: (isPublic: boolean) => void;
}

export function PrivacyToggle({ isPublic, onToggle }: PrivacyToggleProps) {
  return (
    <Card className="border-2 border-gray-200 rounded-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className={cn("w-4 h-4", isPublic ? "text-green-600" : "text-gray-400")} />
            <Label htmlFor="is-public-switch" className="text-sm font-medium">
              Chia sẻ ảnh ra cộng đồng?
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Label 
              htmlFor="is-public-switch" 
              className={cn("text-xs cursor-pointer", !isPublic ? "font-bold text-gray-800" : "text-gray-500")}
            >
              Riêng tư
            </Label>
            <Switch
              id="is-public-switch"
              checked={isPublic}
              onCheckedChange={onToggle}
            />
            <Label 
              htmlFor="is-public-switch" 
              className={cn("text-xs cursor-pointer", isPublic ? "font-bold text-gray-800" : "text-gray-500")}
            >
              Công khai
            </Label>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {isPublic 
            ? "Ảnh sẽ được chia sẻ công khai trong cộng đồng SnapStudio (mặc định)" 
            : "Ảnh chỉ hiển thị trong tài khoản cá nhân của bạn"
          }
        </p>
      </CardContent>
    </Card>
  );
}