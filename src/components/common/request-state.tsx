interface RequestStateProps {
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  emptyMessage: string;
  loadingMessage: string;
  onRetry: () => void;
  children: React.ReactNode;
}

// 로딩 → 오류 → 빈 결과 → 성공 순서로 화면을 나눈다.
export function RequestState({
  isLoading,
  errorMessage,
  isEmpty,
  emptyMessage,
  loadingMessage,
  onRetry,
  children,
}: RequestStateProps) {
  if (isLoading) {
    return <p className="text-zinc-400">{loadingMessage}</p>;
  }

  if (errorMessage) {
    return (
      <div role="alert" className="flex items-center gap-3">
        <p className="text-red-400">{errorMessage}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-zinc-700 px-3 py-1 text-sm text-white hover:bg-zinc-800"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (isEmpty) {
    return <p className="text-zinc-400">{emptyMessage}</p>;
  }

  return <>{children}</>;
}
