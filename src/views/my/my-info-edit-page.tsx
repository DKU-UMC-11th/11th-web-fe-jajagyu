"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { memberQueries } from "../../api/members/member-queries";
import type { MemberInfo } from "../../api/members/me";
import { AuthCard } from "../../components/auth/auth-card";
import { FormField } from "../../components/auth/form-field";
import { SubmitButton } from "../../components/auth/submit-button";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import {
  isNicknameValid,
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
} from "../../utils/auth/validation";

function MyInfoEditForm({ me }: { me: MemberInfo }) {
  const [nickname, setNickname] = useState(me.nickname);
  const updateMeMutation = useUpdateMeMutation();

  const isValid = isNicknameValid(nickname);
  const showNicknameError = nickname.length > 0 && !isValid;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || updateMeMutation.isPending) return;

    updateMeMutation.mutate({ nickname: nickname.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* 이메일은 가입 후 바꿀 수 없으므로 읽기 전용으로 보여준다. */}
      <FormField label="이메일" name="email" value={me.email} readOnly className="text-zinc-500" />
      <FormField
        label="닉네임"
        name="nickname"
        value={nickname}
        onChange={(event) => setNickname(event.target.value)}
        errorMessage={
          showNicknameError
            ? `닉네임은 ${NICKNAME_MIN_LENGTH}자 이상 ${NICKNAME_MAX_LENGTH}자 이하로 입력해 주세요.`
            : null
        }
      />
      <SubmitButton disabled={!isValid || updateMeMutation.isPending}>
        {updateMeMutation.isPending ? "저장 중" : "저장하기"}
      </SubmitButton>
    </form>
  );
}

export function MyInfoEditPage() {
  const meQuery = useQuery(memberQueries.me());

  return (
    <AuthCard title="내 정보 수정">
      {meQuery.isLoading && <p className="text-zinc-400">내 정보를 불러오는 중이에요.</p>}
      {meQuery.isError && <p className="text-red-400">내 정보를 불러오지 못했어요.</p>}
      {meQuery.data && <MyInfoEditForm me={meQuery.data} />}
      <Link href="/my" className="mt-6 block text-center text-sm text-zinc-400">
        돌아가기
      </Link>
    </AuthCard>
  );
}
