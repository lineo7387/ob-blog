import type { LinkProps } from "next/link";
import Link from "next/link";
import type { ReactNode } from "react";
import type { UrlObject } from "url";

type NeonButtonProps = {
  children: ReactNode;
  href?: string | UrlObject;
  variant?: "primary" | "secondary";
  className?: string;
};

const variants = {
  primary:
    "border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-background hover:shadow-[0_0_24px_var(--neon-cyan)]",
  secondary:
    "border-neon-magenta bg-neon-magenta text-white hover:bg-transparent hover:text-neon-magenta hover:shadow-[0_0_24px_var(--neon-magenta)]",
};

export function NeonButton({
  children,
  href,
  variant = "primary",
  className = "",
}: NeonButtonProps) {
  const classes = `inline-flex h-12 -skew-x-12 items-center justify-center border-2 px-5 font-mono text-sm uppercase tracking-wider transition-all duration-200 ease-linear hover:skew-x-0 ${variants[variant]} ${className}`;
  const content = (
    <span className="inline-block skew-x-12 transition-transform group-hover:skew-x-0">
      {children}
    </span>
  );

  if (href) {
    return (
      <Link href={href as LinkProps<string>["href"]} className={`group ${classes}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={`group ${classes}`}>
      {content}
    </button>
  );
}
