"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthCard } from "../../components/auth/auth-card";
import { FormField } from "../../components/auth/form-field";
import { SubmitButton } from "../../components/auth/submit-button";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { EMAIL_REGEX } from "../../utils/auth/validation";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const showEmailError = email.length > 0 && !isEmailValid;
  const canSubmit = isEmailValid && password.length > 0;
  const loginMutation = useLoginMutation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({ email: email.trim(), password });
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
        <SubmitButton disabled={!canSubmit || loginMutation.isPending}>
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-400">
        아직 계정이 없나요?{" "}
        <Link href="/signup" className="font-medium text-red-500">
          회원가입
        </Link>
      </p>
    </AuthCard>
  );
}
