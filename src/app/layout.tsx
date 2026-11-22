import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";
import "./globals.css";
import { Providers } from "./providers";

// next/font: 폰트 파일을 빌드 때 함께 내려받아 앱에서 직접 제공한다. (한글은 아래 font-family 대체 글꼴이 맡는다)
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

// 여러 페이지가 공통으로 쓰는 메타데이터는 layout에, 페이지마다 다른 제목은 각 page.tsx에 둔다.
export const metadata: Metadata = {
  title: { default: "UMCine", template: "%s | UMCine" },
  description: "TMDB 영화 정보를 보고 평점과 즐겨찾기를 남기는 UMCine",
  openGraph: {
    title: "UMCine",
    description: "TMDB 영화 정보를 보고 평점과 즐겨찾기를 남기는 UMCine",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={geistSans.variable}>
      <body>
        {/* Header는 로그인 상태(Client)를 쓰지만, layout 자체는 Server Component로 둔다. */}
        <Providers>
          {/* usePathname()은 요청 시점에야 알 수 있는 값이라 Suspense로 감싸야 나머지 화면을 미리 만들 수 있다. */}
          <Suspense fallback={<div className="h-20" />}>
            <Header />
          </Suspense>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
