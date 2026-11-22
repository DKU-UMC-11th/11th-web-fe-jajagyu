"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { favoriteQueries } from "../../api/favorites/favorite-queries";
import { memberQueries } from "../../api/members/member-queries";
import { ratingQueries } from "../../api/ratings/rating-queries";
import { RequestState } from "../../components/common/request-state";
import { MovieSummary } from "../../components/movies/movie-summary";
import { useAuthStore } from "../../stores/auth-store";
import { getMemberIdFromToken } from "../../utils/auth/get-member-id-from-token";

const sectionTitleClass = "mb-4 text-lg font-semibold";

export function MyInfoPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberIdFromToken(accessToken);

  const meQuery = useQuery(memberQueries.me());
  const favoritesQuery = useQuery(favoriteQueries.list());
  const ratingsQuery = useQuery(ratingQueries.byMember(memberId));

  const favorites = favoritesQuery.data ?? [];
  const ratings = ratingsQuery.data ?? [];

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 pb-16">
      <section>
        <h2 className={sectionTitleClass}>내 정보</h2>
        <RequestState
          isLoading={meQuery.isLoading}
          errorMessage={meQuery.isError ? "내 정보를 불러오지 못했어요." : null}
          isEmpty={!meQuery.data}
          emptyMessage="내 정보가 없어요."
          loadingMessage="내 정보를 불러오는 중이에요."
          onRetry={() => meQuery.refetch()}
        >
          {meQuery.data && (
            <dl className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <div>
                <dt className="mb-1 text-sm text-zinc-400">이메일</dt>
                <dd className="m-0">{meQuery.data.email}</dd>
              </div>
              <div>
                <dt className="mb-1 text-sm text-zinc-400">닉네임</dt>
                <dd className="m-0">{meQuery.data.nickname}</dd>
              </div>
              <div>
                <dt className="mb-1 text-sm text-zinc-400">가입일</dt>
                <dd className="m-0">
                  {new Date(meQuery.data.createdAt).toLocaleDateString("ko-KR")}
                </dd>
              </div>
              <Link
                href="/my/edit"
                className="mt-2 block rounded-lg bg-red-500 px-4 py-3 text-center font-medium text-white"
              >
                내 정보 수정
              </Link>
            </dl>
          )}
        </RequestState>
      </section>

      <section>
        <h2 className={sectionTitleClass}>내 즐겨찾기</h2>
        <RequestState
          isLoading={favoritesQuery.isLoading}
          errorMessage={favoritesQuery.isError ? "즐겨찾기를 불러오지 못했어요." : null}
          isEmpty={favorites.length === 0}
          emptyMessage="아직 즐겨찾기한 영화가 없어요."
          loadingMessage="즐겨찾기를 불러오는 중이에요."
          onRetry={() => favoritesQuery.refetch()}
        >
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {favorites.map((favorite) => (
              <li key={favorite.favoriteId}>
                <MovieSummary movieId={favorite.movieId}>
                  <p className="m-0 text-sm text-zinc-400">
                    {new Date(favorite.createdAt).toLocaleDateString("ko-KR")}에 추가
                  </p>
                </MovieSummary>
              </li>
            ))}
          </ul>
        </RequestState>
      </section>

      <section>
        <h2 className={sectionTitleClass}>내 평점</h2>
        <RequestState
          isLoading={ratingsQuery.isLoading}
          errorMessage={ratingsQuery.isError ? "평점을 불러오지 못했어요." : null}
          isEmpty={ratings.length === 0}
          emptyMessage="아직 남긴 평점이 없어요."
          loadingMessage="평점을 불러오는 중이에요."
          onRetry={() => ratingsQuery.refetch()}
        >
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {ratings.map((rating) => (
              <li key={rating.ratingId}>
                <MovieSummary movieId={rating.movieId}>
                  <p className="m-0 text-sm text-yellow-400">
                    {"★".repeat(rating.score)} ({rating.score}점)
                  </p>
                  {rating.comment && (
                    <p className="m-0 text-sm text-zinc-300">{rating.comment}</p>
                  )}
                </MovieSummary>
              </li>
            ))}
          </ul>
        </RequestState>
      </section>
    </main>
  );
}
