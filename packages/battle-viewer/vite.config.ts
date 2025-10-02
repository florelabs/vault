import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "examples",
  server: {
    port: 5173,
    open: "/index.html",
  },
  resolve: {
    alias: {
      "@florelabs/battle-viewer": resolve(__dirname, "./src/index.ts"),
    },
  },
  optimizeDeps: {
    exclude: ["@florelabs/battle-viewer"],
  },
});
