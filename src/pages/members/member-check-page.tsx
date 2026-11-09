import { Link } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useState, type FormEvent } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { CheckResponse, MemberRating } from "../../api/members/models";

function getErrorMessage(error: unknown) {
  if (isHTTPError(error)) {
    if (error.response.status === 400) return "형식이 올바르지 않아요. (400)";
    if (error.response.status === 404) return "존재하지 않는 유저예요. (404)";
    return `서버 오류가 났어요. (${error.response.status})`;
  }
  // 서버가 꺼져 있거나 CORS로 브라우저가 응답을 막으면 여기로 온다.
  return "서버에 연결하지 못했어요. 서버 실행과 CORS 설정을 확인해요.";
}

interface CheckFormProps {
  title: string;
  placeholder: string;
  availableText: string;
  unavailableText: string;
  onCheck: (value: string) => Promise<CheckResponse>;
}

function CheckForm({
  title,
  placeholder,
  availableText,
  unavailableText,
  onCheck,
}: CheckFormProps) {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("확인하는 중이에요.");

    try {
      const response = await onCheck(value.trim());
      setMessage(response.available ? availableText : unavailableText);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-medium">{title}</h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          aria-label={title}
          value={value}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          className="w-full max-w-sm rounded-lg border border-zinc-700 bg-transparent px-3 py-2 text-white"
        />
        <button
          type="submit"
          className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white"
        >
          확인
        </button>
      </form>
      {message && <p className="mt-3 text-zinc-300">{message}</p>}
    </section>
  );
}

function MemberRatings() {
  const [memberId, setMemberId] = useState("1");
  const [ratings, setRatings] = useState<MemberRating[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const parsedMemberId = Number(memberId);
    if (!Number.isInteger(parsedMemberId) || parsedMemberId <= 0) {
      setRatings(null);
      setErrorMessage("회원 번호는 1 이상의 정수여야 해요.");
      return;
    }

    try {
      setRatings(await getMemberRatings(parsedMemberId));
    } catch (error) {
      setRatings(null);
      setErrorMessage(getErrorMessage(error));
    }
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-medium">유저별 평점 조회</h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          aria-label="회원 번호"
          value={memberId}
          onChange={(event) => setMemberId(event.target.value)}
          className="w-full max-w-xs rounded-lg border border-zinc-700 bg-transparent px-3 py-2 text-white"
        />
        <button
          type="submit"
          className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white"
        >
          조회
        </button>
      </form>

      {errorMessage && <p className="mt-3 text-red-400">{errorMessage}</p>}
      {ratings && ratings.length === 0 && (
        <p className="mt-3 text-zinc-400">남긴 평점이 없어요.</p>
      )}
      {ratings && ratings.length > 0 && (
        <ul className="mt-4 flex list-none flex-col gap-3 p-0">
          {ratings.map((rating) => (
            <li
              key={rating.ratingId}
              className="rounded-lg border border-zinc-800 p-4"
            >
              <p className="m-0 font-medium">
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(rating.movieId) }}
                  className="text-red-500"
                >
                  영화 {rating.movieId}
                </Link>{" "}
                · 별점 {rating.score}점
              </p>
              <p className="m-0 mt-1 text-zinc-300">
                {rating.comment ?? "코멘트가 없어요."}
              </p>
              <p className="m-0 mt-1 text-xs text-zinc-500">{rating.createdAt}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function MemberCheckPage() {
  return (
    <main className="px-10 pb-10">
      <h1 className="mb-6 text-xl font-semibold">회원 API 연결 확인</h1>
      <CheckForm
        title="닉네임 중복 체크"
        placeholder="닉네임 (2~12자)"
        availableText="사용할 수 있는 닉네임이에요."
        unavailableText="이미 사용 중인 닉네임이에요."
        onCheck={checkNickname}
      />
      <CheckForm
        title="이메일 중복 체크"
        placeholder="이메일"
        availableText="사용할 수 있는 이메일이에요."
        unavailableText="이미 사용 중인 이메일이에요."
        onCheck={checkEmail}
      />
      <MemberRatings />
    </main>
  );
}
