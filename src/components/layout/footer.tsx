import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-10 flex flex-wrap items-center gap-4 border-t border-zinc-800 px-10 py-6">
      <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
        {/* SVG는 이미 가벼운 벡터라서 최적화 서버를 거치지 않는다(unoptimized). */}
        <Image
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          width={123}
          height={16}
          unoptimized
          className="h-4 w-auto"
        />
      </a>
      <p className="m-0 text-xs text-zinc-500">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}
