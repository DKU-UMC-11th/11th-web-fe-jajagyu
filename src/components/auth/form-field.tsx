import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string | null;
  // 입력창 오른쪽에 붙는 버튼 (예: 중복 확인)
  action?: ReactNode;
}

export function FormField({
  label,
  errorMessage,
  action,
  className,
  id,
  ...inputProps
}: FormFieldProps) {
  const inputId = id ?? inputProps.name;

  return (
    <div className="mb-5">
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          aria-invalid={Boolean(errorMessage)}
          className={cn(
            "w-full rounded-lg border border-zinc-700 bg-transparent px-3 py-2 text-white disabled:opacity-50",
            errorMessage && "border-red-500",
            className,
          )}
          {...inputProps}
        />
        {action}
      </div>
      {errorMessage && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
