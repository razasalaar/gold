import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    // Note: Vercel preset is used automatically by TanStack Start on Vercel
  },
});
