import type { ReactNode } from "react";

type ProseProps = {
  children: ReactNode;
};

export function Prose({ children }: ProseProps) {
  return (
    <article className="mx-auto min-w-0 max-w-full break-words px-4 text-base leading-8 text-foreground/90 [overflow-wrap:anywhere] sm:max-w-3xl sm:px-0 sm:text-lg sm:leading-9 [&_a]:text-neon-cyan [&_a]:underline [&_code]:bg-panel-strong [&_code]:px-1.5 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:text-neon-cyan sm:[&_h2]:text-3xl [&_p]:my-6 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-neon-cyan/40 [&_pre]:bg-panel-strong [&_pre]:p-4 [&_pre_code]:inline-block [&_pre_code]:min-w-max">
      {children}
    </article>
  );
}
