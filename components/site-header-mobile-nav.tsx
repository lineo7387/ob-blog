"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

type MobileNavLink = {
  href: string;
  label: string;
};

type SiteHeaderMobileNavProps = {
  links: ReadonlyArray<MobileNavLink>;
};

export function SiteHeaderMobileNav({ links }: SiteHeaderMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navId = `mobile-site-nav-${useId().replace(/:/g, "")}`;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setIsOpen(false);
      buttonRef.current?.focus();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={isOpen ? "收起导航菜单" : "打开导航菜单"}
        aria-controls={navId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-10 w-10 items-center justify-center border border-neon-magenta/50 bg-panel-strong text-neon-magenta shadow-[0_0_18px_var(--glow-cyan)] transition-colors hover:border-neon-cyan hover:text-neon-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-cyan"
      >
        <span aria-hidden="true" className="font-mono text-lg leading-none">
          {isOpen ? "×" : "≡"}
        </span>
      </button>
      {isOpen ? (
        <nav
          id={navId}
          aria-label="移动端导航"
          className="absolute right-0 top-full mt-3 w-52 border border-neon-cyan/40 border-t-2 border-t-neon-magenta bg-panel/95 p-3 shadow-[0_0_28px_var(--glow-cyan)] backdrop-blur-xl"
        >
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border border-transparent px-3 py-2 font-mono text-xs uppercase tracking-[0.28em] text-muted transition-colors hover:border-neon-cyan/50 hover:text-neon-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
