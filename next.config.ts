import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    // TMDB 포스터/배경 이미지 서버를 허용 목록에 등록한다.
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }],
  },
  partialPrefetching: true,
  // 배포(HTTPS)된 프론트가 HTTP 백엔드를 브라우저에서 직접 부르면 혼합 콘텐츠로 막힌다.
  // BACKEND_PROXY_TARGET(서버 전용 환경 변수)이 있으면 /api/backend/* 요청을 Vercel 서버가 대신 백엔드로 전달한다.
  // 브라우저는 같은 주소로만 요청하므로 혼합 콘텐츠와 CORS가 모두 생기지 않는다.
  async rewrites() {
    const target = process.env.BACKEND_PROXY_TARGET;
    return target ? [{ source: "/api/backend/:path*", destination: `${target}/:path*` }] : [];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
