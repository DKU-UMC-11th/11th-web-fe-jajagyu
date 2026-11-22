import type { Metadata } from "next";
import { Suspense } from "react";
import { getMovieDetail } from "../../../api/movies/get-movie-detail";
import { getTmdbBackdropUrl } from "../../../utils/movies/tmdb-image";
import { MovieDetailPage } from "../../../views/movies/movie-detail-page";

interface PageProps {
  params: Promise<{ movieId: string }>;
}

// 영화마다 제목/설명/공유 이미지가 다르므로, 서버에서 영화 정보를 조회해 메타데이터를 만든다.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { movieId } = await params;
  const id = Number(movieId);
  if (!Number.isInteger(id) || id <= 0) return { title: "영화 상세" };

  try {
    const movie = await getMovieDetail(id);
    const backdrop = getTmdbBackdropUrl(movie.backdrop_path);
    return {
      title: movie.title,
      description: movie.overview || `${movie.title} 상세 정보`,
      openGraph: {
        title: movie.title,
        description: movie.overview || undefined,
        images: backdrop ? [backdrop] : undefined,
      },
    };
  } catch {
    return { title: "영화 상세" };
  }
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<main className="px-10">불러오는 중이에요.</main>}>
      <MovieDetailScreen params={params} />
    </Suspense>
  );
}

// params를 await 하는 부분(요청 시점에 알 수 있는 값)을 Suspense 안으로 분리한다.
async function MovieDetailScreen({ params }: PageProps) {
  const { movieId } = await params;
  return <MovieDetailPage movieId={movieId} />;
}
