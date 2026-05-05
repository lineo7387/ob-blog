import type { ReactNode } from "react";

type ProseProps = {
  children: ReactNode;
};

export function Prose({ children }: ProseProps) {
  return (
    <article className="mx-auto max-w-3xl text-lg leading-9 text-foreground/90 [&_a]:text-neon-cyan [&_a]:underline [&_code]:bg-panel-strong [&_code]:px-1.5 [&_h2]:font-heading [&_h2]:text-3xl [&_h2]:text-neon-cyan [&_p]:my-6">
      {children}
    </article>
  );
}
