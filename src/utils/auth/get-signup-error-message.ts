import { isHTTPError } from "ky";

// 서버가 보낸 실패 이유(message)가 있으면 그대로 보여주고, 없으면 기본 문구를 쓴다.
// ky는 응답 본문을 미리 읽어 error.data에 넣어 두므로 response.json()은 쓸 수 없다.
export function getSignupErrorMessage(error: unknown) {
  const fallback = "회원가입에 실패했어요. 다시 시도해 주세요.";
  if (!isHTTPError<{ message?: unknown }>(error)) return fallback;

  const { data } = error;
  if (typeof data !== "object" || data === null) return fallback;

  return typeof data.message === "string" ? data.message : fallback;
}
