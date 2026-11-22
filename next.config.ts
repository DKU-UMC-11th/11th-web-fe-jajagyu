import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    // TMDB 포스터/배경 이미지 서버를 허용 목록에 등록한다.
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }],
  },
  partialPrefetching: true,
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
