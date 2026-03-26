import { PageLayout } from '@/components/layout/page-layout';
import SampleOutputsGrid from '@/components/sample-outputs-grid';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: "4 Phong cách ảnh chuyên nghiệp",
  description: "Display • Model • Social • Seeding — được thiết kế để tối ưu cho mọi kênh marketing. Xem ví dụ templates AI của SnapStudio.",
  path: "/templates",
  keywords: ["templates ảnh", "phong cách photography", "marketing templates", "AI templates"]
});

export default function TemplatesPage() {
  return (
    <PageLayout
      title="4 Phong cách ảnh chuyên nghiệp"
      subtitle="Display • Model • Social • Seeding — được thiết kế để tối ưu cho mọi kênh marketing."
    >
      <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-blue-900 mb-2">Display</h3>
            <p className="text-blue-800">Ảnh nền trắng studio chuẩn cho website, catalog và sàn TMĐT. Tập trung vào sản phẩm với ánh sáng đều, không có yếu tố phân tâm.</p>
          </div>
          
          <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-green-900 mb-2">Model</h3>
            <p className="text-green-800">Ảnh có người mẫu sử dụng sản phẩm trong bối cảnh thực tế. Tăng độ tin cậy và giúp khách hàng hình dung cách sử dụng.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <h3 className="text-xl font-bold text-orange-900 mb-2">Social</h3>
            <p className="text-orange-800">Ảnh được tối ưu cho Facebook, Instagram, TikTok. Bố cục bắt mắt, màu sắc nổi bật, phù hợp cho quảng cáo và bài post.</p>
          </div>
          
          <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-purple-900 mb-2">Seeding</h3>
            <p className="text-purple-800">Ảnh UGC (User Generated Content) trông như do khách hàng thật chụp. Tăng độ tin cậy và phù hợp cho chiến lược seeding.</p>
          </div>
        </div>
      </div>
      
      <SampleOutputsGrid dense={false} />
    </PageLayout>
  );
}