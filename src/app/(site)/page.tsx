"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Users, Zap, ArrowRight, TrendingUp, Award, Shield, LogIn, Star, CheckCircle, Sparkles, CreditCard } from "lucide-react";
import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import SampleOutputsGrid from "@/components/sample-outputs-grid";
import PricingPlans from "@/components/pricing-plans";
import { useRouter } from "next/navigation";

const supabase = createSupabaseBrowserClient();

const stats = [
  { number: '50,000+', label: 'Ảnh đã tạo thành công', icon: TrendingUp, color: 'text-blue-600' },
  { number: '2,500+', label: 'Doanh nghiệp tin dùng', icon: Users, color: 'text-green-600' },
  { number: '4.9/5', label: 'Đánh giá từ khách hàng', icon: Award, color: 'text-yellow-600' },
  { number: '99.9%', label: 'Thời gian hoạt động', icon: Shield, color: 'text-purple-600' }
];

const features = [
  {
    icon: Zap,
    title: "Bộ ảnh marketing hoàn chỉnh trong 30 giây",
    description: "Từ 1 ảnh gốc tạo ra 12 ảnh đầy đủ cho mọi nền tảng: Website, Facebook, Instagram, TikTok, Shopee, Lazada",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Star,
    title: "4 phong cách phủ sóng toàn bộ customer journey", 
    description: "Ảnh trưng bày sản phẩm, người mẫu thực tế, content mạng xã hội, banner quảng cáo - đủ từ awareness đến conversion",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: CheckCircle,
    title: "Nhất quán thương hiệu trên mọi kênh",
    description: "Tông màu, phong cách, chất lượng đồng nhất - xây dựng brand identity mạnh mẽ và chuyên nghiệp",
    color: "bg-green-100 text-green-600"
  }
];

const testimonials = [
  {
    name: "Chị Minh Anh",
    role: "Marketing Manager - Thời trang MINA",
    content: "SnapStudio giúp team mình có đủ ảnh cho cả năm! Website, Facebook Ads, Instagram Stories, TikTok - tất cả đều có ảnh đẹp và nhất quán thương hiệu.",
    avatar: "https://ui-avatars.com/api/?name=Minh+Anh&background=random&color=fff",
    industry: 'fashion'
  },
  {
    name: "Anh Văn Hùng", 
    role: "Founder - Chuỗi Quán Hùng Ký",
    content: "Từ menu in, poster quán, đến Facebook, Grab Food - tất cả đều dùng ảnh từ SnapStudio. Khách thấy ảnh đẹp, order nhiều hơn hẳn!",
    avatar: "https://ui-avatars.com/api/?name=Văn+Hùng&background=random&color=fff",
    industry: 'f_b'
  },
  {
    name: "Chị Thị Mai",
    role: "CEO - Mai Beauty House", 
    content: "1 lần chụp có ngay content cho cả tháng: ảnh website, banner Shopee, story Instagram, video TikTok. Marketing team không bao giờ thiếu ảnh!",
    avatar: "https://ui-avatars.com/api/?name=Thị+Mai&background=random&color=fff",
    industry: 'beauty'
  }
];

const comparisonData = [
  { aspect: 'Số nền tảng phủ sóng', traditional: '1-2 nền tảng', snapstudio: 'Tất cả nền tảng', improvement: 'Phủ sóng toàn diện' },
  { aspect: 'Thời gian có ảnh đủ dùng', traditional: '2-4 tuần', snapstudio: '30 giây', improvement: 'Nhanh hơn 99%' },
  { aspect: 'Chi phí cho đa nền tảng', traditional: '10-50 triệu', snapstudio: '99k-5M', improvement: 'Tiết kiệm 90%' },
  { aspect: 'Tính nhất quán thương hiệu', traditional: 'Khó đồng bộ', snapstudio: 'Hoàn toàn nhất quán', improvement: 'Brand identity mạnh' }
];

export default function Home() {
  const router = useRouter();
  const [sampleImages, setSampleImages] = useState<any[] | null>(null);
  const [samplesLoaded, setSamplesLoaded] = useState(false);

  useEffect(() => {
    if (samplesLoaded) return;

    const loadSampleImages = async () => {
      try {
        const { data, error } = await supabase
          .from('generated_images')
          .select('id, image_type, title, description, image_url')
          .eq('is_featured', true)
          .limit(12);

        if (error) {
          console.error('Error loading sample images:', error);
          setSampleImages(null);
        } else {
          setSampleImages(data);
        }
      } catch (error) {
        console.error('Error in loadSampleImages:', error);
        setSampleImages(null);
      } finally {
        setSamplesLoaded(true);
      }
    };

    loadSampleImages();
  }, [samplesLoaded]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg pt-24 pb-16">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative container-custom">
          <div className="text-center max-w-5xl mx-auto animate-fade-in-up">
            <Badge className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0 px-6 py-2 mb-8 animate-scale-in">
              <Sparkles className="w-4 h-4" />
              Giải pháp hình ảnh marketing đa nền tảng số 1 Việt Nam
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 text-balance">
              <span className="gradient-text">SnapStudio</span>
              <span className="text-gray-900">.app</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed text-balance max-w-4xl mx-auto">
              <span className="font-bold text-purple-600">1 ảnh sản phẩm</span> → 
              <span className="font-bold text-blue-600"> 12 ảnh marketing hoàn chỉnh</span> cho
              <span className="font-bold text-green-600"> mọi nền tảng</span>: Website, Social Media, E-commerce, Quảng cáo
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                variant="default"
                className="btn-primary text-lg px-8 py-4 animate-scale-in animation-delay-200"
                onClick={() => router.push('/login')}
              >
                <LogIn className="w-5 h-5 mr-2" />
                Tạo bộ ảnh marketing ngay
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-secondary text-lg px-8 py-4 animate-scale-in animation-delay-400"
                onClick={() => {
                  const pricingSection = document.getElementById('pricing');
                  if (pricingSection) pricingSection.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Xem gói dịch vụ
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index} 
                    className={`text-center animate-fade-in-up`}
                    style={{ animationDelay: `${600 + index * 100}ms` }}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl mb-3 shadow-lg ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Sample Outputs */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container-custom">
          <SampleOutputsGrid
            title="Bộ ảnh marketing hoàn chỉnh"
            subtitle="Website • Social Media • E-commerce • Advertising — đầy đủ cho mọi nền tảng marketing"
            preloadedImages={sampleImages}
          />
        </div>
      </section>

      {/* Features */}
      <section className="section-padding gradient-bg">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">
              Tại sao doanh nghiệp chọn SnapStudio?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Giải pháp hình ảnh marketing toàn diện, tiết kiệm thời gian và chi phí
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="card-hover bg-white border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${feature.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">
              So sánh với cách làm marketing truyền thống
            </h2>
            <p className="text-xl text-gray-600">Phủ sóng toàn diện, nhất quán thương hiệu, tiết kiệm chi phí</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden shadow-2xl border-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="grid grid-cols-4 p-6">
                  <div className="font-semibold text-lg">Tiêu chí</div>
                  <div className="font-semibold text-lg">Cách truyền thống</div>
                  <div className="font-semibold text-lg">SnapStudio</div>
                  <div className="font-semibold text-lg">Lợi ích</div>
                </div>
              </div>
              {comparisonData.map((row, index) => (
                <div key={index} className={`grid grid-cols-4 p-6 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <div className="font-medium text-gray-900">{row.aspect}</div>
                  <div className="text-gray-600">{row.traditional}</div>
                  <div className="text-blue-600 font-semibold">{row.snapstudio}</div>
                  <div className="text-green-600 font-bold">{row.improvement}</div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding gradient-bg">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">
              Doanh nghiệp từ mọi ngành tin dùng SnapStudio
            </h2>
            <p className="text-xl text-gray-600">Hơn 2,500 doanh nghiệp đã có bộ ảnh marketing hoàn chỉnh</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover bg-white border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed italic mb-4">"{testimonial.content}"</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingPlans />

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container-custom text-center">
          <div className="animate-float">
            <Sparkles className="w-16 h-16 text-white/80 mx-auto mb-6" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
            Sẵn sàng có bộ ảnh marketing hoàn chỉnh?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Tạo ngay bộ ảnh đầy đủ cho mọi nền tảng marketing của doanh nghiệp bạn.
          </p>
          <Button 
            size="lg" 
            variant="default"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
            onClick={() => router.push('/login')}
          >
            <LogIn className="w-5 h-5 mr-2" />
            Tạo bộ ảnh marketing ngay
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </>
  );
}