// src/components/marketing/NavLink.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

type Props = {
  href: string;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
  children: React.ReactNode;
  exact?: boolean;
};

export function NavLink({
  href,
  className = "",
  activeClassName = "",
  onClick,
  children,
  exact = true,
}: Props) {
  const pathname = usePathname() || "/";
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  const combined = `${className} ${isActive ? activeClassName : ""}`.trim();

  return (
    <Link href={href} className={combined} onClick={onClick}>
      {children}
    </Link>
  );
}
