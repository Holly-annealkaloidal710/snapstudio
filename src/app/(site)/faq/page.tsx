import { PageLayout } from '@/components/layout/page-layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: "Câu hỏi Thường gặp (FAQ)",
  description: "Tìm câu trả lời cho các thắc mắc về SnapStudio: cách hoạt động, chi phí, chất lượng ảnh, quyền sử dụng thương mại.",
  path: "/faq",
  keywords: ["FAQ", "câu hỏi", "hướng dẫn", "support", "help"]
});

export default function FaqPage() {
  const faqs = [
    {
      question: "SnapStudio hoạt động như thế nào?",
      answer: "Bạn chỉ cần tải lên một ảnh sản phẩm gốc. AI của chúng tôi sẽ phân tích và tự động tạo ra một bộ 12 ảnh marketing chuyên nghiệp theo 4 phong cách khác nhau: Display, Model, Social, và Seeding."
    },
    {
      question: "Chi phí cho mỗi lần tạo ảnh là bao nhiêu?",
      answer: "Mỗi lần tạo một bộ 12 ảnh (Batch Mode) sẽ tốn 120 điểm. Nếu bạn tạo ảnh tùy chỉnh (Solo Mode), chi phí là 30 điểm cho mỗi ảnh. Chúng tôi khuyến khích sử dụng Batch Mode để tiết kiệm chi phí tối đa."
    },
    {
      question: "Tôi có thể sử dụng ảnh đã tạo cho mục đích thương mại không?",
      answer: "Có, tất cả các ảnh bạn tạo ra đều thuộc quyền sở hữu của bạn và bạn có toàn quyền sử dụng chúng cho các mục đích thương mại như quảng cáo, đăng bài trên mạng xã hội, website, v.v."
    },
    {
      question: "Chất lượng ảnh đầu ra như thế nào?",
      answer: "Ảnh được tạo ra có độ phân giải cao, phù hợp cho cả việc in ấn và sử dụng trên các nền tảng kỹ thuật số. AI được huấn luyện để tạo ra hình ảnh với ánh sáng, bố cục và chất lượng chuyên nghiệp như trong studio."
    }
  ];

  return (
    <PageLayout
      title="Câu hỏi Thường gặp (FAQ)"
      subtitle="Tìm câu trả lời cho các thắc mắc phổ biến nhất."
    >
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-base">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageLayout>
  );
}