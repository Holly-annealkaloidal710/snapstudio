import { PageLayout } from '@/components/layout/page-layout';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: "Điều khoản Dịch vụ",
  description: "Điều khoản và điều kiện sử dụng dịch vụ SnapStudio. Cập nhật lần cuối: 25/07/2024.",
  path: "/terms",
  keywords: ["điều khoản", "terms of service", "legal", "policy"],
  noIndex: true // Usually you don't want legal pages indexed
});

export default function TermsPage() {
  return (
    <PageLayout
      title="Điều khoản Dịch vụ"
      subtitle="Cập nhật lần cuối: 25/07/2024"
    >
      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Giới thiệu</h2>
      <p>
        Chào mừng bạn đến với SnapStudio. Bằng cách truy cập hoặc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện này. Vui lòng đọc kỹ trước khi sử dụng.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Sử dụng Dịch vụ</h2>
      <p>
        Bạn đồng ý không sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp nào hoặc vi phạm bất kỳ luật nào tại khu vực pháp lý của bạn. Bạn chịu trách nhiệm về tất cả các hoạt động xảy ra dưới tài khoản của mình.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Quyền sở hữu trí tuệ</h2>
      <p>
        Tất cả nội dung được tạo ra bởi người dùng vẫn thuộc quyền sở hữu của người dùng. Tuy nhiên, bằng cách sử dụng dịch vụ, bạn cấp cho SnapStudio quyền sử dụng, sao chép, và hiển thị nội dung đó cho mục đích vận hành và cải thiện dịch vụ.
      </p>
    </PageLayout>
  );
}