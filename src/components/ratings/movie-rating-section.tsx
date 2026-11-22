"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { MemberRating } from "../../api/members/models";
import { ratingQueries } from "../../api/ratings/rating-queries";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useUpdateRatingMutation,
} from "../../hooks/use-rating-mutations";
import { useAuthStore } from "../../stores/auth-store";
import { getMemberIdFromToken } from "../../utils/auth/get-member-id-from-token";

const SCORES = [1, 2, 3, 4, 5];
const MAX_COMMENT_LENGTH = 500;

interface RatingFormProps {
  movieId: number;
  rating: MemberRating | undefined;
}

function RatingForm({ movieId, rating }: RatingFormProps) {
  const [score, setScore] = useState(rating?.score ?? 5);
  const [comment, setComment] = useState(rating?.comment ?? "");

  const createMutation = useCreateRatingMutation();
  const updateMutation = useUpdateRatingMutation();
  const deleteMutation = useDeleteRatingMutation();
  const isPending =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    const trimmedComment = comment.trim() || undefined;
    if (rating) {
      updateMutation.mutate({ ratingId: rating.ratingId, score, comment: trimmedComment });
    } else {
      createMutation.mutate({ movieId, score, comment: trimmedComment });
    }
  };

  const handleDelete = () => {
    if (!rating || isPending) return;
    if (window.confirm("평점을 삭제할까요?")) {
      deleteMutation.mutate(rating.ratingId);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-3">
      <label className="flex items-center gap-3 text-sm text-zinc-300">
        별점
        <select
          value={score}
          onChange={(event) => setScore(Number(event.target.value))}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1 text-white"
        >
          {SCORES.map((value) => (
            <option key={value} value={value}>
              {"★".repeat(value)} ({value}점)
            </option>
          ))}
        </select>
      </label>
      <textarea
        aria-label="후기"
        value={comment}
        maxLength={MAX_COMMENT_LENGTH}
        onChange={(event) => setComment(event.target.value)}
        placeholder="후기를 남겨 보세요. (선택, 500자 이하)"
        rows={3}
        className="rounded-lg border border-zinc-700 bg-transparent px-3 py-2 text-white"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {rating ? "평점 수정" : "평점 등록"}
        </button>
        {rating && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-200 disabled:opacity-50"
          >
            삭제
          </button>
        )}
      </div>
    </form>
  );
}

interface MovieRatingSectionProps {
  movieId: number;
}

export function MovieRatingSection({ movieId }: MovieRatingSectionProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberIdFromToken(accessToken);
  const ratingsQuery = useQuery(ratingQueries.byMember(memberId));

  if (memberId === null) {
    return (
      <p className="text-sm text-zinc-400">
        <Link href="/login" className="text-red-500">
          로그인
        </Link>
        하면 이 영화에 평점을 남길 수 있어요.
      </p>
    );
  }

  if (ratingsQuery.isLoading) {
    return <p className="text-sm text-zinc-400">내 평점을 불러오는 중이에요.</p>;
  }

  if (ratingsQuery.isError) {
    return <p className="text-sm text-red-400">내 평점을 불러오지 못했어요.</p>;
  }

  const myRating = ratingsQuery.data?.find((rating) => rating.movieId === movieId);

  return (
    <div>
      <h2 className="mb-3 text-lg font-medium">내 평점</h2>
      {/* 평점이 생기거나 사라지면 key가 바뀌어 폼의 입력값이 서버 값으로 다시 시작한다. */}
      <RatingForm key={myRating?.ratingId ?? "new"} movieId={movieId} rating={myRating} />
    </div>
  );
}
