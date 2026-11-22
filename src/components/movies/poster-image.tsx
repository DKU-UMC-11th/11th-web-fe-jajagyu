import Image from "next/image";
import { cn } from "../../utils/cn";

interface PosterImageProps {
  src: string | null;
  alt: string;
  className?: string;
  // 화면에서 차지하는 너비. 브라우저가 알맞은 크기의 파일만 받게 한다.
  sizes?: string;
}

export function PosterImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
}: PosterImageProps) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={`${alt} (이미지 없음)`}
        className={cn(
          "flex items-center justify-center bg-zinc-800 text-sm text-zinc-500",
          className,
        )}
      >
        이미지 없음
      </div>
    );
  }

  // TMDB 포스터(w500)의 원본 비율 2:3 을 width/height 로 알려 줘 자리를 미리 확보한다.
  return (
    <Image
      src={src}
      alt={alt}
      width={500}
      height={750}
      sizes={sizes}
      className={cn("bg-zinc-800", className)}
    />
  );
}
