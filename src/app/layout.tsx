import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "営業アタックリスト作成ツール - Google Maps連携営業支援システム",
  description: "Google Mapsのデータを活用して効率的な営業アタックリストを瞬時に生成。業種別検索、距離フィルタ、CSV出力機能で営業活動を劇的に効率化します。",
  keywords: "営業リスト,営業支援,Google Maps,営業効率化,顧客開拓,営業ツール",
  authors: [{ name: "営業アタックリスト作成ツール" }],
  
  openGraph: {
    title: "営業アタックリスト作成ツール",
    description: "Google Mapsのデータを活用して効率的な営業アタックリストを瞬時に生成",
    type: "website",
    locale: "ja_JP",
  },
  
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
