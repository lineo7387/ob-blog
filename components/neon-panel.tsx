import type { ReactNode } from "react";

type NeonPanelProps = {
  children: ReactNode;
  className?: string;
};

export function NeonPanel({ children, className = "" }: NeonPanelProps) {
  return (
    <section
      className={`border border-neon-magenta/35 border-t-2 border-t-neon-cyan bg-panel p-6 shadow-[0_0_30px_var(--glow-cyan)] backdrop-blur-md ${className}`}
    >
      {children}
    </section>
  );
}
