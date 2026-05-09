import Link from "next/link";
import { Container } from "@/components/container";
import { SiteHeaderMobileNav } from "@/components/site-header-mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const links: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/", label: "首页" },
  { href: "/blog", label: "博客" },
  { href: "/about", label: "关于" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/82 backdrop-blur-xl">
      <Container className="flex flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-0">
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:flex-none">
          <Link
            href="/"
            className="font-heading text-xl font-black uppercase text-neon-cyan drop-shadow-[0_0_10px_var(--neon-cyan)]"
          >
            oh-blog
          </Link>
          <div className="flex items-center gap-2 sm:gap-5">
            <nav className="hidden min-w-0 items-center justify-start gap-5 text-sm text-muted sm:flex">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-neon-magenta">
                  {link.label}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
            <div className="sm:hidden">
              <SiteHeaderMobileNav links={links} />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
