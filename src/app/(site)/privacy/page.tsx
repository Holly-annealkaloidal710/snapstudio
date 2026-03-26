import { PageLayout } from '@/components/layout/page-layout';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: "Chính sách Bảo mật",
  description: "Chính sách bảo mật thông tin cá nhân của SnapStudio. Chúng tôi tôn trọng quyền riêng tư của bạn.",
  path: "/privacy",
  keywords: ["chính sách bảo mật", "privacy policy", "data protection", "GDPR"],
  noIndex: true
});

export default function PrivacyPage() {
  return (
    <PageLayout
      title="Chính sách Bảo mật"
      subtitle="Chúng tôi tôn trọng quyền riêng tư của bạn."
    >
      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Thu thập thông tin</h2>
      <p>
        Chúng tôi thu thập thông tin bạn cung cấp trực tiếp cho chúng tôi, chẳng hạn như khi bạn tạo tài khoản, bao gồm tên, địa chỉ email và thông tin thanh toán.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Sử dụng thông tin</h2>
      <p>
        Chúng tôi sử dụng thông tin thu thập được để cung cấp, duy trì và cải thiện dịch vụ của mình, cũng như để liên lạc với bạn về các cập nhật và ưu đãi.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Chia sẻ thông tin</h2>
      <p>
        Chúng tôi không chia sẻ thông tin cá nhân của bạn với các công ty, tổ chức hoặc cá nhân bên ngoài trừ khi có sự đồng ý của bạn hoặc theo yêu cầu của pháp luật.
      </p>
    </PageLayout>
  );
}