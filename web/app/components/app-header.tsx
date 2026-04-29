"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Chat" },
  { href: "/files", label: "Files" },
] as const satisfies ReadonlyArray<{ href: Route; label: string }>;

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="app-header">
      <Link href="/" className="app-logo">
        LLM Wiki GUI
      </Link>

      <nav className="app-nav" aria-label="Primary">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`app-nav-link${isActive ? " is-active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
