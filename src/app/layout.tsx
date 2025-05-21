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
        url: "https://wordcount-seohyeon.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "워드카운트 미리보기 이미지",
      },
    ],
    siteName: "워드카운트-글자수세기",
  },
  twitter: {
    card: "summary_large_image",
    title: "워드카운트-글자수세기",
    description: "실시간 글자수 체크, 한 번에 해결하세요. 글자수와 공백 포함 여부를 지금 바로 확인하세요.",
    images: ["https://wordcount-seohyeon.vercel.app/og-image.png"],
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
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KWQ5MZJ7');`
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KWQ5MZJ7"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <main className="container mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
