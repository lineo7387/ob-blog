import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), mdx({ remarkPlugins: [remarkFrontmatter] }), react()],
  test: {
    environment: "jsdom",
    globals: false,
    // Keeps `pnpm test:run -- --passWithNoTests` green when pnpm passes the flag as a filter.
    passWithNoTests: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
