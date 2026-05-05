import { Container } from "@/components/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10 text-sm text-muted">
      <Container className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 oh-blog</p>
        <p className="font-mono uppercase tracking-wider text-neon-cyan">
          Digital nostalgia / neon future
        </p>
      </Container>
    </footer>
  );
}
