import type { Metadata } from "next";

interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  image = "/og-image.jpg",
  keywords = [],
  noIndex = false
}: PageMetadataOptions): Metadata {
  const fullTitle = `${title} | SnapStudio`;
  const url = `https://snapstudio.app${path}`;
  const fullImage = image.startsWith('http') ? image : `https://snapstudio.app${image}`;
  
  const allKeywords = [
    "SnapStudio",
    "tạo ảnh AI",
    "ảnh sản phẩm",
    "marketing",
    "AI Vietnam",
    ...keywords
  ];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    
    // Open Graph
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url,
      siteName: "SnapStudio",
      title: fullTitle,
      description,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    
    // Twitter
    twitter: {
      card: "summary_large_image",
      site: "@snapstudio_app",
      creator: "@snapstudio_app",
      title: fullTitle,
      description,
      images: [fullImage],
    },
    
    // Canonical URL
    alternates: {
      canonical: url,
    },
    
    // Robots
    robots: noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
    },
  };
}

// Industry-specific metadata
export const industryMetadata = {
  'f_b': {
    title: "Tạo ảnh Food & Beverage bằng AI",
    description: "Prompt chuyên biệt cho F&B - Studio shots, lifestyle dining, social content. Tiết kiệm 99% chi phí chụp ảnh món ăn.",
    keywords: ["ảnh món ăn", "food photography", "restaurant marketing", "F&B AI", "menu design"],
    image: "/og-food-beverage.jpg"
  },
  'beauty': {
    title: "Tạo ảnh Beauty & Personal Care bằng AI", 
    description: "Prompt chuyên biệt cho mỹ phẩm - Luxury aesthetic, model application, skincare campaigns. Ảnh beauty chuyên nghiệp.",
    keywords: ["ảnh mỹ phẩm", "beauty photography", "skincare marketing", "makeup AI", "cosmetics"],
    image: "/og-beauty.jpg"
  },
  'fashion': {
    title: "Tạo ảnh Fashion & Accessories bằng AI",
    description: "Prompt chuyên biệt cho thời trang - Editorial style, streetwear vibe, product flat-lay. Fashion photography AI.",
    keywords: ["ảnh thời trang", "fashion photography", "streetwear", "clothing AI", "accessories"],
    image: "/og-fashion.jpg"
  },
  'mother_baby': {
    title: "Tạo ảnh Mother & Baby bằng AI",
    description: "Prompt chuyên biệt cho sản phẩm em bé - An toàn, ấm áp, family-friendly. Baby product photography AI.",
    keywords: ["ảnh sản phẩm baby", "mother baby photography", "family products", "baby AI", "parenting"],
    image: "/og-mother-baby.jpg"
  }
};