// Next.js는 process.env.NEXT_PUBLIC_* 를 "정적으로" 치환하므로 process.env[key] 처럼 동적으로 읽으면 안 된다.
const tmdbApiBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

// 우리 백엔드(Spring) 주소. 따로 정하지 않으면 로컬 서버를 사용한다.
const backendApiBaseUrl =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || "http://localhost:8080"; // 빈 문자열도 "없음"으로 본다

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  backendApiBaseUrl,
};
