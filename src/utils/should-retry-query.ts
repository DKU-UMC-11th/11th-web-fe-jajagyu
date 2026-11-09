import { isHTTPError } from "ky";

const MAX_RETRY_COUNT = 3;

// 없는 영화(404)나 잘못된 토큰(401)은 다시 요청해도 같은 결과라서 재시도하지 않는다.
// 429(요청 한도 초과)와 서버 오류(5xx), 네트워크 오류는 기본처럼 재시도한다.
export function shouldRetryQuery(failureCount: number, error: unknown) {
  if (isHTTPError(error)) {
    const status = error.response.status;
    if (status >= 400 && status < 500 && status !== 429) return false;
  }

  return failureCount < MAX_RETRY_COUNT;
}
