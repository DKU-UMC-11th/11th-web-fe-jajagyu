import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthCard } from "../../components/auth/auth-card";
import { FormField } from "../../components/auth/form-field";
import { SubmitButton } from "../../components/auth/submit-button";
import { EMAIL_REGEX } from "../../utils/auth/validation";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const showEmailError = email.length > 0 && !isEmailValid;
  const canSubmit = isEmailValid && password.length > 0;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 이번 주차는 화면만 만든다. 로그인 API 연동은 8주차에서 진행한다.
  };

  return (
    <AuthCard title="로그인">
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="이메일"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          errorMessage={showEmailError ? "올바른 이메일 형식이 아니에요." : null}
        />
        <FormField
          label="비밀번호"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitButton disabled={!canSubmit}>로그인</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-400">
        아직 계정이 없나요?{" "}
        <Link to="/signup" className="font-medium text-red-500">
          회원가입
        </Link>
      </p>
    </AuthCard>
  );
}
