import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Building2, ArrowRight, LogIn, TrendingUp } from 'lucide-react';
import SampleOutputsGrid from '@/components/sample-outputs-grid';
import { cn } from '@/lib/utils';
import { generatePageMetadata, industryMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  ...industryMetadata.f_b,
  path: "/food-beverage"
});

export default function FoodBeveragePage() {
  const benefits = [
    "Ảnh món ăn studio với ánh sáng đều, màu sắc tươi ngon",
    "Model thưởng thức tự nhiên, tăng cảm giác thèm muốn", 
    "Content social media bắt mắt cho mọi platform",
    "UGC content chân thực như khách hàng review"
  ];

  const useCases = [
    { title: "Nhà hàng & Quán ăn", description: "Menu digital, poster, social media" },
    { title: "Food Delivery", description: "Ảnh món ăn cho app giao hàng" },
    { title: "Thương hiệu F&B", description: "Marketing campaigns, packaging" },
    { title: "Food Content", description: "Blog, review, recipe posts" }
  ];

  const pricingHighlight = [
    { plan: "Starter", price: "99k", images: "10 món", best: false },
    { plan: "Pro", price: "528k", images: "41 món", best: true },
    { plan: "Business", price: "1.58M", images: "125 món", best: false }
  ];

  return (
    <PageLayout
      title="Tạo ảnh Food & Beverage bằng AI"
      subtitle="Prompt chuyên biệt cho F&B — Studio shots, lifestyle dining, social content"
    >
      <div className="space-y-16">
        {/* Hero Benefits */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              AI chuyên biệt cho Food & Beverage
            </h2>
            <p className="text-xl text-gray-600">
              Prompt được tối ưu cho freshness, plating và food styling
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Phù hợp cho mọi loại hình F&B
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-orange-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{useCase.title}</h3>
                  <p className="text-gray-600 text-sm">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sample Outputs */}
        <div>
          <SampleOutputsGrid
            title="Ví dụ ảnh F&B được tạo bởi SnapStudio"
            subtitle="Studio shots • Lifestyle dining • Social posts • UGC content"
          />
        </div>

        {/* Clean Pricing */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 border border-orange-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bảng giá cho F&B
            </h2>
            <p className="text-lg text-gray-600">
              Tính theo số món ăn cần chụp mỗi tháng
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {pricingHighlight.map((plan, index) => (
              <Card key={index} className={cn(
                "border-2 transition-all hover:scale-105",
                plan.best ? "border-orange-500 shadow-lg" : "border-gray-200"
              )}>
                <CardContent className="p-6 text-center">
                  {plan.best && (
                    <Badge className="bg-orange-500 text-white mb-4">
                      PHỔ BIẾN
                    </Badge>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.plan}</h3>
                  <div className="text-2xl font-bold text-orange-600 mb-2">{plan.price}</div>
                  <p className="text-gray-600 mb-4">{plan.images}</p>
                  <Button 
                    className={cn(
                      "w-full auth-trigger",
                      plan.best 
                        ? "bg-orange-500 hover:bg-orange-600" 
                        : "bg-gray-900 hover:bg-gray-800"
                    )}
                  >
                    Chọn {plan.plan}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              <strong>Mỗi món ăn</strong> = 12 ảnh đa style (Display, Model, Social, Seeding)
            </p>
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white auth-trigger">
              <LogIn className="w-5 h-5 mr-2" />
              Bắt đầu tạo ảnh F&B
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* ROI Comparison */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            So sánh chi phí F&B
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                Studio truyền thống
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Chi phí: 2-5 triệu/buổi</li>
                <li>• Thời gian: 1-2 ngày</li>
                <li>• Kết quả: 5-8 ảnh/món</li>
                <li>• <strong>Tổng: 3-7 ngày, 2-5 triệu</strong></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-600 mb-4 flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                SnapStudio
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Chi phí: 120 điểm (~12k VND)</li>
                <li>• Thời gian: 30 giây</li>
                <li>• Kết quả: 12 ảnh/món (4 style)</li>
                <li>• <strong className="text-green-600">Tổng: 30 giây, 12k VND</strong></li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <p className="text-xl font-bold text-green-600">
                Tiết kiệm 99.8% thời gian và 99.5% chi phí!
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}