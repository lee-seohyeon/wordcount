import type { Metadata } from "next";
import { Pretendard } from "@/lib/fonts";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "워드카운트-글자수세기",
  description: "실시간 글자수 체크, 한 번에 해결하세요. 글자수와 공백 포함 여부를 지금 바로 확인하세요.",
  robots: "index, follow",
  openGraph: {
    title: "워드카운트-글자수세기",
    description: "실시간 글자수 체크, 한 번에 해결하세요. 글자수와 공백 포함 여부를 지금 바로 확인하세요.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 1200,
        alt: "워드카운트 미리보기 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "워드카운트-글자수세기",
    description: "실시간 글자수 체크, 한 번에 해결하세요. 글자수와 공백 포함 여부를 지금 바로 확인하세요.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={Pretendard.className}>
      <body>
        <main className="container mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
