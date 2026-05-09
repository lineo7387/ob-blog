"use client";

import type { MouseEvent } from "react";
import { useTheme } from "@/components/theme/theme-provider";

const labels = {
  system: "跟随系统",
  light: "亮色",
  dark: "暗色",
} as const;

type ThemeToggleProps = {
  compact?: boolean;
};

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

    setTheme(nextTheme, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`切换主题，当前为${labels[theme]}`}
      className={
        compact
          ? "group relative inline-flex h-10 w-10 items-center justify-center border-2 border-neon-cyan bg-panel text-foreground shadow-[0_0_18px_var(--glow-cyan)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-cyan"
          : "group relative inline-flex h-8 w-16 items-center border-2 border-neon-cyan bg-panel text-foreground shadow-[0_0_18px_var(--glow-cyan)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-cyan"
      }
    >
      <span
        className={`absolute left-1 bg-neon-cyan shadow-[0_0_14px_var(--neon-cyan)] transition-transform group-hover:bg-neon-magenta ${
          compact ? "hidden" : "top-1 h-5 w-5"
        }`}
        style={{ transform: resolvedTheme === "dark" ? "translateX(32px)" : "translateX(0)" }}
      />
      <span className="sr-only">{labels[theme]}</span>
      {compact ? (
        <span aria-hidden className="font-mono text-lg leading-none">
          {resolvedTheme === "dark" ? "☾" : "☼"}
        </span>
      ) : (
        <span aria-hidden className="relative z-10 grid w-full grid-cols-2 text-[10px]">
          <span>☼</span>
          <span>☾</span>
        </span>
      )}
    </button>
  );
}
