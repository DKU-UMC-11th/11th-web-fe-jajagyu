import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onSelectPage: (page: number) => void;
}

const VISIBLE_PAGE_COUNT = 10;

// TMDB는 수백 페이지가 있어서 현재 페이지 주변 10개만 보여 준다.
export default function Pagination({ currentPage, totalPages, onSelectPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = Math.max(
    1,
    Math.min(currentPage - Math.floor(VISIBLE_PAGE_COUNT / 2), totalPages - VISIBLE_PAGE_COUNT + 1),
  );
  const end = Math.min(totalPages, start + VISIBLE_PAGE_COUNT - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <nav aria-label="페이지 이동" className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onSelectPage(currentPage - 1)}
        className="h-9 rounded-lg border border-zinc-700 px-3 text-white disabled:opacity-40"
      >
        이전
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onSelectPage(page)}
          className={cn(
            "h-9 w-9 rounded-lg border border-zinc-700 bg-transparent text-white",
            page === currentPage && "border-red-500 bg-red-500",
          )}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onSelectPage(currentPage + 1)}
        className="h-9 rounded-lg border border-zinc-700 px-3 text-white disabled:opacity-40"
      >
        다음
      </button>
    </nav>
  );
}
