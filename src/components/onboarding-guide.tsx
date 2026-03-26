"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Sparkles, Upload, Wand2 } from 'lucide-react';

const steps = [
  {
    icon: Building2,
    title: "Bước 1: Chọn Ngành Hàng",
    description: "Chọn ngành hàng để AI sử dụng bộ prompt chuyên biệt, tối ưu cho sản phẩm của bạn.",
  },
  {
    icon: Sparkles,
    title: "Bước 2: Cấu hình Bộ Ảnh",
    description: "Tùy chỉnh số lượng ảnh cho mỗi phong cách (Display, Model, Social, Seeding) để đủ 12 ảnh.",
  },
  {
    icon: Upload,
    title: "Bước 3: Tải Ảnh Gốc",
    description: "Tải lên ảnh sản phẩm gốc của bạn. Ảnh nên rõ nét và sản phẩm là trung tâm.",
  },
  {
    icon: Wand2,
    title: "Bước 4: Tạo Bộ Ảnh",
    description: "Nhấn nút 'Tạo ảnh' và chờ trong 30-60 giây để nhận bộ ảnh marketing hoàn chỉnh.",
  },
];

export function OnboardingGuide() {
  return (
    <Card className="mb-8 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-gray-900">
          Hướng dẫn tạo ảnh trong 4 bước
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-900 border-2 border-white">
                    {index + 1}
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}