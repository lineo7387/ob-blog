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
      <Container className="py-3 sm:h-16 sm:py-0">
        <div className="flex items-center justify-between gap-3 sm:hidden">
          <Link
            href="/"
            className="font-heading text-xl font-black uppercase text-neon-cyan drop-shadow-[0_0_10px_var(--neon-cyan)]"
          >
            oh-blog
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <SiteHeaderMobileNav links={links} />
          </div>
        </div>
        <div className="hidden h-full items-center gap-6 sm:flex">
          <Link
            href="/"
            className="shrink-0 font-heading text-xl font-black uppercase text-neon-cyan drop-shadow-[0_0_10px_var(--neon-cyan)]"
          >
            oh-blog
          </Link>
          <div className="ml-auto flex min-w-0 items-center gap-5">
            <nav aria-label="主导航" className="hidden min-w-0 items-center justify-start gap-5 text-sm text-muted sm:flex">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-neon-magenta">
                  {link.label}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}
