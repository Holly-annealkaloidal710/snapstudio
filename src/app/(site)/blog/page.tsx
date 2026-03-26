import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: "Blog - Xu hướng AI và Marketing",
  description: "Cập nhật các xu hướng mới nhất về AI tạo ảnh, marketing automation và digital transformation cho doanh nghiệp.",
  path: "/blog",
  keywords: ["blog AI", "marketing trends", "digital transformation", "AI photography"]
});

export default function BlogPage() {
  const posts = [
    { title: "5 Mẹo Chụp Ảnh Sản Phẩm Bằng AI Để Tăng Doanh Số", category: "Marketing", date: "20/07/2024" },
    { title: "So Sánh Chi Phí: Chụp Ảnh Studio vs. Tạo Ảnh Bằng SnapStudio", category: "Case Study", date: "15/07/2024" },
    { title: "Hướng Dẫn Sử Dụng Phong Cách 'Seeding' Hiệu Quả", category: "Tutorial", date: "10/07/2024" },
  ];

  return (
    <PageLayout
      title="Blog"
      subtitle="Cập nhật các xu hướng mới nhất về AI và marketing."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <Link href="#" key={index}>
            <Card className="card-hover">
              <CardHeader>
                <Badge className="mb-2">{post.category}</Badge>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{post.date}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}