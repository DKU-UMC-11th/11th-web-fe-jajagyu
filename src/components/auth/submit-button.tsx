import type { ButtonHTMLAttributes } from "react";

export function SubmitButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      className="w-full rounded-lg bg-red-500 px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
      {...props}
    >
      {children}
    </button>
  );
}
