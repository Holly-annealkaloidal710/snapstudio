import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Heart, Shield, ArrowRight, LogIn, Building2 } from 'lucide-react';
import SampleOutputsGrid from '@/components/sample-outputs-grid';
import { cn } from '@/lib/utils';
import { generatePageMetadata, industryMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  ...industryMetadata.mother_baby,
  path: "/mother-baby"
});

export default function MotherBabyPage() {
  const benefits = [
    "Ảnh sản phẩm em bé an toàn với ánh sáng mềm mại, màu pastel",
    "Khoảnh khắc gia đình ấm áp với bố/mẹ và con",
    "Content family-friendly cho social với tone ấm cúng",
    "UGC content chân thực như bố/mẹ review"
  ];

  const babyCategories = [
    { name: "Baby Care", examples: "Tã, sữa tắm, kem dưỡng" },
    { name: "Feeding", examples: "Bình sữa, thìa ăn, ghế ăn" },
    { name: "Toys & Play", examples: "Đồ chơi, sách, xe đẩy" },
    { name: "Mom Care", examples: "Sản phẩm cho mẹ bầu, sau sinh" }
  ];

  const safetyFeatures = [
    { feature: "Soft Lighting", description: "Ánh sáng mềm mại, không harsh, phù hợp cho em bé" },
    { feature: "Pastel Colors", description: "Màu sắc nhẹ nhàng, tạo cảm giác an toàn" },
    { feature: "Family Context", description: "Bối cảnh gia đình, nhấn mạnh tình cảm" },
    { feature: "Trust Building", description: "Tăng độ tin cậy của bố/mẹ với sản phẩm" }
  ];

  return (
    <PageLayout
      title="Tạo ảnh Mother & Baby bằng AI"
      subtitle="Prompt chuyên biệt cho sản phẩm em bé — An toàn, ấm áp, family-friendly"
    >
      <div className="space-y-16">
        {/* Hero Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              AI chuyên biệt cho Mother & Baby
            </h2>
            <p className="text-xl text-gray-600">
              Prompt tối ưu cho sự an toàn, ấm áp và family-friendly aesthetic
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Baby Categories */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Phù hợp cho mọi sản phẩm Mother & Baby
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {babyCategories.map((category, index) => (
              <Card key={index} className="border-blue-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.examples}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Safety Features */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Tính năng an toàn cho sản phẩm em bé
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {safetyFeatures.map((item, index) => (
              <Card key={index} className="border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{item.feature}</h3>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sample Outputs */}
        <div>
          <SampleOutputsGrid
            title="Ví dụ ảnh Mother & Baby được tạo bởi SnapStudio"
            subtitle="Safe product display • Family moments • Nursery lifestyle • Parent reviews"
          />
        </div>

        {/* Trust Building */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Xây dựng niềm tin với bố/mẹ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">An toàn tuyệt đối</h3>
              <p className="text-gray-600">
                Prompt nhấn mạnh tính an toàn và chất lượng sản phẩm
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tình cảm gia đình</h3>
              <p className="text-gray-600">
                Khoảnh khắc ấm áp, tăng emotional connection
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Phù hợp lứa tuổi</h3>
              <p className="text-gray-600">
                Content phù hợp cho từng độ tuổi của em bé
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-4">
            Sẵn sàng tạo ảnh Baby chuyên nghiệp?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Bắt đầu với prompt an toàn, family-friendly cho sản phẩm em bé.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl auth-trigger"
          >
            <Heart className="w-5 h-5 mr-2" />
            Bắt đầu tạo ảnh Baby
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}