import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ClientLayoutWrapper } from "@/components/client-layout-wrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnapStudio - Tạo ảnh sản phẩm với AI | 1 ảnh → 12 ảnh marketing chuyên nghiệp",
  description: "Từ 1 ảnh sản phẩm tạo ra bộ ảnh marketing chuyên nghiệp trong 30 giây. 4 phong cách: Display, Model, Social, Seeding. Tiết kiệm 99% chi phí studio.",
  keywords: ["tạo ảnh AI", "ảnh sản phẩm", "marketing", "AI Vietnam", "studio ảnh", "e-commerce", "social media"],
  authors: [{ name: "SnapStudio Team" }],
  creator: "SnapStudio",
  publisher: "SnapStudio",
  
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },

  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://snapstudio.app",
    siteName: "SnapStudio",
    title: "SnapStudio - Tạo ảnh sản phẩm với AI",
    description: "Từ 1 ảnh sản phẩm tạo ra 12 ảnh marketing chuyên nghiệp trong 30 giây. Tiết kiệm 99% chi phí studio.",
    images: [
      {
        url: "https://snapstudio.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SnapStudio - AI tạo ảnh sản phẩm chuyên nghiệp",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    site: "@snapstudio_app",
    creator: "@snapstudio_app",
    title: "SnapStudio - Tạo ảnh sản phẩm với AI",
    description: "Từ 1 ảnh sản phẩm tạo ra 12 ảnh marketing chuyên nghiệp trong 30 giây. Tiết kiệm 99% chi phí studio.",
    images: ["https://snapstudio.app/og-image.jpg"],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  verification: {
    google: "your-google-verification-code",
  },
  
  applicationName: "SnapStudio",
  category: "Business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3B82F6" />
        <link rel="canonical" href="https://snapstudio.app" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}