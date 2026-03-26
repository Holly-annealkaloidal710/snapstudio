import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Building2, ArrowRight, LogIn, TrendingUp } from 'lucide-react';
import SampleOutputsGrid from '@/components/sample-outputs-grid';
import { cn } from '@/lib/utils';
import { generatePageMetadata, industryMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  ...industryMetadata.fashion,
  path: "/fashion-accessories"
});

export default function FashionAccessoriesPage() {
  const benefits = [
    "Flat-lay studio chuyên nghiệp với ánh sáng đều, texture rõ nét",
    "Model mặc/đeo sản phẩm trong bối cảnh editorial",
    "Content streetwear và lifestyle cho social trendy",
    "UGC content như khách hàng tự chụp OOTD"
  ];

  const fashionCategories = [
    { name: "Clothing", examples: "Áo, quần, váy, jacket" },
    { name: "Footwear", examples: "Giày sneaker, boots, sandals" },
    { name: "Accessories", examples: "Túi xách, đồng hồ, jewelry" },
    { name: "Streetwear", examples: "Urban style, casual wear" }
  ];

  const fashionStyles = [
    { 
      style: "Editorial Fashion", 
      description: "Model trong studio với lighting chuyên nghiệp", 
      useCase: "Website, catalog, lookbook" 
    },
    { 
      style: "Streetwear Lifestyle", 
      description: "Bối cảnh đường phố, phong cách năng động", 
      useCase: "Social media, youth marketing" 
    },
    { 
      style: "Product Flat-lay", 
      description: "Sản phẩm bày trí đẹp mắt, texture rõ nét", 
      useCase: "E-commerce, product catalog" 
    },
    { 
      style: "OOTD Content", 
      description: "Outfit of the day, UGC style tự nhiên", 
      useCase: "Seeding, influencer marketing" 
    }
  ];

  return (
    <PageLayout
      title="Tạo ảnh Fashion & Accessories bằng AI"
      subtitle="Prompt chuyên biệt cho thời trang — Editorial style, streetwear vibe, product flat-lay"
    >
      <div className="space-y-16">
        {/* Hero Benefits */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              AI chuyên biệt cho Fashion & Accessories
            </h2>
            <p className="text-xl text-gray-600">
              Prompt tối ưu cho editorial style, streetwear aesthetic và product styling
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fashion Categories */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Phù hợp cho mọi sản phẩm Fashion
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fashionCategories.map((category, index) => (
              <Card key={index} className="border-purple-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.examples}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fashion Styles */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            4 phong cách chụp ảnh thời trang
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fashionStyles.map((style, index) => (
              <Card key={index} className="border-purple-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{style.style}</h3>
                  <p className="text-gray-600 mb-4">{style.description}</p>
                  <Badge className="bg-purple-100 text-purple-700">
                    {style.useCase}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sample Outputs */}
        <div>
          <SampleOutputsGrid
            title="Ví dụ ảnh Fashion được tạo bởi SnapStudio"
            subtitle="Editorial shots • Streetwear style • Product flat-lay • OOTD content"
          />
        </div>

        {/* ROI Comparison */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            ROI cho Fashion Brands
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                Studio truyền thống
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Photographer: 3-10 triệu/buổi</li>
                <li>• Model: 1-3 triệu/ngày</li>
                <li>• Studio: 500k-2M/ngày</li>
                <li>• Styling: 1-2 triệu</li>
                <li>• <strong>Tổng: 5-17 triệu, 3-5 ngày</strong></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-600 flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                SnapStudio
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Upload: 5 giây</li>
                <li>• AI generation: 30 giây</li>
                <li>• 12 ảnh đa style: Tức thì</li>
                <li>• Chi phí: 120 điểm (~12k VND)</li>
                <li>• <strong className="text-green-600">Tổng: 35 giây, 12k VND</strong></li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <p className="text-xl font-bold text-green-600">
                Tiết kiệm 99.9% thời gian và 99.9% chi phí!
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-4">
            Sẵn sàng revolutionize fashion photography?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Tạo ngay bộ ảnh thời trang chuyên nghiệp với AI. Từ editorial đến streetwear, từ flat-lay đến OOTD.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl auth-trigger"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Bắt đầu tạo ảnh Fashion
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}