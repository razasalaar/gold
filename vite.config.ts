// NOTE: The preset config already includes:
//   tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//   VITE_* env injection, @ path alias, React/TanStack dedupe, and error logger plugins.
// You can pass additional vite config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig();
