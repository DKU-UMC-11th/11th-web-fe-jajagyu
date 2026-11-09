import { cn } from "../../utils/cn";

interface PosterImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function PosterImage({ src, alt, className }: PosterImageProps) {
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

  return <img src={src} alt={alt} className={cn("bg-zinc-800", className)} />;
}
