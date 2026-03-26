"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Star, Sparkles, CreditCard } from "lucide-react";

type IndustryId = 'f_b' | 'beauty' | 'fashion' | 'mother_baby' | 'other';

type Plan = {
  id: string;
  name: string;
  points: number;
  priceUsd: number;
  popular?: boolean;
  color?: "gray" | "blue" | "purple" | "yellow";
  yearly?: boolean;
  discountNote?: string;
  features?: string[];
  industryExamples?: {
    f_b: string;
    beauty: string;
    fashion: string;
    mother_baby: string;
    other: string;
  };
};

const USD_VND_RATE = 26400;

function usdToVnd(usd: number) {
  const raw = usd * USD_VND_RATE;
  return Math.round(raw / 1000) * 1000;
}

const monthlyPlans: Plan[] = [
  { 
    id: "starter_monthly", 
    name: "Starter", 
    points: 1200,
    priceUsd: 5, 
    color: "yellow",
    features: ["1,200 điểm/tháng", "Tương đương ~10 bộ ảnh", "Tất cả templates", "Tải xuống HD"],
    industryExamples: {
      f_b: "~10 món ăn/tháng",
      beauty: "~10 sản phẩm mỹ phẩm/tháng", 
      fashion: "~10 outfit/sản phẩm/tháng",
      mother_baby: "~10 sản phẩm baby/tháng",
      other: "~10 sản phẩm tech/tháng"
    }
  },
  { 
    id: "pro_monthly", 
    name: "Pro", 
    points: 5000,
    priceUsd: 20, 
    popular: true, 
    color: "blue",
    features: ["5,000 điểm/tháng", "Tương đương ~41 bộ ảnh", "Tất cả tính năng Starter", "Hỗ trợ ưu tiên"],
    industryExamples: {
      f_b: "~41 món ăn/tháng",
      beauty: "~41 sản phẩm mỹ phẩm/tháng",
      fashion: "~41 outfit/sản phẩm/tháng", 
      mother_baby: "~41 sản phẩm baby/tháng",
      other: "~41 sản phẩm tech/tháng"
    }
  },
  { 
    id: "business_monthly", 
    name: "Business", 
    points: 15000,
    priceUsd: 60, 
    color: "purple",
    features: ["15,000 điểm/tháng", "Tương đương ~125 bộ ảnh", "Tất cả tính năng Pro", "Lịch sử không giới hạn"],
    industryExamples: {
      f_b: "~125 món ăn/tháng",
      beauty: "~125 sản phẩm mỹ phẩm/tháng",
      fashion: "~125 outfit/sản phẩm/tháng",
      mother_baby: "~125 sản phẩm baby/tháng", 
      other: "~125 sản phẩm tech/tháng"
    }
  },
  { 
    id: "enterprise_monthly", 
    name: "Enterprise", 
    points: 50000,
    priceUsd: 199, 
    color: "gray",
    features: ["50,000 điểm/tháng", "Tương đương ~416 bộ ảnh", "Tất cả tính năng Business", "Tư vấn riêng"],
    industryExamples: {
      f_b: "~416 món ăn/tháng",
      beauty: "~416 sản phẩm mỹ phẩm/tháng",
      fashion: "~416 outfit/sản phẩm/tháng",
      mother_baby: "~416 sản phẩm baby/tháng",
      other: "~416 sản phẩm tech/tháng"
    }
  },
];

const yearlyPlans: Plan[] = [
  { 
    id: "starter_yearly", 
    name: "Starter", 
    points: 1200,
    priceUsd: 50,
    color: "yellow", 
    yearly: true, 
    discountNote: "Tiết kiệm 17%",
    features: ["1,200 điểm/tháng", "Tương đương ~10 bộ ảnh/tháng", "Thanh toán theo năm", "Tất cả templates"],
    industryExamples: {
      f_b: "~10 món ăn/tháng × 12 tháng",
      beauty: "~10 sản phẩm mỹ phẩm/tháng × 12 tháng",
      fashion: "~10 outfit/tháng × 12 tháng",
      mother_baby: "~10 sản phẩm baby/tháng × 12 tháng",
      other: "~10 sản phẩm/tháng × 12 tháng"
    }
  },
  { 
    id: "pro_yearly", 
    name: "Pro", 
    points: 5000,
    priceUsd: 200,
    popular: true, 
    color: "blue", 
    yearly: true, 
    discountNote: "Tiết kiệm 17%",
    features: ["5,000 điểm/tháng", "Tương đương ~41 bộ ảnh/tháng", "Thanh toán theo năm", "Hỗ trợ ưu tiên"],
    industryExamples: {
      f_b: "~41 món ăn/tháng × 12 tháng",
      beauty: "~41 sản phẩm mỹ phẩm/tháng × 12 tháng",
      fashion: "~41 outfit/tháng × 12 tháng",
      mother_baby: "~41 sản phẩm baby/tháng × 12 tháng", 
      other: "~41 sản phẩm/tháng × 12 tháng"
    }
  },
  { 
    id: "business_yearly", 
    name: "Business", 
    points: 15000,
    priceUsd: 600,
    color: "purple", 
    yearly: true, 
    discountNote: "Tiết kiệm 17%",
    features: ["15,000 điểm/tháng", "Tương đương ~125 bộ ảnh/tháng", "Thanh toán theo năm", "Lịch sử không giới hạn"],
    industryExamples: {
      f_b: "~125 món ăn/tháng × 12 tháng",
      beauty: "~125 sản phẩm mỹ phẩm/tháng × 12 tháng",
      fashion: "~125 outfit/tháng × 12 tháng",
      mother_baby: "~125 sản phẩm baby/tháng × 12 tháng",
      other: "~125 sản phẩm/tháng × 12 tháng"
    }
  },
  { 
    id: "enterprise_yearly", 
    name: "Enterprise", 
    points: 50000,
    priceUsd: 1990,
    color: "gray", 
    yearly: true, 
    discountNote: "Tiết kiệm 17%",
    features: ["50,000 điểm/tháng", "Tương đương ~416 bộ ảnh/tháng", "Thanh toán theo năm", "Tư vấn riêng"],
    industryExamples: {
      f_b: "~416 món ăn/tháng × 12 tháng",
      beauty: "~416 sản phẩm mỹ phẩm/tháng × 12 tháng", 
      fashion: "~416 outfit/tháng × 12 tháng",
      mother_baby: "~416 sản phẩm baby/tháng × 12 tháng",
      other: "~416 sản phẩm/tháng × 12 tháng"
    }
  },
];

export default function PricingPlans() {
  const [yearly, setYearly] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryId | null>(null);
  const plans = yearly ? yearlyPlans : monthlyPlans;

  const handlePlanSelect = (planId: string) => {
    // Use window.location for navigation to avoid client-side routing issues
    if (typeof window !== 'undefined') {
      window.location.href = `/dashboard/billing?plan=${planId}`;
    }
  };

  const handleContactRedirect = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/contact';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800 text-sm font-semibold">Bảng giá linh hoạt</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Chọn gói phù hợp với ngành của bạn
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Yearly tiết kiệm 17% — điểm được cấp hàng tháng, không hết hạn
          </p>
          
          {/* Industry Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Button
              variant={selectedIndustry === null ? "default" : "outline"}
              onClick={() => setSelectedIndustry(null)}
              size="sm"
              className="rounded-full"
            >
              Tất cả ngành
            </Button>
            {[
              { value: 'f_b', label: '🍔 F&B' },
              { value: 'beauty', label: '💄 Beauty' },
              { value: 'fashion', label: '👕 Fashion' },
              { value: 'mother_baby', label: '👶 Mom&Baby' },
              { value: 'other', label: '📱 Tech' }
            ].map((industry) => (
              <Button
                key={industry.value}
                variant={selectedIndustry === industry.value ? "default" : "outline"}
                onClick={() => setSelectedIndustry(industry.value as IndustryId)}
                size="sm"
                className="rounded-full flex items-center gap-1"
              >
                {industry.label}
              </Button>
            ))}
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3 max-w-2xl mx-auto">
            <p className="text-sm text-blue-800">
              <strong>Batch Mode:</strong> 120 điểm = 12 ảnh (10 điểm/ảnh) 💰 | 
              <strong>Solo Mode:</strong> 30 điểm = 1 ảnh (30 điểm/ảnh) 💸
            </p>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center mb-10">
          <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setYearly(false)}
                className={`px-5 py-2 rounded-full font-semibold transition-all ${
                  !yearly 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`px-5 py-2 rounded-full font-semibold transition-all relative ${
                  yearly 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Yearly
                {yearly && (
                  <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1">
                    -17%
                  </Badge>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.popular ? Zap : plan.color === "purple" ? Crown : plan.color === "yellow" ? Star : Sparkles;
            const vnd = usdToVnd(plan.priceUsd);
            const monthlyUsd = plan.yearly ? plan.priceUsd / 12 : null;
            const monthlyVnd = plan.yearly ? vnd / 12 : null;

            // Get industry-specific example
            const industryExample = selectedIndustry && plan.industryExamples 
              ? plan.industryExamples[selectedIndustry]
              : null;

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? "ring-2 ring-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50" 
                    : "shadow-lg hover:shadow-xl bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-bold">
                    🔥 PHỔ BIẾN
                  </div>
                )}

                <CardHeader className={`text-center ${plan.popular ? 'pt-12 pb-4' : 'pt-6 pb-4'}`}>
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 mx-auto ${
                      plan.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : plan.color === "purple"
                        ? "bg-purple-100 text-purple-600"
                        : plan.color === "yellow"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>

                  {plan.discountNote && (
                    <Badge variant="outline" className="mb-3 bg-green-50 text-green-700 border-green-200 text-xs">
                      {plan.discountNote}
                    </Badge>
                  )}

                  <div className="mb-1">
                    <span className="text-3xl font-bold text-gray-900">
                      ${plan.priceUsd.toLocaleString()}
                    </span>
                    <span className="text-gray-500 ml-1 text-sm">
                      {plan.yearly ? "/năm" : "/tháng"}
                    </span>
                  </div>

                  <div className="text-base font-semibold text-blue-600 mb-1">
                    {vnd.toLocaleString()}₫
                  </div>

                  {monthlyUsd && monthlyVnd && (
                    <div className="text-xs text-gray-500 mb-3">
                      ≈ ${monthlyUsd.toFixed(0)}/tháng ({Math.round(monthlyVnd/1000)}k₫/tháng)
                    </div>
                  )}

                  <Badge 
                    variant="outline" 
                    className={`text-sm px-3 py-1 font-bold ${
                      plan.color === "blue" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      plan.color === "purple" ? "bg-purple-50 text-purple-700 border-purple-200" :
                      plan.color === "yellow" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                      "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    {plan.points.toLocaleString()} pts/tháng
                  </Badge>

                  {/* Industry-specific example */}
                  {industryExample && (
                    <div className="mt-3">
                      <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 text-xs px-3 py-1">
                        {industryExample}
                      </Badge>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="px-5 pb-6">
                  <ul className="space-y-2 mb-6">
                    {plan.features?.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-2 font-semibold transition-all auth-trigger ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {plan.popular ? "Bắt đầu ngay" : "Chọn gói này"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Industry-specific ROI */}
        {selectedIndustry && (
          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">
                    {selectedIndustry === 'f_b' ? '🍔' : 
                     selectedIndustry === 'beauty' ? '💄' :
                     selectedIndustry === 'fashion' ? '👕' :
                     selectedIndustry === 'mother_baby' ? '👶' : '📱'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    ROI cho ngành {selectedIndustry === 'f_b' ? 'F&B' : 
                                  selectedIndustry === 'beauty' ? 'Beauty' :
                                  selectedIndustry === 'fashion' ? 'Fashion' :
                                  selectedIndustry === 'mother_baby' ? 'Mom&Baby' : 'Tech'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Studio truyền thống</h4>
                      <p className="text-gray-600 text-sm">
                        {selectedIndustry === 'f_b' && "2-5 triệu/buổi chụp món ăn"}
                        {selectedIndustry === 'beauty' && "3-8 triệu/buổi chụp mỹ phẩm"}
                        {selectedIndustry === 'fashion' && "5-15 triệu/buổi chụp thời trang"}
                        {selectedIndustry === 'mother_baby' && "3-10 triệu/buổi chụp baby"}
                        {selectedIndustry === 'other' && "2-8 triệu/buổi chụp tech"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-2">SnapStudio AI</h4>
                      <p className="text-blue-700 text-sm font-semibold">
                        120 điểm = 12k VND cho 12 ảnh đa style
                      </p>
                    </div>
                  </div>
                  <Badge className="mt-4 bg-green-500 text-white px-4 py-2">
                    Tiết kiệm 99%+ chi phí!
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Cần tư vấn gói phù hợp cho ngành của bạn?
            </h3>
            <p className="text-gray-600 mb-4">
              Liên hệ với đội ngũ SnapStudio để được tư vấn gói cước tối ưu cho business model của bạn.
            </p>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2"
              onClick={handleContactRedirect}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Tư vấn gói cước
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}