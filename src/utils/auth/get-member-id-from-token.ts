// GET /members/me 응답에는 memberId가 없고, 평점 목록 API(/members/{memberId}/ratings)는 memberId가 필요하다.
// JWT의 payload(sub)에 memberId가 들어 있어 화면에서 읽어 쓴다.
// payload는 누구나 읽을 수 있는 값이라 "표시용"일 뿐이고, 토큰이 진짜인지는 서버가 서명으로 검증한다.
export function getMemberIdFromToken(accessToken: string | null) {
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const memberId = Number((JSON.parse(json) as { sub?: unknown }).sub);
    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
