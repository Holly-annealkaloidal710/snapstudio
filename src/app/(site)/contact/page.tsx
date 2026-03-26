import { PageLayout } from '@/components/layout/page-layout';
import { Mail, Phone } from 'lucide-react';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: "Liên hệ",
  description: "Liên hệ với đội ngũ SnapStudio để được hỗ trợ, tư vấn về dịch vụ AI tạo ảnh sản phẩm. Email: contact@snapstudio.app",
  path: "/contact",
  keywords: ["liên hệ", "hỗ trợ", "tư vấn", "contact", "support"]
});

export default function ContactPage() {
  return (
    <PageLayout
      title="Liên hệ"
      subtitle="Chúng tôi luôn sẵn sàng lắng nghe bạn."
    >
      <div className="text-center space-y-8">
        <p>
          Nếu bạn có bất kỳ câu hỏi, góp ý hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi qua các kênh dưới đây. Đội ngũ SnapStudio sẽ phản hồi bạn trong thời gian sớm nhất.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <Mail className="w-6 h-6 text-blue-600" />
            <a href="mailto:contact@snapstudio.app" className="text-lg font-medium text-gray-800 hover:text-blue-600">
              contact@snapstudio.app
            </a>
          </div>
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <Phone className="w-6 h-6 text-green-600" />
            <span className="text-lg font-medium text-gray-800">
              (+84) 123 456 789
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}