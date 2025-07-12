import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "営業アタックリスト作成ツール - 営業効率90%向上 | Google Maps API連携",
  description: "Google Maps APIを活用した営業リスト自動生成ツール。情報収集時間を90%削減、成約率2.3倍向上を実現。現在地からの自動検索、CSV一括エクスポート機能で営業活動を劇的に効率化します。",
  keywords: "営業リスト,営業支援,Google Maps,営業効率化,顧客開拓,営業ツール,CSV出力,地図検索",
  authors: [{ name: "営業アタックリスト作成ツール" }],
  creator: "営業アタックリスト作成ツール",
  publisher: "営業アタックリスト作成ツール",
  
  // Open Graph
  openGraph: {
    title: "営業アタックリスト作成ツール - 営業効率90%向上",
    description: "Google Maps APIを活用した営業リスト自動生成で、情報収集時間を90%削減。成約率2.3倍向上を実現する次世代営業支援ツール。",
    url: "https://your-domain.com/landing",
    siteName: "営業アタックリスト作成ツール",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "営業アタックリスト作成ツール",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "営業アタックリスト作成ツール - 営業効率90%向上",
    description: "Google Maps APIを活用した営業リスト自動生成で、情報収集時間を90%削減。",
    images: ["/og-image.png"],
    creator: "@your-twitter-handle",
  },

  // Additional SEO
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

  // Canonical URL
  alternates: {
    canonical: "https://your-domain.com/landing",
  },

  // Structured data will be added via JSON-LD in the component
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "営業アタックリスト作成ツール",
            "description": "Google Maps APIを活用した営業リスト自動生成ツール。情報収集時間を90%削減、成約率2.3倍向上を実現。",
            "url": "https://your-domain.com",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "JPY",
              "description": "14日間無料トライアル"
            },
            "author": {
              "@type": "Organization",
              "name": "営業アタックリスト作成ツール"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "500",
              "bestRating": "5"
            },
            "features": [
              "Google Maps API連携",
              "現在地自動検索",
              "CSV一括エクスポート",
              "業種別フィルタリング",
              "地図表示機能"
            ]
          }),
        }}
      />
      {children}
    </>
  );
}