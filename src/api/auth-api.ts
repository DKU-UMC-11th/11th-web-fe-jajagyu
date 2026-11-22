import { useAuthStore } from "../stores/auth-store";
import { backendClient } from "./backend-client";

// 기존 backendClient의 설정을 이어받아 인증 처리를 더한 인스턴스. 로그인이 필요한 API는 이걸로 요청한다.
export const authApi = backendClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        // React 컴포넌트 바깥에서는 getState()로 store의 현재 값을 읽는다.
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        // 인증에 실패하면(토큰 없음/위조/만료) 저장된 토큰을 비운다.
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
