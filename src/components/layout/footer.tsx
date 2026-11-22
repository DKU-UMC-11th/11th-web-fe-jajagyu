export function Footer() {
  return (
    <footer className="mt-10 flex flex-wrap items-center gap-4 border-t border-zinc-800 px-10 py-6">
      <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="h-4"
        />
      </a>
      <p className="m-0 text-xs text-zinc-500">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}
