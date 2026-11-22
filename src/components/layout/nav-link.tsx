"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

const baseClass = "text-sm font-medium text-zinc-400 hover:text-white";

interface NavLinkProps {
  href: string;
  exact?: boolean;
  children: ReactNode;
}

// TanStack Router의 activeProps / activeOptions 를 usePathname 으로 대신한다.
export function NavLink({ href, exact = false, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href} className={cn(baseClass, isActive && "text-white")}>
      {children}
    </Link>
  );
}
