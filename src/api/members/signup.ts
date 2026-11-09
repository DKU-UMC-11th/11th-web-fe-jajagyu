import { backendClient } from "../backend-client";
import type { SignupRequest, SignupResponse } from "./models";

function signup(body: SignupRequest) {
  // passwordConfirm은 화면에서만 검사하므로 요청에 포함하지 않는다.
  return backendClient.post("members", { json: body }).json<SignupResponse>();
}

export { signup };
