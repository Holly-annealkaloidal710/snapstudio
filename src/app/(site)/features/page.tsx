import { PageLayout } from '@/components/layout/page-layout';
import { Zap, Star, CheckCircle } from 'lucide-react';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: "Tính năng AI tạo ảnh sản phẩm",
  description: "Khám phá sức mạnh của SnapStudio: AI tạo ảnh siêu nhanh, 4 phong cách marketing hoàn chỉnh, chất lượng studio chuyên nghiệp.",
  path: "/features",
  keywords: ["tính năng AI", "tạo ảnh nhanh", "marketing automation", "studio quality"]
});

export default function FeaturesPage() {
  const features = [
    {
      icon: Zap,
      title: "AI Tạo Ảnh Siêu Nhanh",
      description: "Tạo 12 ảnh sản phẩm chuyên nghiệp chỉ trong 30 giây với công nghệ Gemini 2.5 Flash. Không cần studio, không cần photographer.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Star,
      title: "4 Phong Cách Marketing Hoàn Chỉnh", 
      description: "Display (nền trắng studio), Model (người mẫu), Social (bài post), Seeding (UGC) - đủ cho mọi kênh bán hàng và quảng cáo.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: CheckCircle,
      title: "Chất Lượng Studio Chuyên Nghiệp",
      description: "Ảnh đầu ra có độ phân giải cao, ánh sáng chuẩn studio, bố cục hoàn hảo. Sẵn sàng sử dụng cho website, social media, sàn TMĐT.",
      color: "bg-green-100 text-green-600"
    }
  ];

  return (
    <PageLayout
      title="Dịch vụ tạo ảnh AI"
      subtitle="Khám phá sức mạnh của SnapStudio"
    >
      <div className="space-y-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="flex items-start gap-6 p-6 border rounded-lg">
              <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${feature.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-lg text-gray-700">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}