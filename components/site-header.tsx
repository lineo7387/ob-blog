import Link from "next/link";
import type { UrlObject } from "url";
import { Container } from "@/components/container";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const links: ReadonlyArray<{ href: UrlObject; label: string }> = [
  { href: { pathname: "/" }, label: "首页" },
  { href: { pathname: "/blog" }, label: "博客" },
  { href: { pathname: "/about" }, label: "关于" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/82 backdrop-blur-xl">
      <Container className="flex flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-0">
        <Link
          href="/"
          className="font-heading text-xl font-black uppercase text-neon-cyan drop-shadow-[0_0_10px_var(--neon-cyan)]"
        >
          oh-blog
        </Link>
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-5">
          <nav className="flex min-w-0 flex-1 items-center justify-between gap-2 text-xs text-muted sm:flex-none sm:justify-start sm:gap-5 sm:text-sm">
            {links.map((link) => (
              <Link
                key={String(link.href.pathname)}
                href={link.href}
                className="transition-colors hover:text-neon-magenta"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
