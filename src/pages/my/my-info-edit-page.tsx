import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthCard } from "../../components/auth/auth-card";
import { FormField } from "../../components/auth/form-field";
import { SubmitButton } from "../../components/auth/submit-button";
import {
  isNicknameValid,
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
} from "../../utils/auth/validation";
import { MY_INFO_PLACEHOLDER } from "./my-info-placeholder";

export function MyInfoEditPage() {
  const [nickname, setNickname] = useState(MY_INFO_PLACEHOLDER.nickname);

  const isValid = isNicknameValid(nickname);
  const showNicknameError = nickname.length > 0 && !isValid;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 이번 주차는 화면만 만든다. 내 정보 수정 API 연동은 8주차에서 진행한다.
  };

  return (
    <AuthCard title="내 정보 수정">
      <form onSubmit={handleSubmit} noValidate>
        {/* 이메일은 가입 후 바꿀 수 없으므로 읽기 전용으로 보여준다. */}
        <FormField
          label="이메일"
          name="email"
          value={MY_INFO_PLACEHOLDER.email}
          readOnly
          className="text-zinc-500"
        />
        <FormField
          label="닉네임"
          name="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          errorMessage={
            showNicknameError
              ? `닉네임은 ${NICKNAME_MIN_LENGTH}자 이상 ${NICKNAME_MAX_LENGTH}자 이하로 입력해 주세요.`
              : null
          }
        />
        <SubmitButton disabled={!isValid}>저장하기</SubmitButton>
      </form>
      <Link to="/my" className="mt-6 block text-center text-sm text-zinc-400">
        취소
      </Link>
    </AuthCard>
  );
}
